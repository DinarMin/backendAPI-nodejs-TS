import { Response } from "express";

export const responseHandlerCookie = (res: Response, parseBody: any) => {
  if (parseBody && parseBody.token) {
    res.cookie("token", parseBody.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return parseBody.message;
  }
  return parseBody;
};
