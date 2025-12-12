import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Overlay / wrapper
const modalOverlayVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
)

// Modal content variants
const modalContentVariants = cva(
  "bg-white rounded-lg shadow-lg overflow-hidden w-full",
  {
    variants: {
      size: {
        default: "max-w-lg w-full",
        sm: "max-w-sm w-full",
        lg: "max-w-3xl w-full",
      },
      variant: {
        default: "bg-white text-black",
        destructive: "bg-red-50 text-red-900",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

// Props for Modal overlay
type ModalProps = React.PropsWithChildren<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>

// Props for Modal content
type ModalContentProps = React.PropsWithChildren<
  VariantProps<typeof modalContentVariants> & {
    onClick?: React.MouseEventHandler<HTMLDivElement>
    className?: string
  }
>

// --------------------
// Modal Overlay
// --------------------
function Modal({ open, onOpenChange, children }: ModalProps) {
  if (!open) return null

  return (
    <div
      className={cn(modalOverlayVariants())}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  )
}

// --------------------
// Modal Content
// --------------------
const ModalContent = ({
  children,
  size,
  variant,
  className,
  onClick
}: ModalContentProps) => {
  return (
    <div
      className={cn(modalContentVariants({ size, variant }), className)}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
    >
      {children}
    </div>
  )
}

// --------------------
// Modal Sections
// --------------------
function ModalHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-6 py-4 border-b font-semibold text-lg", className)} {...props} />
  )
}

function ModalBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("px-6 py-4", className)} {...props} />
}

function ModalFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("px-6 py-4 border-t flex justify-end gap-2", className)} {...props} />
  )
}

export { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter }
