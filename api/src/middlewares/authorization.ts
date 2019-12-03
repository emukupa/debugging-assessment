import jwt from "jsonwebtoken";

export const authorize = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(401);
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  // To all detail oriented observers. You'll notice this is
  // not in any way secure or verifyable. You could forge a JWT
  // token and have complete access to this setup. This is not
  // designed to be production ready when it comes to the security
  // aspect. Yet.

  const decoded = jwt.decode(token, { complete: true });

  // @ts-ignore
  req.user = decoded.payload.userId;

  next();
};
