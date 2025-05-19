import type { ComponentProps } from 'react'

export const ExportButton = (props: ComponentProps<'button'>) => {
  return (
    <button
      {...props}
      type='button'
      className='w-fit cursor-pointer select-none rounded-2xl bg-sky-700 p-6 font-bold text-2xl text-gray-50 transition-all ease-in hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60'
    >
      Export tasks
    </button>
  )
}
