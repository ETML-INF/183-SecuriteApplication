# Indices par exercice

Des pistes, pas des réponses. Essaie 10 minutes avant de lire l'indice suivant.
Les solutions sont dans le dossier de chaque exercice (`exercices/…`), dans un fichier `X-…` ou l'archive `02X-…` : à ouvrir après avoir essayé.

## 02 Authentification (`02-Auth.docx`)
1. *Injection* : regarde comment la requête SQL est construite dans `routes/Auth.mjs` (concaténation de chaînes ?). Que se passe-t-il si le mot de passe contient une apostrophe ?
2. Un exemple de corps de requête se trouve dans `02-injection-payload.txt` (à comprendre, pas à copier).
3. *Correction* : une requête **préparée** (paramètres `?`) sépare le code SQL des données.
4. *Hachage* : un hash rapide (MD5, SHA-256) ne suffit pas. Cherche Argon2id, scrypt ou bcrypt. Le **sel** est propre à chaque utilisateur et stocké ; le **poivre** est global et gardé hors de la base.
5. *Privilèges* : l'app se connecte en root. Quel compte MySQL avec le minimum de droits suffirait ?

## 03 JWT (`03-jwt.docx`)
1. Un JWT a 3 parties séparées par des points : décode-les (base64url) pour voir ce qu'elles contiennent.
2. La signature protège l'**intégrité**, pas la confidentialité : ne mets rien de secret dans le payload.
3. Pense à l'expiration (`exp`) et à l'endroit où le client garde le token (entête Bearer, stockage local, cookie) : chaque choix a ses risques.

## 04 Juice Shop (`JuiceShop.docx`)
1. *Score board* : cherche dans le code JavaScript de la page (F12, onglet Sources) un mot lié à la route.
2. *DOM XSS* : le champ de recherche réinjecte ce que tu écris dans la page. Le défi *tutorial* te donne le payload de départ.
3. *Document confidentiel* : y a-t-il un répertoire exposé que le site ne lie pas ? Essaie `/ftp`.
4. *Gestion d'erreur* : provoque une erreur en visitant une route qui n'existe pas et lis le message affiché.
5. *Login admin* : que se passe-t-il si l'e-mail contient une apostrophe ?
6. Pour classer : pose-toi la question "quelle règle de sécurité aurait dû empêcher cela ?" et relis les 10 catégories A01..A10.

## 05 Vues et procédures stockées
1. Une vue est une requête `SELECT` nommée : écris d'abord la requête qui marche, puis `CREATE VIEW ... AS` dessus.
2. Un utilisateur restreint reçoit `GRANT SELECT ON db.v_nom TO 'user'@'%'` sur la **vue**, jamais sur les tables.
3. Les scripts d'init ne rejouent que sur un volume neuf : `docker compose down -v` puis `up -d` après chaque modification.
4. Teste en te connectant avec le nouvel utilisateur dans phpMyAdmin : l'accès aux tables doit être refusé.

## 06 XSS
1. *Réfléchi* : que fait le serveur avec le paramètre `q` avant de l'écrire dans la page ?
2. *Stocké* : le commentaire est enregistré tel quel puis rendu à tous les visiteurs.
3. *Correction* : encode `& < > " '` en entités HTML au moment de **l'affichage** (ou utilise `textContent` côté navigateur). Une CSP est une défense en plus, pas à la place.

## 07 IA
Voir les conseils directement dans [la fiche](ia/ia-exercice.md). Si le score reste bas : change d'angle (rôle, langue, format) au lieu de répéter.
