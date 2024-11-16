import { Container } from "@mantine/core";
import TableVacancies from "../../components/TableVacancies/TableVacancies";
import { ToastContainer } from "react-toastify";

export default function HomePage() {
	return (
		<Container size={"xl"}>
			<TableVacancies />
			<ToastContainer />
		</Container>
	);
}
