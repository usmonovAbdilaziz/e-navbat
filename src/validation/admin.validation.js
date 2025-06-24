import Joi from "joi";

export const createAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string()
      .regex(/(?=.*[a-z])(?=.*[A-Z])[A-Za-z]{8,20}/)
      .required(),
  });
  return admin.validate(data);
};

export const updateAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).optional(),
    password: Joi.string()
      .regex(
        /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!#.])[A-Za-z0-9$@$!%*?&.]{8,20}/
      )
      .optional(),
  });
  return admin.validate(data);
};
