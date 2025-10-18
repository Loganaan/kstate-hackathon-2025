// components/Button.tsx
// Reusable button component with various styles and states.
// Provides consistent button styling and interaction patterns.

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantStyles = {
    primary: "bg-[rgba(76,166,38,1)] text-white hover:bg-[rgba(76,166,38,0.9)] hover:shadow-lg hover:scale-105",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-md dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg dark:bg-red-500 dark:hover:bg-red-600"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}