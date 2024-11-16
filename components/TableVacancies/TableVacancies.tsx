"use client";

import { useState } from "react";
import cx from "clsx";
import { Table, Checkbox, Group, rem, Button } from "@mantine/core";
import styles from "./TableVacancies.module.css";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import ModalAddRecord from "../ModalAddRecord/ModalAddRecord";
import { VacancyT } from "../../types/vacancy";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllVacancies } from "../../api/client/vacancies";
import { deleteOne } from "../../api/server/vacancies";

const TableVacancies = () => {
	const query = useQuery<VacancyT[]>({
		queryKey: ["vacancies"],
		queryFn: getAllVacancies,
	});
	const queryClient = useQueryClient();
	const [vacancyRedact, SetVacancyRedact] = useState<VacancyT>();
	const [selection, setSelection] = useState(["0"]);
	const [opened, { open, close }] = useDisclosure(false);

	const mutationDeleteOne = useMutation({
		mutationFn: deleteOne,
		onSuccess: () => {
			toast("Запись успешнейшим образом аккуратненько удалена.", {
				style: { backgroundColor: "#feffd0" },
			});
			queryClient.invalidateQueries({ queryKey: ["vacancies"] });
		},
	});

	const toggleRow = (id: string) => {
		setSelection((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id]
		);
	};

	const toggleAll = () =>
		setSelection((current) =>
			current.length === query.data!.length
				? []
				: query.data!.map((item) => item._id)
		);

	const openModal = (id: string) => {
		const redactVacancy = query.data?.find((item) => item._id === id);
		SetVacancyRedact(redactVacancy);
		open();
	};

	const rows = query.data?.map((item) => {
		const selected = selection.includes(item._id);
		return (
			<Table.Tr
				key={item._id}
				className={cx({ [styles.rowSelected]: selected })}>
				<Table.Td>
					<Checkbox
						checked={selection.includes(item._id)}
						onChange={() => toggleRow(item._id)}
					/>
				</Table.Td>
				<Table.Td>{item.company}</Table.Td>
				<Table.Td>{item.vacancy}</Table.Td>
				<Table.Td>
					{item.salary_fork.from} - {item.salary_fork.to} ($)
				</Table.Td>
				<Table.Td
					className={cx({
						[styles.invitation]: item.response_status === "приглашение",
						[styles.notviewed]: item.response_status === "не просмотрено",
						[styles.tviewed]: item.response_status === "просмотрено",
						[styles.refusal]: item.response_status === "отказ",
					})}>
					{item.response_status}
				</Table.Td>
				<Table.Td>{item.note}</Table.Td>
				<Table.Td>
					<Group gap='md'>
						<Button
							px='xs'
							onClick={() => openModal(item._id)}>
							<Pencil />
						</Button>
						<Button
							px='sm'
							color='red'
							onClick={() => mutationDeleteOne.mutate(item._id)}>
							<Trash2 />
						</Button>
					</Group>
				</Table.Td>
			</Table.Tr>
		);
	});

	if (query.isLoading) {
		return (
			<p style={{ textAlign: "center", fontSize: "26px", padding: "20px" }}>
				Загрузка таблицы...
			</p>
		);
	}

	return (
		<>
			<Table
				miw={800}
				verticalSpacing='sm'>
				<Table.Thead>
					<Table.Tr>
						<Table.Th style={{ width: rem(40) }}>
							<Checkbox
								onChange={toggleAll}
								checked={selection.length === query.data?.length}
								indeterminate={
									selection.length > 0 &&
									selection.length !== query.data?.length
								}
							/>
						</Table.Th>
						<Table.Th>Компания</Table.Th>
						<Table.Th>Вакансия</Table.Th>
						<Table.Th>Зарплатная вилка</Table.Th>
						<Table.Th>Статус отклика</Table.Th>
						<Table.Th>Заметка</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>{rows}</Table.Tbody>
			</Table>

			<Group
				gap='md'
				mt='md'>
				<Button
					color='green'
					onClick={() => openModal("")}>
					<Plus />
				</Button>
			</Group>

			<ModalAddRecord
				opened={opened}
				close={close}
				redactVacancy={vacancyRedact}
			/>
		</>
	);
};

export default TableVacancies;
