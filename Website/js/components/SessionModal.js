import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { TagInput } from '@/components/TagInput';
const emptySession = {
    session: '',
    category: 'Product',
    speaker: '',
    speakerTitle: '',
    speakerImage: '',
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    location: '',
    description: '',
    objectives: [],
    materials: [],
    tags: [],
};
const FormRow = ({ children, className }) => (_jsx("div", { className: `grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 ${className}`, children: children }));
const FormField = ({ label, children, hint }) => (_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-1.5", children: [label, " ", hint && _jsx("span", { className: "text-gray-400 font-normal", children: hint })] }), children] }));
const SessionModal = ({ session, day, onClose, onSave, existingSessions, dayTheme, isReadOnly = false }) => {
    const [formData, setFormData] = useState(emptySession);
    useEffect(() => {
        setFormData(session ? { ...session } : { ...emptySession });
    }, [session]);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleListChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value.split('\n').filter(s => s.trim()) }));
    };
    const handleTagsChange = (tags) => {
        setFormData(prev => ({ ...prev, tags }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isReadOnly)
            return;
        const finalSession = { ...emptySession, ...formData, id: formData.id || Date.now() };
        onSave(finalSession);
    };
    const inputClass = "w-full p-2 border border-[var(--color-border)] rounded-md shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-shadow disabled:bg-gray-100 disabled:text-gray-500";
    const modalTitleId = "session-modal-title";
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": modalTitleId, children: _jsx("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-3xl m-4 transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: _jsxs("form", { onSubmit: handleSubmit, className: "max-h-[90vh] overflow-y-auto", children: [_jsx("div", { className: "sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 sm:px-8 py-4 border-b border-[var(--color-border-subtle)]", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h2", { id: modalTitleId, className: "text-xl sm:text-2xl font-bold text-[var(--color-text-main)]", children: isReadOnly ? 'Session Details' : (session?.id ? 'Edit Session' : 'Add New Session') }), _jsxs("p", { className: "text-sm text-[var(--color-text-secondary)]", children: ["Day ", day, ": ", dayTheme] })] }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close session editor", className: "p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }) }), _jsxs("div", { className: "p-6 sm:p-8 space-y-6", children: [_jsxs(FormRow, { children: [_jsx(FormField, { label: "Session Title", children: _jsx("input", { type: "text", name: "session", value: formData.session || '', onChange: handleChange, className: inputClass, required: true, disabled: isReadOnly }) }), _jsx(FormField, { label: "Category", children: _jsxs("select", { name: "category", value: formData.category, onChange: handleChange, className: `${inputClass} bg-white`, disabled: isReadOnly, children: [_jsx("option", { children: "Product" }), _jsx("option", { children: "Technology" }), _jsx("option", { children: "Training" }), _jsx("option", { children: "Planning" }), _jsx("option", { children: "Company Update" }), _jsx("option", { children: "Hackathon" }), _jsx("option", { children: "Entertainment" }), _jsx("option", { children: "Opening" }), _jsx("option", { children: "Closing" }), _jsx("option", { children: "Breakfast" }), _jsx("option", { children: "Break" }), _jsx("option", { children: "Lunch" })] }) })] }), _jsx(FormField, { label: "Description", children: _jsx("textarea", { name: "description", value: formData.description || '', onChange: handleChange, rows: 3, className: inputClass, required: true, disabled: isReadOnly }) }), _jsxs(FormRow, { children: [_jsx(FormField, { label: "Speaker", children: _jsx("input", { type: "text", name: "speaker", value: formData.speaker || '', onChange: handleChange, placeholder: "e.g., Jane Doe or 'TBD'", className: inputClass, disabled: isReadOnly }) }), _jsx(FormField, { label: "Speaker Title", hint: "(optional)", children: _jsx("input", { type: "text", name: "speakerTitle", value: formData.speakerTitle || '', onChange: handleChange, placeholder: "e.g., CEO, Deltek", className: inputClass, disabled: isReadOnly }) })] }), _jsxs(FormRow, { children: [_jsx(FormField, { label: "Speaker Image URL", hint: "(optional)", children: _jsx("input", { type: "text", name: "speakerImage", value: formData.speakerImage || '', onChange: handleChange, placeholder: "https://...", className: inputClass, disabled: isReadOnly }) }), _jsx(FormField, { label: "Location", children: _jsx("input", { type: "text", name: "location", value: formData.location || '', onChange: handleChange, placeholder: "e.g., Novotel Ballroom", className: inputClass, required: true, disabled: isReadOnly }) })] }), _jsxs(FormRow, { children: [_jsx(FormField, { label: "Start Time", children: _jsx("input", { type: "text", name: "startTime", value: formData.startTime || '', onChange: handleChange, placeholder: "e.g., 9:00 AM", className: inputClass, required: true, disabled: isReadOnly }) }), _jsx(FormField, { label: "End Time", children: _jsx("input", { type: "text", name: "endTime", value: formData.endTime || '', onChange: handleChange, placeholder: "e.g., 10:00 AM", className: inputClass, required: true, disabled: isReadOnly }) })] }), _jsx(FormField, { label: "Objectives", hint: isReadOnly ? '' : "(one per line)", children: _jsx("textarea", { name: "objectives", value: formData.objectives?.join('\n') || '', onChange: e => handleListChange('objectives', e.target.value), rows: 3, className: inputClass, disabled: isReadOnly }) }), _jsx(FormField, { label: "Materials", hint: isReadOnly ? '' : "(one per line)", children: _jsx("textarea", { name: "materials", value: formData.materials?.join('\n') || '', onChange: e => handleListChange('materials', e.target.value), rows: 2, className: inputClass, disabled: isReadOnly }) }), _jsx(FormField, { label: "Tags", children: _jsx(TagInput, { tags: formData.tags || [], onChange: handleTagsChange }) })] }), _jsxs("div", { className: "sticky bottom-0 flex justify-end gap-4 p-6 bg-white/80 backdrop-blur-md border-t border-[var(--color-border-subtle)]", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors", children: isReadOnly ? 'Close' : 'Cancel' }), !isReadOnly && (_jsxs("button", { type: "submit", className: "flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm hover:shadow-md", children: [_jsx(Save, { className: "w-5 h-5" }), "Save Session"] }))] })] }) }) }));
};
export default SessionModal;
