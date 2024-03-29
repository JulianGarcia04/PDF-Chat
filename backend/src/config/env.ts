import { config } from "dotenv";

import { envSchema } from "../schemas";

config();

export const env = envSchema.parse(process.env);
