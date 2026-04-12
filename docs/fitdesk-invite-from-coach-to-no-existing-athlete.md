# FitdeskInviteFromCoachToNoExistingAthlete

## Nom du template

`FitdeskInviteFromCoachToNoExistingAthlete`

## Objectif

Permettre a une personne qui n'a pas encore de compte FitDesk de decouvrir l'invitation d'un coach et de completer les informations necessaires pour demarrer.

## Declencheur

Un coach envoie une invitation a une personne externe afin qu'elle le rejoigne comme athlete sur FitDesk.

## Destinataire

Personne invitee qui n'a pas encore de compte sur FitDesk.

## Sujet

`{{ coachName }} t'invite a rejoindre FitDesk`

## Preheader

`{{ coachName }} t'invite a rejoindre FitDesk.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom du destinataire, utilise dans le hero |
| `coachName` | yes | Identite du coach invitant, visible dans le sujet recommande et le corps |
| `invitationUrl` | yes | Lien securise vers le parcours public derive de l'inscription |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation coach`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction expliquant qu'il s'agit d'une invitation a rejoindre FitDesk en tant qu'athlete.
5. Bloc d'information rappelant le coach invitant, la nature du parcours et la validite du lien.
6. Phrase inspirante et rassurante dans un bloc editorial discret.
7. CTA principal pleine largeur.
8. Lien alternatif visible en clair.
9. Note de secours rappelant que le lien reste valable 7 jours.
10. Signature FitDesk et footer standard.

## Proposition de copywriting

- Badge: `Invitation coach`
- Heading line 1: `DÉCOUVRE`
- Heading line 2: `FITDESK, {{ firstName }}.`
- Intro: `{{ coachName }} t’invite à le rejoindre comme athlète sur FitDesk. Depuis le lien sécurisé ci-dessous, tu pourras découvrir cette invitation et compléter simplement les informations nécessaires pour démarrer.`
- Coach card label: `Invitation reçue`
- Coach identity label: `Coach invitant`
- Journey label: `Parcours`
- Journey value: `Invitation publique et démarrage guidé`
- Validity label: `Validité du lien`
- Validity value: `7 jours`
- Inspiring line: `Un bon départ commence souvent par une invitation claire, un cadre simple et l’envie d’avancer.`
- Signature note: `Si le bouton ne s’affiche pas correctement, copie et colle le lien ci-dessus dans ton navigateur. Ce lien reste valable pendant 7 jours.`

## Libelle CTA

`DÉCOUVRIR MON INVITATION`

## Fallback texte avec lien

`Lien d'invitation`

Puis afficher `{{ invitationUrl }}` en clair, sur sa propre ligne, avec retour a la ligne naturel et `word-break`.

## Regles de rendu

- Conserver la largeur max de `480px` et les espacements FitDesk existants.
- Utiliser la palette existante: noir `#080810`, rouge `#F1011F`, fond `#f4f4f6`.
- Conserver la typo `DM Sans` et la hierarchie actuelle des templates FitDesk.
- Garder le CTA principal pleine largeur, uppercase, fond noir.
- Afficher `coachName` tel quel sans transformation aggressive.
- Afficher `firstName` dans le hero en uppercase, comme sur les autres templates FitDesk.
- Afficher `invitationUrl` en clair sous le CTA, avec `word-break: break-all`.
- Expliquer sobrement que le lien permet de decouvrir l'invitation et de completer les informations necessaires pour demarrer.
- Rappeler explicitement que le lien est valable 7 jours.
- Ne pas supposer que le destinataire connait deja FitDesk.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile garde un CTA pleine largeur et un contenu lisible sans zoom.
- Le nom du coach apparait dans le preview, le contenu et le sujet recommande.
- Le texte explique clairement qu'il s'agit d'une invitation a rejoindre FitDesk.
- Le texte mentionne que le destinataire pourra decouvrir l'invitation et completer les informations necessaires pour demarrer.
- Le lien visible en clair est identique au `href` du bouton.
- La mention `7 jours` est presente dans le bloc d'information et dans la note de secours.
- Aucun element ne suppose l'existence d'un compte deja cree.
