import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { useProfile } from "../hooks/user/useProfile";

export const Profile = () => {
	const navigation = useNavigate();
	const { data: userProfileData, isLoading: userIsLoading } = useProfile();

	const isLoading = userIsLoading;
	const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

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

			<div className="fixed left-0 top-0 h-screen w-[250px] z-50">
				<Sidebar />
			</div>

			<div className="p-6 w-full ml-[250px] bg-gradient-to-br from-[#1f2937] via-[#111827] to-black text-white min-h-screen">
				<div className="w-full h-[250px] flex overflow-x-auto justify-center items-center bg-black/40 backdrop-blur-sm rounded-xl mb-6">
					<div className="w-[200px] flex flex-col items-center justify-center text-center">
						{userProfileData?.avatar ? (
							<img
								width={100}
								height={100}
								src={userProfileData.avatar}
								alt="avatar"
								className="rounded-full p-[5px]"
							/>
						) : (
							<div className="w-[100px] h-[100px] rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-semibold">
								{(userProfileData?.firstName?.[0] || "") +
									(userProfileData?.lastName?.[0] || "")}
							</div>
						)}
						<h3 className="mt-2">
							{userProfileData?.firstName} {userProfileData?.lastName}
						</h3>
						<p className="text-gray-400 text-sm">{userProfileData?.email}</p>
					</div>
				</div>

				<div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
					<div className="bg-black/40 backdrop-blur-sm w-full rounded-xl border border-white/10 shadow-inner">
						<div className="w-full bg-[#171b24] rounded-t-xl px-4 h-[50px] flex items-center border-b border-white/10">
							<p className="text-gray-400 font-semibold">Person details</p>
						</div>

						{[
							{
								label: "Full name",
								value: `${userProfileData?.firstName || ""} ${
									userProfileData?.lastName || ""
								}`,
							},
							{ label: "Email", value: userProfileData?.email },
							{ label: "Phone", value: userProfileData?.telephoneNumber },
							{ label: "Passport", value: userProfileData?.passportNumber },
							{ label: "Address", value: userProfileData?.address },
							{
								label: "Date of birth",
								value: userProfileData?.dateOfBirth
									? new Date(userProfileData.dateOfBirth).toLocaleDateString(
											"en-GB",
											{
												day: "2-digit",
												month: "long",
												year: "numeric",
											}
									  )
									: undefined,
							},
							{ label: "Role", value: userProfileData?.role },
						].map(({ label, value }) => (
							<div
								key={label}
								className="px-4 py-3 border-b border-white/10 flex items-center"
							>
								<p className="w-[150px] text-gray-400">{label}:</p>
								<p className="ml-[200px]">{value || "Not provided"}</p>
							</div>
						))}
					</div>

					<div className="bg-black/40 backdrop-blur-sm w-full rounded-xl border border-white/10 shadow-inner">
						<div className="w-full bg-[#171b24] rounded-t-xl px-4 h-[50px] flex items-center border-b border-white/10">
							<p className="text-gray-400 font-semibold">Account Details</p>
						</div>

						<div className="px-4 py-3 border-b border-white/10 flex items-center">
							<p className="w-[150px] text-gray-400">Account Created:</p>
							<p className="ml-[200px]">
								{userProfileData?.createdAt
									? new Date(userProfileData.createdAt).toLocaleDateString(
											"en-GB",
											{ day: "2-digit", month: "long", year: "numeric" }
									  )
									: "Not provided"}
							</p>
						</div>

						<div className="px-4 py-3 border-b border-white/10 flex items-center">
							<p className="w-[170px] text-gray-400">Password Last Change:</p>
							<p className="ml-[180px]">
								{userProfileData?.lastChangePassword
									? new Date(
											userProfileData.lastChangePassword
									  ).toLocaleDateString("en-GB", {
											day: "2-digit",
											month: "long",
											year: "numeric",
									  })
									: "Not provided"}
							</p>
						</div>

						<div className="px-4 py-3 border-b border-white/10 flex items-center">
							<p className="w-[150px] text-gray-400">Account Verification:</p>
							<p className="ml-[200px]">
								<span
									className={`px-2 py-1 rounded text-sm font-medium ${
										userProfileData?.isVerified
											? "bg-green-900 text-green-400 border border-green-500"
											: "bg-red-900 text-red-400 border border-red-500"
									}`}
								>
									{userProfileData?.isVerified ? "Verified" : "Not Verified"}
								</span>
							</p>
						</div>

						<div className="px-4 py-3 border-b border-white/10 flex items-center">
							<p className="w-[150px] text-gray-400">Notifications:</p>
							<p className="ml-[200px]">
								<span className="px-2 py-1 rounded text-sm font-medium border border-purple-600 text-purple-400 bg-purple-900">
									Subscribed
								</span>
							</p>
						</div>

						{[
							{
								label: "Language",
								value:
									window.localStorage.getItem("language") === "EN"
										? "English"
										: "Ukrainian",
							},
							{
								label: "Time Zone",
								value: timeZone,
							},
							{
								label: "Account Id",
								value: userProfileData?.id,
							},
						].map(({ label, value }) => (
							<div
								key={label}
								className="px-4 py-3 border-b border-white/10 flex items-center"
							>
								<p className="w-[150px] text-gray-400">{label}:</p>
								<p className="ml-[200px]">{value || "Not provided"}</p>
							</div>
						))}
					</div>

					{(() => {
						const missingFields: string[] = [];

						if (!userProfileData?.firstName || !userProfileData?.lastName)
							missingFields.push("Full name");
						if (!userProfileData?.telephoneNumber)
							missingFields.push("Phone number");
						if (!userProfileData?.passportNumber)
							missingFields.push("Passport");
						if (!userProfileData?.address) missingFields.push("Address");
						if (!userProfileData?.dateOfBirth)
							missingFields.push("Date of birth");

						if (missingFields.length === 0) return null;

						return (
							<div className="mt-6 bg-yellow-900/20 border border-yellow-500 text-yellow-300 rounded-xl p-4 shadow-inner">
								<h4 className="text-md font-semibold mb-2 flex items-center gap-2">
									<span className="text-yellow-400">⚠️</span> Incomplete Profile
								</h4>
								<ul className="list-disc pl-5 text-sm space-y-1">
									{missingFields.map(field => (
										<li key={field}>
											Please provide your {field.toLowerCase()}.
										</li>
									))}
								</ul>
							</div>
						);
					})()}

					{!userProfileData?.isVerified && (
						<div className="mt-6 bg-red-900/20 border border-red-500 text-red-300 rounded-xl p-4 shadow-inner lg:col-start-2">
							<h4 className="text-md font-semibold mb-2 flex items-center gap-2">
								<span className="text-red-400">⚠️</span> Account Not Verified
							</h4>
							<p className="text-sm">
								Your account is currently{" "}
								<span className="font-semibold">not verified</span>. Some
								features may be limited until verification is completed.
							</p>
							<p className="text-sm mt-2">
								Please go to{" "}
								<span className="text-white font-medium underline">
									Security & Settings
								</span>{" "}
								and complete your verification.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
