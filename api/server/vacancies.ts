"use server";

import { VacancySchema } from "../../utils/validation/form";

interface DeleteResponse {
	message: string;
}

export const deleteOne = async (id: string) => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
			method: "DELETE",
			mode: "cors",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
				"Access-Control-Allow-Origin": "*",
			},
		});

		return res.json();
	} catch (error) {
		console.log("Не удалось удалить.", error);
	}
};

export async function submitForm(formData: VacancySchema) {
	const newVacancy = {
		company: formData.company,
		vacancy: formData.vacancy,
		salary_fork: {
			from: formData.salary_from,
			to: formData.salary_to,
		},
		response_status: formData.response_status,
		note: formData.note,
	};

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
		method: "POST",
		mode: "cors",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(newVacancy),
	});

	return response.json();
}

export async function updateForm({
	formData,
	id,
}: {
	formData: VacancySchema;
	id: string;
}) {
	const vacancy = {
		company: formData.company,
		vacancy: formData.vacancy,
		salary_fork: {
			from: formData.salary_from,
			to: formData.salary_to,
		},
		response_status: formData.response_status,
		note: formData.note,
	};

	const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${id}`, {
		method: "PUT",
		mode: "cors",
		headers: {
			"Content-type": "application/json; charset=UTF-8",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify(vacancy),
	});

	return response.json();
}
