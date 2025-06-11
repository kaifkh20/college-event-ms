import nodemailer from "nodemailer"
import QRCode from "qrcode"

async function sendConfirmationEmail(email, event) {
  const qrData = event.qrData;
  const qrImage = await QRCode.toDataURL(qrData); // base64 image
  
  const testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email", // or Gmail, etc.
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  })

  const mailOptions = {
    from: '"Event Team" <noreply@example.com>',
    to: email,
    subject: "Event Registration with QR",
    html: `
      <h2>Thank you for registering!</h2>
      <p>Your event QR code is below:</p>
      <img src="${qrImage}" alt="QR Code" style="width:200px;height:200px;" />
      <p>To cancel your registration. Contact the administration.</p>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", nodemailer.getTestMessageUrl(info));
}

export default sendConfirmationEmail

