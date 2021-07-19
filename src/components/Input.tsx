import React, { ChangeEvent } from "react"

type ButtonRound = 'top' | 'bottom'

interface InputProps {
  type: string
  placeholder: string
  value?: string
  onChange: (value: string) => void
  round?: ButtonRound
}

export const Input = (props: InputProps) => {
  const onInputChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value)
  }, [props])

  const roundClass = React.useMemo(() => {
    switch(props.round) {
      case 'top': return 'rounded-t-md'
      case 'bottom': return 'rounded-b-md'
      default: return ''
    }
  }, [props.round])

  const className = React.useMemo(() => {
    return `${roundClass} appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`
  }, [roundClass])

  return (
    <input
      type={props.type}
      value={props.value}
      onChange={onInputChange}
      className={className}
      placeholder={props.placeholder}
    />
  )
}
