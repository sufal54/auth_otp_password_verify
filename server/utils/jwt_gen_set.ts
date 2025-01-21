import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const secrate_key: string = "secrate";
export const jwt_gen_set = (res: Response, token: string): boolean => {
  try {
    const gen_token: string = jwt.sign(token, secrate_key);
    res.cookie("authToken", gen_token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const jwt_decode = (token: string): string | JwtPayload => {
  return jwt.verify(token, secrate_key);
};
