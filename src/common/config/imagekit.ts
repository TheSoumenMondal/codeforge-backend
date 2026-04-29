import ImageKit from "@imagekit/nodejs";
import { envConfig } from "./server.config.js";

const imagekitClient = new ImageKit({
	privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
});

export { imagekitClient };
