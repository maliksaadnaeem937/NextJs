import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password (NOT your Gmail login password)
  },
});

export async function sendVerificationEmail(to, name, code) {
  const mailOptions = {
    from: `"DevConnect 👨‍💻" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your DevConnect account',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thanks for signing up at <strong>DevConnect</strong>.</p>
      <p>Your verification code is:</p>
      <h1 style="color:blue;">${code}</h1>
      <p>Please enter this code in the app to verify your account.</p>
      <p>If you didn’t request this, you can safely ignore it.</p>
      <br/>
      <small>This is an automated email. Do not reply.</small>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent to:', to);
  } catch (err) {
    console.error('❌ Email sending error:', err);
    throw err;
  }
}
