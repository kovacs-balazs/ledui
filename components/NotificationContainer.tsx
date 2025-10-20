// components/NotificationContainer.tsx - Alternative version
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import KobaNotification from './KobaNotification';
import { useNotificationDisplay } from '../src/hooks/useNotification';

const NotificationWithProgress = ({
    notification,
    onRemove
}: {
    notification: { id: number; content: string; type: string; duration: number };
    onRemove: (id: number) => void;
}) => {
    const [progress, setProgress] = useState(100);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const visibleDelay = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev - 1;
                if (newProgress <= 0) {
                    clearInterval(interval);
                    setIsVisible(false); // Start fade out
                    // Don't call onRemove here - let the useEffect below handle it
                    return 0;
                }
                return newProgress;
            });
        }, 30);
        return () => { clearTimeout(visibleDelay); clearInterval(interval) };
    }, [notification.id, notification.duration]);

    // Handle removal after fade out animation completes
    useEffect(() => {
        if (!isVisible) {
            const timer = setTimeout(() => {
                onRemove(notification.id);
            }, 500); // Wait for fade out animation to complete
            return () => clearTimeout(timer);
        }
    }, [isVisible, notification.id, onRemove]);

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false); // Start fade out
    }, []);

    return (
        <div onClick={handleClick} className="cursor-pointer">
            <KobaNotification
                type={notification.type}
                content={notification.content}
                progress={progress}
                isVisible={isVisible}
                onClick={handleClick}
            />
        </div>
    );
};

const MemoizedNotificationWithProgress = React.memo(NotificationWithProgress);

const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotificationDisplay();

    const handleRemove = useCallback((id: number) => {
        removeNotification(id);
    }, [removeNotification]);

    return (
        <div className='fixed left-0 right-0 z-[10000] top-0 bottom-64 pointer-events-none flex flex-col gap-4 items-center justify-start pt-24 overflow-scroll hide-scrollbar'>
            {notifications.map((notif) => (
                <div key={notif.id} className="pointer-events-auto">
                    <MemoizedNotificationWithProgress
                        notification={{
                            ...notif,
                            duration: notif.duration || 3000
                        }}
                        onRemove={handleRemove}
                    />
                </div>
            ))}
        </div>
    );
};

export default React.memo(NotificationContainer);