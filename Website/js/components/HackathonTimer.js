import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Code, Clock, AlertTriangle } from 'lucide-react';
const TimerSegment = ({ value, label, urgencyState }) => {
    const textColor = urgencyState === 'urgent' ? 'text-red-400'
        : urgencyState === 'warning' ? 'text-yellow-300'
            : 'text-white';
    const animation = urgencyState === 'urgent' ? 'animate-blink-warning' : '';
    return (_jsxs("div", { className: "flex flex-col items-center", children: [_jsx("span", { className: `text-5xl sm:text-7xl font-extrabold tracking-tighter transition-colors duration-500 ${textColor} ${animation}`, style: { textShadow: '0 0 15px rgba(0,0,0,0.5)' }, children: String(value).padStart(2, '0') }), _jsx("span", { className: "text-sm font-semibold uppercase tracking-widest text-white/80", children: label })] }));
};
const HackathonTimer = ({ targetDate }) => {
    const calculateTimeLeft = () => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();
        if (difference > 0) {
            const totalHours = difference / (1000 * 60 * 60);
            return {
                hours: Math.floor(totalHours),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
                isTimeUp: false,
                urgencyState: totalHours <= 1 ? 'urgent' : totalHours <= 2 ? 'warning' : 'normal',
                isFinalPush: difference <= 300000, // 5 minutes in ms
            };
        }
        return { hours: 0, minutes: 0, seconds: 0, isTimeUp: true, urgencyState: 'normal', isFinalPush: false };
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        // Recalculate immediately if targetDate changes
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);
    // This is a placeholder for the image the user mentioned.
    // I'm using an icon from lucide-react as a substitute.
    const HackathonImagePlaceholder = () => (_jsx("div", { className: "absolute inset-0 z-0 opacity-10", children: _jsx(Code, { className: "w-full h-full text-white/50", strokeWidth: 0.5 }) }));
    // The component should not render if it's way past the end time.
    // Let's hide it if more than an hour has passed.
    if (timeLeft.isTimeUp && (new Date().getTime() - targetDate.getTime() > 3600000)) {
        return null;
    }
    const urgencyGradient = timeLeft.urgencyState === 'urgent' ? 'from-red-700 to-rose-900'
        : timeLeft.urgencyState === 'warning' ? 'from-amber-600 to-yellow-800'
            : 'from-indigo-600 to-blue-800';
    return (_jsxs("div", { className: `relative bg-gradient-to-br ${urgencyGradient} rounded-xl shadow-lg p-6 sm:p-8 my-8 border-2 border-white/20 overflow-hidden transition-all duration-500`, children: [_jsx(HackathonImagePlaceholder, {}), _jsxs("div", { className: "relative z-10 flex flex-col items-center text-center text-white", children: [_jsx("h2", { className: "text-3xl sm:text-4xl font-extrabold tracking-tight", children: "AI Hackathon Countdown" }), _jsx("p", { className: "text-base text-white/80 mt-1 mb-6", children: timeLeft.isTimeUp ? "The coding phase has ended!" : "Time remaining to submit your projects" }), _jsxs("div", { className: "flex justify-around items-center w-full max-w-md", children: [_jsx(TimerSegment, { value: timeLeft.hours, label: "Hours", urgencyState: timeLeft.urgencyState }), _jsx("span", { className: "text-5xl sm:text-6xl font-light opacity-50 -mt-4", children: ":" }), _jsx(TimerSegment, { value: timeLeft.minutes, label: "Minutes", urgencyState: timeLeft.urgencyState }), _jsx("span", { className: "text-5xl sm:text-6xl font-light opacity-50 -mt-4", children: ":" }), _jsx(TimerSegment, { value: timeLeft.seconds, label: "Seconds", urgencyState: timeLeft.urgencyState })] }), _jsx("div", { className: "mt-8 min-h-[96px] flex items-center justify-center w-full", children: timeLeft.isTimeUp ? (_jsxs("div", { className: "text-center bg-green-500/80 text-white font-semibold p-4 rounded-lg shadow-lg max-w-md w-full", children: [_jsx("p", { className: "font-bold text-lg", children: "Time's Up!" }), _jsx("p", { className: "mt-1 text-sm", children: "Hope you've submitted your amazing projects!" })] })) : timeLeft.isFinalPush ? (_jsxs("div", { className: "text-center bg-red-600/50 backdrop-blur-sm text-white font-semibold p-4 rounded-lg border-2 border-yellow-300 shadow-lg max-w-md w-full animate-pulse", children: [_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(AlertTriangle, { className: "w-6 h-6 text-yellow-300" }), _jsx("p", { className: "font-bold text-xl", children: "FINAL 5 MINUTES!" })] }), _jsx("p", { className: "mt-2 text-md font-bold", children: "SUBMIT NOW!" }), _jsx("p", { className: "mt-1 text-sm font-normal", children: "Post your demo video & push your final code to GitHub immediately." })] })) : timeLeft.urgencyState === 'urgent' ? (_jsxs("div", { className: "text-center bg-white/20 backdrop-blur-sm text-white font-semibold p-4 rounded-lg border border-red-300/50 shadow-lg max-w-md w-full", children: [_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-300" }), _jsx("p", { className: "font-bold text-lg", children: "Final Hour!" })] }), _jsx("p", { className: "mt-1 text-sm font-normal", children: "Please post your demo videos and push to GitHub." })] })) : timeLeft.urgencyState === 'warning' ? (_jsxs("div", { className: "text-center bg-white/20 backdrop-blur-sm text-white font-semibold p-4 rounded-lg border border-yellow-300/50 shadow-lg max-w-md w-full", children: [_jsxs("div", { className: "flex items-center justify-center gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-300" }), _jsx("p", { className: "font-bold text-lg", children: "Less Than 2 Hours Left!" })] }), _jsx("p", { className: "mt-1 text-sm font-normal", children: "Start finalizing your projects and prepare for submission." })] })) : (_jsxs("div", { className: "flex items-center justify-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-sm", children: [_jsx(Clock, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Ends tonight at 12:00 AM (Midnight) IST" })] })) })] })] }));
};
export default HackathonTimer;
