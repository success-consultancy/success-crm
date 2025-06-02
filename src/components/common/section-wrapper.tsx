import { cn } from "@/lib/cn"
import { ReactNode } from "react"

type Props = {
  className?: string
  title: string
  children: ReactNode
}

const SectionWrapper = ({ className, title, children }: Props) => {
  return (
    <div className={cn(["rounded-lg border", className])}>
      <div className="py-3 px-6 border-b text-base font-bold">
        {title}
      </div>
      <div className="py-5 px-6">
        {children}
      </div>
    </div>
  )
}

export default SectionWrapper  
