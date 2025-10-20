// hooks/useNotification.ts
import { useState, useCallback, useEffect } from 'react';

interface Notification {
    id: number;
    content: string;
    type: string;
    duration?: number;
}

// Singleton to manage notifications outside React
class NotificationManager {
    private listeners: Array<(notifications: Notification[]) => void> = [];
    private notifications: Notification[] = [];

    subscribe(listener: (notifications: Notification[]) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(listener => listener([...this.notifications]));
    }

    addNotification(content: string, type = 'info', duration = 3000) {
        const id = Date.now();
        const newNotification: Notification = {
            content,
            type,
            id,
            duration
        };

        this.notifications.push(newNotification);
        this.notify();

        // Auto-remove after duration
        setTimeout(() => {
            this.removeNotification(id);
        }, duration + 500);
    }

    removeNotification(id: number) {
        this.notifications = this.notifications.filter(notification => notification.id !== id);
        this.notify();
    }
}

// Single instance
const notificationManager = new NotificationManager();

// Hook for components that want to SHOW notifications
export const useNotificationDisplay = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        return notificationManager.subscribe(setNotifications);
    }, []);

    const removeNotification = useCallback((id: number) => {
        notificationManager.removeNotification(id);
    }, []);

    return {
        notifications,
        removeNotification,
    };
};

// Hook for components that want to ADD notifications
export const useNotification = () => {
    const addNotification = useCallback((content: string, type = 'info', duration = 3000) => {
        notificationManager.addNotification(content, type, duration);
    }, []);

    return {
        addNotification,
    };
};