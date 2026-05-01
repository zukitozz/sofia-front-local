import { titleFont } from '@/config/fonts';
import React from 'react'
interface Props {
    title: string;
    subtitle?: string;
    className?: string;
}
export const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className={ `${titleFont.className} antialiased text-4xl font-semibold my-6` }>
        {title}
      </h1>

      {
        subtitle && (
          <div className="inline-flex items-center bg-slate-800 rounded-lg px-3 py-3 shadow-lg border-l-4 border-blue-500 mb-3 text-lg w-full">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>  
              <span className="font-medium text-sm text-white font-mono uppercase tracking-wide">
                {subtitle}
              </span>  
          </div>
        )
    }
    </div>
  )
}
