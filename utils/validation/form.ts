import { z } from "zod";

export const vacancySchema = z
	.object({
		company: z.string().min(1, "Укажите название компании"),
		vacancy: z.string().min(1, "Укажите название вакансии"),
		salary_from: z
			.number({ invalid_type_error: "Введите значение" })
			.min(1, "Укажите начальную зарплату")
			.max(1000000, "Значение слишком велико"),
		salary_to: z
			.number({ invalid_type_error: "Введите значение" })
			.min(1, "Укажите конечную зарплату")
			.max(1000000, "Значение слишком велико"),
		note: z.string().min(1, "Укажите заметку"),
		response_status: z.string(),
	})
	.refine((data) => data.salary_from < data.salary_to, {
		message: "Конечная зарплата должна быть больше начальной",
		path: ["salary_to"],
	});

export type VacancySchema = z.infer<typeof vacancySchema>;
