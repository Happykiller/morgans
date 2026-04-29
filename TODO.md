# TODO

## Bulk mailing a grande echelle

Objectif vise:

- supporter des campagnes de `100000` lignes
- avec un debit faible et stable, par exemple `250` envois par heure
- sans perte de supervision
- sans doublons en cas de retry ou redemarrage

## Limites actuelles

- Un job de `100000` lignes a `250/h` dure environ `400` heures, soit `16,7` jours.
- Le statut de job expire au bout de `7` jours, donc la supervision disparait avant la fin.
- Le worker traite tout le CSV comme un seul job ARQ longue duree.
- La lecture CSV charge tout le fichier en memoire via `list(csv.DictReader(...))`.
- Il n'existe pas de checkpoint durable par ligne ou par lot.
- Un redemarrage worker peut rendre la reprise fragile.
- Il n'y a pas encore de mecanisme d'idempotence metier pour eviter les doublons.
- La supervision est encore trop legere pour des campagnes multi-jours.

## Chantiers necessaires

### 1. Lire le CSV en streaming

- Remplacer le chargement complet en memoire par une lecture progressive.
- Ne jamais faire reposer un gros job sur `list(...)`.

### 2. Decouper en lots

- Introduire une notion de campagne bulk.
- Decouper une campagne en sous-jobs ou chunks.
- Eviter un unique job ARQ monolithique qui dure plusieurs jours.

### 3. Persister la progression

- Sauvegarder un curseur de progression durable.
- Pouvoir reprendre a partir d'une ligne ou d'un lot connu.
- Exposer cette progression dans l'API de supervision.

### 4. Garantir l'idempotence

- Introduire un identifiant de campagne stable.
- Enregistrer les destinataires deja traites.
- Eviter un double envoi en cas de retry, crash ou redemarrage.

### 5. Allonger ou externaliser l'etat

- Ne plus faire dependre le suivi d'un TTL de `7` jours.
- Soit augmenter fortement la retention Redis.
- Soit stocker l'etat bulk dans un stockage plus durable.

### 6. Renforcer la supervision

- Conserver l'historique complet d'une campagne.
- Exposer les campagnes en cours, terminees, echouees.
- Afficher les compteurs de progression, l'heure de debut, la derniere activite et les erreurs.

### 7. Mieux gerer les redemarrages

- Reprendre proprement les jobs apres crash ou restart.
- Rendre explicite dans l'etat qu'un job a ete repris.
- Verifier la coherence entre file ARQ, supervision Redis et execution worker.

### 8. Tester les cas de charge longue

- Ajouter des tests ou scenarios manuels de campagne longue duree.
- Verifier le comportement sur plusieurs fenetres de throttling.
- Verifier la reprise apres interruption.
- Verifier l'absence de doublons.

## Refactor cible

Le modele cible ne devrait plus etre:

- `1 CSV = 1 job ARQ geant`

Le modele cible devrait plutot etre:

- `1 campagne = N chunks`
- chaque chunk traite une portion du CSV
- la campagne conserve l'etat global
- les chunks sont idempotents et repris proprement
