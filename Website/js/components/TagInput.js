import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { X } from 'lucide-react';
export const TagInput = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
            }
            setInputValue('');
        }
        else if (e.key === 'Backspace' && !inputValue) {
            removeTag(tags.length - 1);
        }
    };
    const removeTag = (indexToRemove) => {
        onChange(tags.filter((_, index) => index !== indexToRemove));
    };
    return (_jsxs("div", { className: "flex flex-wrap gap-2 items-center w-full p-2 border rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500", children: [tags.map((tag, index) => (_jsxs("span", { className: "flex items-center gap-1 bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded", children: [tag, _jsx("button", { type: "button", className: "ml-1 rounded-full hover:bg-blue-200", onClick: () => removeTag(index), children: _jsx(X, { className: "w-3 h-3" }) })] }, index))), _jsx("input", { type: "text", value: inputValue, onChange: handleInputChange, onKeyDown: handleInputKeyDown, className: "flex-1 bg-transparent outline-none p-1 text-sm", placeholder: "Add a tag..." })] }));
};
