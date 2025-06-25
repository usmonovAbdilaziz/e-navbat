import Joi from "joi";

export const createCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required(),
    phoneNumber: Joi.string()
      .regex(/^\+998\d{2}\d{3}\d{2}\d{2}$/)
      .required(),
  });
  return customer.validate(data);
};
export const signUpCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required(),
    phoneNumber: Joi.string()
      .regex(/^\+998\d{2}\d{3}\d{2}\d{2}$/)
      .required(),
  });
  return customer.validate(data);
};
export const signInCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required(),
  });
  return customer.validate(data);
};
export const confirmSignInCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required(),
    otp: Joi.string().length(6).required(),
  });
  return customer.validate(data);
};

export const updateCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .optional(),
    phoneNumber: Joi.string()
      .regex(/^\+998\d{2}\d{3}\d{2}\d{2}$/)
      .optional(),
  });
  return customer.validate(data);
};
