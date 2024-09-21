import { MailtrapClient } from "mailtrap";
import { MAILTRAP_API_KEY } from "../env";

export const mailtrapClient = new MailtrapClient({
  token: MAILTRAP_API_KEY,
});

export const sender = {
  email: "mailtrap@demomailtrap.com",
  name: "Safe Spoon",
};
