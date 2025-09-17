import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';
const PasswordModal = ({ onClose, onLogin, error }) => {
    const [password, setPassword] = useState('');
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    const handleSubmit = (e) => {
        e.preventDefault();
        onLogin(password);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "password-modal-title", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl p-8 w-full max-w-sm text-center transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4", children: _jsx(Lock, { className: "h-6 w-6 text-[var(--color-primary)]" }) }), _jsx("h2", { id: "password-modal-title", className: "text-2xl font-bold text-[var(--color-text-main)] mb-2", children: "Admin Access Required" }), _jsx("p", { className: "text-[var(--color-text-secondary)] mb-6", children: "Please enter the password to continue." }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Password", className: "w-full p-3 border border-[var(--color-border)] rounded-lg shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-shadow text-center", autoFocus: true }), error && _jsx("p", { className: "text-sm text-red-600 mt-2", children: error }), _jsx("button", { type: "submit", className: "w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-[var(--color-text-on-primary)] transition-all duration-300 shadow-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]", children: "Login" })] })] }) }));
};
export default PasswordModal;
