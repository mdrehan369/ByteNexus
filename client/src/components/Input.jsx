import React from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
    name,
    register,
    type = 'text',
    label = '',
    labelSize = 'text-2xl',
    className = '',
    ...props
}) {
    return (
        <div className='flex items-center justify-start'>
            <label
                htmlFor={name}
                className={`${labelSize} text-center`}
            >
                {label}
            </label>
            <input
                type={type}
                name={name}
                className={twMerge(`dark:bg-slate-800 bg-slate-200 shadow-md p-2 m-4 rounded-md w-[25vw] h-[6vh] `, className)}
                {...register(name)}
                {...props}
            />
        </div>
    )
}

export default Input