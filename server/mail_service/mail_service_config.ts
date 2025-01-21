import Nodemailer from "nodemailer";
import { MailtrapTransport } from "mailtrap";
import { MailtrapTransporter } from "mailtrap/dist/types/transport";

const TOKEN = process.env.MAIL_SERVICE_TOKEN;

if (!TOKEN) {
  throw new Error("Mail Service token invaild");
}

export const transport: MailtrapTransporter = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

export const sender: { address: string; name: string } = {
  address: "hello@demomailtrap.com",
  name: "Demo Test",
};
