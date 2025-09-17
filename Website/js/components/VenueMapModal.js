import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { VENUE_LOCATIONS } from '@/constants';
import MainBlockMap from '@/components/MainBlockMap';
import VillaMap from '@/components/VillaMap';
import NovotelMap from '@/components/NovotelMap';
const VenueMapModal = ({ isOpen, onClose, locationName }) => {
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
    if (!isOpen || !locationName)
        return null;
    const locationKey = locationName.toLowerCase().trim();
    const locationData = VENUE_LOCATIONS[locationKey];
    if (!locationData) {
        onClose();
        return null;
    }
    const { name, mapId, coords, description } = locationData;
    const getMapComponent = (id) => {
        switch (id) {
            case 'mainBlock':
                return MainBlockMap;
            case 'villas':
                return VillaMap;
            case 'novotelResort':
                return NovotelMap;
            default:
                return null;
        }
    };
    const MapComponent = getMapComponent(mapId);
    if (!MapComponent) {
        onClose();
        return null;
    }
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[110] p-4", onClick: onClose, role: "dialog", "aria-modal": "true", "aria-labelledby": "venue-map-title", children: _jsxs("div", { className: "bg-[var(--color-surface)] rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all animate-fade-in-up", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex justify-between items-start px-6 py-4 border-b border-[var(--color-border-subtle)] flex-shrink-0", children: [_jsxs("div", { children: [_jsx("h2", { id: "venue-map-title", className: "text-xl font-bold text-[var(--color-text-main)]", children: name }), _jsx("p", { className: "text-sm text-[var(--color-text-secondary)]", children: description })] }), _jsx("button", { type: "button", onClick: onClose, "aria-label": "Close venue map", className: "p-2 -m-2 rounded-full hover:bg-gray-100 transition-colors", children: _jsx(X, { className: "w-6 h-6 text-gray-500" }) })] }), _jsx("div", { className: "p-4 flex-1 overflow-auto", children: _jsx("div", { className: "relative w-full h-full min-h-[400px] sm:min-h-[500px]", children: _jsx(MapComponent, { highlightCoords: coords }) }) })] }) }));
};
export default VenueMapModal;
