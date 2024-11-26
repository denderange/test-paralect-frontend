import { Container } from "@mantine/core";
import TableVacancies from "../../components/TableVacancies/TableVacancies";
import { ToastContainer } from "react-toastify";

export default function HomePage() {
	return (
		<div className='wrapper'>
			<TableVacancies />
			<ToastContainer />
		</div>
	);
}
