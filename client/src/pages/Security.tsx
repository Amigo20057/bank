import {
	BookMarked,
	Cake,
	Lock,
	Mail,
	MapPin,
	Phone,
	User,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProfile } from "../hooks/user/useProfile";

export const Security = () => {
	const navigation = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();
	const [language, setLanguage] = useState(
		window.localStorage.getItem("language") || "EN"
	);

	const isLoading = userIsLoading;

	if (!userProfileData && !userIsLoading) {
		navigation("/auth/login");
	}

	const handleLanguageChange = (lang: "EN" | "UA") => {
		window.localStorage.setItem("language", lang);
		setLanguage(lang);
	};

	return (
		<div className="flex relative">
			{isLoading && (
				<div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center">
					<div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			<div className="fixed left-0 top-0 h-screen w-[250px] z-50">
				<Sidebar />
			</div>

			<div className="p-6 w-full ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white min-h-screen">
				<h2 className="text-2xl font-semibold mb-6">Security & Settings</h2>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					<div className="bg-black/40 rounded-xl p-5 border border-white/10 shadow-inner col-span-1 lg:col-span-2">
						<h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
							<svg
								className="w-5 h-5 text-blue-400"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M15.232 15.232a9 9 0 111.768-1.768l4.243 4.243-1.768 1.768-4.243-4.243z"
								/>
							</svg>
							Edit Personal Info
						</h3>

						<div className="flex flex-col sm:flex-row flex-wrap gap-4">
							<button
								onClick={() => navigation("/settings/change-name")}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
							>
								<User className="w-4 h-4" />
								Change Full Name
							</button>
							<button
								onClick={() => navigation("/settings/change-phone-number")}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
							>
								<Phone className="w-4 h-4" />
								Change Phone Number
							</button>
							<button
								onClick={() => navigation("/settings/change-address")}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
							>
								<MapPin className="w-4 h-4" />
								Change Address
							</button>
							<button
								onClick={() => navigation("/settings/change-date-of-birth")}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
							>
								<Cake className="w-4 h-4" />
								Change Date Of Birth
							</button>
							{!userProfileData?.googleId && (
								<button
									onClick={() => navigation("/settings/change-password")}
									className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
								>
									<Lock className="w-4 h-4" />
									Change Password
								</button>
							)}
							<button
								onClick={() => navigation("/settings/change-passport-number")}
								className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
							>
								<BookMarked className="w-4 h-4" />
								Passport Number
							</button>
							{!userProfileData?.googleId && (
								<button
									onClick={() => navigation("/settings/change-email")}
									className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white font-medium"
								>
									<Mail className="w-4 h-4" />
									Change Email
								</button>
							)}
						</div>
					</div>

					<div className="bg-black/40 rounded-xl p-5 border border-white/10 shadow-inner">
						<h3 className="text-lg font-semibold mb-3">Account Verification</h3>
						{userProfileData?.isVerified ? (
							<p className="text-green-400">Your account is verified ✅</p>
						) : (
							<>
								<p className="text-red-400 mb-2">
									Your account is not verified
								</p>
								<button
									onClick={() => navigation("/settings/request-verification")}
									className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-white font-medium"
								>
									Verify Account
								</button>
							</>
						)}
					</div>

					<div className="bg-black/40 rounded-xl p-5 border border-white/10 shadow-inner">
						<h3 className="text-lg font-semibold mb-3">Language Settings</h3>
						<div className="flex gap-4">
							<button
								onClick={() => handleLanguageChange("EN")}
								className={`px-4 py-2 rounded font-medium ${
									language === "EN"
										? "bg-green-700 text-white"
										: "bg-gray-700 text-gray-300"
								}`}
							>
								English
							</button>
							<button
								onClick={() => handleLanguageChange("UA")}
								className={`px-4 py-2 rounded font-medium ${
									language === "UA"
										? "bg-green-700 text-white"
										: "bg-gray-700 text-gray-300"
								}`}
							>
								Ukrainian
							</button>
						</div>
					</div>

					<div className="bg-black/40 rounded-xl p-5 border border-white/10 shadow-inner col-span-1 lg:col-span-2">
						<h3 className="text-lg font-semibold mb-3">Remove Bank Card</h3>
						<p className="text-gray-400 mb-3">
							This will permanently remove your saved bank card.
						</p>
						<button
							onClick={() => navigation("/settings/delete-card")}
							className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-medium"
						>
							Delete Card
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
