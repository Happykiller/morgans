// emails/WelcomeEmail.tsx
import * as React from 'react';
import { Head, Heading, Text, Img, Section } from '@react-email/components';
import { EmailLayout } from './components/EmailLayout';
import { GlowCard } from './components//GlowCard';
import { EmailButton } from './components/EmailButton';
import { FaLock, FaRocket } from 'react-icons/fa';

export const WelcomeEmail = () => {
  return (
    <EmailLayout>
      <Head>
        <style>
          {`
          @media only screen and (max-width: 600px) {
            .container {
              padding: 1rem !important;
              width: 100% !important;
            }

            .button {
              width: 100% !important;
              font-size: 0.9rem !important;
            }

            .text-center {
              text-align: center !important;
            }
          }
        `}
        </style>
      </Head>

      <GlowCard>
        <Section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Img
            src="{{logoUrl}}"
            alt="Logo Vergo"
            height="64"
            style={{ margin: '0 auto' }}
          />
        </Section>

        <Heading
          as="h1"
          style={{
            fontSize: '1.8rem',
            fontWeight: 700,
            textAlign: 'center',
            color: '#FFFFFF',
            marginBottom: '1.5rem',
          }}
        >
          Bienvenue sur Vergo, {'{{id}}'} !
        </Heading>

        <Text style={{ fontSize: '1rem', lineHeight: 1.6 }}>
          Ton compte est maintenant actif. Tu peux te connecter immédiatement avec les informations suivantes :
        </Text>

        <Text><strong>👤 Identifiant :</strong> {'{{email}}'}</Text>
        <Text><strong>🔑 Mot de passe :</strong> {'{{password}}'}</Text>
        <Text>
          <strong>🌐 Accès au service :</strong>{' '}
          <a href="{{serviceUrl}}" style={{ color: '#8ECAE6', textDecoration: 'underline' }}>{'{{serviceName}}'}</a>
        </Text>

        <Text style={{ marginTop: '1rem' }}>
          <strong>🔐 Astuce sécurité :</strong> Pour éviter d’oublier ces informations, pense à les enregistrer dans ton gestionnaire sécurisé{' '}
          <a href="{{siguriUrl}}" style={{ color: '#8ECAE6', textDecoration: 'underline' }}>Siguri</a>.
        </Text>

        <Section style={{ marginTop: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          <EmailButton href="{{serviceUrl}}" variant="primary" icon={<FaRocket />} iconPosition="left">
            Accéder à mon espace {'{{serviceName}}'}
          </EmailButton>
          <div style={{ height: '16px' }} />
          <EmailButton href="{{siguriUrl}}" variant="secondary" icon={<FaLock />} iconPosition="left">
            Enregistrer dans Siguri
          </EmailButton>
        </Section>

        <Text style={{ fontSize: '1rem' }}>
          À très vite,<br />
          L’équipe {'{{serviceName}}'}
        </Text>

        <Text style={{ fontSize: '0.875rem', color: '#999999', textAlign: 'center', marginTop: '2rem' }}>
          <a href="{{serviceUrl}}/legal" style={{ color: '#666' }}>Mentions légales</a> – <a href="{{serviceUrl}}/unsubscribe" style={{ color: '#666' }}>Se désinscrire</a> – <a href="{{serviceUrl}}/help" style={{ color: '#666' }}>Aide</a>
        </Text>
      </GlowCard>
    </EmailLayout>
  );
};

export default WelcomeEmail;
