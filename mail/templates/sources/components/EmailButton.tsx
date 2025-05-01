// components/EmailButton.tsx
import { Button } from '@react-email/components';
import * as React from 'react';

type Variant = 'primary' | 'secondary';

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const EmailButton = ({
  href,
  children,
  variant = 'primary',
  fullWidth = true,
  size = 'md',
  icon,
  iconPosition = 'left',
}: EmailButtonProps) => {
  const sizeStyles = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
    },
    md: {
      padding: '1rem 0',
      fontSize: '1rem',
    },
    lg: {
      padding: '1.25rem 0',
      fontSize: '1.125rem',
    },
  }[size];

  const baseStyle = {
    width: fullWidth ? '100%' : 'auto',
    borderRadius: '12px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    fontFamily: 'Montserrat, sans-serif',
    letterSpacing: '0.5px',
    display: 'inline-block',
    textAlign: 'center' as const,
    ...sizeStyles,
  };

  const variantStyles = {
    primary: {
      backgroundColor: '#4169E1',
      color: '#FFFFFF',
      border: 'none',
    },
    secondary: {
      backgroundColor: 'transparent',
      color: '#F1F1F1',
      border: '1px solid #598AE3',
    },
  }[variant];

  return (
    <Button href={href} style={{ ...baseStyle, ...variantStyles }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        {icon && iconPosition === 'left' && icon}
        {children}
        {icon && iconPosition === 'right' && icon}
      </span>
    </Button>
  );
};
