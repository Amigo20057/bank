import { Route, Routes } from "react-router-dom";
import { Home, Login, Profile, Register } from "./pages";

export const App = () => {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />

			<Route path="/" element={<Home />} />
			<Route path="/profile" element={<Profile />} />
		</Routes>
	);
};
