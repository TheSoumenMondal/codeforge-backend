import { db } from "../../common/config/db/index.js";
import { code_stub } from "../../common/config/db/schema/problem.js";

class CodeStubRepository {
	async create(data: {
		problem_id: string;
		language: "cpp" | "java" | "python" | "js";
		start_code: string;
		user_code: string;
		end_code: string;
	}) {
		const codeStub = await db
			.insert(code_stub)
			.values(data)
			.returning()
			.onConflictDoNothing();
		return codeStub[0] ?? null;
	}
}

export { CodeStubRepository };
