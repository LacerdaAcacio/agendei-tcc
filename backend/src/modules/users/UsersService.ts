import { User } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { UsersRepository } from './UsersRepository';
import { CreateUserInput, UpdateUserInput, LoginInput } from './users.schema';
import { AppError } from '@shared/errors/AppError';
import { env } from '@config/env';
import { getMailProvider } from '@shared/providers/MailProvider';

interface IAuthResponse {
  user: User;
  token: string;
}

export class UsersService {
  private usersRepository: UsersRepository;

  constructor() {
    this.usersRepository = new UsersRepository();
  }

  async createUser(data: CreateUserInput): Promise<User> {
    // Check if email already exists
    const existingUser = await this.usersRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('Email already in use', 409);
    }

    // Clean document (numbers only)
    const cleanDocument = data.document.replace(/\D/g, '');
    
    // Check if document already exists
    const existingDocument = await this.usersRepository.findByDocument(cleanDocument);
    if (existingDocument) {
      throw new AppError('Document already in use', 409);
    }

    const hashedPassword = await hash(data.password, 8);

    const user = await this.usersRepository.create({
      ...data,
      document: cleanDocument,
      role: 'client', // Force default role
      password: hashedPassword,
    });

    return user;
  }

  async authenticate({ email, password }: LoginInput): Promise<IAuthResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, env.JWT_SECRET, {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    return {
      user,
      token,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    // Check if user exists
    await this.getUserById(id);

    // If email is being updated, check if it's already in use
    if (data.email) {
      const existingUser = await this.usersRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new AppError('Email already in use', 409);
      }
    }

    // If password is being updated, verify current password
    let updatedData = { ...data };
    
    if (data.password) {
      if (!data.currentPassword) {
        throw new AppError('Current password is required to set a new password', 400);
      }

      const user = await this.getUserById(id);
      const passwordMatched = await compare(data.currentPassword, user.password);

      if (!passwordMatched) {
        throw new AppError('Incorrect current password', 401);
      }

      updatedData.password = await hash(data.password, 8);
      delete updatedData.currentPassword; // Remove from data sent to Prisma
    } else {
      // If not updating password, ensure currentPassword is removed if present
      delete updatedData.currentPassword;
    }

    const updatedUser = await this.usersRepository.update(id, updatedData);

    // Send email if role was updated to provider
    if (data.role === 'provider') {
      // Ensure isProvider is set to true
      if (!updatedUser.isProvider) {
        await this.usersRepository.update(id, { isProvider: true });
      }

      const mailProvider = getMailProvider();
      
      // Colorful log as requested
      console.log(`\x1b[32m📧 EMAIL SENT to ${updatedUser.email}: Parabéns! Sua conta de prestador foi aprovada.\x1b[0m`);

      await mailProvider.sendMail(
        updatedUser.email,
        'Parabéns! Você agora é um Prestador no Agendei',
        `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>🎉 Bem-vindo ao time de Prestadores!</h1>
          <p>Olá <strong>${updatedUser.name}</strong>,</p>
          <p>Sua conta foi atualizada com sucesso para o perfil de <strong>Prestador de Serviços</strong>.</p>
          <p>Agora você pode:</p>
          <ul>
            <li>Criar e gerenciar seus serviços</li>
            <li>Definir sua disponibilidade</li>
            <li>Receber agendamentos e pagamentos</li>
          </ul>
          <p>Acesse seu painel para começar a cadastrar seus serviços.</p>
          <br>
          <p>Atenciosamente,<br>Equipe Agendei</p>
        </div>
        `
      );
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    // Check if user exists
    await this.getUserById(id);
    await this.usersRepository.delete(id);
  }

  async getUserFavorites(userId: string) {
    const favorites = await this.usersRepository.findFavorites(userId);
    return favorites.map(fav => fav.service);
  }
}
