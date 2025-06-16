import Joi from "joi";

export const creatCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .required(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
      .required(),
  });
  return customer.validate(data);
};

export const updateCustomerValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)
      .optional(),
    phoneNumber: Joi.string()
      .regex(/^\+998\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
      .optional(),
  });
  return customer.validate(data);
};
