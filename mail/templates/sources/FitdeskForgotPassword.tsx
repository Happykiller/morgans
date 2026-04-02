import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

type SupportedLocale = 'fr' | 'en';

interface FitdeskForgotPasswordProps {
  locale?: string;
}

const colors = {
  red: '#F1011F',
  black: '#080810',
  text: '#080810',
  muted: 'rgba(10,10,20,.48)',
  border: 'rgba(10,10,20,.09)',
  background: '#f4f4f6',
  white: '#ffffff',
};

const email = '{{ email }}';
const resetPasswordUrl = '{{ resetPasswordUrl }}';

const copyByLocale: Record<
  SupportedLocale,
  {
    preview: string;
    badge: string;
    headingPrefix: string;
    headingAccent: string;
    intro: string;
    emailLabel: string;
    actionLabel: string;
    cta: string;
    securityNote: string;
    signatureName: string;
    signatureRole: string;
  }
> = {
  fr: {
    preview: 'Réinitialise ton mot de passe FitDesk.',
    badge: 'Mot de passe oublié',
    headingPrefix: 'RÉINITIALISE',
    headingAccent: 'TON ACCÈS',
    intro:
      "Une demande de réinitialisation de mot de passe a été reçue pour ton compte FitDesk. Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe.",
    emailLabel: 'Compte concerné',
    actionLabel: 'Lien de réinitialisation',
    cta: 'RÉINITIALISER MON MOT DE PASSE',
    securityNote:
      "Si tu n'es pas à l'origine de cette demande, tu peux ignorer cet e-mail en toute sécurité.",
    signatureName: 'Alexandre',
    signatureRole: 'Fondateur · FitDesk',
  },
  en: {
    preview: 'Reset your FitDesk password.',
    badge: 'Forgot password',
    headingPrefix: 'RESET',
    headingAccent: 'YOUR ACCESS',
    intro:
      'A password reset request was received for your FitDesk account. Click the button below to choose a new password.',
    emailLabel: 'Account email',
    actionLabel: 'Reset link',
    cta: 'RESET MY PASSWORD',
    securityNote:
      "If you did not request this reset, you can safely ignore this email.",
    signatureName: 'Alexandre',
    signatureRole: 'Founder · FitDesk',
  },
};

export default function FitdeskForgotPassword({
  locale = 'fr',
}: FitdeskForgotPasswordProps) {
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
                <span style={{ color: colors.red }}>{copy.headingAccent}</span>
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

              <Section
                style={{
                  marginBottom: '16px',
                  border: `1px solid ${colors.border}`,
                  padding: '12px',
                  backgroundColor: 'rgba(10,10,20,.02)',
                }}
              >
                <Text
                  style={{
                    margin: '0 0 4px',
                    color: 'rgba(10,10,20,.35)',
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {copy.emailLabel}
                </Text>
                <Text
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 500,
                  }}
                >
                  {email}
                </Text>
              </Section>

              <Button
                href={resetPasswordUrl}
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
                  marginBottom: '12px',
                }}
              >
                {copy.cta} <span style={{ color: colors.red }}>→</span>
              </Button>

              <Text
                style={{
                  margin: '0 0 14px',
                  color: 'rgba(10,10,20,.35)',
                  fontSize: '11px',
                  lineHeight: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                {copy.actionLabel}
              </Text>
              <Text
                style={{
                  margin: '0 0 16px',
                  color: colors.muted,
                  fontSize: '13px',
                  lineHeight: '21px',
                  wordBreak: 'break-all',
                }}
              >
                {resetPasswordUrl}
              </Text>

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
                {copy.securityNote}
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
                background: 'linear-gradient(90deg, #F1011F 0%, #0D01F4 100%)',
              }}
            />

            <Section
              style={{
                backgroundColor: colors.black,
                padding: '13px 24px',
                textAlign: 'right',
              }}
            >
              <Text
                style={{
                  margin: 0,
                  color: colors.white,
                  fontSize: '14px',
                  lineHeight: '14px',
                  letterSpacing: '0.2em',
                  fontWeight: 700,
                }}
              >
                FITDESK
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
