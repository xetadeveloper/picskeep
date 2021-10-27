// This module sends mail using nodemailer api
import nodemailer from 'nodemailer';

let globalTransport;

// gets the transport object
function getTransportObject() {
  if (globalTransport) {
    return globalTransport;
  } else {
    // Create a new transport object
    const transportOptions = {
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.picsKeepEmail,
        pass: process.env.picsKeepPass,
      },
    };
    globalTransport = nodemailer.createTransport(transportOptions);
    return globalTransport;
  }
}

// Sends the email
export function sendEmail(userMail) {
  return new Promise((resolve, reject) => {
    // Sends the email
    const mailData = {
      from: '"PicsKeep Contact Us" xetaglobal@gmail.com',
      to: 'xetaglobal@gmail.com',
      subject: 'PicsKeep Contact Us Message',
      html: `
            <h2>User Email: ${userMail.email}</h2>
            <h2>Message:</h2>
            <p>${userMail.message}</p>
            `,
    };

    getTransportObject()
      .sendMail(mailData)
      .then(info => {
        resolve(info);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Closes the tranpsort connections
export function closeTransport() {
  if (globalTransport) {
    globalTransport.close();
  }
}
