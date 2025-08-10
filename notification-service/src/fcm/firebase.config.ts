import * as admin from 'firebase-admin';
import { join } from 'path';

admin.initializeApp({
  credential: admin.credential.cert(
    require(
      join(
        __dirname,
        '../../netflix-clone-b65d2-firebase-adminsdk-fbsvc-6a3c0c02cc.json',
      ),
    ),
  ),
});

export default admin;
