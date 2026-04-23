import type ProblemRepository from "./problem.repository.js";

class ProblemService {
	private problemRepository: ProblemRepository;
	constructor(problemRepository: ProblemRepository) {
		this.problemRepository = problemRepository;
	}
}

export default ProblemService;
