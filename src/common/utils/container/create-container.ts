import Docker from "dockerode";
import { logger } from "../../config/logger/pino-logger.js";

export interface ContainerConfig {
	image: string;
	cmdExecutable: string[];
	memoryLimit: number;
}

export async function createContainer(option: ContainerConfig) {
	const docker = new Docker();
	try {
		const container = await docker.createContainer({
			Image: option.image,
			Cmd: option.cmdExecutable,
			AttachStdin: true,
			AttachStdout: true,
			AttachStderr: true,
			HostConfig: {
				Memory: option.memoryLimit,
				AutoRemove: true,
				PidsLimit: 10,
				CpuQuota: 50000,
				CpuPeriod: 100000,
				SecurityOpt: ["no-new-privileges"],
				NetworkMode: "none",
			},
			OpenStdin: true,
			Tty: false,
		});

		logger.info(
			`Container created with id ${container.id} using image ${option.image}`,
		);
		return container;
	} catch (error) {
		logger.error(`Error occurred while creating container: ${error}`);
		throw error;
	}
}
