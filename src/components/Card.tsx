export const Card = ({ children }: {children?: React.ReactNode}) => {
  return (
    <div className="max-w-md py-4 px-8 bg-white text-black shadow-lg rounded-lg my-20">
      {children}
    </div>
  )
}
