import { and, eq, sql } from "drizzle-orm";
import { db } from "../../common/config/db/index.js";
import {
	code_stub,
	problem,
	test_case,
} from "../../common/config/db/schema/problem.js";
import { code_submission } from "../../common/config/db/schema/submission.js";

class EvaluationRepository {
	async getRequiredDataForEvaluation(submissionId: string) {
		const rows = await db
			.select({
				submissionId: code_submission.id,
				problemId: problem.id,
				code: code_submission.code,
				language: code_submission.language,
				startCode: code_stub.start_code,
				endCode: code_stub.end_code,
				input: test_case.input,
				output: test_case.expected_output,
			})
			.from(code_submission)
			.innerJoin(problem, eq(code_submission.problem_id, problem.id))
			.leftJoin(
				code_stub,
				and(
					eq(code_stub.problem_id, problem.id),
					sql`${code_stub.language}::text = ${code_submission.language}`,
				),
			)
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
			startCode: first.startCode ?? "",
			endCode: first.endCode ?? "",
			testCases: rows
				.filter((row) => row.input !== null && row.output !== null)
				.map((row) => ({
					input: row.input as string,
					output: row.output as string,
				})),
		};
	}
}

export { EvaluationRepository };
