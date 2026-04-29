import { ApiError } from "../../common/utils/error/api.error.js";
import type { ProblemDto, ProblemUpdateDto } from "./dto/problem.dto.js";
import type ProblemRepository from "./problem.repository.js";

class ProblemService {
	private problemRepository: ProblemRepository;
	constructor(problemRepository: ProblemRepository) {
		this.problemRepository = problemRepository;
	}
	async create(data: ProblemDto, userId: string) {
		const alreadyExistingProblem =
			await this.problemRepository.findProblemByTitle(data.title);
		if (alreadyExistingProblem) {
			throw ApiError.conflict("Problem with the same title already exists");
		}
		const problem = await this.problemRepository.create(data, userId);
		return problem;
	}

	async getProblemsByFilter(difficulty?: string) {
		const validDifficulties = ["easy", "medium", "hard"];
		if (difficulty && !validDifficulties.includes(difficulty)) {
			throw ApiError.invalid(
				`Invalid difficulty. Must be one of: ${validDifficulties.join(", ")}`,
			);
		}
		const problems =
			await this.problemRepository.getProblemsByFilter(difficulty);
		return problems;
	}

	async getById(id: string) {
		const problem = await this.problemRepository.getById(id);
		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}
		return problem;
	}

	async update(userId: string, problemId: string, data: ProblemUpdateDto) {
		const problem = await this.problemRepository.getById(problemId);

		if (!problem) {
			throw ApiError.notFound("Problem not found");
		}

		if (problem.created_by !== userId) {
			throw ApiError.forbidden("You are not authorized to update this problem");
		}

		const updatedData = {
			title: data.title ?? problem.title,
			description: data.description ?? problem.description,
			difficulty: data.difficulty ?? problem.difficulty,
		};

		const updatedProblem = await this.problemRepository.update(
			problemId,
			updatedData,
		);
		return updatedProblem;
	}
}

export default ProblemService;
