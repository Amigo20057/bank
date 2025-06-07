let notifications: any[] = [];

export const addNotification = (notification: any) => {
	notifications.unshift(notification);
};

export const getNotifications = () => notifications;

export const clearNotifications = () => {
	notifications = [];
};
