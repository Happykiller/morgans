# FitdeskInviteFromCoachToExistingAthlete

## Nom du template

`FitdeskInviteFromCoachToExistingAthlete`

## Objectif

Permettre a un athlete deja existant sur FitDesk de repondre a l'invitation d'un coach via un lien securise.

## Declencheur

Un coach envoie une invitation a un athlete deja existant pour le rejoindre comme athlete sur FitDesk.

## Destinataire

Athlete existant FitDesk.

## Sujet

`{{ coachName }} t'invite a le rejoindre sur FitDesk`

## Preheader

`{{ coachName }} t'invite a le rejoindre sur FitDesk.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom de l'athlete, utilise dans le titre |
| `coachName` | yes | Identite du coach invitant, visible dans le contenu et le sujet recommande |
| `invitationUrl` | yes | Lien securise permettant de repondre a l'invitation |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation coach`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction sobre expliquant que `coachName` propose de rejoindre FitDesk comme athlete.
5. Bloc d'information avec l'identite du coach, la methode de reponse et la validite du lien.
6. Phrase inspirante dans un bloc editorial discret.
7. CTA principal pleine largeur.
8. Lien alternatif visible en clair.
9. Note de secours rappelant la validite 7 jours.
10. Signature FitDesk et footer standard.

## Proposition de copywriting

- Badge: `Invitation coach`
- Heading line 1: `REJOINS`
- Heading line 2: `TON COACH, {{ firstName }}.`
- Intro: `{{ coachName }} te propose de le rejoindre comme athlète sur FitDesk. Tu peux répondre à cette invitation à partir du lien sécurisé ci-dessous, en toute simplicité.`
- Coach card label: `Invitation reçue`
- Coach identity label: `Coach invitant`
- Response label: `Réponse`
- Response value: `Via un lien sécurisé`
- Validity label: `Validité du lien`
- Validity value: `7 jours`
- Inspiring line: `Les meilleures progressions commencent souvent par un cadre clair et la bonne personne pour t’accompagner.`
- Signature note: `Si le bouton ne s’affiche pas correctement, copie et colle le lien ci-dessus dans ton navigateur. Ce lien reste valable pendant 7 jours.`

## Libelle CTA

`REPONDRE A L'INVITATION`

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
- Rappeler explicitement que le lien est valable 7 jours.
- Ne pas mentionner d'obligation de connexion.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile garde un CTA pleine largeur et un contenu lisible sans zoom.
- Le nom du coach apparait dans le preview, le contenu et le sujet recommande.
- Le texte mentionne clairement que le coach propose a l'athlete de le rejoindre sur FitDesk.
- Le lien visible en clair est identique au `href` du bouton.
- La mention `7 jours` est presente dans le bloc d'information et dans la note de secours.
- Aucun element ne promet une fonctionnalite ou une etape non confirmee.
