import React from 'react'
import { twMerge } from 'tailwind-merge'

function Container({
  children,
  className='',
  height='88vh'
}) {
  return (
    <div className={twMerge(`w-full h-[${height}] `, className)}>
        {children}
    </div>
  )
}

export default Container