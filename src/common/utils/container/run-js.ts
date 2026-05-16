import Docker from "dockerode";
import { logger } from "../../config/logger/pino-logger.js";
import { DOCKER_IMAGES } from "../../constants/images.js";
import type {
	CodeExecutionResponse,
	CodeExecutionStrategy,
} from "../../type/execution.js";
import { createContainer } from "./create-container.js";
import { decodeDockerStream } from "./docker-helper.js";
import { pullDockerImage } from "./pull-container.js";

export class JsExecutor implements CodeExecutionStrategy {
	private async runExec(container: Docker.Container, cmd: string[]) {
		const exec = await container.exec({
			Cmd: cmd,
			AttachStdout: true,
			AttachStderr: true,
		});

		const stream = await exec.start({});
		const chunks: Buffer[] = [];

		return new Promise<string>((resolve, reject) => {
			stream.on("data", (chunk: Buffer) => chunks.push(chunk));
			stream.on("end", () => {
				try {
					const decoded = decodeDockerStream(Buffer.concat(chunks));
					resolve(decoded.stdout + decoded.stderr);
				} catch (e) {
					reject(e);
				}
			});
			stream.on("error", reject);
		});
	}

	async executeCode(
		code: string,
		testCases: { input_test_case: string; expected_output_test_case: string }[],
	): Promise<CodeExecutionResponse> {
		const startTime = Date.now();
		await pullDockerImage(DOCKER_IMAGES.javascript);

		const container = await createContainer({
			image: DOCKER_IMAGES.javascript,
			cmdExecutable: ["/bin/sh"],
			memoryLimit: 128 * 1024 * 1024,
		});

		await container.start();

		try {
			await this.runExec(container, [
				"/bin/sh",
				"-c",
				`cat > Main.js << 'EOF'\n${code}\nEOF`,
			]);

			const compileOutput = await this.runExec(container, [
				"/bin/sh",
				"-c",
				"node --check Main.js",
			]);

			if (compileOutput.trim().length > 0) {
				return {
					output: compileOutput,
					status: "COMPILE_ERROR",
					timeTaken: Date.now() - startTime,
					memoryUsed: 0,
				};
			}

			const results = [];

			for (const { input_test_case, expected_output_test_case } of testCases) {
				const input = input_test_case;
				const expected = expected_output_test_case;

				if (!expected) {
					continue;
				}

				const tcStartTime = Date.now();
				const output = await this.runExec(container, [
					"/bin/sh",
					"-c",
					`printf "%s" "${input}" | timeout 10s node Main.js`,
				]);
				const timeTaken = Date.now() - tcStartTime;

				if (timeTaken >= 9500) {
					// Slightly less than 10s to account for overhead
					return {
						output: "Time Limit Exceeded",
						status: "TIME_LIMIT_EXCEEDED",
						timeTaken: Date.now() - startTime,
						memoryUsed: 0,
					};
				}

				const passed = output.trim() === expected.trim();

				results.push({
					input,
					expected,
					output,
					passed,
				});
			}

			return {
				output: JSON.stringify(results, null, 2),
				status: results.every((r) => r.passed) ? "SUCCESS" : "FAILED",
				timeTaken: Date.now() - startTime,
				memoryUsed: 0,
			};
		} catch (error) {
			return {
				output: error instanceof Error ? error.message : "Unknown error",
				status: "ERROR",
				timeTaken: Date.now() - startTime,
				memoryUsed: 0,
			};
		} finally {
			try {
				await container.stop({ t: 0 });
			} catch (error) {
				// Container might have already stopped, ignore errors during stop
				logger.warn(
					`Error stopping container: ${error instanceof Error ? error.message : error}`,
				);
			}
		}
	}
}
