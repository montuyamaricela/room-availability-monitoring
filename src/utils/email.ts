import nodemailer from "nodemailer";

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use another email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
    <h2>Hello,</h2>
    <p>Welcome to the BulSU - Room Availability Monitoring app! Your account has been successfully created. To complete your sign-up process and activate your account, please verify your email address by clicking the link below:</p>
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
    <p>Thank you for registering with the BulSU - Room Availability Monitoring app. To complete your registration and gain full access to our platform, please verify your email address by clicking the link below:</p>
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
    <p>We received a request to reset your password for your BulSU - Room Availability Monitoring app account. If you made this request, please click the link below to set a new password:</p>
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
