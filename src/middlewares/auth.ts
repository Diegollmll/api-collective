import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
interface AuthenticatedRequest extends Request {
    user?: Express.User;
}

passport.authenticate("jwt", { session: false }, (err: Error | null, user: Express.User | undefined) => {
    if (err || !user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    (req as AuthenticatedRequest).user = user; // Añadimos el usuario al objeto `req`
    next();
})(req, res, next);
};