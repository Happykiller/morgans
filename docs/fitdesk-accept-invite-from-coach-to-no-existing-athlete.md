# FitdeskAcceptInviteFromCoachToNoExistingAthlete

## Nom du template

`FitdeskAcceptInviteFromCoachToNoExistingAthlete`

## Objectif

Informer un coach qu'une personne initialement non inscrite sur FitDesk a complete le parcours d'invitation, rejoint FitDesk et accepte l'invitation, avec creation d'un contrat actif.

## Declencheur

Une personne invitee sans compte FitDesk complete le parcours public d'invitation, rejoint FitDesk et accepte l'invitation du coach.

## Destinataire

Coach expediteur de l'invitation.

## Sujet

`{{ athleteName }} a rejoint FitDesk suite a ton invitation`

## Preheader

`{{ athleteName }} a rejoint FitDesk suite a ton invitation.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom du coach, utilise dans le hero |
| `athleteName` | yes | Identite du nouvel athlete issu du parcours d'invitation |
| `contractEffectiveDate` | yes | Date d'effet du contrat actif, correspondant a la date du jour serveur |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation acceptée`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction indiquant qu'il s'agit d'une personne initialement non inscrite qui a complete le parcours, rejoint FitDesk et accepte l'invitation.
5. Bloc de synthese avec le nouvel athlete, l'origine via le parcours d'invitation, le statut, l'etat du contrat et la date d'effet.
6. Note editoriale positive et sobre confirmant le resultat metier final.
7. Signature FitDesk et footer standard.

## Proposition de copywriting complete

- Badge: `Invitation acceptée`
- Heading line 1: `NOUVEL`
- Heading line 2: `ATHLÈTE, {{ firstName }}.`
- Intro: `{{ athleteName }} a complété le parcours d’invitation, rejoint FitDesk et accepté ton invitation. Un contrat actif a été créé.`
- Summary label: `Résumé`
- Athlete label: `Nouvel athlète`
- Origin label: `Origine`
- Origin value: `Parcours d’invitation FitDesk`
- Status label: `Statut`
- Status value: `Invitation acceptée`
- Contract label: `Contrat`
- Contract value: `Contrat actif créé`
- Effective date label: `Date d’effet du contrat`
- Effective date value: `{{ contractEffectiveDate }}`
- Note: `Cette notification confirme qu’un nouvel athlète a rejoint FitDesk à la suite de ton invitation. Le contrat prend effet à la date du jour serveur indiquée ci-dessus.`

## CTA eventuel ou absence de CTA justifiee

Absence de CTA.

Justification: le besoin exprime est de confirmer un resultat metier final. Aucun bouton n'est ajoute afin de ne pas suggerer d'action supplementaire non specifiee.

## Regles de rendu

- Conserver la largeur max de `480px` et les espacements FitDesk existants.
- Utiliser la palette existante: noir `#080810`, rouge `#F1011F`, fond `#f4f4f6`.
- Conserver la typo `DM Sans` et la hierarchie actuelle des templates FitDesk.
- Afficher `firstName` dans le hero en uppercase, comme sur les autres templates FitDesk.
- Afficher `athleteName` clairement comme nouvel athlete issu du parcours d'invitation.
- Indiquer explicitement que la personne a rejoint FitDesk a la suite de l'invitation.
- Indiquer explicitement `Contrat actif créé`.
- Afficher la date d'effet du contrat via `contractEffectiveDate`.
- Garder un ton positif, premium et maitrise, sans exces marketing.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile reste lisible sans CTA ni rupture de mise en page.
- Le nom du nouvel athlete apparait dans le preview et dans le contenu.
- Le texte mentionne explicitement que la personne a rejoint FitDesk suite a l'invitation.
- Le texte mentionne explicitement qu'un contrat actif a ete cree.
- La date d'effet du contrat est visible dans le bloc de synthese.
- Aucun bouton ni lien n'est present.
- Le ton reste positif, sobre et premium.
