import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type SupportedLocale = 'fr' | 'en';

interface FitdeskWelcomeCoachProps {
  locale?: string;
}

const colors = {
  red: '#F1011F',
  blue: '#0D01F4',
  black: '#080810',
  text: '#080810',
  muted: 'rgba(10,10,20,.48)',
  border: 'rgba(10,10,20,.09)',
  background: '#f4f4f6',
  white: '#ffffff',
};

const firstName = '{{ firstName }}';

const copyByLocale: Record<
  SupportedLocale,
  {
    preview: string;
    badge: string;
    headingPrefix: string;
    headingAccent: string;
    intro: string;
    stepsLabel: string;
    cta: string;
    outro: string;
    signatureName: string;
    signatureRole: string;
    steps: Array<{
      number: string;
      title: string;
      description: string;
    }>;
  }
> = {
  fr: {
    preview: `Bienvenue parmi nous, ${firstName}.`,
    badge: 'Ton espace est prêt',
    headingPrefix: 'BIENVENUE',
    headingAccent: 'PARMI NOUS',
    intro:
      "FitDesk, c'est ton outil du quotidien, pas une appli de plus à apprendre. Voilà l'essentiel pour démarrer.",
    stepsLabel: 'Les premières étapes',
    cta: 'ACCÉDER À MON ESPACE',
    outro:
      "Si tu as la moindre question, utilise la section Aide / Messages depuis ton espace FitDesk pour nous écrire.",
    signatureName: 'Alexandre',
    signatureRole: 'Fondateur · FitDesk',
    steps: [
      {
        number: '1',
        title: 'Crée ton profil coach',
        description:
          'Pose les bases de ton activité en complétant ton profil et les informations de ton entreprise.',
      },
      {
        number: '2',
        title: 'Gère tes prospects',
        description:
          "Crée et suis tes prospects étape par étape jusqu'à leur conversion en athlètes.",
      },
      {
        number: '3',
        title: 'Crée ton premier programme',
        description: 'Construis une séance et assigne-la en deux clics.',
      },
      {
        number: '4',
        title: 'Suis tes athlètes',
        description:
          'Grâce à des rapports détaillés, tu peux suivre leur progression en temps réel.',
      },
    ],
  },
  en: {
    preview: `Welcome aboard, ${firstName}.`,
    badge: 'Your workspace is ready',
    headingPrefix: 'WELCOME',
    headingAccent: 'ABOARD',
    intro:
      "FitDesk is your day-to-day tool, not just another app to learn. Here's what matters to get started.",
    stepsLabel: 'First steps',
    cta: 'ACCESS MY SPACE',
    outro:
      'If you need help, use the Help / Messages section from your FitDesk space to contact us.',
    signatureName: 'Alexandre',
    signatureRole: 'Founder · FitDesk',
    steps: [
      {
        number: '1',
        title: 'Set up your coach profile',
        description:
          'Lay the groundwork for your business by completing your profile and company information.',
      },
      {
        number: '2',
        title: 'Manage your leads',
        description:
          'Create and track your leads step by step until they become athletes.',
      },
      {
        number: '3',
        title: 'Create your first program',
        description: 'Build a session and assign it in just a couple of clicks.',
      },
      {
        number: '4',
        title: 'Track your athletes',
        description:
          'Use detailed reports to monitor their progress in real time.',
      },
    ],
  },
};

export default function FitdeskWelcomeCoach({
  locale = 'fr',
}: FitdeskWelcomeCoachProps) {
  const normalizedLocale = locale.toLowerCase() as SupportedLocale;
  const copy = copyByLocale[normalizedLocale] ?? copyByLocale.fr;

  return (
    <Html>
      <Head />
      <Preview>{copy.preview}</Preview>
      <Body
        style={{
          margin: 0,
          padding: '12px 0 24px',
          backgroundColor: colors.background,
          fontFamily:
            "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <Container style={{ maxWidth: '480px', margin: '0 auto' }}>
          <Section
            style={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
            }}
          >
            <Section
              style={{
                backgroundColor: colors.black,
                padding: '20px 24px',
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: colors.white,
                  fontSize: '18px',
                  lineHeight: '18px',
                  letterSpacing: '0.22em',
                  fontWeight: 700,
                }}
              >
                FITDESK
              </Text>
            </Section>

            <Section style={{ padding: '22px 24px', backgroundColor: colors.white }}>
              <Text
                style={{
                  margin: '0 0 9px',
                  color: colors.red,
                  fontSize: '11px',
                  lineHeight: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                {copy.badge}
              </Text>

              <Text
                style={{
                  margin: '0 0 10px',
                  color: colors.text,
                  fontSize: '38px',
                  lineHeight: '38px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {copy.headingPrefix}
                <br />
                <span style={{ color: colors.red }}>{copy.headingAccent}</span>,{' '}
                <span style={{ textTransform: 'uppercase' }}>{firstName}</span>.
              </Text>

              <Text
                style={{
                  margin: '0 0 16px',
                  color: colors.muted,
                  fontSize: '14px',
                  lineHeight: '23px',
                  fontWeight: 300,
                }}
              >
                {copy.intro}
              </Text>

              <Text
                style={{
                  margin: '0 0 8px',
                  color: 'rgba(10,10,20,.35)',
                  fontSize: '11px',
                  lineHeight: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {copy.stepsLabel}
              </Text>

              <Section
                style={{
                  marginBottom: '16px',
                  border: `1px solid ${colors.border}`,
                }}
              >
                {copy.steps.map((step, index) => (
                  <Section
                    key={step.number}
                    style={{
                      padding: '10px 13px',
                      borderBottom:
                        index === copy.steps.length - 1
                          ? 'none'
                          : '1px solid rgba(10,10,20,.07)',
                    }}
                  >
                    <table
                      role="presentation"
                      width="100%"
                      cellPadding="0"
                      cellSpacing="0"
                      style={{ borderCollapse: 'collapse' }}
                    >
                      <tbody>
                        <tr>
                          <td valign="top" style={{ width: '30px' }}>
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                backgroundColor: 'rgba(241,1,31,.08)',
                                border: '1px solid rgba(241,1,31,.2)',
                                color: colors.red,
                                fontSize: '11px',
                                lineHeight: '20px',
                                textAlign: 'center',
                                fontWeight: 600,
                              }}
                            >
                              {step.number}
                            </div>
                          </td>
                          <td valign="top">
                            <Text
                              style={{
                                margin: '0 0 2px',
                                color: colors.text,
                                fontSize: '14px',
                                lineHeight: '18px',
                                fontWeight: 500,
                              }}
                            >
                              {step.title}
                            </Text>
                            <Text
                              style={{
                                margin: 0,
                                color: colors.muted,
                                fontSize: '13px',
                                lineHeight: '18px',
                              }}
                            >
                              {step.description}
                            </Text>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </Section>
                ))}
              </Section>

              <Button
                href="#"
                style={{
                  display: 'block',
                  boxSizing: 'border-box',
                  width: '100%',
                  backgroundColor: colors.black,
                  color: colors.white,
                  padding: '13px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontSize: '16px',
                  lineHeight: '16px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '16px',
                }}
              >
                {copy.cta} <span style={{ color: colors.red }}>→</span>
              </Button>

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid rgba(10,10,20,.07)',
                  margin: '16px 0',
                }}
              />

              <Text
                style={{
                  margin: '0 0 6px',
                  color: colors.muted,
                  fontSize: '13px',
                  lineHeight: '21px',
                  fontWeight: 300,
                }}
              >
                {copy.outro}
              </Text>

              <Text
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              >
                <strong>{copy.signatureName}</strong>
                <br />
                <span style={{ color: colors.muted }}>{copy.signatureRole}</span>
              </Text>
            </Section>

            <Section
              style={{
                height: '3px',
                background: `linear-gradient(90deg, ${colors.red} 0%, ${colors.blue} 100%)`,
              }}
            />

            <Section
              style={{
                backgroundColor: colors.black,
                padding: '13px 24px',
                textAlign: 'right',
              }}
            >
              <Link
                href="#"
                style={{
                  color: colors.white,
                  textDecoration: 'none',
                  fontSize: '14px',
                  lineHeight: '14px',
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                }}
              >
                FITDESK
              </Link>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
