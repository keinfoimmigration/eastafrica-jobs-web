import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, applicationNumber } = req.body;

  if (!email || !applicationNumber) {
    return res.status(400).json({ error: 'Missing email or application number' });
  }

  // Use robust settings for cloud environments (Port 587 is more reliable than 465)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"East African Community" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Official Application Received - ${applicationNumber}`,
    text: `Hello,\n\nThank you for applying through the official East African Community Portal! We have successfully received your application.\n\nYour Application Number is: ${applicationNumber}\n\nYou can track your application status on our official portal at any time. We look forward to assisting your employment journey within our partner countries!\n\nBest regards,\nEast African Community Team`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #0088CC; text-align: center;">Official Application Received!</h2>
        <p>Hello,</p>
        <p>Thank you for choosing the <strong>East African Community Portal</strong>. We are pleased to inform you that your application for employment placement has been successfully received and is now under official review by the East African Community.</p>
        
        <div style="background: #e6f7ff; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #0088CC;">
          <p style="margin: 0; color: #0F172A; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Official Application Number</p>
          <p style="margin: 10px 0 0; color: #0088CC; font-size: 28px; font-weight: bold;">${applicationNumber}</p>
        </div>
        
        <p>You can use this reference number to securely check your status on our portal. We will also send updates via SMS and Email as your EAC labor clearance progresses.</p>
        
        <p style="margin-top: 30px;">Best regards,<br>
        <strong style="color: #0088CC;">East African Community Team</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">This is an automated message, please do not reply directly to this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}
