import React, { useEffect, useRef, useState } from "react";

interface SearchBoxProps {
    search: string;
    setSearch: (value: string) => void;
    placeholder?: string;
    className?: string;
    debounceMs?: number;
}

const SearchBox: React.FC<SearchBoxProps> = ({ search, setSearch, placeholder = "Search...", className, debounceMs = 300 }) => {
    const [localValue, setLocalValue] = useState(search);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update local value when parent state changes (for external resets)
    useEffect(() => {
        setLocalValue(search);
    }, [search]);

    // Debounce effect
    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setSearch(localValue);
        }, debounceMs);

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [localValue]);

    return (
        <input
            type="text"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            placeholder={placeholder}
            className={`border border-gray-300 rounded px-3 py-2 w-full md:w-64 bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:border-brand-500 transition-all ${
                className || ""
            }`}
        />
    );
};

export default SearchBox;
