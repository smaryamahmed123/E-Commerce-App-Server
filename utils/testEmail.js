// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

// // Configure Nodemailer transporter




// export const testEmail = async (req, res) => {
//     const transporter = nodemailer.createTransport({
//         host: "smtp.ethereal.email",
//         port: 587,
//         secure: false,
//         // service: 'gmail', // Use lowercase 'gmail'
//         auth: {
//             user: 'geovanny47@ethereal.email',
//             pass: 'rWdPPktkwruGkXYVxc'
//         },
//         tls: {
//             rejectUnauthorized: false, // Disable certificate validation
//         },
//     });
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
//         to: "smaryamahmed2006@example.com", // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//       });
//       console.log("Message sent: %s", info.messageId);
//       res.json(info)
// };

// // testEmail();





import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Nodemailer transporter

export const testEmail = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // Disable certificate validation
      },
    });
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to: "syedamaryamahmed80@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    res.json(info);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};
