import type { ComponentProps } from 'react'

type TaskInputProps = ComponentProps<'input'> & {
  title?: string
}

export const TaskInput = ({ title }: TaskInputProps) => {
  return <input />
}
