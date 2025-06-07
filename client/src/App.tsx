import { Route, Routes } from "react-router-dom";
import {
	DateOfBirthChange,
	DeleteCard,
	EmailChange,
	FullNameChange,
	Home,
	Loan,
	Loans,
	Login,
	Notification,
	Profile,
	Register,
	RequestVerification,
	Security,
	Transactions,
	Transfers,
	VerifyAccount,
} from "./pages";
import { AddressChange } from "./pages/Settings/AddressChange";
import { PassportNumberChange } from "./pages/Settings/PassportNumberChange";
import { PasswordChange } from "./pages/Settings/PasswordChange";
import { PhoneNumberChange } from "./pages/Settings/PhoneNumberChange";

export const App = () => {
	return (
		<Routes>
			<Route path="/auth/login" element={<Login />} />
			<Route path="/auth/register" element={<Register />} />

			<Route path="/" element={<Home />} />
			<Route path="/transactions" element={<Transactions />} />
			<Route path="/transfers" element={<Transfers />} />
			<Route path="/profile" element={<Profile />} />
			<Route path="/security" element={<Security />} />
			<Route path="/notifications" element={<Notification />} />

			<Route path="/loans" element={<Loan />} />
			<Route path="/loan/loans" element={<Loans />} />

			<Route path="/settings/change-email" element={<EmailChange />} />
			<Route path="/settings/change-name" element={<FullNameChange />} />
			<Route path="/settings/change-address" element={<AddressChange />} />
			<Route
				path="/settings/change-passport-number"
				element={<PassportNumberChange />}
			/>
			<Route
				path="/settings/change-phone-number"
				element={<PhoneNumberChange />}
			/>
			<Route path="/settings/change-password" element={<PasswordChange />} />

			<Route
				path="/settings/request-verification"
				element={<RequestVerification />}
			/>
			<Route path="/settings/verify-account" element={<VerifyAccount />} />
			<Route
				path="/settings/change-date-of-birth"
				element={<DateOfBirthChange />}
			/>
			<Route path="/settings/delete-card" element={<DeleteCard />} />
		</Routes>
	);
};
