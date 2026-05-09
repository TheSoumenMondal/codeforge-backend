import { eq } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import { problem, test_case } from "../../common/config/db/schema/problem.js";
import { code_submission } from "../../common/config/db/schema/submission.js";

class EvaluationRepository {
	async getRequiredDataForEvaluation(submissionId: string) {
		const rows = await db
			.select({
				submissionId: code_submission.id,
				problemId: problem.id,
				code: code_submission.code,
				language: code_submission.language,
				input: test_case.input,
				output: test_case.expected_output,
			})
			.from(code_submission)
			.innerJoin(problem, eq(code_submission.problem_id, problem.id))
			.leftJoin(test_case, eq(test_case.problem_id, problem.id))
			.where(eq(code_submission.id, submissionId));

		const [first] = rows;
		if (!first) {
			return null;
		}

		return {
			submissionId: first.submissionId,
			problemId: first.problemId,
			code: first.code,
			language: first.language,
			testCases: rows
				.filter((row) => row.input !== null && row.output !== null)
				.map((row) => ({
					input: row.input as string,
					output: row.output as string,
				})),
		};
	}

	async updateEvaluationResult(
		submissionId: string,
		status: string,
		result: string,
	) {
		await db
			.update(code_submission)
			.set({
				status: status as any,
				result: result,
			})
			.where(eq(code_submission.id, submissionId));
	}
}

export { EvaluationRepository };
