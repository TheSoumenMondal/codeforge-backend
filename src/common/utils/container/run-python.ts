import Docker from "dockerode";
import { DOCKER_IMAGES } from "../../constants/images.js";
import type {
	CodeExecutionResponse,
	CodeExecutionStrategy,
} from "../../type/execution.js";
import { createContainer } from "./create-container.js";
import { decodeDockerStream } from "./docker-helper.js";
import { pullDockerImage } from "./pull-container.js";

export class PythonExecutor implements CodeExecutionStrategy {
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
		await pullDockerImage(DOCKER_IMAGES.python);

		const container = await createContainer({
			image: DOCKER_IMAGES.python,
			cmdExecutable: ["/bin/sh"],
			memoryLimit: 128 * 1024 * 1024,
		});

		await container.start();

		try {
			await this.runExec(container, [
				"/bin/sh",
				"-c",
				`cat > Main.py << 'EOF'\n${code}\nEOF`,
			]);

			const compileOutput = await this.runExec(container, [
				"/bin/sh",
				"-c",
				"python3 -m py_compile Main.py",
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

				const output = await this.runExec(container, [
					"/bin/sh",
					"-c",
					`printf "%s" "${input}" | python3 Main.py`,
				]);

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
		}
	}
}
