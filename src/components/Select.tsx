import React, { ChangeEvent } from "react"

type ButtonRound = 'top' | 'bottom'

type SelectOption = {
  label: string
  value: string
}

interface InputProps {
  placeholder: string
  value?: any
  onChange: (value: string) => void
  round?: ButtonRound
  options: SelectOption[]
}

export const Select = (props: InputProps) => {
  const onInputChange = React.useCallback((event: ChangeEvent<HTMLSelectElement>) => {
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
    return `${roundClass} appearance-none rounded-none bg-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`
  }, [roundClass])

  return (
    <select
      value={props.value}
      onChange={onInputChange}
      className={className}
      placeholder={props.placeholder}
    >
      {props.options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
