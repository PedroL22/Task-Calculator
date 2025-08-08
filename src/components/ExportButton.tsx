import type { ComponentProps } from 'react'

import { ExportIcon } from '@phosphor-icons/react'

export const ExportButton = (props: ComponentProps<'button'>) => (
  <button
    {...props}
    type='button'
    className='inline-flex h-14 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-sky-600 px-7 font-semibold text-white text-xl shadow-sm transition-all ease-in hover:bg-sky-700 hover:text-gray-300 active:scale-[.97] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-700 dark:hover:bg-sky-800'
  >
    <ExportIcon weight='bold' className='mt-0.5 size-4' />
    Export
  </button>
)
