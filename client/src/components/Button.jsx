import React from 'react'
import { twMerge } from "tailwind-merge"

function Button({
    children,
    className='',
    ...props
}) {
  return (
    <div>
        <button
        className={twMerge("dark:bg-[#0f2f52] bg-blue-600 hover:bg-blue-900 text-white py-2 px-4 dark:hover:bg-blue-800 rounded-lg text-lg disabled:opacity-50", className)}
        {...props}
        >
        {children}
        </button>
    </div>
  )
}

export default Button