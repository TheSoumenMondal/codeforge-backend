import { ApiError } from "../../common/utils/error/api.error.js";
import type { CodeStubRepository } from "./code-stub.repository.js";
import type { CreateCodeStubDtoType } from "./dto/code-stub.dto.js";
import type ProblemRepository from "./problem.repository.js";

class CodeStubService {
	private readonly codeStubRepository: CodeStubRepository;
	private readonly problemRepository: ProblemRepository;
	constructor(
		codeStubRepository: CodeStubRepository,
		problemRepository: ProblemRepository,
	) {
		this.codeStubRepository = codeStubRepository;
		this.problemRepository = problemRepository;
	}

	async createCodeStub(data: CreateCodeStubDtoType, userId: string) {
		const problem = await this.problemRepository.getById(data.problemId);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}

		if (problem.created_by !== userId) {
			throw ApiError.forbidden(
				"You are not allowed to create code stub for this problem",
			);
		}

		const codeStub = await this.codeStubRepository.create({
			problem_id: data.problemId,
			language: data.language === "javascript" ? "js" : data.language,
			start_code: data.startCode,
			user_code: data.userCode,
			end_code: data.endCode,
		});
		return codeStub;
	}
}

export { CodeStubService };
