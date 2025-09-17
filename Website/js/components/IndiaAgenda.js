import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Calendar, Clock, MapPin, Users, Coffee, Utensils, Star, Tag, Plus, AlertTriangle, RefreshCw, UploadCloud, X, CheckCircle, ListTree, Lock, ListChecks, Info, Search, XCircle, Megaphone, Notebook, Camera } from 'lucide-react';
import { DEFAULT_STORED_DATA, VENUE_LOCATIONS } from '@/constants';
import { volunteers } from '@/constants/volunteers';
import SessionModal from '@/components/SessionModal';
import PasswordModal from '@/components/PasswordModal';
import MyAgendaModal from '@/components/MyAgendaModal';
import MyFavoritesModal from '@/components/MyFavoritesModal';
import GeneralInfoModal from '@/components/GeneralInfoModal';
import VenueMapModal from '@/components/VenueMapModal';
import SpeakerDirectoryModal from '@/components/SpeakerDirectoryModal';
import SessionCard from '@/components/SessionCard';
import LiveAnnouncements from '@/components/LiveAnnouncements';
import VolunteerView from '@/components/VolunteerView';
import HackathonTimer from '@/components/HackathonTimer';
// --- Helper Functions --- //
const IST_TIMEZONE = 'Asia/Kolkata';
const categoryStyles = {
    'breakfast': { icon: _jsx(Utensils, { className: "w-4 h-4" }), classes: 'bg-teal-50 text-teal-800', border: 'border-teal-300', activeClasses: 'bg-teal-500 text-white' },
    'break': { icon: _jsx(Coffee, { className: "w-4 h-4" }), classes: 'bg-yellow-50 text-yellow-800', border: 'border-yellow-300', activeClasses: 'bg-yellow-500 text-white' },
    'lunch': { icon: _jsx(Utensils, { className: "w-4 h-4" }), classes: 'bg-green-50 text-green-800', border: 'border-green-300', activeClasses: 'bg-green-500 text-white' },
    'entertainment': { icon: _jsx(Star, { className: "w-4 h-4" }), classes: 'bg-purple-50 text-purple-800', border: 'border-purple-300', activeClasses: 'bg-purple-500 text-white' },
    'hackathon': { icon: _jsx(Users, { className: "w-4 h-4" }), classes: 'bg-blue-50 text-blue-800', border: 'border-blue-300', activeClasses: 'bg-blue-500 text-white' },
    'training': { icon: _jsx(Users, { className: "w-4 h-4" }), classes: 'bg-indigo-50 text-indigo-800', border: 'border-indigo-300', activeClasses: 'bg-indigo-500 text-white' },
    'product': { icon: _jsx(Tag, { className: "w-4 h-4" }), classes: 'bg-rose-50 text-rose-800', border: 'border-rose-300', activeClasses: 'bg-rose-500 text-white' },
    'opening': { icon: _jsx(Calendar, { className: "w-4 h-4" }), classes: 'bg-amber-50 text-amber-800', border: 'border-amber-300', activeClasses: 'bg-amber-500 text-white' },
    'closing': { icon: _jsx(Star, { className: "w-4 h-4" }), classes: 'bg-cyan-50 text-cyan-800', border: 'border-cyan-300', activeClasses: 'bg-cyan-500 text-white' },
    'company update': { icon: _jsx(Calendar, { className: "w-4 h-4" }), classes: 'bg-emerald-50 text-emerald-800', border: 'border-emerald-300', activeClasses: 'bg-emerald-500 text-white' },
    'planning': { icon: _jsx(Users, { className: "w-4 h-4" }), classes: 'bg-orange-50 text-orange-800', border: 'border-orange-300', activeClasses: 'bg-orange-500 text-white' },
    'registration': { icon: _jsx(Notebook, { className: "w-4 h-4" }), classes: 'bg-sky-50 text-sky-800', border: 'border-sky-300', activeClasses: 'bg-sky-500 text-white' },
    'networking': { icon: _jsx(Users, { className: "w-4 h-4" }), classes: 'bg-gray-100 text-gray-800', border: 'border-gray-300', activeClasses: 'bg-gray-500 text-white' },
    'dinner': { icon: _jsx(Utensils, { className: "w-4 h-4" }), classes: 'bg-slate-50 text-slate-800', border: 'border-slate-300', activeClasses: 'bg-slate-500 text-white' },
    'departure': { icon: _jsx(Calendar, { className: "w-4 h-4" }), classes: 'bg-gray-100 text-gray-800', border: 'border-gray-300', activeClasses: 'bg-gray-500 text-white' },
    'default': { icon: _jsx(Calendar, { className: "w-4 h-4" }), classes: 'bg-gray-100 text-gray-800', border: 'border-gray-300', activeClasses: 'bg-gray-500 text-white' },
};
const getCategoryStyle = (category) => {
    return categoryStyles[category.toLowerCase()] || categoryStyles['default'];
};
const timeToMinutes = (timeStr) => {
    if (!timeStr || timeStr.toLowerCase() === 'tbd')
        return -1;
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match)
        return -1;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const meridiem = match[3].toUpperCase();
    if (meridiem === 'PM' && hours !== 12)
        hours += 12;
    if (meridiem === 'AM' && hours === 12)
        hours = 0;
    return hours * 60 + minutes;
};
const parseSessionTime = (timeStr, dateForDay) => {
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
    // Get the date part from the dateForDay object, formatted for IST timezone.
    // en-CA gives YYYY-MM-DD format which is safe to parse.
    const datePart = dateForDay.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE });
    const timePart = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
    // Construct an ISO string with the IST offset and parse it to get a correct Date object
    return new Date(`${datePart}T${timePart}+05:30`);
};
// --- Countdown Clock Component --- //
const useTime = (refreshCycle = 1000) => {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const timerId = setInterval(() => setNow(new Date()), refreshCycle);
        return () => clearInterval(timerId);
    }, [refreshCycle]);
    return now;
};
const CountdownSegment = ({ value, label }) => (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: "text-xl sm:text-2xl font-extrabold tracking-tighter", style: { textShadow: '2px 2px 8px rgba(0,0,0,0.4)' }, children: String(value).padStart(2, '0') }), _jsx("span", { className: "text-xs sm:text-sm font-semibold uppercase tracking-widest opacity-80", children: label })] }));
const CountdownClock = ({ targetDate, eventEndDate, agendaData, summitDaysInfo }) => {
    const now = useTime();
    const timeRemaining = targetDate.getTime() - now.getTime();
    const isEventLive = now >= targetDate && now <= eventEndDate;
    const hasEventEnded = now > eventEndDate;
    const nextSession = useMemo(() => {
        if (!isEventLive || !agendaData || !summitDaysInfo)
            return null;
        const allSessions = Object.entries(agendaData)
            .flatMap(([day, sessions]) => sessions.map(session => ({ ...session, day: parseInt(day) })));
        const upcomingSessions = allSessions
            .map(s => {
            const dayInfo = summitDaysInfo.find(d => d.day === s.day);
            if (!dayInfo)
                return null;
            const startTime = parseSessionTime(s.startTime, dayInfo.dateObject);
            return { ...s, startTimeObj: startTime };
        })
            .filter((s) => s !== null && s.startTimeObj > now)
            .sort((a, b) => a.startTimeObj.getTime() - b.startTimeObj.getTime());
        return upcomingSessions[0] || null;
    }, [now, agendaData, summitDaysInfo, isEventLive]);
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
    const currentTimeIST = now.toLocaleTimeString('en-US', {
        timeZone: IST_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
    return (_jsxs("div", { className: "w-full max-w-3xl mx-auto bg-black/25 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20 shadow-xl text-white", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 flex-wrap gap-2", children: [_jsx("h3", { className: "text-base font-bold uppercase tracking-wider", children: timeRemaining > 0 ? 'Event Starts In' : isEventLive ? 'Event is Live!' : 'Event Concluded' }), _jsxs("div", { className: "flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold", children: [_jsx(Clock, { className: "w-3 h-3" }), _jsxs("span", { children: [currentTimeIST, " (IST)"] })] })] }), timeRemaining > 0 ? (_jsxs("div", { className: "flex justify-around items-center", children: [_jsx(CountdownSegment, { value: days, label: "Days" }), _jsx("span", { className: "text-3xl sm:text-4xl font-light opacity-50", children: ":" }), _jsx(CountdownSegment, { value: hours, label: "Hours" }), _jsx("span", { className: "text-3xl sm:text-4xl font-light opacity-50", children: ":" }), _jsx(CountdownSegment, { value: minutes, label: "Mins" }), _jsx("span", { className: "text-3xl sm:text-4xl font-light opacity-50", children: ":" }), _jsx(CountdownSegment, { value: seconds, label: "Secs" })] })) : isEventLive ? (_jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left gap-4", children: [_jsxs("div", { className: "flex-shrink-0", children: [_jsx("p", { className: "text-xl sm:text-2xl font-bold", children: "Welcome to Reconnect 2025!" }), _jsx("p", { className: "mt-1 text-base opacity-80", children: "The event is now underway." })] }), nextSession ? (_jsxs("div", { className: "border-t-2 sm:border-t-0 sm:border-l-2 border-white/20 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0 w-full sm:w-auto text-center sm:text-right flex-shrink-0 sm:max-w-xs", children: [_jsx("p", { className: "text-sm font-semibold uppercase tracking-wider opacity-80", children: "Next Up" }), _jsx("p", { className: "font-bold text-lg truncate", title: nextSession.session, children: nextSession.session }), _jsxs("div", { className: "flex items-center justify-center sm:justify-end gap-x-3 gap-y-1 text-sm opacity-90 mt-1 flex-wrap", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), nextSession.startTime] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "w-4 h-4" }), nextSession.location] })] })] })) : (_jsxs("div", { className: "border-t-2 sm:border-t-0 sm:border-l-2 border-white/20 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0 w-full sm:w-auto text-center sm:text-right", children: [_jsx("p", { className: "font-bold text-lg", children: "Wrapping up the day!" }), _jsx("p", { className: "text-sm opacity-80", children: "Check the agenda for final events." })] }))] })) : (_jsxs("div", { className: "text-center py-2", children: [_jsx("p", { className: "text-xl sm:text-2xl font-bold", children: "Thank you for attending!" }), _jsx("p", { className: "mt-1 text-base opacity-80", children: "See you at the next Deltek event." })] }))] }));
};
// --- Sub-components --- //
const ToastNotification = ({ notification, onDismiss }) => {
    return (_jsx("div", { className: "fixed bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-[120] animate-fade-in-up", children: _jsxs("div", { className: "bg-gray-800 text-white rounded-xl shadow-2xl flex items-start gap-4 p-4", children: [_jsx("div", { className: "bg-[var(--color-secondary)] p-2 rounded-full mt-1", children: _jsx(Megaphone, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-bold", children: notification.sessionName }), _jsx("p", { className: "text-sm text-gray-300", children: notification.message })] }), _jsx("button", { onClick: onDismiss, "aria-label": "Dismiss notification", className: "p-1 -m-1 rounded-full hover:bg-white/20", children: _jsx(X, { className: "w-5 h-5" }) })] }) }));
};
const PublishModal = ({ onClose, dataToPublish }) => {
    const [isCopied, setIsCopied] = useState(false);
    // Create a stable JSON string from the agenda data.
    const agendaJSON = JSON.stringify(dataToPublish.agendaData, null, 2);
    // Create a JavaScript string literal from the JSON string. This properly escapes all characters.
    const safeAgendaDataStringLiteral = JSON.stringify(agendaJSON);
    const codeString = `import type { AgendaData, StoredData } from './types';
import { DEFAULT_START_DATE as IGNORED_DATE, DEFAULT_AGENDA_DATA as IGNORED_AGENDA, DEFAULT_STORED_DATA as IGNORED_STORED } from './constants';

// This file is auto-generated by the "Publish" feature in the agenda app.
// Developer: Please replace the content of the 'constants.ts' data definitions with this.
// The VENUE_LOCATIONS constant should remain untouched.

export const DEFAULT_START_DATE = new Date("${dataToPublish.startDate}");

// The data is stored as a JSON string and parsed at runtime.
// This is more robust against special characters in the data.
const defaultAgendaJSON = ${safeAgendaDataStringLiteral};
export const DEFAULT_AGENDA_DATA: AgendaData = JSON.parse(defaultAgendaJSON);

export const DEFAULT_STORED_DATA: StoredData = {
    agendaData: DEFAULT_AGENDA_DATA,
    startDate: DEFAULT_START_DATE.toISOString(),
    lastModified: new Date("${dataToPublish.lastModified}").toISOString(),
};
`;
    useEffect(() => {
        const handleKeyDown = (event) => { if (event.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    const handleCopy = () => {
        navigator.clipboard.writeText(codeString).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2500);
        }).catch(err => {
            console.error("Failed to copy code automatically: ", err);
            alert("Could not copy the code manually.");
        });
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "publish-modal-title", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl p-8 w-full max-w-2xl text-left transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("h2", { id: "publish-modal-title", className: "text-2xl font-bold text-[var(--color-text-main)]", children: "Publish Changes" }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close publish modal", className: "p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }), _jsxs("p", { className: "text-[var(--color-text-secondary)] mb-4", children: ["Copy the code below and use it to replace the data definitions in ", _jsx("code", { className: "bg-gray-100 px-1 py-0.5 rounded", children: "constants.ts" }), " to update the live agenda."] }), _jsx("div", { className: "bg-gray-800 rounded-lg p-4 max-h-80 overflow-auto", children: _jsx("pre", { className: "text-sm text-white whitespace-pre-wrap", children: codeString }) }), _jsxs("button", { onClick: handleCopy, className: `w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-[var(--color-text-on-primary)] transition-all duration-300 shadow-lg ${isCopied ? 'bg-[var(--color-success)]' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]'}`, children: [isCopied ? _jsx(CheckCircle, { className: "w-5 h-5" }) : _jsx(UploadCloud, { className: "w-5 h-5" }), isCopied ? 'Copied to Clipboard!' : 'Copy Code'] })] }) }));
};
const ConfirmationModal = ({ confirmation, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (event) => { if (event.key === 'Escape')
            onClose(); };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] p-4", onClick: onClose, role: "alertdialog", "aria-modal": "true", "aria-labelledby": "confirmation-title", "aria-describedby": "confirmation-description", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl p-8 w-full max-w-md transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100", children: _jsx(AlertTriangle, { className: "h-6 w-6 text-[var(--color-danger)]" }) }), _jsx("h3", { id: "confirmation-title", className: "mt-4 text-lg font-semibold text-[var(--color-text-main)]", children: confirmation.message }), _jsx("p", { id: "confirmation-description", className: "mt-2 text-sm text-[var(--color-text-secondary)]", children: confirmation.description })] }), _jsxs("div", { className: "mt-6 flex justify-center gap-4", children: [_jsx("button", { type: "button", className: "inline-flex justify-center rounded-md border border-transparent bg-[var(--color-danger)] px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors sm:text-sm", onClick: () => { confirmation.onConfirm(); onClose(); }, children: "Confirm" }), _jsx("button", { type: "button", className: "inline-flex justify-center rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors sm:text-sm", onClick: onClose, children: "Cancel" })] })] }) }));
};
const TimelineView = ({ sessions, activeDay, summitDaysInfo, currentTime, activeDayDate, onSessionClick }) => {
    const dayInfo = summitDaysInfo.find(d => d.day === activeDay);
    const timelineLayout = useMemo(() => {
        const validSessions = sessions.map(s => ({ ...s, start: timeToMinutes(s.startTime), end: timeToMinutes(s.endTime) })).filter(s => s.start !== -1 && s.end !== -1 && s.end > s.start).sort((a, b) => a.start - b.start);
        return validSessions.map(session => {
            const overlappingGroup = validSessions.filter(other => session.start < other.end && session.end > other.start);
            overlappingGroup.sort((a, b) => a.start - b.start);
            return { ...session, col: overlappingGroup.findIndex(os => os.id === session.id), numCols: overlappingGroup.length || 1 };
        });
    }, [sessions]);
    const dayStart = 420;
    const dayEnd = 1320;
    const totalMinutes = dayEnd - dayStart;
    const isToday = useMemo(() => {
        const todayISTStr = new Date().toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE });
        const activeDayDateISTStr = activeDayDate.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE });
        return todayISTStr === activeDayDateISTStr;
    }, [activeDayDate]);
    const timeIndicatorPosition = useMemo(() => {
        if (!isToday)
            return null;
        // Get current time in IST
        const timeParts = currentTime.toLocaleTimeString('en-GB', { timeZone: IST_TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false }).split(':');
        const currentMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
        if (currentMinutes < dayStart || currentMinutes > dayEnd)
            return null;
        return ((currentMinutes - dayStart) / totalMinutes) * 100;
    }, [currentTime, isToday]);
    if (timelineLayout.length === 0)
        return _jsx("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-md p-6 text-center border border-[var(--color-border-subtle)]", children: _jsx("p", { className: "text-[var(--color-text-subtle)]", children: "No sessions with valid times to display." }) });
    return (_jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-md border border-[var(--color-border-subtle)] overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-4 sm:p-6", children: _jsxs("h3", { className: "text-xl font-bold text-white", children: [dayInfo ? `${dayInfo.name} Timeline` : "Timeline", " (IST)"] }) }), _jsx("div", { className: "p-4 sm:p-6", children: _jsxs("div", { className: "flex h-[1200px]", children: [_jsx("div", { className: "w-20 sm:w-24 pr-4 text-xs sm:text-sm font-medium text-right", children: Array.from({ length: 16 }, (_, i) => i + 7).map(hour => (_jsxs("div", { style: { height: `${(60 / totalMinutes) * 100}%` }, className: "relative -top-2 text-[var(--color-text-subtle)]", children: [hour % 12 === 0 ? 12 : hour % 12, ":00 ", hour < 12 || hour >= 24 ? 'AM' : 'PM'] }, hour))) }), _jsxs("div", { className: "relative flex-1 border-l border-[var(--color-border)]", children: [timeIndicatorPosition !== null && (_jsxs("div", { className: "absolute left-0 w-full h-0.5 bg-red-500 z-20 flex items-center", style: { top: `${timeIndicatorPosition}%` }, children: [_jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white -ml-[5px]" }), _jsx("span", { className: "text-xs font-semibold text-red-500 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full ml-2 shadow-sm", children: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: IST_TIMEZONE }) })] })), Array.from({ length: 16 }, (_, i) => i).map(hourIndex => _jsx("div", { className: "h-px bg-[var(--color-border)] absolute w-full", style: { top: `${(hourIndex * 60 / totalMinutes) * 100}%` } }, hourIndex)), timelineLayout.map((session) => {
                                    const top = ((session.start - dayStart) / totalMinutes) * 100;
                                    const height = ((session.end - session.start) / totalMinutes) * 100;
                                    const width = 100 / session.numCols;
                                    const left = session.col * width;
                                    const categoryStyle = getCategoryStyle(session.category);
                                    return (_jsxs("button", { onClick: () => onSessionClick(session), "aria-label": `View details for ${session.session}`, className: `absolute rounded-md p-2 text-left shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:z-10 flex flex-col justify-between overflow-hidden ${categoryStyle.classes}`, style: { top: `${top}%`, height: `calc(${height}% - 2px)`, left: `calc(${left}% + 4px)`, width: `calc(${width}% - 8px)` }, children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm truncate", children: session.session }), _jsxs("p", { className: "text-xs opacity-80", children: [session.startTime, " - ", session.endTime] })] }), _jsxs("div", { className: "text-xs opacity-80 truncate flex items-center gap-1", children: [_jsx(Users, { className: "w-3 h-3 flex-shrink-0" }), session.speaker || 'TBD'] })] }, session.id));
                                })] })] }) })] }));
};
// --- Main Component --- //
const ScrollingBanner = () => {
    // Content for one seamless block
    const BannerContent = () => (_jsxs("span", { className: "flex items-center px-4", children: [_jsx(Camera, { className: "w-5 h-5 mr-4 flex-shrink-0" }), _jsx("span", { children: "Upload all your India Reconnect 2025 pictures" }), _jsx(Camera, { className: "w-5 h-5 ml-4 mr-4 flex-shrink-0" }), _jsx("span", { children: "Upload all your India Reconnect 2025 pictures" })] }));
    return (_jsx("div", { className: "w-full max-w-3xl mx-auto bg-gradient-to-r from-[var(--color-info)] to-pink-500 overflow-hidden whitespace-nowrap my-8 rounded-full shadow-lg border-2 border-white/30 select-none", children: _jsxs("div", { className: "flex animate-scroll-text", children: [_jsx("div", { className: "flex-shrink-0 flex items-center py-3 text-base font-bold text-white uppercase tracking-wider", children: _jsx(BannerContent, {}) }), _jsx("div", { className: "flex-shrink-0 flex items-center py-3 text-base font-bold text-white uppercase tracking-wider", "aria-hidden": "true", children: _jsx(BannerContent, {}) })] }) }));
};
const IndiaAgenda = () => {
    const [storedData, setStoredData] = useState(DEFAULT_STORED_DATA);
    const [activeDay, setActiveDay] = useState(1);
    const [viewMode, setViewMode] = useState('detailed');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [isSessionModalReadOnly, setIsSessionModalReadOnly] = useState(false);
    const [notification, setNotification] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [subscribedSessionIds, setSubscribedSessionIds] = useState(new Set());
    const [favoriteSessionIds, setFavoriteSessionIds] = useState(new Set());
    const [showMyAgendaModal, setShowMyAgendaModal] = useState(false);
    const [showMyFavoritesModal, setShowMyFavoritesModal] = useState(false);
    const [showGeneralInfoModal, setShowGeneralInfoModal] = useState(false);
    const [showVenueMapModal, setShowVenueMapModal] = useState(false);
    const [mapLocation, setMapLocation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategories, setActiveCategories] = useState(new Set());
    const [showSpeakerModal, setShowSpeakerModal] = useState(false);
    const [sessionRatings, setSessionRatings] = useState({});
    const [sessionNotes, setSessionNotes] = useState({});
    const [toastNotification, setToastNotification] = useState(null);
    const [notifiedSessionIds, setNotifiedSessionIds] = useState(new Set());
    const nowSessionRef = useRef(null);
    const notesSaveTimeoutRef = useRef(null);
    // --- Smart App Initialization --- //
    useEffect(() => {
        // Determine current event day and set it as active
        const now = new Date();
        const start = new Date(DEFAULT_STORED_DATA.startDate);
        const day1 = new Date(start);
        day1.setUTCHours(0, 0, 0, 0);
        const day2 = new Date(day1);
        day2.setUTCDate(day1.getUTCDate() + 1);
        const day3 = new Date(day1);
        day3.setUTCDate(day1.getUTCDate() + 2);
        const day4 = new Date(day1);
        day4.setUTCDate(day1.getUTCDate() + 3);
        const day5 = new Date(day1);
        day5.setUTCDate(day1.getUTCDate() + 4);
        // Convert 'now' to IST date string for comparison
        const nowISTStr = now.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE });
        if (nowISTStr === day5.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })) {
            setActiveDay(5);
        }
        else if (nowISTStr === day4.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })) {
            setActiveDay(4);
        }
        else if (nowISTStr === day3.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })) {
            setActiveDay(3);
        }
        else if (nowISTStr === day2.toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE })) {
            setActiveDay(2);
        }
        else if (now >= day1 && now < day2) {
            setActiveDay(1);
        }
        else {
            setActiveDay(1); // Default to Day 1 before or after the event
        }
        // Auto-scroll to current session
        setTimeout(() => {
            nowSessionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500); // Delay to allow rendering
    }, []);
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 15000); // Update every 15 seconds for live announcements
        return () => clearInterval(timer);
    }, []);
    useEffect(() => {
        try {
            const storedSubs = localStorage.getItem('deltekAgendaSubscriptions');
            if (storedSubs)
                setSubscribedSessionIds(new Set(JSON.parse(storedSubs)));
            const storedFavs = localStorage.getItem('deltekAgendaFavorites');
            if (storedFavs)
                setFavoriteSessionIds(new Set(JSON.parse(storedFavs)));
            const storedRatings = localStorage.getItem('deltekAgendaRatings');
            if (storedRatings)
                setSessionRatings(JSON.parse(storedRatings));
            const storedNotes = localStorage.getItem('deltekSessionNotes');
            if (storedNotes)
                setSessionNotes(JSON.parse(storedNotes));
        }
        catch (e) {
            console.error("Failed to load data from localStorage", e);
        }
    }, []);
    useEffect(() => {
        if (isAdmin) {
            try {
                const localDataString = localStorage.getItem('deltekAgendaAdminDraft');
                if (localDataString)
                    setStoredData(JSON.parse(localDataString));
                else {
                    const initialDraft = { ...DEFAULT_STORED_DATA, lastModified: new Date().toISOString() };
                    localStorage.setItem('deltekAgendaAdminDraft', JSON.stringify(initialDraft));
                    setStoredData(initialDraft);
                }
            }
            catch (e) {
                setStoredData(DEFAULT_STORED_DATA);
            }
        }
        else {
            setStoredData(DEFAULT_STORED_DATA);
        }
    }, [isAdmin]);
    const showNotification = (message, type = 'success') => {
        setNotification({ id: Date.now(), message, type });
        setTimeout(() => setNotification(null), 3000);
    };
    const updateAndSaveData = useCallback((data) => {
        if (!isAdmin)
            return;
        setStoredData(prev => {
            const updatedData = { ...prev, ...data, lastModified: new Date().toISOString() };
            try {
                localStorage.setItem('deltekAgendaAdminDraft', JSON.stringify(updatedData));
            }
            catch (e) {
                showNotification('Error: Could not save your draft.', 'error');
            }
            return updatedData;
        });
    }, [isAdmin]);
    const handleToggleSubscription = (sessionId, sessionName) => {
        const newSubscribedIds = new Set(subscribedSessionIds);
        if (newSubscribedIds.has(sessionId)) {
            newSubscribedIds.delete(sessionId);
            showNotification(`Unsubscribed from "${sessionName}"`, 'success');
        }
        else {
            newSubscribedIds.add(sessionId);
            showNotification(`Subscribed to "${sessionName}"`, 'success');
        }
        setSubscribedSessionIds(newSubscribedIds);
        localStorage.setItem('deltekAgendaSubscriptions', JSON.stringify(Array.from(newSubscribedIds)));
    };
    const handleToggleFavorite = (sessionId, sessionName) => {
        setFavoriteSessionIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sessionId)) {
                newSet.delete(sessionId);
                showNotification(`Removed "${sessionName}" from favorites.`);
            }
            else {
                newSet.add(sessionId);
                showNotification(`Added "${sessionName}" to favorites!`);
            }
            try {
                localStorage.setItem('deltekAgendaFavorites', JSON.stringify(Array.from(newSet)));
            }
            catch (e) {
                showNotification('Could not save your favorites.', 'error');
            }
            return newSet;
        });
    };
    const handleRateSession = (sessionId, rating) => {
        setSessionRatings(prev => {
            const newRatings = { ...prev, [sessionId]: rating };
            try {
                localStorage.setItem('deltekAgendaRatings', JSON.stringify(newRatings));
            }
            catch (e) {
                showNotification('Could not save your rating.', 'error');
            }
            return newRatings;
        });
        showNotification('Thank you for your feedback!');
    };
    const handleNoteChange = useCallback((sessionId, note) => {
        setSessionNotes(prev => {
            const newNotes = { ...prev, [sessionId]: note };
            // Debounce saving to localStorage to avoid excessive writes
            if (notesSaveTimeoutRef.current)
                clearTimeout(notesSaveTimeoutRef.current);
            notesSaveTimeoutRef.current = setTimeout(() => {
                try {
                    localStorage.setItem('deltekSessionNotes', JSON.stringify(newNotes));
                }
                catch (e) {
                    console.error("Failed to save notes", e);
                }
            }, 500); // 500ms debounce delay
            return newNotes;
        });
    }, []);
    const handleDateChange = (e) => {
        if (e.target.value) {
            // When setting start date, ensure it's set to midnight in IST.
            updateAndSaveData({ startDate: new Date(`${e.target.value}T00:00:00+05:30`).toISOString() });
            showNotification('Start date updated in your draft.', 'success');
        }
    };
    const handleReset = () => setConfirmation({ message: "Reset Local Draft", description: "Are you sure? All local changes will be lost and you'll revert to the default agenda.", onConfirm: () => {
            const resetData = { ...DEFAULT_STORED_DATA, lastModified: new Date().toISOString() };
            setStoredData(resetData);
            localStorage.setItem('deltekAgendaAdminDraft', JSON.stringify(resetData));
            showNotification('Draft has been reset to the default agenda.');
        } });
    const handleOpenModal = (session, readOnly = false) => {
        setEditingSession(session);
        setIsSessionModalReadOnly(readOnly);
        setShowSessionModal(true);
    };
    const handleSaveSession = (session) => {
        const newAgenda = { ...storedData.agendaData };
        const newDaySessions = [...(newAgenda[activeDay] || [])];
        const sessionIndex = newDaySessions.findIndex(s => s.id === session.id);
        if (sessionIndex > -1)
            newDaySessions[sessionIndex] = session;
        else
            newDaySessions.push(session);
        newDaySessions.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
        newAgenda[activeDay] = newDaySessions;
        updateAndSaveData({ agendaData: newAgenda });
        showNotification(editingSession?.id ? 'Session updated in draft.' : 'New session added to draft.', 'success');
        setShowSessionModal(false);
    };
    const handleDeleteSession = (sessionId) => setConfirmation({ message: "Delete Session", description: "Are you sure you want to delete this session from your draft?", onConfirm: () => {
            const newAgenda = { ...storedData.agendaData };
            newAgenda[activeDay] = (newAgenda[activeDay] || []).filter(s => s.id !== sessionId);
            updateAndSaveData({ agendaData: newAgenda });
            showNotification('Session deleted from draft.');
        } });
    const handleLogin = (password) => {
        if (password === 'deltek2025') {
            setIsAdmin(true);
            setShowPasswordModal(false);
            setLoginError('');
            showNotification('Admin mode enabled.', 'success');
        }
        else {
            setLoginError('Incorrect password. Please try again.');
        }
    };
    const handleShowMap = (locationName) => {
        const locationKey = locationName.toLowerCase().trim();
        if (VENUE_LOCATIONS[locationKey]) {
            setMapLocation(locationName);
            setShowVenueMapModal(true);
        }
    };
    const startDateObj = useMemo(() => new Date(storedData?.startDate || DEFAULT_STORED_DATA.startDate), [storedData]);
    const eventEndDate = useMemo(() => {
        const endDate = new Date(startDateObj);
        endDate.setDate(endDate.getDate() + 5); // Event is 5 days long
        return endDate;
    }, [startDateObj]);
    const summitDaysInfo = useMemo(() => Array.from({ length: 5 }).map((_, i) => {
        const dayDate = new Date(startDateObj);
        // Use setUTCDate to avoid local timezone issues when crossing day boundaries
        dayDate.setUTCDate(new Date(startDateObj).getUTCDate() + i);
        const themes = [
            { theme: 'Arrival', focus: 'Check-in & Welcome' },
            { theme: 'Unite', focus: 'Strategy & Collaboration' },
            { theme: 'Innovate', focus: 'Artificial Intelligence' },
            { theme: 'Excel', focus: 'Demonstration & Adoption' },
            { theme: 'Departure', focus: 'Farewell & Wrap-up' }
        ];
        return {
            day: i + 1,
            name: dayDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: IST_TIMEZONE }),
            date: dayDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: IST_TIMEZONE }),
            shortDate: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: IST_TIMEZONE }),
            theme: themes[i].theme,
            focus: themes[i].focus,
            dateObject: dayDate // Add the date object for reliable calculations
        };
    }), [startDateObj]);
    const hackathonEndDate = useMemo(() => {
        // The hackathon ends at midnight, at the start of Day 4 (September 3rd).
        const day4Info = summitDaysInfo.find(d => d.day === 4);
        if (!day4Info)
            return null;
        const datePart = day4Info.dateObject.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        // Midnight at the start of Day 4.
        const timePart = '00:00:00';
        return new Date(`${datePart}T${timePart}+05:30`);
    }, [summitDaysInfo]);
    const dateRangeString = useMemo(() => {
        if (!summitDaysInfo.length)
            return '';
        const startDt = new Date(summitDaysInfo[0].date);
        const endDt = new Date(summitDaysInfo[summitDaysInfo.length - 1].date);
        return `${startDt.toLocaleDateString('en-US', { month: 'long' })} ${startDt.getDate()}–${endDt.getDate()}, ${startDt.getFullYear()}`;
    }, [summitDaysInfo]);
    const activeDayInfo = useMemo(() => summitDaysInfo.find(d => d.day === activeDay), [activeDay, summitDaysInfo]);
    const activeDayDate = useMemo(() => activeDayInfo?.dateObject || new Date(), [activeDayInfo]);
    const currentDaySessions = storedData.agendaData[activeDay] || [];
    const subscribedSessions = useMemo(() => {
        const allSessionsWithDay = Object.entries(storedData.agendaData).flatMap(([day, sessions]) => sessions.map(session => ({ ...session, day: parseInt(day) })));
        return allSessionsWithDay
            .filter(s => subscribedSessionIds.has(s.id))
            .sort((a, b) => {
            if (a.day !== b.day)
                return a.day - b.day;
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
    }, [subscribedSessionIds, storedData.agendaData]);
    const favoriteSessions = useMemo(() => {
        const allSessionsWithDay = Object.entries(storedData.agendaData).flatMap(([day, sessions]) => sessions.map(session => ({ ...session, day: parseInt(day) })));
        return allSessionsWithDay
            .filter(s => favoriteSessionIds.has(s.id))
            .sort((a, b) => {
            if (a.day !== b.day)
                return a.day - b.day;
            return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
        });
    }, [favoriteSessionIds, storedData.agendaData]);
    const uniqueCategories = useMemo(() => {
        const categories = new Set(currentDaySessions.map(s => s.category));
        return Array.from(categories).sort();
    }, [currentDaySessions]);
    const uniqueSpeakers = useMemo(() => {
        const speakerMap = new Map();
        const processSpeaker = (speaker, session, day) => {
            if (speaker.name && speaker.image) {
                if (!speakerMap.has(speaker.name)) {
                    speakerMap.set(speaker.name, {
                        image: speaker.image,
                        title: speaker.title || '',
                        sessions: []
                    });
                }
                const speakerData = speakerMap.get(speaker.name);
                if (speakerData) {
                    // Avoid adding duplicate session if it has multiple speakers
                    if (!speakerData.sessions.find(s => s.id === session.id)) {
                        speakerData.sessions.push({ ...session, day });
                    }
                    if (speaker.title && !speakerData.title) {
                        speakerData.title = speaker.title;
                    }
                }
            }
        };
        Object.entries(storedData.agendaData).forEach(([dayStr, sessions]) => {
            const day = parseInt(dayStr, 10);
            sessions.forEach(session => {
                if (session.speakers && session.speakers.length > 0) {
                    session.speakers.forEach(sp => {
                        processSpeaker({ name: sp.name, title: sp.title, image: sp.image }, session, day);
                    });
                }
                else if (session.speaker && session.speakerImage) {
                    processSpeaker({ name: session.speaker, title: session.speakerTitle, image: session.speakerImage }, session, day);
                }
            });
        });
        const speakers = [];
        speakerMap.forEach((data, name) => {
            data.sessions.sort((a, b) => {
                if (a.day !== b.day)
                    return a.day - b.day;
                return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
            });
            speakers.push({ name, image: data.image, title: data.title, sessions: data.sessions });
        });
        return speakers.sort((a, b) => {
            const firstSessionA = a.sessions[0];
            const firstSessionB = b.sessions[0];
            if (!firstSessionA || !firstSessionB)
                return 0;
            if (firstSessionA.day !== firstSessionB.day)
                return firstSessionA.day - firstSessionB.day;
            return timeToMinutes(firstSessionA.startTime) - timeToMinutes(firstSessionB.startTime);
        });
    }, [storedData.agendaData]);
    const handleCategoryToggle = (category) => {
        setActiveCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            }
            else {
                newSet.add(category);
            }
            return newSet;
        });
    };
    const handleClearFilters = () => {
        setSearchQuery('');
        setActiveCategories(new Set());
    };
    const filteredSessions = useMemo(() => {
        return currentDaySessions.filter(session => {
            const categoryMatch = activeCategories.size === 0 || activeCategories.has(session.category);
            const searchLower = searchQuery.toLowerCase();
            const searchMatch = searchQuery === '' ||
                session.session.toLowerCase().includes(searchLower) ||
                session.speaker.toLowerCase().includes(searchLower) ||
                session.description.toLowerCase().includes(searchLower) ||
                (session.tags && session.tags.some(tag => tag.toLowerCase().includes(searchLower)));
            return categoryMatch && searchMatch;
        });
    }, [currentDaySessions, searchQuery, activeCategories]);
    // Effect for proactive notifications
    useEffect(() => {
        const notificationCheckInterval = setInterval(() => {
            const now = new Date();
            // Check for sessions starting in the next 10 minutes
            const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
            subscribedSessions.forEach(session => {
                // Skip if already notified
                if (notifiedSessionIds.has(session.id))
                    return;
                const dayInfo = summitDaysInfo.find(d => d.day === session.day);
                if (!dayInfo)
                    return;
                const dayDate = dayInfo.dateObject;
                const startTime = parseSessionTime(session.startTime, dayDate);
                // Check if the session is today, is in the future, and is within the 10-minute window
                if (startTime && startTime > now && startTime <= tenMinutesFromNow) {
                    setToastNotification({
                        id: session.id,
                        message: `Starts in about ${Math.round((startTime.getTime() - now.getTime()) / 60000)} minutes.`,
                        sessionName: session.session
                    });
                    // Add to notified set to prevent re-notifying
                    setNotifiedSessionIds(prev => new Set(prev).add(session.id));
                    // Automatically clear the toast after 8 seconds
                    setTimeout(() => {
                        setToastNotification(prev => (prev?.id === session.id ? null : prev));
                    }, 8000);
                }
            });
        }, 60000); // Check every minute
        return () => clearInterval(notificationCheckInterval);
    }, [subscribedSessions, summitDaysInfo, notifiedSessionIds]);
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-[600px] sm:h-[550px] bg-gradient-to-br from-[#002B45] via-[#005684] to-[#00A9E0] overflow-hidden", style: { clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 100px), 0 100%)' }, children: _jsxs("div", { className: "absolute inset-0 z-0 opacity-10 pointer-events-none", children: [_jsx("svg", { className: "absolute text-white", style: { top: '10%', left: '-5%', width: '200px', transform: 'rotate(-15deg)', opacity: '0.8' }, viewBox: "0 0 20 20", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0 0L20 10L0 20V0Z" }) }), _jsx("svg", { className: "absolute text-white", style: { top: '60%', left: '5%', width: '150px', transform: 'rotate(25deg)', opacity: '0.6' }, viewBox: "0 0 20 20", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0 0L20 10L0 20V0Z" }) }), _jsx("svg", { className: "absolute text-white", style: { top: '5%', right: '-8%', width: '250px', transform: 'rotate(10deg)', opacity: '0.9' }, viewBox: "0 0 20 20", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0 0L20 10L0 20V0Z" }) }), _jsx("svg", { className: "absolute text-white", style: { bottom: '20%', right: '10%', width: '120px', transform: 'rotate(-20deg)', opacity: '0.5' }, viewBox: "0 0 20 20", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0 0L20 10L0 20V0Z" }) }), _jsx("svg", { className: "absolute text-white", style: { bottom: '0%', left: '40%', width: '280px', transform: 'rotate(15deg) scaleX(-1)', opacity: '0.7' }, viewBox: "0 0 20 20", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M0 0L20 10L0 20V0Z" }) })] }) }), _jsxs("div", { className: "relative max-w-7xl mx-auto p-4 sm:p-6 lg:p-8", children: [showSessionModal && _jsx(SessionModal, { session: editingSession, day: activeDay, onClose: () => setShowSessionModal(false), onSave: handleSaveSession, existingSessions: currentDaySessions, dayTheme: summitDaysInfo[activeDay - 1].theme, isReadOnly: isSessionModalReadOnly }), showPublishModal && _jsx(PublishModal, { onClose: () => setShowPublishModal(false), dataToPublish: storedData }), confirmation && _jsx(ConfirmationModal, { confirmation: confirmation, onClose: () => setConfirmation(null) }), showPasswordModal && _jsx(PasswordModal, { onClose: () => setShowPasswordModal(false), onLogin: handleLogin, error: loginError }), notification && _jsxs("div", { className: "fixed bottom-5 right-5 bg-gray-800 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 z-[100] animate-fade-in-up", children: [_jsx(CheckCircle, { className: "w-6 h-6 text-[var(--color-success)]" }), _jsx("span", { children: notification.message })] }), toastNotification && _jsx(ToastNotification, { notification: toastNotification, onDismiss: () => setToastNotification(null) }), showMyAgendaModal && _jsx(MyAgendaModal, { isOpen: showMyAgendaModal, onClose: () => setShowMyAgendaModal(false), subscribedSessions: subscribedSessions, onToggleSubscription: handleToggleSubscription, summitDaysInfo: summitDaysInfo, currentTime: currentTime }), showMyFavoritesModal && _jsx(MyFavoritesModal, { isOpen: showMyFavoritesModal, onClose: () => setShowMyFavoritesModal(false), favoriteSessions: favoriteSessions, onToggleFavorite: handleToggleFavorite, summitDaysInfo: summitDaysInfo }), showGeneralInfoModal && _jsx(GeneralInfoModal, { isOpen: showGeneralInfoModal, onClose: () => setShowGeneralInfoModal(false) }), showVenueMapModal && _jsx(VenueMapModal, { isOpen: showVenueMapModal, onClose: () => setShowVenueMapModal(false), locationName: mapLocation }), showSpeakerModal && _jsx(SpeakerDirectoryModal, { isOpen: showSpeakerModal, onClose: () => setShowSpeakerModal(false), speakers: uniqueSpeakers, summitDaysInfo: summitDaysInfo }), isAdmin && (_jsxs("div", { className: "bg-gray-800/80 text-white p-3 rounded-lg mb-6 shadow-lg flex items-center justify-between flex-wrap gap-4 backdrop-blur-md border border-white/20", children: [_jsx("div", { className: "font-bold flex items-center gap-2", children: "\uD83D\uDE80 Admin Editor" }), _jsxs("div", { className: "flex items-center gap-2 sm:gap-4 flex-wrap", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "startDate", className: "text-sm font-medium mr-2", children: "Start Date:" }), _jsx("input", { type: "date", id: "startDate", value: new Date(storedData.startDate).toLocaleDateString('en-CA', { timeZone: IST_TIMEZONE }), onChange: handleDateChange, className: "bg-gray-700 p-2 rounded-md text-sm border-gray-600" })] }), _jsxs("button", { onClick: () => setShowPublishModal(true), "aria-label": "Publish changes", className: "flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold text-sm bg-green-600 hover:bg-green-700 transition-colors", children: [_jsx(UploadCloud, { className: "w-4 h-4" }), "Publish"] }), _jsxs("button", { onClick: handleReset, "aria-label": "Reset local draft", className: "flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold text-sm bg-gray-600 hover:bg-gray-700 transition-colors", children: [_jsx(RefreshCw, { className: "w-4 h-4" }), " Reset"] }), _jsx("button", { onClick: () => setIsAdmin(false), "aria-label": "Exit admin mode", className: "px-3 py-1.5 rounded-md font-semibold text-sm bg-red-600 hover:bg-red-700 transition-colors", children: "Exit" })] })] })), _jsxs("header", { className: "text-center pt-8 pb-24 text-white", children: [_jsxs("div", { className: "mb-6", children: [_jsxs("h1", { className: "text-5xl sm:text-7xl font-extrabold tracking-tight", style: { textShadow: '2px 2px 5px rgba(0,0,0,0.3)' }, children: ["Deltek", _jsx("sup", { className: "text-lg sm:text-2xl", children: "\u00AE" }), " India Reconnect"] }), _jsx("p", { className: "mt-2 text-2xl sm:text-4xl font-bold text-cyan-200 tracking-wide", children: "Goa, 2025" })] }), _jsx("div", { className: "mb-8", children: _jsx(CountdownClock, { targetDate: startDateObj, eventEndDate: eventEndDate, agendaData: storedData.agendaData, summitDaysInfo: summitDaysInfo }) }), _jsx(ScrollingBanner, {}), _jsx("div", { className: "max-w-xl mx-auto bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg", children: _jsx("p", { className: "text-xl font-semibold tracking-wide text-white", children: "#Unite, #Innovate, #Excel" }) })] }), _jsx("div", { className: "sticky top-4 z-30 max-w-fit mx-auto -mt-20 mb-8", children: _jsxs("div", { className: "flex justify-center items-center flex-wrap gap-1 p-1.5 rounded-full bg-black/25 backdrop-blur-lg border border-white/20 shadow-xl", children: [_jsxs("div", { className: "flex items-center gap-1 bg-black/20 rounded-full p-1", children: [_jsxs("button", { onClick: () => setViewMode('detailed'), "aria-pressed": viewMode === 'detailed', className: `flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 text-sm ${viewMode === 'detailed'
                                                ? 'bg-white text-[var(--color-primary)] shadow'
                                                : 'bg-transparent text-white hover:bg-white/10'}`, children: [_jsx(ListTree, { className: "w-4 h-4" }), " Detailed"] }), _jsxs("button", { onClick: () => setViewMode('timeline'), "aria-pressed": viewMode === 'timeline', className: `flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 text-sm ${viewMode === 'timeline'
                                                ? 'bg-white text-[var(--color-primary)] shadow'
                                                : 'bg-transparent text-white hover:bg-white/10'}`, children: [_jsx(Calendar, { className: "w-4 h-4" }), " Timeline"] }), _jsxs("button", { onClick: () => setViewMode('volunteers'), "aria-pressed": viewMode === 'volunteers', className: `flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold transition-all duration-300 text-sm ${viewMode === 'volunteers'
                                                ? 'bg-white text-[var(--color-primary)] shadow'
                                                : 'bg-transparent text-white hover:bg-white/10'}`, children: [_jsx(Users, { className: "w-4 h-4" }), " Volunteers"] })] }), _jsxs("button", { onClick: () => setShowSpeakerModal(true), "aria-label": "Open speakers directory", className: "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors bg-transparent text-white hover:bg-white/20 text-sm", children: [_jsx(Users, { className: "w-4 h-4" }), "Speakers"] }), _jsxs("button", { onClick: () => setShowGeneralInfoModal(true), "aria-label": "Open general info", className: "flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors bg-transparent text-white hover:bg-white/20 text-sm", children: [_jsx(Info, { className: "w-4 h-4" }), "Info"] })] }) }), viewMode !== 'volunteers' && _jsx(DayNavigation, { activeDay: activeDay, setActiveDay: setActiveDay, summitDaysInfo: summitDaysInfo }), _jsxs("main", { children: [viewMode !== 'volunteers' && _jsx(DayOverview, { activeDay: activeDay, sessions: currentDaySessions, summitDaysInfo: summitDaysInfo }), _jsx(LiveAnnouncements, {}), activeDay === 3 && viewMode !== 'volunteers' && hackathonEndDate && (_jsx(HackathonTimer, { targetDate: hackathonEndDate })), viewMode !== 'volunteers' && (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white/80 backdrop-blur-md rounded-xl shadow-md p-4 my-8 border border-[var(--color-border-subtle)]", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 items-center", children: [_jsxs("div", { className: "md:col-span-1 relative", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" }), _jsx("input", { type: "text", "aria-label": "Search sessions", placeholder: "Search sessions, speakers...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-11 pr-4 py-2.5 border border-[var(--color-border)] rounded-full shadow-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] transition-shadow" })] }), _jsxs("div", { className: "md:col-span-2 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { className: "flex items-center flex-wrap gap-2", children: [_jsx("span", { className: "font-semibold text-sm text-[var(--color-text-secondary)] mr-2", children: "Filter by:" }), uniqueCategories.map(category => {
                                                                    const isActive = activeCategories.has(category);
                                                                    const style = getCategoryStyle(category);
                                                                    return (_jsxs("button", { onClick: () => handleCategoryToggle(category), "aria-pressed": isActive, className: `px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all duration-200 transform hover:scale-105 ${isActive ? `${style.activeClasses} border-transparent shadow-sm` : `bg-white ${style.classes} ${style.border} hover:bg-gray-50`}`, children: [style.icon, " ", category] }, category));
                                                                }), (searchQuery || activeCategories.size > 0) && (_jsxs("button", { onClick: handleClearFilters, "aria-label": "Clear all filters and search query", className: "flex items-center gap-1 text-sm text-[var(--color-danger)] hover:bg-red-50 px-2 py-1.5 rounded-full transition-colors font-medium", children: [_jsx(XCircle, { className: "w-4 h-4" }), " Clear"] }))] }), (searchQuery || activeCategories.size > 0) && (_jsxs("span", { className: "text-sm font-medium text-[var(--color-text-subtle)] pr-2", children: ["Showing ", filteredSessions.length, " session", filteredSessions.length !== 1 ? 's' : ''] }))] })] }) }), isAdmin && (_jsx("div", { className: "flex justify-center mb-8", children: _jsxs("button", { onClick: () => handleOpenModal(null), "aria-label": "Add new session", className: "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white bg-[var(--color-success)] hover:bg-green-600 transition-transform transform hover:scale-105 shadow-lg", children: [_jsx(Plus, { className: "w-5 h-5" }), "Add New Session"] }) }))] })), viewMode === 'volunteers' ? (_jsx(VolunteerView, { volunteers: volunteers })) : filteredSessions.length === 0 && (searchQuery || activeCategories.size > 0) ? (_jsxs("div", { className: "text-center py-16 bg-[var(--color-surface)] rounded-xl shadow-md border border-[var(--color-border-subtle)]", children: [_jsx(Search, { className: "w-12 h-12 mx-auto text-gray-300" }), _jsx("h3", { className: "mt-4 text-lg font-semibold text-[var(--color-text-main)]", children: "No Sessions Found" }), _jsx("p", { className: "mt-1 text-sm text-[var(--color-text-secondary)]", children: "Try adjusting your search or filter criteria." })] })) : viewMode === 'timeline' ? (_jsx(TimelineView, { sessions: filteredSessions, activeDay: activeDay, summitDaysInfo: summitDaysInfo, currentTime: currentTime, activeDayDate: activeDayDate, onSessionClick: (session) => handleOpenModal(session, true) })) : (_jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-md border border-[var(--color-border-subtle)] overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-4 sm:p-6", children: _jsx("h3", { className: "text-xl font-bold text-white", children: activeDayInfo ? `${activeDayInfo.name} Detailed View` : "Detailed View" }) }), _jsx("div", { className: "space-y-6 p-4 sm:p-6", children: filteredSessions.map((session) => {
                                            const startTime = parseSessionTime(session.startTime, activeDayDate);
                                            const endTime = parseSessionTime(session.endTime, activeDayDate);
                                            const isPast = endTime ? endTime < currentTime : false;
                                            const isNow = startTime && endTime ? startTime <= currentTime && currentTime < endTime : false;
                                            const wrapperClasses = `relative transition-all duration-300 ${isPast ? 'opacity-60 saturate-50' : ''} ${isNow ? 'rounded-2xl animate-subtle-pulse' : ''}`;
                                            const sessionRef = isNow ? { ref: nowSessionRef } : {};
                                            return (_jsxs("div", { id: `session-${session.id}`, className: wrapperClasses, ...sessionRef, children: [isNow && (_jsx("div", { className: "absolute -top-2.5 -right-2.5 z-10 bg-[var(--color-secondary)] text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg", children: "Now" })), _jsx(SessionCard, { session: session, isAdmin: isAdmin, onEdit: () => handleOpenModal(session), onDelete: () => handleDeleteSession(session.id), isSubscribed: subscribedSessionIds.has(session.id), onToggleSubscription: () => handleToggleSubscription(session.id, session.session), isFavorite: favoriteSessionIds.has(session.id), onToggleFavorite: () => handleToggleFavorite(session.id, session.session), onShowMap: handleShowMap, showRating: isPast, rating: sessionRatings[session.id] || 0, onRate: (newRating) => handleRateSession(session.id, newRating), note: sessionNotes[session.id] || '', onNoteChange: (note) => handleNoteChange(session.id, note) })] }, session.id));
                                        }) })] }))] }), _jsxs("div", { className: "fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-4", children: [_jsx("a", { href: "https://delteko365-my.sharepoint.com/:f:/g/personal/gauravjetly_deltek_com/En0PxPvnRNZOtOgvX7-1W7QBmrVA8XmDgRNPWLtvHFxGug?e=p3QrK9", target: "_blank", rel: "noopener noreferrer", className: "bg-[var(--color-info)] hover:bg-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center", "aria-label": "Upload event photos", title: "Upload event photos", children: _jsx(Camera, { className: "w-6 h-6" }) }), favoriteSessionIds.size > 0 && (_jsxs("button", { onClick: () => setShowMyFavoritesModal(true), className: "bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative", "aria-label": `View my ${favoriteSessionIds.size} favorite sessions`, children: [_jsx(Star, { className: "w-6 h-6" }), _jsx("span", { className: "absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white", "aria-hidden": "true", children: favoriteSessionIds.size })] })), subscribedSessionIds.size > 0 && (_jsxs("button", { onClick: () => setShowMyAgendaModal(true), className: "bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center relative", "aria-label": `View my ${subscribedSessionIds.size} subscribed sessions`, children: [_jsx(ListChecks, { className: "w-6 h-6" }), _jsx("span", { className: "absolute -top-1 -right-1 bg-[var(--color-danger)] text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white", "aria-hidden": "true", children: subscribedSessionIds.size })] }))] }), _jsxs("footer", { className: "mt-12 text-center text-sm text-[var(--color-text-subtle)]", children: [_jsxs("p", { children: ["\u00A9 ", new Date().getFullYear(), " Deltek, Inc. All rights reserved."] }), !isAdmin && (_jsxs("button", { onClick: () => {
                                    setShowPasswordModal(true);
                                    setLoginError('');
                                }, "aria-label": "Open admin login", className: "mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold text-xs text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-primary)] transition-colors border border-transparent hover:border-[var(--color-border)]", children: [_jsx(Lock, { className: "w-3 h-3" }), "Admin Login"] }))] })] })] }));
};
const DayNavigation = ({ activeDay, setActiveDay, summitDaysInfo }) => (_jsx("div", { className: "mb-8 overflow-hidden", children: _jsx("div", { className: "bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex p-1.5 overflow-x-auto horizontal-scroll", children: summitDaysInfo.map(day => (_jsxs("button", { onClick: () => setActiveDay(day.day), className: `px-4 sm:px-6 py-3 rounded-full font-semibold transition-all text-sm sm:text-base flex-shrink-0 ${activeDay === day.day ? 'bg-[var(--color-primary)] text-[var(--color-text-on-primary)] shadow-md' : 'text-[var(--color-text-secondary)] hover:bg-white/80'}`, children: [_jsx("div", { className: "font-bold", children: day.name }), _jsxs("div", { className: `text-xs mt-1 ${activeDay === day.day ? 'text-blue-200' : 'text-gray-500'}`, children: [day.shortDate, " \u2022 ", day.theme] })] }, day.day))) }) }));
const DayOverview = ({ activeDay, sessions, summitDaysInfo }) => {
    const dayInfo = summitDaysInfo.find(d => d.day === activeDay);
    if (!dayInfo)
        return null;
    return (_jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-md p-6 mb-8 border border-[var(--color-border-subtle)]", children: [_jsxs("h2", { className: "text-2xl font-bold text-[var(--color-text-main)] mb-1", children: [dayInfo.name, ": ", _jsx("span", { className: "text-[var(--color-primary)]", children: dayInfo.theme })] }), _jsxs("p", { className: "text-md text-[var(--color-text-subtle)] mb-4 flex items-center gap-2", children: [_jsx(Calendar, { className: "w-4 h-4" }), " ", dayInfo.date] }), _jsxs("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-green-50 p-4 rounded-lg border border-green-200", children: [_jsx("h3", { className: "font-semibold text-green-800 text-sm mb-1", children: "Total Sessions" }), _jsx("p", { className: "text-3xl font-bold text-green-600", children: sessions.length })] }), _jsxs("div", { className: "bg-purple-50 p-4 rounded-lg border border-purple-200", children: [_jsx("h3", { className: "font-semibold text-purple-800 text-sm mb-1", children: "Duration" }), _jsx("p", { className: "text-3xl font-bold text-purple-600", children: "Full Day" })] }), _jsxs("div", { className: "bg-orange-50 p-4 rounded-lg border border-orange-200 lg:col-span-1 sm:col-span-2", children: [_jsx("h3", { className: "font-semibold text-orange-800 text-sm mb-1", children: "Focus Areas" }), _jsx("p", { className: "text-xl font-bold text-orange-600", children: dayInfo.focus })] })] })] }));
};
export default IndiaAgenda;
