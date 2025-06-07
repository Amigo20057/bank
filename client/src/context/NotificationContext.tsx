import { createContext, useContext, useEffect, useState } from "react";
import socket from "../socket";
import { addNotification, getNotifications } from "../store/notificationStore";

interface NotificationContextType {
	notifications: any[];
	unreadCount: number;
	clearUnread: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
	notifications: [],
	unreadCount: 0,
	clearUnread: () => {},
});

export const NotificationProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [notifications, setNotifications] = useState(getNotifications());
	const [unreadCount, setUnreadCount] = useState(0);

	useEffect(() => {
		const handler = (data: any) => {
			addNotification(data);
			setNotifications([...getNotifications()]);
			setUnreadCount(prev => prev + 1);
		};

		socket.on("transaction", handler);
		return () => {
			socket.off("transaction", handler);
		};
	}, []);

	const clearUnread = () => {
		setUnreadCount(0);
	};

	return (
		<NotificationContext.Provider
			value={{ notifications, unreadCount, clearUnread }}
		>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => useContext(NotificationContext);
