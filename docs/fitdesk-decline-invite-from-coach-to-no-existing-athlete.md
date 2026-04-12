# FitdeskDeclineInviteFromCoachToNoExistingAthlete

## Nom du template

`FitdeskDeclineInviteFromCoachToNoExistingAthlete`

## Objectif

Informer un coach qu'une personne non encore inscrite sur FitDesk a refuse l'invitation envoyee, tout en confirmant qu'aucun contrat n'a ete cree.

## Declencheur

Une personne invitee sans compte FitDesk refuse l'invitation, soit sans soumettre le formulaire, soit apres soumission avec refus coche.

## Destinataire

Coach expediteur de l'invitation.

## Sujet

`{{ invitedEmail }} a refuse ton invitation FitDesk`

## Preheader

`{{ invitedEmail }} a refuse ton invitation FitDesk.`

## Variables requises

| Variable | Required | Description |
|---|---|---|
| `firstName` | yes | Prenom du coach, utilise dans le hero |
| `invitedEmail` | yes | Adresse email de la personne invitee |
| `accountCreated` | yes | Booleen indiquant si un compte a ete cree lors de la soumission du formulaire |

## Structure de contenu

1. Header FitDesk noir avec branding.
2. Badge rouge `Invitation refusée`.
3. Titre hero en capitales avec personnalisation `firstName`.
4. Introduction courte indiquant explicitement que l'invitation a ete refusee et qu'aucun contrat n'a ete cree.
5. Bloc de synthese avec l'email invite, le statut, l'etat du compte et l'etat du contrat.
6. Note editoriale variant selon creation ou non d'un compte, tout en confirmant l'absence de contrat.
7. Signature FitDesk et footer standard.

## Proposition de copywriting complete

- Badge: `Invitation refusée`
- Heading line 1: `INVITATION`
- Heading line 2: `REFUSÉE, {{ firstName }}.`
- Intro: `L’invitation envoyée à {{ invitedEmail }} a été refusée. Aucun contrat n’a été créé.`
- Summary label: `Résumé`
- Invited email label: `Email invité`
- Status label: `Statut`
- Status value: `Invitation refusée`
- Account label: `Compte`
- Account value if `accountCreated = true`: `Compte créé sans contrat`
- Account value if `accountCreated = false`: `Aucun compte créé`
- Contract label: `Contrat`
- Contract value: `Aucun contrat créé`
- Note if `accountCreated = true`: `Le formulaire a été soumis avec refus coché. Un compte a pu être créé, mais aucun contrat n’a été créé.`
- Note if `accountCreated = false`: `L’invitation a été refusée sans création de compte et sans création de contrat.`

## Gestion eventuelle d'une variante selon creation ou non de compte

Le template gere une variante via la variable booleenne `accountCreated`.

- Si `accountCreated` est vrai:
  le bloc `Compte` affiche `Compte créé sans contrat` et la note rappelle qu'un compte a pu etre cree lors de la soumission du formulaire.
- Si `accountCreated` est faux:
  le bloc `Compte` affiche `Aucun compte créé` et la note confirme qu'il n'y a eu ni creation de compte ni creation de contrat.

## CTA eventuel ou absence de CTA justifiee

Absence de CTA.

Justification: le besoin exprime est purement informatif. Aucun bouton n'est ajoute afin de ne pas suggerer d'action metier supplementaire.

## Regles de rendu

- Conserver la largeur max de `480px` et les espacements FitDesk existants.
- Utiliser la palette existante: noir `#080810`, rouge `#F1011F`, fond `#f4f4f6`.
- Conserver la typo `DM Sans` et la hierarchie actuelle des templates FitDesk.
- Afficher `firstName` dans le hero en uppercase, comme sur les autres templates FitDesk.
- Afficher `invitedEmail` clairement dans le bloc de synthese avec `word-break`.
- Indiquer explicitement `Invitation refusée`.
- Indiquer explicitement `Aucun contrat créé`.
- Garder une formulation nette, professionnelle et sobre dans les deux variantes.

## Points QA a verifier

- Le template compile bien en `fr` et `en`.
- Le rendu mobile reste lisible sans CTA ni rupture de mise en page.
- L'email invite apparait dans le preview et dans le contenu.
- Le texte mentionne explicitement que l'invitation a ete refusee.
- Le texte mentionne explicitement qu'aucun contrat n'a ete cree.
- La variante `accountCreated = true` affiche bien un compte cree sans contrat.
- La variante `accountCreated = false` affiche bien l'absence de compte cree.
- Aucun bouton ni lien n'est present.
