require("dotenv").config();
import jwt from "jsonwebtoken";
const nonSecurePaths = ["/"];

const extractToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  // let cookies = req.cookies;
  let tokenFromHeader = extractToken(req);
  console.log(">>>> check token", tokenFromHeader);
  if (tokenFromHeader) {
    let access_token = tokenFromHeader;
    next();
    // let decode = verifyToken(access_token);

    // if (decode) {
    //   decode.access_token = access_token;
    //   decode.refresh_token = cookies.refresh_token;
    //   req.user = decode;
    //   // req.access_token = access_token;
    //   next();
    // } else {
    //   return res.status(401).json({
    //     EC: -1,
    //     DT: "",
    //     EM: "Not authenticaed the user",
    //   });
    // }

    // console.log("jwt:", cookies.jwt);
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticaed the 2",
    });
  }
};
const checkuserpermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();

  if (req.user) {
    let email = req.user.email;
    let roles = req.user.groupWithRoles.Roles;
    let currentUrl = req.path;
    if (!roles || roles.lenght === 0) {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't permission to access this resource...`,
      });
    }
    let canAccess = roles.some(
      (item) => item.url === currentUrl || currentUrl.includes(item.url)
    );
    if (canAccess == true) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        DT: "",
        EM: `You don't permission to access this resource...`,
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      DT: "",
      EM: "Not authenticaed the user",
    });
  }
};
module.exports = {
  checkUserJWT,
  checkuserpermission,
};
