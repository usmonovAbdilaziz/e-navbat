import { handleError } from "../helpers/error.js";
export const logMid = (includeRoles = []) => {
  return (req, res, next) => {
    console.log(req.user.role);
    if (!includeRoles.includes(req.user?.role)) {
      return handleError(res, "Forbidden user", 403);
    }
  };
};
