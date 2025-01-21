import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "../mail_service/mail_templates";
import { mail_data_type, send_mail } from "../mail_service/send_mail";

export const send_verifiy_otp_mail = async (
  user_name: string,
  email: string,
  code: string
): Promise<boolean> => {
  try {
    const template: string = VERIFICATION_EMAIL_TEMPLATE.replace(
      "{user_name}",
      user_name
    ).replace("{verificationCode}", code);

    const info: mail_data_type = {
      to: [email],
      subject: "E-Mail Verification",
      html: template,
    };
    return send_mail(info);
  } catch (e: unknown) {
    console.log(e);
    return false;
  }
};

export const send_reset_pass_otp_mail = async (
  email: string,
  token: string
): Promise<boolean> => {
  try {
    const template: string = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
      "{resetURL}",
      `http://localhost/login/forget_password/search?id=${token}`
    );

    const info: mail_data_type = {
      to: [email],
      subject: "Password Reset",
      html: template,
    };
    return send_mail(info);
  } catch (e: unknown) {
    console.log(e);
    return false;
  }
};
