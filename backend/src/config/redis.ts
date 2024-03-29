import { createClient } from "redis";

import { env } from "./env";

export const redisClient = createClient({
	url: env.REDIS_URI,
});

redisClient.on("error", (err) => {
	console.error("Redis Client Error", err);
});

if (!redisClient.isOpen) {
	redisClient.connect().then(() => {
		console.info("Redis Client Connected");
	});
} else {
	console.info("Redis Client already connected");
}
