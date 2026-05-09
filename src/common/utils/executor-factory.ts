import type { CodeExecutionStrategy } from "../type/execution.js";
import { CppExecutor } from "./container/run-cpp.js";
import { JavaExecutor } from "./container/run-java.js";
import { JsExecutor } from "./container/run-js.js";
import { PythonExecutor } from "./container/run-python.js";

function createExecutor(codeLanguage: string): CodeExecutionStrategy | null {
	switch (codeLanguage.toLocaleLowerCase()) {
		case "cpp":
			return new CppExecutor();
		case "java":
			return new JavaExecutor();
		case "python":
			return new PythonExecutor();
		case "js":
		case "javascript":
			return new JsExecutor();
		default:
			return null;
	}
}

export default createExecutor;
