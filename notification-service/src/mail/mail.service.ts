import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ContentEpisodeDto, ContentMovieDto } from '@netflix-clone/types';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async sendUserWelcome(email: string, name: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome Netflix',
        template: './welcome',
        context: {
          name,
          token,
        },
      });
      console.log(`Email sent ${email}`);
      return 'Email sent !';
    } catch (error) {
      console.error('Failed to sent mail:', error);
      throw error;
    }
  }

  async resetPassword(email: string, name: string, token: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Password',
        template: './reset-password',
        context: {
          name,
          token,
        },
      });
      console.log(`Email sent ${email}`);
      return 'Email sent !';
    } catch (error) {
      console.error('Failed to sent mail:', error);
      throw error;
    }
  }

  async newFilm(email: string, name: string, content: ContentMovieDto) {
    const { title, thumbnail, publishAt, quality } = content;
    const publishAtConvert = publishAt.toString().slice(0, 16);
    await this.mailerService.sendMail({
      to: email,
      subject: 'New Movie',
      template: './new-movie',
      context: {
        name,
        title,
        thumbnail,
        publishAt: publishAtConvert,
        quality,
      },
    });
  }

  async newEpisode(email: string, name: string, content: ContentEpisodeDto) {
    const { title, publishAt, quality, episodeNumber, series, thumbnail } =
      content;
    const publishAtConvert = publishAt.toString().slice(0, 16);

    await this.mailerService.sendMail({
      to: email,
      subject: 'New Episode',
      template: './new-episode',
      context: {
        name,
        thumbnail,
        title,
        publishAt: publishAtConvert,
        quality,
        episodeNumber,
        series,
      },
    });
  }

  async contentPublish(followers: number[], content: ContentMovieDto) {
    const users = await lastValueFrom(
      this.userClient.send('find-user-by-ids', followers),
    );
    await Promise.all(
      users.map(async (user) => {
        try {
          await this.newFilm(user.email, user.fullName, content);
          console.log('Mail success to', user.email);
        } catch (error) {
          console.error('Error when mailer to', user.email, error);
        }
      }),
    );
  }
}
