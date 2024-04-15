import React from 'react'
import Button from './Button'
import { twMerge } from 'tailwind-merge'

function SearchBar({className, ...props}) {
  return (
    <div className='flex items-center justify-center w-full h-[10%]'>
        <input
        type="text"
        className={twMerge(`w-[60%] h-[90%] bg-slate-200 border-2 dark:border-slate-900 border-slate-400 rounded-md p-3 m-4 text-black`, className)}
        placeholder='Search Here...'
        {...props}
        />
        <Button><i className="fa-solid fa-magnifying-glass"></i></Button>
    </div>
  )
}

export default SearchBar