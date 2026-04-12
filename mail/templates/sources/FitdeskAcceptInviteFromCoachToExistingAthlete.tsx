import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import copyEn from './FitdeskAcceptInviteFromCoachToExistingAthlete.en.json';
import copyFr from './FitdeskAcceptInviteFromCoachToExistingAthlete.fr.json';

type SupportedLocale = 'fr' | 'en';

interface FitdeskAcceptInviteFromCoachToExistingAthleteProps {
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
const athleteName = '{{ athleteName }}';
const contractEffectiveDate = '{{ contractEffectiveDate }}';

interface AcceptCopy {
  preview: string;
  badge: string;
  headingPrefix: string;
  headingAccent: string;
  intro: string;
  summaryLabel: string;
  athleteLabel: string;
  statusLabel: string;
  contractLabel: string;
  effectiveDateLabel: string;
  statusValue: string;
  contractValue: string;
  note: string;
  signatureName: string;
  signatureRole: string;
}

const copyByLocale: Record<SupportedLocale, AcceptCopy> = {
  fr: copyFr,
  en: copyEn,
};

export default function FitdeskAcceptInviteFromCoachToExistingAthlete({
  locale = 'fr',
}: FitdeskAcceptInviteFromCoachToExistingAthleteProps) {
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
                    margin: '0 0 8px',
                    color: colors.red,
                    fontSize: '11px',
                    lineHeight: '16px',
                    fontWeight: 600,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                  }}
                >
                  {copy.summaryLabel}
                </Text>

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
                  {copy.athleteLabel}
                </Text>
                <Text
                  style={{
                    margin: '0 0 12px',
                    color: colors.text,
                    fontSize: '14px',
                    lineHeight: '22px',
                    fontWeight: 500,
                  }}
                >
                  {athleteName}
                </Text>

                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td valign="top" style={{ width: '50%', paddingRight: '8px' }}>
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
                          {copy.statusLabel}
                        </Text>
                        <Text
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: '13px',
                            lineHeight: '21px',
                          }}
                        >
                          {copy.statusValue}
                        </Text>
                      </td>
                      <td valign="top" style={{ width: '50%', paddingLeft: '8px' }}>
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
                          {copy.contractLabel}
                        </Text>
                        <Text
                          style={{
                            margin: 0,
                            color: colors.text,
                            fontSize: '13px',
                            lineHeight: '21px',
                          }}
                        >
                          {copy.contractValue}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid rgba(10,10,20,.07)',
                    margin: '12px 0',
                  }}
                />

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
                  {copy.effectiveDateLabel}
                </Text>
                <Text
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '13px',
                    lineHeight: '21px',
                  }}
                >
                  {contractEffectiveDate}
                </Text>
              </Section>

              <Section
                style={{
                  borderLeft: `2px solid ${colors.red}`,
                  padding: '12px 14px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '16px',
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    color: colors.text,
                    fontSize: '13px',
                    lineHeight: '21px',
                    fontWeight: 300,
                  }}
                >
                  {copy.note}
                </Text>
              </Section>

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
