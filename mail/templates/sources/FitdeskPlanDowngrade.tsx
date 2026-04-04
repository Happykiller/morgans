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

interface FitdeskPlanDowngradeProps {
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
const previousPlan = '{{ previousPlan|upper }}';
const newPlan = '{{ newPlan|upper }}';
const previousClientLimit = '{{ previousClientLimit }}';
const newClientLimit = '{{ newClientLimit }}';
const ctaUrl = '{{ ctaUrl }}';

export default function FitdeskPlanDowngrade({
  locale = 'fr',
}: FitdeskPlanDowngradeProps) {
  void locale;

  return (
    <Html>
      <Head />
      <Preview>Ta nouvelle formule est active.</Preview>
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
                  color: colors.muted,
                  fontSize: '11px',
                  lineHeight: '16px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                Changement de formule
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
                Ta nouvelle formule est
                <br />
                <span style={{ color: colors.red }}>active, {firstName}.</span>
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
                Ton changement est pris en compte. Toutes tes fonctionnalites
                restent disponibles, seul le nombre de clients actifs change.
              </Text>

              <Section
                style={{
                  backgroundColor: colors.black,
                  borderRadius: '8px',
                  padding: '16px 18px',
                  marginBottom: '16px',
                }}
              >
                <Section style={{ marginBottom: '12px' }}>
                  <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                    <tbody>
                      <tr>
                        <td width="42%" align="center" style={{ verticalAlign: 'top' }}>
                          <Text
                            style={{
                              margin: '0 0 4px',
                              color: 'rgba(255,255,255,.3)',
                              fontSize: '10px',
                              lineHeight: '14px',
                              fontWeight: 600,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Ancienne formule
                          </Text>
                          <Text
                            style={{
                              margin: 0,
                              color: 'rgba(255,255,255,.3)',
                              fontSize: '18px',
                              lineHeight: '20px',
                              fontWeight: 700,
                              textDecoration: 'line-through',
                            }}
                          >
                            {previousPlan}
                          </Text>
                        </td>

                        <td width="16%" align="center" style={{ verticalAlign: 'middle' }}>
                          <Text
                            style={{
                              margin: 0,
                              color: 'rgba(255,255,255,.3)',
                              fontSize: '16px',
                              lineHeight: '16px',
                            }}
                          >
                            →
                          </Text>
                        </td>

                        <td width="42%" align="center" style={{ verticalAlign: 'top' }}>
                          <Text
                            style={{
                              margin: '0 0 4px',
                              color: 'rgba(255,255,255,.3)',
                              fontSize: '10px',
                              lineHeight: '14px',
                              fontWeight: 600,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Nouvelle formule
                          </Text>
                          <Text
                            style={{
                              margin: 0,
                              color: colors.white,
                              fontSize: '21px',
                              lineHeight: '22px',
                              fontWeight: 700,
                            }}
                          >
                            {newPlan}
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Section>

                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid rgba(255,255,255,.08)',
                    margin: '0 0 12px',
                  }}
                />

                <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>
                        <Text
                          style={{
                            margin: 0,
                            color: 'rgba(255,255,255,.3)',
                            fontSize: '11px',
                            lineHeight: '16px',
                            fontWeight: 600,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Clients autorises
                        </Text>
                      </td>
                      <td align="right">
                        <Text
                          style={{
                            margin: 0,
                            color: colors.white,
                            fontSize: '18px',
                            lineHeight: '20px',
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              color: 'rgba(255,255,255,.35)',
                              textDecoration: 'line-through',
                              marginRight: '8px',
                            }}
                          >
                            {previousClientLimit}
                          </span>
                          <span>{newClientLimit}</span>
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>

              <Section
                style={{
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  marginBottom: '16px',
                  backgroundColor: '#FAFAFA',
                }}
              >
                <Text
                  style={{
                    margin: '0 0 2px',
                    color: colors.text,
                    fontSize: '13px',
                    lineHeight: '20px',
                    fontWeight: 600,
                  }}
                >
                  Si tu depasses la limite de clients actifs
                </Text>
                <Text
                  style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: '12px',
                    lineHeight: '19px',
                  }}
                >
                  Tu peux choisir lesquels garder actifs. Les autres passent en
                  archives, leurs donnees restent conservees.
                </Text>
              </Section>

              <Section
                style={{
                  borderLeft: '2px solid rgba(10,10,20,.15)',
                  padding: '12px 14px',
                  backgroundColor: '#FAFAFA',
                  borderRadius: '0 8px 8px 0',
                  marginBottom: '16px',
                }}
              >
                <Text
                  style={{
                    margin: '0 0 4px',
                    color: colors.text,
                    fontSize: '20px',
                    lineHeight: '23px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  Chaque etape a son rythme.
                </Text>
                <Text
                  style={{
                    margin: 0,
                    color: colors.muted,
                    fontSize: '13px',
                    lineHeight: '21px',
                    fontWeight: 300,
                  }}
                >
                  FitDesk grandit avec toi dans les deux sens. Quand tu veux
                  repasser a la vitesse superieure, un clic suffit.
                </Text>
              </Section>

              <Button
                href={ctaUrl}
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
                Acceder a mon espace <span style={{ color: colors.red }}>→</span>
              </Button>

              <Text
                style={{
                  margin: 0,
                  color: colors.text,
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              >
                <strong>Alexandre</strong>
                <br />
                <span style={{ color: colors.muted }}>Fondateur · FitDesk</span>
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
