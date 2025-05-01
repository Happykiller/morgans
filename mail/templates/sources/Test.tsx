// emails/TestEmail.tsx
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';
import { GlowCard } from './components/GlowCard';
import { EmailButton } from './components/EmailButton';
import { FaLock, FaRocket } from 'react-icons/fa';

const TestEmail = () => {
  return (
    <EmailLayout>
      <GlowCard>
        <h1 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '1rem' }}>Test GlowCard</h1>
        <p style={{ color: '#CCCCCC', fontSize: '1rem', marginBottom: '2rem' }}>
          Ceci est un test de rendu visuel pour le composant <code>GlowCard</code> avec des boutons personnalisés.
        </p>

        <EmailButton href="https://vergo.app" variant="primary" icon="🚀" iconPosition="left">
          Lancer Vergo
        </EmailButton>

        <EmailButton href="https://siguri.app" variant="secondary" icon={<FaLock />} iconPosition="left">
          Sauver dans Siguri
        </EmailButton>
      </GlowCard>
    </EmailLayout>
  );
};

export default TestEmail;
