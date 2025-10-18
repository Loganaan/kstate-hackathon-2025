// components/Card.tsx
// Reusable card component for displaying content in a contained layout.
// Supports different styles and hover effects for interactive cards.

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  onClick 
}: CardProps) {
  const baseStyles = "bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6";
  const hoverStyles = hover ? "hover:shadow-lg transition-shadow cursor-pointer" : "";
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
