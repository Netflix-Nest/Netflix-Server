import { Injectable } from '@nestjs/common';
import admin from './firebase.config';

@Injectable()
export class FcmService {
  async sendPushNotification(token: string, title: string, body: string) {
    try {
      const response = await admin.messaging().send({
        token,
        notification: {
          title,
          body,
        },
      });
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }
}
