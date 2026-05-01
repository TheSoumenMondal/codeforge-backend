import { DOCKER_STREAM_HEADER_SIZE } from "../../constants/docker.js";
import type { DockerStreamOutput } from "../../type/docker.js";

export const decodeDockerStream = (buffer: Buffer) => {
	let offset = 0;
	const output: DockerStreamOutput = {
		stdout: "",
		stderr: "",
	};

	while (offset < buffer.length) {
		const typeOfStream = buffer[offset];
		const length = buffer.readUInt32BE(offset + 4);
		offset += DOCKER_STREAM_HEADER_SIZE;

		if (typeOfStream === 1) {
			output.stdout += buffer.toString("utf8", offset, offset + length);
		} else if (typeOfStream === 2) {
			output.stderr += buffer.toString("utf8", offset, offset + length);
		}
		offset += length;
	}
	return output;
};
