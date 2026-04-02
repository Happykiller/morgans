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
              backgroundColor: '#101030', // Un fond légèrement plus clair
              border: '2px solid #598AE3', // Fallback Gmail : visible et contrasté
              boxShadow: `
                0 0 24px #598AE3,
                0 0 64px #1E90FF
              `, // Effet glow pour clients compatibles
              borderRadius: '0', // Gmail ignore border-radius, autant l'uniformiser
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
