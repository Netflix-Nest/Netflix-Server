import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserWelcome(email: string, name: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome Netflix',
        template: './welcome',
        context: {
          name,
          code,
        },
      });
      console.log(`Email sent ${email}`);
      return 'Email sent !';
    } catch (error) {
      console.error('Failed to sent mail:', error);
      throw error;
    }
  }

  async resetPassword(email: string, name: string, code: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Password',
        template: './reset-password',
        context: {
          name,
          code,
        },
      });
      console.log(`Email sent ${email}`);
      return 'Email sent !';
    } catch (error) {
      console.error('Failed to sent mail:', error);
      throw error;
    }
  }

  async newFilm(email: string, name: string, content: any) {
    const { title, thumbnail, publishAt, quality } = content;
    await this.mailerService.sendMail({
      to: email,
      subject: 'New Movie',
      template: './new-movie',
      context: {
        name,
        title,
        thumbnail,
        publishAt,
        quality,
      },
    });
  }

  async newEpisode(email: string, name: string, content: any) {
    const { title, publishAt, quality, episodeNumber, series, thumbnail } =
      content;
    await this.mailerService.sendMail({
      to: email,
      subject: 'New Episode',
      template: './new-episode',
      context: {
        name,
        thumbnail,
        title,
        publishAt,
        quality,
        episodeNumber,
        series,
      },
    });
  }
}
