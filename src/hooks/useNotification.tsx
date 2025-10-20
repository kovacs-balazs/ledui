// hooks/useNotification.ts
import { useState, useCallback, useMemo } from 'react';

interface NotificationState {
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
}

export const useNotification = () => {
    const [notification, setNotification] = useState<NotificationState>({
        isVisible: false,
        message: '',
        type: 'info',
    });

    const showNotification = useCallback((
        message: string,
        type: NotificationState['type'] = 'info',
    ) => {
        setNotification({
            isVisible: true,
            message,
            type,
        });
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(prev => ({ ...prev, isVisible: false }));
    }, []);

    // Memoize the notification props to prevent unnecessary re-renders
    const notificationProps = useMemo(() => ({
        isVisible: notification.isVisible,
        message: notification.message,
        type: notification.type,
        onClose: hideNotification
    }), [notification, hideNotification]);

    return {
        showNotification,
        hideNotification,
        notificationProps
    };
};