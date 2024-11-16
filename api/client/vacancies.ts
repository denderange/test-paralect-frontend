export const getAllVacancies = async () => {
	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);

		return res.json();
	} catch (error) {
		console.log("Не удалось получить данные.", error);
	}
};
