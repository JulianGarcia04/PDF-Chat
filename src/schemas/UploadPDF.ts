import { z } from "zod";

export const uploadPDFResponseSchema = z.object({
	pages: z.number(),
	title: z.object({
		raw: z.string(),
		processed: z.string(),
	}),
	url: z.string().url(),
	requestId: z.string().uuid(),
	clientRequestId: z.string().uuid(),
});

export type UploadPDFResponse = z.infer<typeof uploadPDFResponseSchema>;
