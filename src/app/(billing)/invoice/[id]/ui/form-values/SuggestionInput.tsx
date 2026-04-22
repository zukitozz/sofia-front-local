import { IReceptor } from '@/interfaces';
import React from 'react'
interface SuggestionInputProps {
    suggestions: IReceptor[];
    onSelect: (suggestion: IReceptor) => void;
}

export const SuggestionInput = ({ suggestions, onSelect } : SuggestionInputProps) => {
    return (
        <ul>
            {
                suggestions.map((suggestion) => (
                    <li 
                        key={suggestion.id}>
                        <button
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                            onClick={() => onSelect(suggestion)}>
                                {suggestion.razon_social}
                        </button>
                    </li>
                ))  
            }
        </ul>
    );
}
