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
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
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
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/create-account?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Creation",
    html: `<p>Click <a href="${verificationUrl}">here</a> to create an account.</p>`,
  };

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email");
  }
};
