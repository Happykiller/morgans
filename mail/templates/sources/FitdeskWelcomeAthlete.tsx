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

interface FitdeskWelcomeAthleteProps {
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
    features: string[];
    cta: string;
    outro: string;
    signatureName: string;
    signatureRole: string;
  }
> = {
  fr: {
    preview: `Ton espace athlète est activé, ${firstName}.`,
    badge: 'Ton espace athlète est activé',
    headingPrefix: 'PRÊT À',
    headingAccent: 'PERFORMER',
    intro:
      'Ton espace FitDesk est prêt. Retrouve au même endroit tes programmes personnalisés, le suivi de ta progression, ton rapport bien-être et ton plan nutritionnel pour avancer avec un cadre clair, séance après séance.',
    features: [
      'Programmes perso',
      'Suivi de progression',
      'Rapport bien-être',
      'Plan nutritionnel',
    ],
    cta: 'ACCÉDER À MON ESPACE',
    outro:
      "Si tu as la moindre question, utilise la section Aide / Messages depuis ton espace FitDesk pour nous écrire.",
    signatureName: 'Alexandre',
    signatureRole: 'Fondateur · FitDesk',
  },
  en: {
    preview: `Your athlete space is ready, ${firstName}.`,
    badge: 'Your athlete space is ready',
    headingPrefix: 'READY TO',
    headingAccent: 'PERFORM',
    intro:
      'Your FitDesk space is ready. Find your personalized programs, progress tracking, wellness report, and nutrition plan all in one place to move forward with a clear structure, session after session.',
    features: [
      'Custom programs',
      'Progress tracking',
      'Wellness report',
      'Nutrition plan',
    ],
    cta: 'ACCESS MY SPACE',
    outro:
      'If you need help, use the Help / Messages section from your FitDesk space to contact us.',
    signatureName: 'Alexandre',
    signatureRole: 'Founder · FitDesk',
  },
};

export default function FitdeskWelcomeAthlete({
  locale = 'fr',
}: FitdeskWelcomeAthleteProps) {
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
                <span style={{ textTransform: 'uppercase' }}>{firstName}</span> ?
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

              <Section style={{ marginBottom: '16px' }}>
                {copy.features.map((feature, index) => (
                  <span
                    key={feature}
                    style={{
                      display: 'inline-block',
                      marginRight: index === copy.features.length - 1 ? '0' : '6px',
                      marginBottom: '6px',
                      padding: '4px 11px',
                      border: '1px solid rgba(10,10,20,.12)',
                      backgroundColor: 'rgba(10,10,20,.03)',
                      color: 'rgba(10,10,20,.5)',
                      fontSize: '12px',
                      lineHeight: '18px',
                      borderRadius: '20px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: colors.red,
                        marginRight: '5px',
                        verticalAlign: 'middle',
                      }}
                    />
                    {feature}
                  </span>
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
