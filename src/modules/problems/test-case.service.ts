import type { TestCaseRepository } from "./test-case.repository.js";

class TestCaseService {
	private readonly testCaseRepository: TestCaseRepository;

	constructor(testCaseRepository: TestCaseRepository) {
		this.testCaseRepository = testCaseRepository;
	}
}

export { TestCaseService };
