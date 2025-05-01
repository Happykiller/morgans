// components/GlowCard.tsx
import * as React from 'react';
import { Table } from './Table';

interface GlowCardProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export const GlowCard = ({ children, maxWidth = 600 }: GlowCardProps) => (
  <Table style={{ backgroundColor: '#0F0F2B', padding: '40px 0' }}>
    <tbody>
      <tr>
        <td align="center">
          <Table
            width={maxWidth}
            style={{
              backgroundColor: '#0F0F2B',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `
                0 0 48px rgba(66, 133, 244, 0.35),
                0 0 96px rgba(66, 133, 244, 0.25),
                inset 0 0 24px rgba(255, 255, 255, 0.1),
                inset 0 0 48px rgba(255, 255, 255, 0.06)
              `,
            }}
          >
            <tbody>
              <tr>
                <td style={{ padding: '2rem' }}>{children}</td>
              </tr>
            </tbody>
          </Table>
        </td>
      </tr>
    </tbody>
  </Table>
);
