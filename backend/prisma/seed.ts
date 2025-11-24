// @ts-nocheck
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

// --- 1. Curated Constants ---

const CITIES_BR = [
  { name: 'Ponta Grossa, Paraná, Brasil', lat: -25.0916, lon: -50.1668 },
  { name: 'Curitiba, Paraná, Brasil', lat: -25.4284, lon: -49.2733 },
  { name: 'São Paulo, São Paulo, Brasil', lat: -23.5505, lon: -46.6333 },
  { name: 'Rio de Janeiro, Rio de Janeiro, Brasil', lat: -22.9068, lon: -43.1729 },
  { name: 'Florianópolis, Santa Catarina, Brasil', lat: -27.5969, lon: -48.5495 }
];

// Real Unsplash URLs (Fixed & Curated)
const CATEGORY_IMAGES = {
  'faxina': [
    'https://images.unsplash.com/photo-1581578731117-104f2a863a30?w=800&q=80',
    'https://images.unsplash.com/photo-1527515637-62da2a02dd86?w=800&q=80',
    'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=800&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    'https://images.unsplash.com/photo-1585421514738-01798e10f971?w=800&q=80'
  ],
  'obras-reparos': [
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    'https://images.unsplash.com/photo-1534237710431-e2fc698436d5?w=800&q=80',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80',
    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80'
  ],
  'aulas': [
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80',
    'https://images.unsplash.com/photo-1510531704581-5b2870972060?w=800&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'
  ],
  'esportes-lazer': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    'https://images.unsplash.com/photo-1526304640152-d4619684e484?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    'https://images.unsplash.com/photo-1519861531473-920026393112?w=800&q=80'
  ],
  'saude-bem-estar': [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
    'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80'
  ],
  'transporte': [
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80',
    'https://images.unsplash.com/photo-1511923970558-380d4c8e3907?w=800&q=80',
    'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?w=800&q=80',
    'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80',
    'https://images.unsplash.com/photo-1611605645502-8eef397a843f?w=800&q=80'
  ],
  'turismo': [
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80',
    'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&q=80',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80'
  ],
  'eventos': [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80'
  ]
};

const CATEGORY_REVIEWS = {
  'faxina': ['Limpeza impecável!', 'Muito detalhista e pontual.', 'Deixou tudo cheiroso.', 'Profissional de confiança.', 'Recomendo de olhos fechados.'],
  'obras-reparos': ['Resolveu o problema rápido.', 'Preço justo e serviço bom.', 'Explicou tudo o que fez.', 'Muito caprichoso.', 'Ótimo acabamento.'],
  'aulas': ['Didática excelente.', 'Material muito bom.', 'Aprendi muito na primeira aula.', 'Professor paciente.', 'Aulas dinâmicas e divertidas.'],
  'esportes-lazer': ['Gramado top.', 'Vestiário limpo.', 'Ótima estrutura.', 'Bola e coletes novos.', 'Ambiente familiar.'],
  'saude-bem-estar': ['Mãos de fada!', 'Sai de lá renovado.', 'Profissional muito atenciosa.', 'Espaço aconchegante.', 'Melhor massagem que já fiz.'],
  'transporte': ['Dirige com muito cuidado.', 'Carro limpo e confortável.', 'Chegou no horário.', 'Muito educado.', 'Viagem tranquila.'],
  'turismo': ['Conhece muito a cidade.', 'Passeio inesquecível.', 'Lugares lindos.', 'Guia muito simpático.', 'Valeu cada centavo.'],
  'eventos': ['Fotos ficaram lindas!', 'Animou a festa toda.', 'Equipamento de primeira.', 'Registrou tudo com perfeição.', 'DJ sensacional.']
};

const CATEGORY_CONFIG = {
  'faxina': {
    name: 'Faxina',
    titles: ['Faxina Completa', 'Limpeza Pós-Obra', 'Diarista Caprichosa', 'Limpeza de Escritório'],
    descriptions: [
      'Olá, sou {name} e deixo sua casa brilhando! Produtos inclusos. Tenho referências.',
      'Olá, me chamo {name}. Faço limpeza pesada e detalhada. Foco em banheiros e cozinha.',
      'Sou {name}, especialista em organização e limpeza de manutenção semanal.'
    ],
    priceMin: 150, priceMax: 300, unit: 'FIXED', duration: 240, buffer: 30
  },
  'obras-reparos': {
    name: 'Reformas',
    titles: ['Marido de Aluguel', 'Eletricista Residencial', 'Pintura Rápida', 'Encanador 24h'],
    descriptions: [
      'Olá, sou {name}. Resolvo pequenos reparos, instalações e elétrica básica.',
      'Me chamo {name}. Faço pintura limpa e sem respingos. Orçamento justo.',
      'Sou {name}. Faço instalação de móveis, cortinas e prateleiras com precisão.'
    ],
    priceMin: 80, priceMax: 200, unit: 'HOURLY', duration: 60, buffer: 30
  },
  'aulas': {
    name: 'Aulas',
    titles: ['Aulas de Inglês', 'Professor de Violão', 'Reforço de Matemática', 'Conversação em Espanhol'],
    descriptions: [
      'Hello! Sou {name}. Minha metodologia é dinâmica e focada em conversação. Material incluso.',
      'Sou {name}. Aprenda a tocar suas músicas favoritas em 3 meses!',
      'Olá, sou {name}. Dou aulas particulares para ensino fundamental e médio.'
    ],
    priceMin: 50, priceMax: 100, unit: 'HOURLY', duration: 60, buffer: 15
  },
  'esportes-lazer': {
    name: 'Esportes e Lazer',
    titles: ['Society Farofa de Javali', 'Quadra de Tênis Club', 'Aluguel de Quadra Vôlei', 'Arena Beach Tennis'],
    descriptions: [
      'Quadra de grama sintética nova. Churrasqueira inclusa no aluguel. Responsável: {name}.',
      'Espaço coberto com iluminação LED. Temos coletes e bola. Falar com {name}.',
      'Ambiente familiar para seu esporte de fim de semana. Gerente: {name}.'
    ],
    priceMin: 150, priceMax: 250, unit: 'HOURLY', duration: 60, buffer: 0
  },
  'saude-bem-estar': {
    name: 'Saúde',
    titles: ['Personal Trainer', 'Massagem Relaxante', 'Yoga ao Ar Livre', 'Psicologia Clínica'],
    descriptions: [
      'Sou {name}, Personal Trainer. Treino personalizado para seus objetivos. Foco em hipertrofia.',
      'Olá, sou {name}. Alivie o stress com uma massagem completa. Óleos essenciais.',
      'Me chamo {name}. Sessão de terapia online ou presencial.'
    ],
    priceMin: 80, priceMax: 200, unit: 'HOURLY', duration: 60, buffer: 15
  },
  'transporte': {
    name: 'Transporte',
    titles: ['Frete Pequeno', 'Motorista Executivo', 'Van para Eventos'],
    descriptions: [
      'Olá, sou {name}. Transporte seguro e pontual. Carro higienizado.',
      'Sou {name}. Levo sua mudança com cuidado.'
    ],
    priceMin: 100, priceMax: 500, unit: 'FIXED', duration: 120, buffer: 60
  },
  'turismo': {
    name: 'Turismo',
    titles: ['Guia Turístico Local', 'Passeio no Centro Histórico'],
    descriptions: [
      'Olá, sou {name}, guia credenciado. Conheça os melhores pontos da cidade comigo.'
    ],
    priceMin: 50, priceMax: 150, unit: 'PER_PERSON', duration: 180, buffer: 30
  },
  'eventos': {
    name: 'Eventos',
    titles: ['Fotógrafo de Casamento', 'DJ para Festas'],
    descriptions: [
      'Sou {name}, fotógrafo. Registro seus melhores momentos.',
      'Olá, sou o DJ {name}. Som e iluminação para sua festa bombar.'
    ],
    priceMin: 300, priceMax: 1500, unit: 'FIXED', duration: 240, buffer: 60
  }
};

const USERS_NAMES = [
  'Pedro Silva', 'Ana Costa', 'Lucas Oliveira', 'Mariana Santos', 'Rafael Souza',
  'Julia Rodrigues', 'Bruno Ferreira', 'Camila Almeida', 'Thiago Gomes', 'Beatriz Lima',
  'Fernanda Barbosa', 'Gabriel Martins', 'Amanda Pereira', 'Rodrigo Ribeiro', 'Carolina Carvalho',
  'Marcos Mendes', 'Patricia Nunes', 'Ricardo Teixeira', 'Leticia Vieira', 'Felipe Araujo'
];

const STREETS = ['Rua das Flores', 'Av. Brasil', 'Rua XV de Novembro', 'Av. Paulista', 'Rua do Comércio', 'Av. Atlântica', 'Rua das Palmeiras'];

// --- 2. Main Seed Function ---

async function main() {
  console.log('🌱 Starting Ultimate Seed (Refactored Edition)...\n');

  // 1. Clean DB
  try {
    await prisma.$executeRawUnsafe(`DELETE FROM "reviews"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "favorites"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "bookings"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "services"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "categories"`);
    await prisma.$executeRawUnsafe(`DELETE FROM "users"`);
  } catch (e) {
    console.log('Clean DB: Tables empty or error', e.message);
  }

  const password = await hash('Teste@123', 8);
  const now = new Date().toISOString();

  // 2. Create Categories
  const categories = {};
  for (const [slug, config] of Object.entries(CATEGORY_CONFIG)) {
    const cat = await prisma.category.create({
      data: {
        name: config.name,
        slug,
        imageUrl: CATEGORY_IMAGES[slug][0] // Use first image as category cover
      }
    });
    categories[slug] = cat;
  }
  console.log('✅ Categories created');

  // 3. Create Users
  const providers = [];
  const clients = [];
  const allUsers = [];

  for (let i = 0; i < 40; i++) {
    const fullName = USERS_NAMES[i % USERS_NAMES.length] + (i > 19 ? ' Jr' : '');
    const email = `user${i}@agendei.com`;
    const isProvider = i < 20;
    const userId = `user_${i}_${Math.floor(Math.random()*1000)}`;
    const document = Math.floor(Math.random() * 10000000000).toString().padStart(11, '0');
    
    await prisma.$executeRawUnsafe(`
      INSERT INTO "users" (id, name, email, password, role, "isProvider", "profileImage", document, "documentType", "isVerified", "verificationStatus", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, userId, fullName, email, password, isProvider ? 'provider' : 'client', isProvider, `https://ui-avatars.com/api/?name=${fullName.replace(' ', '+')}&background=random`, document, 'CPF', true, 'APPROVED', now, now);

    const userObj = { id: userId, name: fullName, isProvider };
    allUsers.push(userObj);
    if (isProvider) providers.push(userObj);
    else clients.push(userObj);
  }
  console.log('✅ Users created');

  // 4. Create Services
  const services = [];

  for (const provider of providers) {
    const numServices = Math.random() > 0.7 ? 2 : 1;

    for (let k = 0; k < numServices; k++) {
      const slug = Object.keys(CATEGORY_CONFIG)[Math.floor(Math.random() * Object.keys(CATEGORY_CONFIG).length)];
      const config = CATEGORY_CONFIG[slug];
      const city = CITIES_BR[Math.floor(Math.random() * CITIES_BR.length)];
      
      const serviceId = `svc_${provider.id}_${k}`;
      const title = config.titles[Math.floor(Math.random() * config.titles.length)];
      
      // Personalize description
      let descTemplate = config.descriptions[Math.floor(Math.random() * config.descriptions.length)];
      const desc = descTemplate.replace('{name}', provider.name.split(' ')[0]);

      const price = Math.floor(Math.random() * (config.priceMax - config.priceMin) + config.priceMin);
      
      // Generate 5 images (fixed count as requested)
      const catImages = CATEGORY_IMAGES[slug];
      // Create a larger pool by repeating images if necessary, but with unique sigs
      const baseImages = [...catImages, ...catImages]; 
      const images = [];
      
      for (let i = 0; i < 5; i++) {
        // Use modulo to cycle through curated images
        const baseImage = baseImages[i % baseImages.length];
        // Append unique sig to ensure no caching overlap
        const uniqueImage = `${baseImage}&sig=${serviceId}_${i}`;
        images.push(uniqueImage);
      }

      const availability = JSON.stringify({
        monday: { active: true, start: '08:00', end: '18:00' },
        tuesday: { active: true, start: '08:00', end: '18:00' },
        wednesday: { active: true, start: '08:00', end: '18:00' },
        thursday: { active: true, start: '08:00', end: '18:00' },
        friday: { active: true, start: '08:00', end: '18:00' },
        saturday: { active: true, start: '09:00', end: '13:00' },
        sunday: { active: false, start: '00:00', end: '00:00' }
      });

      const address = `${STREETS[Math.floor(Math.random() * STREETS.length)]}, ${Math.floor(Math.random() * 1000)}, Centro`;

      // Insert with new fields: priceUnit, address
      await prisma.$executeRawUnsafe(`
        INSERT INTO "services" (id, title, description, price, "priceUnit", location, address, latitude, longitude, images, rating, "reviewCount", type, duration, "bufferTime", availability, "platformFeePercent", "createdAt", "updatedAt", "categoryId", "userId")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, serviceId, title, desc, price, config.unit, city.name, address, city.lat, city.lon, JSON.stringify(images), 0, 0, 'PRESENTIAL', config.duration, config.buffer, availability, 12.0, now, now, categories[slug].id, provider.id);
      
      services.push({ id: serviceId, price, providerId: provider.id, title, slug });
    }
  }
  console.log(`✅ Created ${services.length} services with Ultimate Data`);

  // 5. Reviews & Ratings
  console.log('⭐ Creating Reviews...');
  for (const service of services) {
    const reviewCount = Math.floor(Math.random() * (8 - 2 + 1) + 2);
    let totalRating = 0;

    const catReviews = CATEGORY_REVIEWS[service.slug] || ['Muito bom!'];

    for (let k = 0; k < reviewCount; k++) {
      let reviewer;
      do {
        reviewer = allUsers[Math.floor(Math.random() * allUsers.length)];
      } while (reviewer.id === service.providerId);

      const isGood = Math.random() > 0.1; // 90% good
      const rating = isGood ? (Math.random() * (5.0 - 4.0) + 4.0) : (Math.random() * (3.0 - 1.0) + 1.0);
      
      const comment = isGood 
        ? catReviews[Math.floor(Math.random() * catReviews.length)]
        : "Poderia ser melhor.";
      
      const reviewId = `review_${service.id}_${k}`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "reviews" (id, rating, comment, "createdAt", "updatedAt", "serviceId", "userId")
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, reviewId, rating, comment, now, now, service.id, reviewer.id);

      totalRating += rating;
    }

    const avgRating = totalRating / reviewCount;
    await prisma.$executeRawUnsafe(`
      UPDATE "services" SET rating = ?, "reviewCount" = ? WHERE id = ?
    `, avgRating, reviewCount, service.id);
  }
  console.log('✅ Reviews created');

  // 6. Create Favorites
  console.log('❤️ Creating Favorites...');
  for (const user of allUsers) {
    const favoriteCount = 3;
    const favoritedServiceIds = new Set();

    for (let f = 0; f < favoriteCount; f++) {
      let service;
      let attempts = 0;
      do {
        service = services[Math.floor(Math.random() * services.length)];
        attempts++;
      } while (favoritedServiceIds.has(service.id) && attempts < 10);

      if (!favoritedServiceIds.has(service.id)) {
        favoritedServiceIds.add(service.id);
        const favoriteId = `fav_${user.id}_${f}`;
        
        await prisma.$executeRawUnsafe(`
          INSERT INTO "favorites" (id, "createdAt", "serviceId", "userId")
          VALUES (?, ?, ?, ?)
        `, favoriteId, now, service.id, user.id);
      }
    }
  }
  console.log('✅ Favorites created');

  // 7. Create Bookings
  console.log('📅 Creating Bookings...');
  
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  for (const client of clients) {
    const bookingCount = Math.floor(Math.random() * 2) + 1;

    for (let b = 0; b < bookingCount; b++) {
      const service = services[Math.floor(Math.random() * services.length)];
      if (service.providerId === client.id) continue;

      const isPast = Math.random() > 0.5;
      const baseDate = new Date();
      let startDate, endDate, status;

      if (isPast) {
        startDate = addDays(baseDate, -Math.floor(Math.random() * 30) - 1);
        endDate = addDays(startDate, 1); 
        status = 'COMPLETED';
      } else {
        startDate = addDays(baseDate, Math.floor(Math.random() * 30) + 1);
        endDate = addDays(startDate, 1);
        status = 'CONFIRMED';
      }

      const totalPrice = service.price; // Simplified
      const serviceFee = totalPrice * 0.12;
      const providerEarnings = totalPrice - serviceFee;

      const bookingId = `booking_${client.id}_${b}`;

      await prisma.$executeRawUnsafe(`
        INSERT INTO "bookings" (id, "startDate", "endDate", "totalPrice", "serviceFee", "providerEarnings", status, "createdAt", "updatedAt", "serviceId", "clientId", "providerId")
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, bookingId, startDate.toISOString(), endDate.toISOString(), totalPrice, serviceFee, providerEarnings, status, now, now, service.id, client.id, service.providerId);
    }
  }
  console.log('✅ Bookings created');
  console.log('🎉 Ultimate Seed Finished!');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
