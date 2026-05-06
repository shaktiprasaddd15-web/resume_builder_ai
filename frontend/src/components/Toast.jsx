import React, { useState, useEffect } from 'react';

let toastId = 0;
let addToastFn = null;

export const toast = {
    success: (msg) => addToastFn && addToastFn({ id: ++toastId, msg, type: 'success' }),
    error: (msg) => addToastFn && addToastFn({ id: ++toastId, msg, type: 'error' }),
    info: (msg) => addToastFn && addToastFn({ id: ++toastId, msg, type: 'info' }),
};

const Toast = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        addToastFn = (t) => {
            setToasts(prev => [...prev, t]);
            setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500);
        };
        return () => { addToastFn = null; };
    }, []);

    const icons = { success: '✅', error: '❌', info: 'ℹ️' };

    return (
        <div className="toast-container">
            {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>
                    <span>{icons[t.type]}</span>
                    <span>{t.msg}</span>
                </div>
            ))}
        </div>
    );
};

export default Toast;
