import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProfile } from "../hooks/user/useProfile";

export const Profile = () => {
	const navigation = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();

	const isLoading = userIsLoading;

	if (!userProfileData && !userIsLoading) {
		navigation("/auth/login");
	}
	return (
		<div className="flex relative">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<Sidebar />
			<div className="p-6 w-full min-h-screen bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white">
				<h2 className="text-xl font-semibold mb-4"></h2>
				<div className="w-full h-[250px] flex items-center overflow-x-auto"></div>
			</div>
		</div>
	);
};
