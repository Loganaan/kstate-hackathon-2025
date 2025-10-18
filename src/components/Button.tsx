// components/Button.tsx
// Reusable button component with various styles and states.
// Provides consistent button styling and interaction patterns.

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export default function Button({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  // Button implementation will be added here
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}