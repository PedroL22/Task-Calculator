import type { ComponentProps } from 'react'

export const ResetButton = (props: ComponentProps<'button'>) => (
  <button
    {...props}
    type='button'
    className='inline-flex h-14 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-red-600 px-7 font-semibold text-white text-xl shadow-sm transition-all ease-in hover:bg-red-700 hover:text-gray-300 active:scale-[.97] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-700 dark:hover:bg-red-800'
  >
    Reset
  </button>
)
