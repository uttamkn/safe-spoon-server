import { MailtrapClient } from "mailtrap";

const TOKEN = process.env.MAILTRAP_API_TOKEN;

if (!TOKEN) {
  throw new Error("MAILTRAP_API_TOKEN not found in environment variables");
}

export const mailtrapClient = new MailtrapClient({
  token: TOKEN,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Safe Spoon",
};
