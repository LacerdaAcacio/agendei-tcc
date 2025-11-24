import { EtherealMailProvider } from './EtherealMailProvider';
import { IMailProvider } from './IMailProvider';

export { IMailProvider };

// Simple console-based implementation for development
export class ConsoleMailProvider implements IMailProvider {
  async sendMail(to: string, subject: string, body: string): Promise<void> {
    console.info('📧 Email sent:');
    console.info(`  To: ${to}`);
    console.info(`  Subject: ${subject}`);
    console.info(`  Body: ${body}`);
  }
}

// Factory function to get the appropriate provider
export const getMailProvider = (): IMailProvider => {
  // Use Ethereal for development/testing
  return new EtherealMailProvider();
};
