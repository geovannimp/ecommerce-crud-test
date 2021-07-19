interface RoundButtonProps {
  onClick: () => void
  title: string
  subtitle?: string
}

export const RoundButton = (props: RoundButtonProps) => {
  return (
    <div
      onClick={props.onClick}
      className="flex items-center justify-between w-full lg:rounded-full md:rounded-full hover:bg-gray-100 hover:text-gray-800 cursor-pointer border-2 rounded-lg py-4 px-8 my-4"
    >
      <div className="flex flex-col">
        <div className="text-sm leading-3 font-bold w-full">{props.title}</div>
        {(props.subtitle) && (
          <div className="text-xs w-full">{props.subtitle}</div>
        )}
      </div>
    </div>
  )
}
