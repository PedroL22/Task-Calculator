import type { ComponentProps } from 'react'

export const ResetButton = (props: ComponentProps<'button'>) => {
  return (
    <button
      {...props}
      type='button'
      className='w-fit select-none rounded-2xl bg-red-700 p-6 font-bold text-2xl text-gray-50 transition-all ease-in hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
    >
      Reset
    </button>
  )
}
