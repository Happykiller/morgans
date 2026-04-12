# FitdeskAcceptInviteFromCoachToExistingAthlete

## Nom du template

`FitdeskAcceptInviteFromCoachToExistingAthlete`

## Objectif

Informer un coach qu'un athlete deja existant sur FitDesk a accepte son invitation et qu'un contrat actif a ete cree.

## Declencheur

Un athlete deja existant sur FitDesk accepte l'invitation envoyee par un coach.

## Destinataire

Coach expediteur de l'invitation.

## Sujet

`{{ athleteName }} a accepte ton invitation FitDesk`

## Preheader

`{{ athleteName }} a accepte ton invitation FitDesk.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom du coach, utilise dans le hero |
| `athleteName` | yes | Identite de l'athlete ayant accepte l'invitation |
| `contractEffectiveDate` | yes | Date d'effet du contrat actif, correspondant a la date du jour serveur |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation acceptée`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction courte indiquant explicitement que l'invitation a ete acceptee et qu'un contrat actif a ete cree.
5. Bloc de synthese avec l'athlete concerne, le statut, l'etat du contrat et la date d'effet.
6. Note editoriale sobre confirmant le resultat metier final.
7. Signature FitDesk et footer standard.

## Proposition de copywriting

- Badge: `Invitation acceptée`
- Heading line 1: `INVITATION`
- Heading line 2: `ACCEPTÉE, {{ firstName }}.`
- Intro: `{{ athleteName }} a accepté l’invitation envoyée depuis FitDesk. Un contrat actif a été créé.`
- Summary label: `Résumé`
- Athlete label: `Athlète concerné`
- Status label: `Statut`
- Status value: `Invitation acceptée`
- Contract label: `Contrat`
- Contract value: `Contrat actif créé`
- Effective date label: `Date d’effet du contrat`
- Effective date value: `{{ contractEffectiveDate }}`
- Neutral positive note: `Cette notification confirme le résultat métier final. Le contrat prend effet à la date du jour serveur indiquée ci-dessus.`

## CTA eventuel ou absence de CTA justifiee

Absence de CTA.

Justification: le besoin exprime est de confirmer un resultat metier final. Aucun bouton n'est ajoute afin de ne pas suggerer d'action supplementaire non specifiee.

## Regles de rendu

- Conserver la largeur max de `480px` et les espacements FitDesk existants.
- Utiliser la palette existante: noir `#080810`, rouge `#F1011F`, fond `#f4f4f6`.
- Conserver la typo `DM Sans` et la hierarchie actuelle des templates FitDesk.
- Afficher `firstName` dans le hero en uppercase, comme sur les autres templates FitDesk.
- Afficher `athleteName` clairement dans le bloc de synthese.
- Indiquer explicitement `Invitation acceptée`.
- Indiquer explicitement `Contrat actif créé`.
- Afficher la date d'effet du contrat via `contractEffectiveDate`.
- Garder un ton positif, maitrise et premium, sans surpromesse.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile reste lisible sans CTA ni rupture de mise en page.
- Le nom de l'athlete apparait dans le preview et dans le contenu.
- Le texte mentionne explicitement que l'invitation a ete acceptee.
- Le texte mentionne explicitement qu'un contrat actif a ete cree.
- La date d'effet du contrat est visible dans le bloc de synthese.
- Aucun bouton ni lien n'est present.
- Le ton reste positif, sobre et professionnel.
