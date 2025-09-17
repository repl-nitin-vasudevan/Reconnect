import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo } from 'react';
import { X, Clock, MapPin, BellOff, Info, Bell, Download } from 'lucide-react';
const IST_TIMEZONE = 'Asia/Kolkata';
// Helper to parse time and create a full date object in IST
const parseSessionTimeToDate = (timeStr, dateForDay) => {
    if (!timeStr || timeStr.toLowerCase() === 'tbd')
        return null;
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match)
        return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12)
        hours += 12;
    if (meridiem === 'AM' && hours === 12)
        hours = 0;
    const datePart = dateForDay.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE });
    const timePart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    return new Date(`${datePart}T${timePart}+05:30`);
};
// Helper to format a Date object into the iCalendar UTC format (YYYYMMDDTHHMMSSZ)
const toICSFormat = (date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};
const MyAgendaModal = ({ isOpen, onClose, subscribedSessions, onToggleSubscription, summitDaysInfo, currentTime }) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape')
                onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);
    const { nextUpSession, otherSessions } = useMemo(() => {
        const upcoming = subscribedSessions
            .map(s => {
            const dayInfo = summitDaysInfo.find(d => d.day === s.day);
            if (!dayInfo)
                return null;
            const startTime = parseSessionTimeToDate(s.startTime, dayInfo.dateObject);
            return { ...s, startTimeObj: startTime };
        })
            .filter((s) => s !== null && s.startTimeObj > currentTime)
            .sort((a, b) => a.startTimeObj.getTime() - b.startTimeObj.getTime());
        const nextUp = upcoming[0] || null;
        const others = subscribedSessions.filter(s => s.id !== nextUp?.id);
        return { nextUpSession: nextUp, otherSessions: others };
    }, [subscribedSessions, currentTime, summitDaysInfo]);
    if (!isOpen)
        return null;
    const groupedSessions = otherSessions.reduce((acc, session) => {
        (acc[session.day] = acc[session.day] || []).push(session);
        return acc;
    }, {});
    const handleExportToCalendar = () => {
        const icsEvents = subscribedSessions.map(session => {
            const dayInfo = summitDaysInfo.find(d => d.day === session.day);
            if (!dayInfo)
                return '';
            const startDate = parseSessionTimeToDate(session.startTime, dayInfo.dateObject);
            const endDate = parseSessionTimeToDate(session.endTime, dayInfo.dateObject);
            if (!startDate || !endDate)
                return '';
            const event = [
                'BEGIN:VEVENT',
                `UID:${session.id}@deltek.reconnect.2025`,
                `DTSTAMP:${toICSFormat(new Date())}`,
                `DTSTART:${toICSFormat(startDate)}`,
                `DTEND:${toICSFormat(endDate)}`,
                `SUMMARY:${session.session}`,
                `DESCRIPTION:${session.description.replace(/\n/g, '\\n')}`,
                `LOCATION:${session.location}`,
                'END:VEVENT'
            ].join('\r\n');
            return event;
        }).filter(Boolean).join('\r\n');
        const icsFile = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Deltek Inc//Reconnect 2025 Agenda//EN',
            icsEvents,
            'END:VCALENDAR'
        ].join('\r\n');
        const blob = new Blob([icsFile], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", "MyAgenda-Reconnect2025.ics");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-start z-[100] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "my-agenda-title", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-2xl my-8 transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "sticky top-0 bg-white/80 backdrop-blur-md z-10 px-6 sm:px-8 py-4 border-b border-[var(--color-border-subtle)]", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { id: "my-agenda-title", className: "text-xl sm:text-2xl font-bold text-[var(--color-text-main)]", children: "My Personalized Agenda" }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close my agenda modal", className: "p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }), _jsx("p", { className: "text-sm text-[var(--color-text-secondary)] mt-1", children: "Your subscribed sessions and upcoming reminders." })] }), _jsx("div", { className: "max-h-[75vh] overflow-y-auto p-6 sm:p-8", children: subscribedSessions.length > 0 ? (_jsxs("div", { className: "space-y-8", children: [nextUpSession && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-orange-500 animate-pulse" }), _jsx("h3", { className: "text-lg font-bold text-orange-600", children: "Next Up" })] }), _jsx("div", { className: "border-l-2 border-orange-200 ml-1 pl-8", children: _jsx("div", { className: "bg-orange-50 p-4 rounded-lg border border-orange-200 shadow-sm", children: _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-lg text-orange-800", children: nextUpSession.session }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-orange-700 mt-2", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: [nextUpSession.startTime, " - ", nextUpSession.endTime, " (IST)"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { children: nextUpSession.location })] })] })] }), _jsx("button", { onClick: () => onToggleSubscription(nextUpSession.id, nextUpSession.session), className: "p-2 rounded-full text-[var(--color-danger)] hover:bg-red-50 transition-colors flex-shrink-0", "aria-label": `Unsubscribe from ${nextUpSession.session}`, children: _jsx(BellOff, { className: "w-5 h-5" }) })] }) }) })] })), Object.entries(groupedSessions).map(([day, sessions]) => {
                                const dayInfo = summitDaysInfo.find(d => d.day === parseInt(day));
                                const dayDate = dayInfo ? dayInfo.dateObject : new Date();
                                return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-[var(--color-primary)]" }), _jsx("h3", { className: "text-lg font-bold text-[var(--color-text-main)]", children: dayInfo?.name || `Day ${day}` }), _jsx("span", { className: "text-sm text-[var(--color-text-subtle)]", children: dayInfo?.date })] }), _jsx("div", { className: "space-y-4 border-l-2 border-[var(--color-border)] ml-1 pl-8 relative", children: sessions.map(session => {
                                                const sessionStartTime = parseSessionTimeToDate(session.startTime, dayDate);
                                                const sessionEndTime = parseSessionTimeToDate(session.endTime, dayDate);
                                                const isNow = sessionStartTime && sessionEndTime ? sessionStartTime <= currentTime && currentTime < sessionEndTime : false;
                                                return (_jsxs("div", { className: "relative bg-white p-4 rounded-lg border border-[var(--color-border-subtle)] shadow-sm hover:shadow-md transition-shadow", children: [_jsx("div", { className: "absolute -left-[37px] top-6 w-3 h-3 rounded-full bg-white border-2 border-[var(--color-primary)]" }), _jsxs("div", { className: "flex justify-between items-start gap-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-4 flex-wrap mb-2", children: [_jsx("p", { className: "font-semibold text-base text-[var(--color-text-main)]", children: session.session }), isNow && (_jsx("span", { className: `text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700`, children: "Happening Now" }))] }), _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-[var(--color-text-secondary)]", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { className: "w-4 h-4" }), _jsxs("span", { children: [session.startTime, " - ", session.endTime, " (IST)"] })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { children: session.location })] })] })] }), _jsx("button", { onClick: () => onToggleSubscription(session.id, session.session), className: "p-2 rounded-full text-[var(--color-danger)] hover:bg-red-50 transition-colors flex-shrink-0", "aria-label": `Unsubscribe from ${session.session}`, children: _jsx(BellOff, { className: "w-5 h-5" }) })] })] }, session.id));
                                            }) })] }, day));
                            })] })) : (_jsxs("div", { className: "text-center py-12", children: [_jsx(Info, { className: "w-12 h-12 mx-auto text-gray-300" }), _jsx("h3", { className: "mt-4 text-lg font-semibold text-[var(--color-text-main)]", children: "No Subscriptions Yet" }), _jsxs("p", { className: "mt-1 text-sm text-[var(--color-text-secondary)]", children: ["Click the ", _jsx(Bell, { className: "w-4 h-4 inline-block mx-1" }), " icon on any session to add it to your personal agenda."] })] })) }), subscribedSessions.length > 0 && (_jsx("div", { className: "sticky bottom-0 flex justify-end gap-4 p-4 bg-white/80 backdrop-blur-md border-t border-[var(--color-border-subtle)]", children: _jsxs("button", { type: "button", onClick: handleExportToCalendar, className: "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm hover:shadow-md", children: [_jsx(Download, { className: "w-4 h-4" }), "Export to Calendar"] }) }))] }) }));
};
export default MyAgendaModal;
