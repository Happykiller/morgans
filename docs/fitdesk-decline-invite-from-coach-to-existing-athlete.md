# FitdeskDeclineInviteFromCoachToExistingAthlete

## Nom du template

`FitdeskDeclineInviteFromCoachToExistingAthlete`

## Objectif

Informer un coach qu'un athlete deja existant sur FitDesk a refuse son invitation.

## Declencheur

Un athlete deja existant sur FitDesk refuse l'invitation envoyee par un coach.

## Destinataire

Coach expediteur de l'invitation.

## Sujet

`{{ athleteName }} a refuse ton invitation FitDesk`

## Preheader

`{{ athleteName }} a refuse ton invitation FitDesk.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom du coach, utilise dans le hero |
| `athleteName` | yes | Identite de l'athlete ayant refuse l'invitation |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation refusée`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction courte indiquant explicitement que l'invitation a ete refusee et qu'aucun contrat n'a ete cree.
5. Bloc de synthese avec l'athlete concerne, le statut et l'etat du contrat.
6. Note editoriale neutre rappelant que l'e-mail est purement informatif.
7. Signature FitDesk et footer standard.

## Proposition de copywriting

- Badge: `Invitation refusée`
- Heading line 1: `INVITATION`
- Heading line 2: `REFUSÉE, {{ firstName }}.`
- Intro: `{{ athleteName }} a refusé l’invitation envoyée depuis FitDesk. Aucun contrat n’a été créé.`
- Summary label: `Résumé`
- Athlete label: `Athlète concerné`
- Status label: `Statut`
- Status value: `Invitation refusée`
- Contract label: `Contrat`
- Contract value: `Aucun contrat créé`
- Neutral note: `Cette notification est informative. Elle confirme simplement la réponse de l’athlète, dans un cadre clair et sans autre action requise.`

## CTA eventuel ou absence de CTA justifiee

Absence de CTA.

Justification: le cas d'usage decrit est purement informatif. Aucun bouton n'est ajoute afin de ne pas suggerer d'action metier non precisee.

## Regles de rendu

- Conserver la largeur max de `480px` et les espacements FitDesk existants.
- Utiliser la palette existante: noir `#080810`, rouge `#F1011F`, fond `#f4f4f6`.
- Conserver la typo `DM Sans` et la hierarchie actuelle des templates FitDesk.
- Afficher `firstName` dans le hero en uppercase, comme sur les autres templates FitDesk.
- Afficher `athleteName` clairement dans le bloc de synthese.
- Indiquer explicitement `Invitation refusée`.
- Indiquer explicitement `Aucun contrat créé`.
- Garder un ton sobre, neutre et non culpabilisant.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile reste lisible sans CTA ni rupture de mise en page.
- Le nom de l'athlete apparait dans le preview et dans le contenu.
- Le texte mentionne explicitement que l'invitation a ete refusee.
- Le texte mentionne explicitement qu'aucun contrat n'a ete cree.
- Aucun bouton ni lien n'est present.
- Le ton reste propre, professionnel et neutre.
