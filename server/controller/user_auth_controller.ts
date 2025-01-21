import { Request, Response, NextFunction } from "express";
import user_model, { send_user_type, user_type } from "../model/user_model";
import { cmp_password, gen_hash } from "../utils/hash_utils";
import { get_rand_code } from "../utils/gen_rand_code";
import {
  send_reset_pass_otp_mail,
  send_verifiy_otp_mail,
} from "../utils/send_user_mail";
import { jwt_decode, jwt_gen_set } from "../utils/jwt_gen_set";
import { JwtPayload } from "jsonwebtoken";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, email, password } = req.body;

    if (!user_name || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Requier data not found" });
      return;
    }
    const user_data: user_type | null = await user_model.findOne({ user_name });
    if (user_data) {
      res.status(400).json({ success: false, message: "user exists" });
      return;
    }
    const hash_password: string = await gen_hash(password);
    const save_user: user_type = new user_model({
      user_name,
      email,
      password: hash_password,
    });

    await save_user.save();

    res.status(200).json({ success: true, message: "user save successfully" });
  } catch (e: unknown) {
    res.status(400).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user_name, password } = req.params;
    if (!user_name || !password) {
      res.status(400).json({ success: false, message: "insufficient data" });
      return;
    }

    const user_data: user_type | null = await user_model.findOne({ user_name });

    if (!user_data) {
      res.status(400).json({ success: false, message: "user not exist" });
      return;
    }

    if (!(await cmp_password(user_data.password, password))) {
      res.status(400).json({ success: false, message: "wrong password" });
      return;
    }
    if (!jwt_gen_set(res, user_data.user_name)) {
      res.status(400).json({ success: false, message: "error to set cookie" });
      return;
    }
    res.status(200).json({ success: true, message: "user login successfully" });
  } catch (e: unknown) {
    res.status(400).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const set_send_email = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name } = req.body;
    if (!user_name) {
      res.status(400).json({ success: false, message: "insufficient data" });
      return;
    }

    const user_data: user_type | null = await user_model.findOne({ user_name });
    if (!user_data) {
      res.status(400).json({ success: true, message: "user not exist" });
      return;
    }
    if (
      user_data.verify_token_expire &&
      user_data.verify_token_expire > new Date()
    ) {
      res.status(400).json({ success: false, message: "wait time 15min" });
      return;
    }

    const code: string = get_rand_code().toString();

    user_data.verify_token = code;

    user_data.verify_token_expire = new Date(Date.now() + 15 * 60 * 1000);

    await user_data.save();
    if (!(await send_verifiy_otp_mail(user_name, user_data.email, code))) {
      res.status(400).json({ success: false, message: "fail to send mail" });
      return;
    }

    res.status(200).json({ success: true, message: "send otp successfully" });
  } catch (e: unknown) {
    res.status(400).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const verifiy_email = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_name, code } = req.body;
    if (!user_name || !code) {
      res
        .status(400)
        .json({ success: false, message: "Requier data not found" });
      return;
    }
    const user_data: user_type | null = await user_model.findOne({ user_name });
    if (!user_data || !user_data.verify_token) {
      res.status(400).json({
        success: false,
        message: "user not exist or code is expired",
      });
      return;
    }

    if (code != user_data.verify_token || !user_data.verify_token_expire) {
      res.status(400).json({
        success: false,
        message: "wrong code",
      });
      return;
    }

    if (user_data.verify_token_expire < new Date()) {
      res.status(400).json({
        success: false,
        message: "code expired",
      });
      return;
    }
    user_data.is_verify = true;
    user_data.verify_token = undefined;
    user_data.verify_token_expire = undefined;
    await user_data.save();
    res
      .status(200)
      .json({ success: true, message: "verification successfully" });
  } catch (e: unknown) {
    res.status(400).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const password_reset_request = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "insufficient data" });
      return;
    }

    const user_data: user_type | null = await user_model.findOne({ email });
    if (!user_data || !user_data.is_verify) {
      res
        .status(400)
        .json({ success: true, message: "user not exist or not verified" });
      return;
    }

    const token: string = await gen_hash(get_rand_code().toString());

    user_data.reset_pass_token = token;

    user_data.reset_pass_token_expire = new Date(Date.now() + 15 * 60 * 1000);

    await user_data.save();
    if (!(await send_reset_pass_otp_mail(user_data.email, token))) {
      res.status(400).json({ success: false, message: "fail to send mail" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "password reset link sended" });
  } catch (e: unknown) {
    res.status(400).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const reset_password = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      res.status(400).json({ success: false, message: "insufficient data" });
      return;
    }

    const user_data: user_type | null = await user_model.findOne({
      reset_pass_token: token,
    });

    if (
      !user_data ||
      !user_data.reset_pass_token_expire ||
      new Date() > user_data.reset_pass_token_expire
    ) {
      res
        .status(400)
        .json({ success: true, message: "worng link or its' expire" });
      return;
    }
    user_data.reset_pass_token = undefined;
    user_data.reset_pass_token_expire = undefined;
    user_data.password = await gen_hash(password);
    await user_data.save();
    res
      .status(200)
      .json({ success: true, message: "successfully reset the password" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export const req_user_data = async (req: user, res: Response) => {
  try {
    const user_name = req.user;
    if (!user_name) {
      res.status(400).json({
        success: true,
        message: "login token expire or something else happend",
      });
      return;
    }
    const user_data: send_user_type | null = await user_model
      .findOne({ user_name })
      .select("user_name email is_verify");

    if (!user_data) {
      res.status(400).json({
        success: true,
        message: "worg token or something else",
      });
      return;
    }
    res
      .status(200)
      .json({ success: true, message: "Verify succesfully", user_data });
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
    throw e;
  }
};

export interface user extends Request {
  user?: string | JwtPayload;
}

export const auth_user = async (
  req: user,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie: string | undefined = req.cookies.authToken;
    if (!cookie) {
      res.status(401).json({ success: true, message: "user not login" });
      return;
    }
    const decoded: string | JwtPayload = jwt_decode(cookie);

    req.user = decoded;
    next();
  } catch (e) {
    res.status(500).json({ success: false, message: "Internal server error" });
    throw e;
  }
};
