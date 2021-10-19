import { closeS3Client } from '../S3/awsModule.js';
import { checkIfConnected, closeClientInstance } from '../Database/mongoDB.js';
import { closeTransport } from './MailSender/mailSend.js';

export default function cleanupServer(code) {
  console.log(`App exited with code: ${code}`);
  console.log('isDBCOnnected in exit: ', checkIfConnected());
  if (checkIfConnected()) {
    closeClientInstance();
  }

  closeTransport();
  closeS3Client();
}
