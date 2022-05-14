import jwt from "jsonwebtoken";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import prisma from "./prisma";

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { CHORDS_ACCESS_TOKEN: token } = req.cookies;

    if (token) {
      let user;

      try {
        const { id } = jwt.verify(token, "hello");
        user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
          throw new Error("Not real user");
        }
      } catch (e) {
        res.status(401).json({
          message: "Unauthorized",
        });
      }
      return handler(req, res, user);
    }
    res.status(401).json({
      message: "Unauthorized",
    });
  };
};

export const validateToken = (token) => {
  const user = jwt.verify(token, "hello");
  return user;
}
