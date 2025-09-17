import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Megaphone, Hash } from 'lucide-react';
const announcements = [
    {
        id: 1,
        title: 'Welcome to Goa!',
        content: 'Hotel check-in is now open. Please proceed to the registration desk in your hotel lobby to collect your welcome kit.',
        timestamp: 'Just now',
    },
    {
        id: 2,
        title: 'AI Hackathon Preread Material Available',
        content: 'Don\'t forget to check the preread materials for the AI Hackathon session on Day 3. Get a head start on the competition!',
        timestamp: '15 mins ago',
    },
    {
        id: 3,
        title: 'Hawaiian Theme Team Building',
        content: 'Get your floral shirts ready! The team building event on Day 2 will have a Hawaiian theme. See you at the Seaside Lawn Area!',
        timestamp: '1 hour ago',
    },
];
const LiveAnnouncements = () => {
    return (_jsxs("div", { className: "bg-sky-50 rounded-xl shadow-md p-6 border border-sky-200", children: [_jsxs("h2", { className: "text-2xl font-bold text-[var(--color-text-main)] mb-4 flex items-center gap-3", children: [_jsx(Megaphone, { className: "w-6 h-6 text-[var(--color-primary)]" }), "Live Announcements & Updates"] }), _jsx("div", { className: "space-y-4 mb-6", children: announcements.map((announcement) => (_jsxs("div", { className: "p-4 bg-white rounded-lg border border-[var(--color-border-subtle)]", children: [_jsxs("div", { className: "flex justify-between items-center mb-1", children: [_jsx("h3", { className: "font-semibold text-[var(--color-text-main)]", children: announcement.title }), _jsx("span", { className: "text-xs text-[var(--color-text-subtle)]", children: announcement.timestamp })] }), _jsx("p", { className: "text-sm text-[var(--color-text-secondary)]", children: announcement.content })] }, announcement.id))) }), _jsxs("div", { className: "pt-4 border-t border-sky-200", children: [_jsx("h3", { className: "font-semibold text-sm text-center text-[var(--color-text-secondary)] mb-3", children: "Follow the event & share your moments!" }), _jsxs("div", { className: "flex justify-center items-center gap-4", children: [_jsxs("a", { href: "https://twitter.com/search?q=%23DeltekReconnect2025", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-white border border-gray-200 text-[var(--color-primary)] hover:bg-gray-50 transition-colors", children: [_jsx(Hash, { className: "w-4 h-4" }), "DeltekReconnect2025"] }), _jsxs("a", { href: "https://twitter.com/search?q=%23UniteInnovateExcel", target: "_blank", rel: "noopener noreferrer", className: "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm bg-white border border-gray-200 text-[var(--color-primary)] hover:bg-gray-50 transition-colors", children: [_jsx(Hash, { className: "w-4 h-4" }), "UniteInnovateExcel"] })] })] })] }));
};
export default LiveAnnouncements;
