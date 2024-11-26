"use client";

import { Modal } from "@mantine/core";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./ModalAddRecord.module.css";
import { vacancySchema, VacancySchema } from "../../utils/validation/form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitForm } from "../../api/server/vacancies";
import { VacancyT } from "../../types/vacancy";
import { useEffect, useMemo } from "react";
import useUpdateVacancy from "../../hooks/useUpdateVacancy";

type Props = {
	opened: boolean;
	close: () => void;
	redactVacancy?: VacancyT;
};

const ModalAddRecord = ({ opened, close, redactVacancy }: Props) => {
	const queryClient = useQueryClient();
	const { mutate: update } = useUpdateVacancy();

	const presetData = useMemo(() => {
		return {
			company: redactVacancy?.company,
			vacancy: redactVacancy?.vacancy,
			salary_from: redactVacancy?.salary_fork?.from,
			salary_to: redactVacancy?.salary_fork?.to,
			response_status: redactVacancy?.response_status,
			note: redactVacancy?.note,
		};
	}, [redactVacancy]);

	const form = useForm<VacancySchema>({
		resolver: zodResolver(vacancySchema),
	});

	const {
		register,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = form;

	const mutationCreate = useMutation({
		mutationFn: submitForm,
		onSuccess: () => {
			toast("Запись сохранена в Базу Данных", {
				style: { backgroundColor: "#d0fff3" },
			});
			reset();
			queryClient.invalidateQueries({ queryKey: ["vacancies"] });
		},
	});

	const onSubmit: SubmitHandler<VacancySchema> = async (data) => {
		const updatedData = {
			...data,
			salary_fork: {
				from: Number(data.salary_from),
				to: Number(data.salary_to),
			},
		};

		if (redactVacancy) {
			update({
				id: redactVacancy._id,
				formData: updatedData,
			});
		} else {
			mutationCreate.mutate(data);
		}

		close();
	};

	useEffect(() => {
		reset(presetData);
	}, [presetData, reset]);

	return (
		<Modal
			opened={opened}
			onClose={close}
			title={redactVacancy ? "Редактирование" : "Добавить запись"}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className={styles.form}>
				<div className={styles.rowWrapper}>
					<label>Компания</label>
					<input
						type='text'
						placeholder='Название Компании'
						{...register("company")}
					/>
					<p>{errors.company && <>{errors.company.message}</>}</p>
				</div>

				<div className={styles.rowWrapper}>
					<label>Вакансия</label>
					<input
						type='text'
						placeholder='Название Вакансии'
						{...register("vacancy")}
					/>
					<p>{errors.vacancy && <>{errors.vacancy.message}</>}</p>
				</div>

				<div className={styles.rowWrapper}>
					<label>Зарплатная вилка</label>
					<div className={styles.inputPrice}>
						<input
							type='number'
							placeholder='От'
							{...register("salary_from", { valueAsNumber: true })}
						/>
						<input
							type='number'
							placeholder='До'
							{...register("salary_to", { valueAsNumber: true })}
						/>
					</div>
					<p>{errors.salary_to && <>{errors.salary_to.message}</>}</p>
				</div>

				<div className={styles.rowWrapper}>
					<label>Статус отклика</label>
					<select {...register("response_status")}>
						<option
							value='не просмотрено'
							style={{ color: "gray" }}>
							не просмотрено
						</option>
						<option value='просмотрено'>просмотрено</option>
						<option
							value='отказ'
							style={{ color: "red" }}>
							отказ
						</option>
						<option
							value='приглашение'
							style={{ color: "green" }}>
							приглашение
						</option>
					</select>
				</div>

				<div className={styles.rowWrapper}>
					<label>Заметка</label>
					<textarea
						rows={10}
						{...register("note")}
					/>
					<p>{errors.note && <>{errors.note.message}</>}</p>
				</div>

				<button
					type='submit'
					disabled={isSubmitting}>
					{redactVacancy ? "Обновить" : "Отправить"}
				</button>
			</form>
		</Modal>
	);
};

export default ModalAddRecord;
