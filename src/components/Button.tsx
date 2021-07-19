import React from "react"

type ButtonType = 'primary' | 'secondary'

interface ButtonProps {
  text: string
  onClick: () => void
  type: ButtonType
}

export const Button = (props: ButtonProps) => {
  const className = React.useMemo(() => {
    switch (props.type) {
      case 'primary': return 'w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-900 hover:bg-indigo-800 outline-none'
      case 'secondary': return 'w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-indigo-900 bg-transparent hover:bg-gray-300 outline-none'
      default: return ''
    }
  }, [props.type])

  return (
    <button
      onClick={props.onClick}
      className={className}
    >
      {props.text}
    </button>
  )
}
