import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { clsx } from 'clsx'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((toast) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { ...toast, id }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const styles = {
  success: "bg-primary text-primary-foreground",
  error: "bg-destructive text-destructive-foreground",
  info: "bg-secondary text-secondary-foreground"
}

function ToastItem({ toast, onClose }) {
  const Icon = icons[toast.type] || Info

  return (
    <div
      className={clsx(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg min-w-[280px] animate-in slide-in-from-right-full",
        styles[toast.type] || styles.info
      )}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <p className="text-sm flex-1">{toast.message}</p>
      <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
