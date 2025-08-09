import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(email: string, name: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome Netflix',
        template: './welcome',
        context: {
          name,
          url: `https://facebook.com`,
        },
      });
      console.log(`Email sent ${email}`);
    } catch (error) {
      console.error('Failed to sent mail:', error);
      throw error;
    }
  }
}
