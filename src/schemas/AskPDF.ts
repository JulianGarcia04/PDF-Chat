import { z } from "zod";

export const askPDFResponseSchema = z.object({
	message: z.string(),
	created_at: z.object({
		raw: z.date(),
		formatted: z.string(),
	}),
});

export type AskPDFResponse = z.infer<typeof askPDFResponseSchema>;
