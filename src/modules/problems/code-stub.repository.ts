import { and, eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { code_stub } from "../../common/config/db/schema/problem.js";
import type { UpdateCodeStubDtoType } from "./dto/code-stub.dto.js";

type CodeStubLanguage = "cpp" | "java" | "python" | "js";

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

	async update(id: string, data: UpdateCodeStubDtoType) {
		const updateData: Record<string, any> = {};

		if (data.startCode !== undefined) {
			updateData.start_code = data.startCode;
		}
		if (data.userCode !== undefined) {
			updateData.user_code = data.userCode;
		}
		if (data.endCode !== undefined) {
			updateData.end_code = data.endCode;
		}

		const updatedCodeStub = await db
			.update(code_stub)
			.set(updateData)
			.where(eq(code_stub.problem_id, id))
			.returning();

		return updatedCodeStub[0] ?? null;
	}

	async getCodeStubByCodeStubId(codeStubId: string) {
		const codeStub = await db
			.select()
			.from(code_stub)
			.where(eq(code_stub.id, codeStubId));
		return codeStub[0] ?? null;
	}

	async getCodeStubByProblemId(problemId: string) {
		const codeStub = await db
			.select()
			.from(code_stub)
			.where(eq(code_stub.problem_id, problemId));
		return codeStub ?? [];
	}

	async delete(codeStubId: string) {
		await db.delete(code_stub).where(eq(code_stub.id, codeStubId));
	}

	async filterCodeStubByLanguage(
		problemId: string,
		language: CodeStubLanguage,
	) {
		const codeStub = await db
			.select()
			.from(code_stub)
			.where(
				and(
					eq(code_stub.problem_id, problemId),
					eq(code_stub.language, language),
				),
			);
		return codeStub ?? [];
	}
}

export { CodeStubRepository };
