import nodemailer from "nodemailer";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
   pool: true, // Enables connection pooling
    maxConnections: 5, // Maximum simultaneous connections
    maxMessages: 100, // Maximum messages per connection
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
    <h2>Hello,</h2>
    <p>Welcome to the BulSU - Room Availability Monitoring website! Your account has been successfully created. To complete your sign-up process and activate your account, please verify your email address by clicking the link below:</p>
    <a href="${verificationUrl}">Verify your account</a>
    <p>If you did not initiate this sign-up, please ignore this email.</p>
    <p>Best regards,</p>
    <p>BulSU - Room Availability Monitoring Team</p>
    `,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendInvitationLink = async (email: string, token: string) => {
  const invitationUrl = `${process.env.NEXTAUTH_URL}/api/create-account?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Creation",
    html: `
    <h2>Hello,</h2>
    <p>Thank you for registering with the BulSU - Room Availability Monitoring website. To complete your registration and gain full access to our platform, please click the link below:</p>
    <a href="${invitationUrl}">Create your account</a>
    <p>If you didn't request an account, please ignore this email.</p>
    <p>Best regards,</p>
    <p>BulSU - Room Availability Monitoring Team</p>
    `,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};

export const sendForgotPasswordLink = async (email: string, token: string) => {
  const forgotPasswordUrl = `${process.env.NEXTAUTH_URL}/api/forgot-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `
    <h2>Hello,</h2>
    <p>We received a request to reset your password for your BulSU - Room Availability Monitoring website account. If you made this request, please click the link below to set a new password:</p>
    <a href="${forgotPasswordUrl}">Reset Password</a>
    <p>If you didn't request a password reset, please ignore this email. Your account remains secure, and no changes will be made.</p>
    <p>Best regards,</p>
    <p>BulSU - Room Availability Monitoring Team</p>
    `,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};


export const sendPendingKeyReturn = async (email: string, facultyName: string, roomName: string) => {

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Pending Room Key Return Notification",
    html: `
    <h2>Hello, ${facultyName}</h2>
    <p>We would like to remind you that the key for <strong>${roomName}</strong> has not been returned yet. Please ensure that the key is returned as soon as possible to avoid any inconvenience.</p>
    <p>If you have already returned the key, kindly disregard this message. If you have any questions or need assistance, please contact the administration office.</p>
    <p>Thank you for your cooperation.</p>
    <p>Best regards,</p>
    <p>BulSU - Room Availability Monitoring Team</p>
    `,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending pending notification email:", error);
    throw new Error("Error sending pending notification email");
  }
};


// export const sendPendingKeyReturn = async (
//   emailData: { email: string; facultyName: string; roomName: string }[]
// ) => {

//   try {
//     console.log(emailData)
//     // Prepare bulk email promises
//     const emailPromises = emailData.map(({ email, facultyName, roomName }) =>
//       transporter.sendMail({
//         from: `"BulSU - Room Monitoring Team" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Pending Room Key Return Notification",
//         html: generateEmailHTML(facultyName, roomName),
//       })
//     );

//     // Send all emails concurrently
//     await Promise.all(emailPromises);
//     console.log("All emails sent successfully.");
//   } catch (error) {
//     console.error("Failed to send bulk notifications:", error);
//     throw new Error("Failed to send one or more emails.");
//   }
// };

// Helper function to generate email HTML
const generateEmailHTML = (facultyName: string, roomName: string): string => `
  <h2>Hello, ${facultyName}</h2>
  <p>We would like to remind you that the key for <strong>${roomName}</strong> has not been returned yet. Please ensure that the key is returned as soon as possible to avoid any inconvenience.</p>
  <p>If you have already returned the key, kindly disregard this message. If you have any questions or need assistance, please contact the administration office.</p>
  <p>Thank you for your cooperation.</p>
  <p>Best regards,</p>
  <p>BulSU - Room Availability Monitoring Team</p>
`;
