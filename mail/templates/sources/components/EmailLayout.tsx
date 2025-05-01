import * as React from 'react';
import { Html, Head, Body } from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  bgColor?: string;
  fontColor?: string;
}

export const EmailLayout = ({
  children,
  bgColor = '#0F0F2B',
  fontColor = '#F1F1F1',
}: EmailLayoutProps) => (
  <Html>
    <Head />
    <Body
      style={{
        backgroundColor: bgColor,
        color: fontColor,
        fontFamily: 'Montserrat, sans-serif',
        margin: 0,
        padding: 0,
      }}
    >
      {children}
    </Body>
  </Html>
);