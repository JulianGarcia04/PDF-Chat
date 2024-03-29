import { ModelResponse, Ollama } from "ollama";

import { env } from "./env";

export const ollamaClient = new Ollama({
	host: env.OLLAMA_HOST,
});

ollamaClient
	.list()
	.then((res) => {
		if (res.models.some((obj) => obj.name === "llama2")) {
			console.log("Model llama2 exists");
			return;
		}

		ollamaClient
			.pull({
				model: "llama2",
			})
			.then(() => {
				console.log("Model llama2 pulled");
			})
			.catch((err) => {
				console.error("Error pulling model llama2", err);
			});
	})
	.catch(() => {
		console.error("Error listing models");
	});
