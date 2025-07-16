import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordToggle?: boolean
  containerClassName?: string
}

function Input({ className, containerClassName, type, showPasswordToggle = false, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  
  const inputType = showPassword ? "text" : type

  const isColor = type === "color";
  
  return (
    <div className={cn("relative w-full", containerClassName)}>
      <input
        type={showPasswordToggle ? inputType : type}
        data-slot="input"
        className={cn(
          "border-input file:text-foreground py-5 placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3  text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isColor && "py-0",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          showPasswordToggle && "pr-10",
          className
        )}
        {...props}
      />
      {showPasswordToggle && type === "password" && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      )}
    </div>
  )
}

export { Input }