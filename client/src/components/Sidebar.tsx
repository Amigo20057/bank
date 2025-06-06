import {
	Banknote,
	Bell,
	LayoutDashboard,
	LogOut,
	Receipt,
	Repeat,
	Shield,
	User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext"; // <== ЗМІНА: глобальний контекст
import { useLogout } from "../hooks/user/mutations/useLogout";

const menuItems = [
	{ label: "Dashboard", icon: LayoutDashboard, path: "/" },
	{ label: "Transactions", icon: Receipt, path: "/transactions" },
	{ label: "Transfers", icon: Repeat, path: "/transfers" },
	{ label: "Loans", icon: Banknote, path: "/loans" },
];

const accountItems = [
	{ label: "Profile", icon: User, path: "/profile" },
	{ label: "Notifications", icon: Bell, path: "/notifications" },
	{ label: "Security & Settings", icon: Shield, path: "/security" },
];

export const Sidebar = () => {
	const location = useLocation();
	const { logoutMutation } = useLogout();
	const { unreadCount } = useNotifications(); // <== правильне джерело даних
	const logout = () => logoutMutation.mutate();

	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="w-[250px] h-screen bg-[#080808] text-white flex flex-col justify-between p-[10px]">
			<div>
				<p className="text-sm text-gray-400 mb-2 px-2">Bank</p>
				<ul className="mb-4 space-y-2">
					{menuItems.map(({ label, icon: Icon, path }) => (
						<li key={label}>
							<Link
								to={path}
								className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
									isActive(path)
										? "bg-[#1a1a1a] text-indigo-400"
										: "hover:bg-[#1a1a1a] text-white"
								}`}
							>
								<Icon size={18} />
								<span>{label}</span>
							</Link>
						</li>
					))}
				</ul>

				<p className="text-sm text-gray-400 mb-2 px-2">My Account</p>
				<ul className="space-y-2">
					{accountItems.map(({ label, icon: Icon, path }) => (
						<li key={label} className="relative">
							<Link
								to={path}
								className={`flex items-center gap-3 px-3 py-2 rounded-md transition ${
									isActive(path)
										? "bg-[#1a1a1a] text-indigo-400"
										: "hover:bg-[#1a1a1a] text-white"
								}`}
							>
								<Icon size={18} />
								<span>{label}</span>

								{label === "Notifications" && unreadCount > 0 && (
									<span className="absolute right-2 top-1 bg-red-600 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
										{unreadCount}
									</span>
								)}
							</Link>
						</li>
					))}
				</ul>
			</div>

			<div>
				<button
					onClick={logout}
					className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#1a1a1a] rounded-md cursor-pointer transition text-white"
				>
					<LogOut size={18} />
					<span>Logout</span>
				</button>
			</div>
		</div>
	);
};
