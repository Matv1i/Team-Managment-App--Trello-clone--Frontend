import React from "react"
import ReactDOM from "react-dom"
import Header from "../Header"
import { X } from "lucide-react"

type Props = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  name: string
}

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-200 bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-4 shadow0lg dark:bg-dark-secondary">
        <div className="flex w-full justify-between">
          <Header name={name} isSmallText />
          <button
            className="flex justify-center h-7 w-7 items-center rounded-full bg-blue-primary text-white hover:bg-blue-700"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  )
}

export default Modal
