import axios from "axios";

export const server = axios.create({
	baseURL: "http://localhost:7071/api",
});
