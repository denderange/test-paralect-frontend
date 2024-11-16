import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateForm } from "../api/server/vacancies";
import { toast } from "react-toastify";

const useUpdateVacancy = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateForm,
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({ queryKey: ["vacancies"] });
			queryClient.setQueryData(["vacany", variables.id], data);
			toast("Запись обновлена", {
				style: { backgroundColor: "#eed0ff" },
			});
		},
		onError: (error) => {
			console.error("Ошибка обновления вакансии:", error);
		},
	});
};

export default useUpdateVacancy;
