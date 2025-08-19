import * as admin from 'firebase-admin';
import { existsSync } from 'fs';

const credPath =
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  '../../netflix-clone-b65d2-firebase-adminsdk-fbsvc-6a3c0c02cc.json';

// if (!existsSync(credPath)) {
//   throw new Error(`Firebase credentials file not found at: ${credPath}`);
// }

admin.initializeApp({
  credential: admin.credential.cert(require(credPath)),
});

export default admin;
