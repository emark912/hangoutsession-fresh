import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-purple-600 text-white hover:bg-purple-700",
      outline: "border border-gray-300 text-gray-900 hover:bg-gray-50",
      ghost: "text-gray-900 hover:bg-gray-100",
    };

    return (
      <button
        ref={ref}
        className={`px-4 py-2 rounded-lg font-medium transition-colors ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
