import { clsx } from 'clsx'
import { Plus } from 'lucide-react'

export default function FloatingActionButton({
  onClick,
  icon: Icon = Plus,
  className = "",
  label
}) {  
  return (
    <button
      onClick={onClick}
      className={clsx(
        "fixed bottom-6 right-6 z-40",
        "flex items-center justify-center gap-2",
        "bg-primary text-primary-foreground",
        "rounded-full shadow-lg hover:shadow-xl",
        "transition-all hover:scale-105 active:scale-95",
        label ? "px-5 py-3" : "w-14 h-14",
        className
      )}
    >
      <Icon className="w-5 h-5" />
      {label && <span className="font-medium text-sm">{label}</span>}
    </button>
  )
}
