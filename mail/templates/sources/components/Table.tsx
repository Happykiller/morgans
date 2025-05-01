// components/Table.tsx
import * as React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
  width?: string | number;
  cellPadding?: number;
  cellSpacing?: number;
  role?: string;
  style?: React.CSSProperties;
}

export const Table = ({
  children,
  width = '100%',
  cellPadding = 0,
  cellSpacing = 0,
  role = 'presentation',
  style = {},
  ...rest
}: TableProps) => (
  <table
    width={width}
    cellPadding={cellPadding}
    cellSpacing={cellSpacing}
    role={role}
    style={style}
    {...rest}
  >
    {children}
  </table>
);
