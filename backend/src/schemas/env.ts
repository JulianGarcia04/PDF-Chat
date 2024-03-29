import { z } from "zod";

export const envSchema = z.object({
	VISION_KEY: z.string(),
	VISION_ENDPOINT: z.string().url(),
	AZURE_STORAGE_CONNECTION_STRING: z.string(),
	REDIS_URI: z.string().url(),
	OLLAMA_HOST: z.string().url(),
	NODE_ENV: z.enum(["development", "production"]),
});

export type Env = z.infer<typeof envSchema>;
