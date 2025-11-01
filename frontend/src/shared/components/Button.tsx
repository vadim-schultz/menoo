import type { ComponentChildren } from 'preact';
import type { LucideIcon } from 'lucide-preact';

interface ButtonProps {
  children?: ComponentChildren;
  onClick?: (e: Event) => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
}: ButtonProps) {
  // Build Pico CSS classes
  const classes: string[] = [];
  
  // Pico CSS uses default button for primary, secondary for secondary
  if (variant === 'secondary') {
    classes.push('secondary');
  } else if (variant === 'danger') {
    // Pico doesn't have built-in danger, we'll use outline with custom styling
    classes.push('outline');
  }
  
  if (className) {
    classes.push(className);
  }

  const classString = classes.length > 0 ? classes.join(' ') : undefined;
  
  // Handle icon rendering
  const hasIcon = Icon !== undefined;
  const hasChildren = children !== undefined && children !== null && children !== '';
  const isIconOnly = hasIcon && !hasChildren;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classString}
      style={variant === 'danger' ? { color: 'var(--pico-del-color, #c62828)' } : undefined}
      aria-label={isIconOnly ? (children as string) || undefined : undefined}
    >
      {hasIcon && iconPosition === 'left' && <Icon size={16} style={{ marginRight: hasChildren ? '0.5rem' : '0' }} />}
      {hasChildren && children}
      {hasIcon && iconPosition === 'right' && <Icon size={16} style={{ marginLeft: hasChildren ? '0.5rem' : '0' }} />}
    </button>
  );
}
