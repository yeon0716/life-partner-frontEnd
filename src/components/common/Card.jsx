import { clsx } from 'clsx'

export default function Card({ children, className = "", onClick, hoverable = false }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "bg-card text-card-foreground rounded-xl border shadow-sm",
        hoverable && "cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={clsx("flex flex-col gap-1.5 p-4", className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className = "" }) {
  return (
    <div className={clsx("p-4 pt-0", className)}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={clsx("flex items-center p-4 pt-0", className)}>
      {children}
    </div>
  )
}
