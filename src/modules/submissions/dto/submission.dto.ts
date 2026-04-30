import z from "zod";
import { AVIABLE_CODE_LANGUAGES } from "../../../common/constants/code-language.js";

const CreateSubmissionDTO = z.object({
	code: z.string(),
	language: z.enum([
		AVIABLE_CODE_LANGUAGES.CPP,
		AVIABLE_CODE_LANGUAGES.JAVA,
		AVIABLE_CODE_LANGUAGES.JAVASCRIPT,
		AVIABLE_CODE_LANGUAGES.PYTHON,
	]),
});

export type SubmissionDTOType = z.infer<typeof CreateSubmissionDTO>;

export { CreateSubmissionDTO };
