import Joi from "joi";

export const createTicketValidator = (data) => {
  const ticket = Joi.object({
    transportId: Joi.string().required(),
    from: Joi.string().required(),
    to: Joi.string().required(),
    price: Joi.string().required(),
    departure: Joi.string().required(),
    arrival: Joi.string().required(),
    customerId: Joi.string().required(),
  });
  return ticket.validate(data);
};

export const updateTicketValidator = (data) => {
  const ticket = Joi.object({
    transportId: Joi.string().optional(),
    from: Joi.string().optional(),
    to: Joi.string().optional(),
    price: Joi.string().optional(),
    departure: Joi.string().optional(),
    arrival: Joi.string().optional(),
    customerId: Joi.string().optional(),
  });
  return ticket.validate(data);
};
