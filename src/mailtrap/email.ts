import { mailtrapClient, sender } from "./mailtrap.config";
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
} from "./emailTemplate";

export const sendOtp = async (email: string, code: string) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", code),
      category: "Email Verification",
    });

    console.log("Verification email sent to: ", email);
  } catch (error) {
    console.error("Error sending verification email: ", error);
    throw new Error("Error sending verification email");
  }
};

export const sendPasswordResetEmail = async (email: string, url: string) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", url),
      category: "Password Reset",
    });

    console.log("Password reset email sent to: ", email);
  } catch (error) {
    console.error("Error sending password reset email: ", error);
    throw new Error("Error sending password reset email");
  }
};
