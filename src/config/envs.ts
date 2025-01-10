import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STRIPE_KEY: string;
}

const envSchema = joi
  .object({
    PORT: joi.number().required(),
    STRIPE_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  STRIPE_KEY: envVars.STRIPE_KEY,
};
