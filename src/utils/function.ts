import jwt from "jsonwebtoken";
const ensureToken = (req: any, res: any, next: Function) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader === "undefined") {
    return res.sendStatus(403);
  }

  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  jwt.verify(bearerToken, "my_secret_key", (err: any, data: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.token = bearerToken;
    req.user = data;
    next();
  });
};

export { ensureToken };
