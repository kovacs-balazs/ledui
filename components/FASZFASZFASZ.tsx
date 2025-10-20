'use client';

import React, { memo, useCallback } from 'react';
import KobaNotification from './KobaNotification';

interface NotificationsContainerProps {
    notifications: Array<{
        id: number;
        content: string;
        type: string;
        progress: number;
    }>;
    removeNotification: (id: number) => void;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({ 
    notifications, 
    removeNotification 
}) => {
    // Memoized callback for removing notifications
    const handleRemoveNotification = useCallback((id: number) => {
        removeNotification(id);
    }, [removeNotification]);

    // Render notifications - this component will only re-render when notifications or removeNotification change
    return (
        <>
            {notifications.map((notif) => (
                <KobaNotification 
                    key={notif.id} 
                    type={notif.type} 
                    content={notif.content} 
                    progress={notif.progress} 
                    onClick={() => handleRemoveNotification(notif.id)} 
                />
            ))}
        </>
    );
};

// Memoize the entire container to prevent re-renders when parent re-renders
export default memo(NotificationsContainer);