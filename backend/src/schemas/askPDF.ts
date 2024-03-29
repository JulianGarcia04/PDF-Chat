import { z } from "zod";

export const askPDFBodyRequestSchema = z.object({
	message: z.string(),
	pdfTitle: z.string(),
});

export const askPDFBodyResponseSchema = z.object({
	message: z.string(),
	created_at: z.object({
		raw: z.date(),
		formatted: z.string(),
	}),
});
