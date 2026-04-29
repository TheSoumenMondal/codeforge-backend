import { ApiError } from "../../common/utils/error/api.error.js";
import type { ProblemDto } from "./dto/problem.dto.js";
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
}

export default ProblemService;
