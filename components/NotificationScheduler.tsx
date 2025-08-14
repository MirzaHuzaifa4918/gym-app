import React, { useState, useRef, useEffect } from 'react';

export const NotificationScheduler: React.FC = () => {
    const [time, setTime] = useState('18:00');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const timeoutId = useRef<number | null>(null);

    useEffect(() => {
        // Clear timeout when the component unmounts
        return () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current);
            }
        };
    }, []);

    const handleSetReminder = async () => {
        setMessage(null);
        setError(null);

        if (!('Notification' in window)) {
            setError('This browser does not support desktop notifications.');
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== 'granted') {
            setError('Notification permission denied. Please enable notifications in your browser settings.');
            return;
        }
        
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        const [hours, minutes] = time.split(':').map(Number);
        const now = new Date();
        const reminderDate = new Date();
        reminderDate.setHours(hours, minutes, 0, 0);

        let delay = reminderDate.getTime() - now.getTime();

        if (delay < 0) {
            // If time is in the past for today, schedule for tomorrow
            reminderDate.setDate(reminderDate.getDate() + 1);
            delay = reminderDate.getTime() - now.getTime();
        }

        timeoutId.current = window.setTimeout(() => {
            new Notification('Time for the Gym! 💪', {
                body: `It's ${time}. Let's go crush that workout!`,
                icon: 'https://cdn-icons-png.flaticon.com/512/60/60905.png' 
            });
        }, delay);
        
        const friendlyTime = new Date(reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessage(`Success! Reminder set for ${friendlyTime}.`);
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-xl shadow-2xl border border-gray-700 text-center">
            <h3 className="text-xl font-bold text-white mb-3">Set a Daily Gym Reminder</h3>
            <div className="flex justify-center items-center flex-wrap gap-4">
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-gray-900 border-gray-700 rounded-md p-2 text-white focus:ring-red-500 focus:border-red-500"
                    aria-label="Set reminder time"
                />
                <button
                    onClick={handleSetReminder}
                    className="py-2 px-4 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                >
                    Set Alert
                </button>
            </div>
            {message && <p className="text-green-400 mt-3 text-sm" role="status">{message}</p>}
            {error && <p className="text-red-400 mt-3 text-sm" role="alert">{error}</p>}
        </div>
    );
};
