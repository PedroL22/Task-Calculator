import { useState } from 'react'
import { cn } from '~/lib/utils'

type ToggleProps = {
  id?: string
  value?: boolean
  onToggle?: (isOn: boolean) => void
}

export const Toggle = ({ id, value, onToggle }: ToggleProps) => {
  const [isOn, setIsOn] = useState(value || false)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    if (onToggle) {
      onToggle(newState)
    }
  }

  return (
    <label className='flex cursor-pointer items-center'>
      <div className='relative'>
        <input id={id} type='checkbox' className='sr-only' checked={isOn} onChange={handleToggle} />

        <div
          className={cn(
            'block h-8 w-14 rounded-full transition-colors duration-300 ease-in-out',
            isOn ? 'bg-gray-600' : 'bg-gray-300'
          )}
        />
        <div
          className={cn(
            'absolute top-1 left-1 h-6 w-6 rounded-full bg-white transition-transform duration-300 ease-in-out',
            isOn && 'translate-x-6 transform'
          )}
        />
      </div>
    </label>
  )
}
