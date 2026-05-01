export type CodeExecutionStrategy = {
	executeCode: (
		code: string,
		testCase: {
			input_test_case: string;
			expected_output_test_case: string;
		}[],
	) => Promise<CodeExecutionResponse>;
};

export type CodeExecutionResponse = {
	status: string;
	output: string;
	timeTaken: number;
	memoryUsed: number;
};
