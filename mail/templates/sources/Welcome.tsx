import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Img,
  Section,
} from '@react-email/components';
import * as React from 'react';

export const WelcomeEmail = () => {
  return (
    <Html>
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
      <Body
        style={{
          background: '#0F0F2B',
          color: '#F1F1F1',
          fontFamily: 'Montserrat, sans-serif',
          margin: 0,
          padding: '3rem 1rem',
        }}
      >
        <Container
          className="container"
          style={{
            width: '100%',
            maxWidth: '600px',
            backgroundColor: '#0F0F2B',
            borderRadius: '16px',
            padding: '2rem',
            margin: '0 auto',
            boxShadow: `
            0 0 32px rgba(66, 133, 244, 0.25),
            0 0 72px rgba(66, 133, 244, 0.12),
            inset 0 0 12px rgba(255, 255, 255, 0.08),
            inset 0 0 24px rgba(255, 255, 255, 0.06)
          `,
            boxSizing: 'border-box',
          }}
        >
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
            <div style={{ marginBottom: '1rem' }}>
              <Button
                className="button"
                href="{{serviceUrl}}"
                style={{
                  backgroundColor: '#4169E1',
                  color: '#FFFFFF',
                  padding: '1rem 0',
                  width: '100%',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  border: 'none',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.5px',
                  display: 'block',
                }}
              >
                Accéder à mon espace {'{{serviceName}}'}
              </Button>
            </div>
            <div>
              <Button
                className="button"
                href="{{siguriUrl}}"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #598AE3',
                  color: '#F1F1F1',
                  padding: '1rem 0',
                  width: '100%',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  fontFamily: 'Montserrat, sans-serif',
                  letterSpacing: '0.5px',
                  display: 'block',
                  marginTop: '1rem',
                }}
              >
                Enregistrer dans Siguri
              </Button>
            </div>
          </Section>

          <Text style={{ fontSize: '1rem' }}>
            À très vite,<br />
            L’équipe {'{{serviceName}}'}
          </Text>

          <Text style={{ fontSize: '0.875rem', color: '#999999', textAlign: 'center', marginTop: '2rem' }}>
            <a href="{{serviceUrl}}/legal" style={{ color: '#666' }}>Mentions légales</a> – <a href="{{serviceUrl}}/unsubscribe" style={{ color: '#666' }}>Se désinscrire</a> – <a href="{{serviceUrl}}/help" style={{ color: '#666' }}>Aide</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
