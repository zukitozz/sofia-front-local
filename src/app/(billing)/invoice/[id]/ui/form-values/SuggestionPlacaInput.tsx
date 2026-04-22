import { IReceptorPlaca } from '@/interfaces';
import React from 'react'
interface SuggestionInputProps {
    suggestions: IReceptorPlaca[];
    onSelect: (suggestion: IReceptorPlaca) => void;
}

export const SuggestionPlacaInput = ({ suggestions, onSelect } : SuggestionInputProps) => {
    return (
        <ul>
            {
                suggestions.map((suggestion) => (
                    <li key={`${suggestion.id}-${suggestion.placa}`}>
                        <button 
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer" 
                            onClick={() => onSelect(suggestion)}>
                                {suggestion.placa}
                        </button>
                    </li>
                ))  
            }
        </ul>
    );
}
