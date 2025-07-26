import React from 'react'

type Props = {
  title: string
  children: React.ReactNode
}

const TitleBox = ({ title, children }: Props) => {
  return (
    <div className="border border-[#EBEBEB] rounded-lg shadow-sm">
      <div className="border-b border-[#EBEBEB] px-6 py-3">
        <p className="text-xl font-bold">{title}</p>
      </div>

      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

export default TitleBox
