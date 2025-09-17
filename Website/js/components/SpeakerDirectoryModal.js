import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { X, ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
const categoryStyles = {
    'breakfast': { border: 'border-teal-300' },
    'break': { border: 'border-yellow-300' },
    'lunch': { border: 'border-green-300' },
    'entertainment': { border: 'border-purple-300' },
    'hackathon': { border: 'border-blue-300' },
    'training': { border: 'border-indigo-300' },
    'product': { border: 'border-rose-300' },
    'opening': { border: 'border-amber-300' },
    'closing': { border: 'border-cyan-300' },
    'company update': { border: 'border-emerald-300' },
    'planning': { border: 'border-orange-300' },
    'registration': { border: 'border-sky-300' },
    'networking': { border: 'border-gray-300' },
    'dinner': { border: 'border-slate-300' },
    'departure': { border: 'border-gray-300' },
    'default': { border: 'border-gray-300' },
};
const getCategoryStyle = (category) => {
    return categoryStyles[category.toLowerCase()] || categoryStyles['default'];
};
const SpeakerDirectoryModal = ({ isOpen, onClose, speakers, summitDaysInfo }) => {
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    useEffect(() => { if (!isOpen)
        setSelectedSpeaker(null); }, [isOpen]);
    useEffect(() => {
        const handleKeyDown = (event) => { if (event.key === 'Escape')
            onClose(); };
        if (isOpen)
            document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    if (!isOpen)
        return null;
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-[100] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "speaker-modal-title", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-4xl my-8 transform transition-all animate-fade-in-up max-h-[90vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] z-10 px-6 sm:px-8 py-4 flex justify-between items-center", children: [_jsx("div", { children: selectedSpeaker ? (_jsxs("button", { onClick: () => setSelectedSpeaker(null), className: "flex items-center gap-2 font-bold text-lg text-white/90 hover:text-white transition-colors", children: [_jsx(ArrowLeft, { className: "w-5 h-5" }), "Back to All Speakers"] })) : (_jsx("h2", { id: "speaker-modal-title", className: "text-xl sm:text-2xl font-bold text-white", children: "India Reconnect 2025 Speakers" })) }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close speakers directory", className: "p-2 -m-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors", children: _jsx(X, { className: "w-6 h-6" }) })] }), _jsx("div", { className: "overflow-y-auto p-6 sm:p-8", children: selectedSpeaker ? (_jsxs("div", { className: "flex flex-col sm:flex-row items-start gap-8", children: [_jsxs("div", { className: "text-center flex-shrink-0 w-full sm:w-40", children: [_jsx("img", { src: selectedSpeaker.image, alt: selectedSpeaker.name, className: "w-32 h-32 rounded-full object-cover shadow-lg mx-auto border-4 border-white" }), _jsx("h3", { className: "text-2xl font-bold mt-4 text-[var(--color-text-main)]", children: selectedSpeaker.name }), _jsx("p", { className: "text-[var(--color-text-secondary)] mt-1", children: selectedSpeaker.title })] }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "text-lg font-semibold text-[var(--color-primary)] mb-3", children: ["Sessions by ", selectedSpeaker.name] }), _jsx("div", { className: "space-y-3", children: selectedSpeaker.sessions.map(session => {
                                            const categoryStyle = getCategoryStyle(session.category);
                                            const dayInfo = summitDaysInfo.find(d => d.day === session.day);
                                            return (_jsxs("div", { className: `p-3 rounded-lg border-l-4 ${categoryStyle.border} bg-gray-50`, children: [_jsx("p", { className: "font-bold text-[var(--color-text-main)]", children: session.session }), _jsxs("p", { className: "text-sm text-[var(--color-text-secondary)] mt-1 flex items-center flex-wrap gap-x-4 gap-y-1", children: [dayInfo && _jsxs("span", { className: "flex items-center gap-1.5 font-medium text-[var(--color-primary)]", children: [_jsx(Calendar, { className: "w-4 h-4" }), dayInfo.name] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-4 h-4" }), session.startTime, " - ", session.endTime, " (IST)"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4" }), session.location] })] })] }, session.id));
                                        }) })] })] })) : (_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6", children: speakers.map(speaker => (_jsxs("button", { onClick: () => setSelectedSpeaker(speaker), className: "text-center group", "aria-label": `View details for ${speaker.name}`, children: [_jsx("img", { src: speaker.image, alt: speaker.name, className: "w-24 h-24 rounded-full object-cover shadow-md mx-auto border-4 border-transparent group-hover:border-[var(--color-primary)] group-hover:scale-105 transition-all duration-300" }), _jsx("p", { className: "mt-2 font-semibold text-sm text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors", children: speaker.name }), _jsx("p", { className: "text-xs text-[var(--color-text-subtle)] mt-0.5 truncate", title: speaker.title, children: speaker.title })] }, speaker.name))) })) })] }) }));
};
export default SpeakerDirectoryModal;
