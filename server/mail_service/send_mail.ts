import { transport, sender } from "./mail_service_config";

export interface mail_data_type {
  from?: { address: string; name: string };
  to: string[];
  subject: string;
  text?: string;
  html?: string;
  category?: string;
}

// const recipients: string[] = ["projectwork207d@gmail.com"];

export const send_mail = async (data: mail_data_type): Promise<boolean> => {
  data = { ...data, from: sender };
  if (!(await transport.sendMail(data))) {
    return false;
  }
  return true;
};
