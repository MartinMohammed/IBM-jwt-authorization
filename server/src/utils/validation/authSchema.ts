import joi from "@hapi/joi";

const authSchema = joi.object({
  email: joi.string().email().lowercase().required(),
  password: joi.string().min(2).required(),
});

export default authSchema;
