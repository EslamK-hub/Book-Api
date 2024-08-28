import { decodeToken } from "./tokens.js";

// --------------------------------- Start Authentication --------------------------------- //
function auth(req, res, next) {
  try {
    let tokenHeader = req.headers.authorization;

    if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json("Authorization required for this action.");
    }

    tokenHeader = tokenHeader.split(" ")[1];

    const { user_id } = decodeToken(tokenHeader);
    req.user = { user_id };

    next();
  } catch (error) {
    return res
      .status(401)
      .json("Authorization required for this action.");
  }
}
// --------------------------------- End Authentication --------------------------------- //

export default auth;
