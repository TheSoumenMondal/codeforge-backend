import type { Readable } from "node:stream";
import Docker from "dockerode";
import { logger } from "../../config/logger/pino-logger.js";
import { DOCKER_IMAGES } from "../../constants/images.js";

export async function pullDockerImage(
	imageName: (typeof DOCKER_IMAGES)[keyof typeof DOCKER_IMAGES],
) {
	const docker = new Docker();
	return new Promise((resolved, rejected) => {
		docker.pull(imageName, (err: Error, stream: Readable | null) => {
			if (err) {
				return rejected(err);
			}

			if (!stream) {
				return rejected(
					new Error(`Docker did not return a stream for ${imageName}`),
				);
			}
			docker.modem.followProgress(
				stream,
				function onFinished(err, output) {
					if (err) {
						return rejected(err);
					}
					resolved(output);
				},

				function onProgress(event) {
					logger.info(
						`Pulling image ${imageName} : ${event.status} ${event.progress || ""}`,
					);
				},
			);
		});
	});
}

export async function pullAllDockerImages() {
	const images = [
		DOCKER_IMAGES.cpp,
		DOCKER_IMAGES.python,
		DOCKER_IMAGES.java,
		DOCKER_IMAGES.javascript,
	];
	const promises = images.map((img) => pullDockerImage(img));
	try {
		const res = await Promise.all(promises);
		logger.info("All images pulled successfully");
	} catch (error) {
		logger.error(`Error pulling images: ${error}`);
	}
}
