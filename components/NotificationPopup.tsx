// components/NotificationPopup.tsx
'use client';

import React, { useMemo, useEffect, useState } from 'react';

interface NotificationPopupProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
    onClose: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
    message,
    type = 'info',
    isVisible,
    onClose,
}) => {
    const [shouldRender, setShouldRender] = useState(false);

    // Memoize the notification styles based on type
    const typeStyles = useMemo(() => {
        const styles = {
            success: {
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'text-green-800',
            },
            error: {
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'text-red-800',
            },
            warning: {
                bg: 'bg-yellow-50',
                border: 'border-yellow-200',
                text: 'text-yellow-800',
            },
            info: {
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'text-blue-800',
            }
        };
        return styles[type];
    }, [type]);

    // Memoize position classes
    //   const positionClasses = useMemo(() => {
    //     const positions = {
    //       'bottom-right': 'right-4 bottom-4',
    //       'bottom-left': 'left-4 bottom-4',
    //       'bottom-center': 'left-1/2 bottom-4 -translate-x-1/2'
    //     };
    //     return positions[position];
    //   }, [position]);

    // Memoize animation classes based on visibility
    const animationClasses = useMemo(() => {
        if (isVisible) {
            return 'translate-y-0 opacity-100';
        } else if (shouldRender) {
            return 'translate-y-full opacity-0';
        }
        return 'translate-y-full opacity-0';
    }, [isVisible, shouldRender]);

    // Handle visibility and auto-close
    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);

            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            // Wait for slide-out animation to complete before unmounting
            const timer = setTimeout(() => {
                setShouldRender(false);
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!shouldRender && !isVisible) {
        return null;
    }

    return (
        <div
            className={`
        fixed z-50 
        min-w-[300px] max-w-[500px] 
        p-4 rounded-lg border
        shadow-lg
        transition-all duration-500 ease-in-out
        ${typeStyles.bg} ${typeStyles.border} ${typeStyles.text}
        left-1/2 bottom-1/2 -translate-x-1/2
        ${animationClasses}
        pointer-events-none
        ${isVisible ? 'pointer-events-auto' : ''}
        
        mx-4
        sm:mx-0
        sm:min-w-[300px]
      `}
        >
            <div className="flex items-center gap-3">
                {/* <span className="text-lg flex-shrink-0">{typeStyles.icon}</span> */}
                <span className="text-sm font-medium leading-5">{message}</span>
            </div>
        </div>
    );
};

export default React.memo(NotificationPopup);