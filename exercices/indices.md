# Indices par exercice

Des pistes, pas des réponses. Essayer au moins 10 minutes avant de lire l'indice suivant.
Les solutions sont dans le dossier de chaque exercice (`exercices/…`), dans un fichier `X-…` ou les archives `02X-…` et `03X-…` : à ouvrir après avoir essayé.

## 02 Authentification (`02-Auth.docx`)
1. *Injection* : regarde comment la requête SQL est construite dans `routes/Auth.mjs` (concaténation de chaînes ?). Que se passe-t-il si le mot de passe contient une apostrophe ?
2. Un exemple de corps de requête se trouve dans `02-injection-payload.txt` (à comprendre, pas à copier).
3. *Correction* : une requête **préparée** (paramètres `?`) sépare le code SQL des données. Avant ça, vérifie que ce que tu reçois a la bonne forme (type, longueur).
   OWASP : [requêtes paramétrées][sqli-param], [validation des entrées][input-impl] · JS : [mysql2 `execute()`][mysql2-prep]
4. *Hachage* : un hash rapide (MD5, SHA-256) ne suffit pas. OWASP recommande **Argon2id**. Le **sel** est propre à chaque utilisateur et stocké ; le **poivre** est global et gardé hors de la base (variable d'environnement, `process.env`).
   Installation : `docker compose exec nodejs npm install argon2` (ou `npm install argon2` dans `app/` depuis ton PC) : dès que `package.json` change, le conteneur installe le paquet et redémarre l'app (voir `README.md` de l'archive). Ensuite `argon2.hash(mdp, options)` et `argon2.verify(hashStocké, mdp, options)`. Le poivre se passe dans l'option `secret` (un `Buffer`, le même pour `hash` et `verify`). Le sel : génère-le toi-même (`crypto.randomBytes`), stocke-le dans ta colonne et passe-le dans l'option `salt`.
   *Astuce Argon2* : sans option `salt`, `argon2.hash()` **tire lui-même** un sel aléatoire à chaque appel. Dans tous les cas il le recopie **dans** son résultat (`$argon2id$v=19$m=...$<sel>$<hash>`), et `argon2.verify()` le relit là : ta colonne sel devient alors facultative. Regarde un hash dans phpMyAdmin pour repérer le sel.
   Sans rien installer : `crypto.scrypt` est intégré à node, mais tu dois alors générer et stocker le sel toi-même (`crypto.randomBytes`, colonne dédiée), appliquer le poivre (`crypto.createHmac`) et comparer en temps constant (`crypto.timingSafeEqual`).
   OWASP : [algorithmes][pw-algos] ([Argon2id][pw-argon], [scrypt][pw-scrypt]), [sel][pw-salt], [poivre][pw-pepper] · JS : [`argon2`][npm-argon2], [`crypto.scrypt`][node-scrypt], [`crypto.randomBytes`][node-random], [`crypto.createHmac`][node-hmac], [`crypto.timingSafeEqual`][node-tse]
   *Et `john` dans `db_authentication.sql` ?* Son hash doit être calculé **par ton application** (même algorithme, même poivre). Le plus simple : écris d'abord une route d'inscription (`POST /auth/register` : hash + `INSERT`), inscris un utilisateur, puis copie sa ligne depuis phpMyAdmin dans le fichier SQL. Ou, temporairement, `console.log(await argon2.hash('1234', options))` au démarrage, et copie le résultat depuis `docker compose logs nodejs`. Le login de `john` échoue alors que le hash a l'air bon ? Le poivre a changé entre le calcul et la vérification : changer le poivre rend **tous** les hash invalides.
5. *Privilèges* : l'app se connecte en root. Quel compte MySQL avec le minimum de droits suffirait ? De quoi l'app a-t-elle besoin : lire des utilisateurs, en créer... et c'est tout ?
   OWASP : [moindre privilège][sqli-least], [permissions DB][dbsec-perm], [identifiants hors du code][dbsec-cred] · MySQL : [`CREATE USER`][mysql-cu], [`GRANT` sur une table][mysql-grant]
6. *Tester les privilèges* : une fois l'injection corrigée (étape 4), tu ne peux plus envoyer de `DROP` par l'API. Deux façons de vérifier : revenir temporairement au code vulnérable (`git stash` ou ton commit initial) et envoyer un mot de passe du type `x'; DROP TABLE t_users; -- ` ; ou te connecter à phpMyAdmin **avec le compte restreint** et essayer `TRUNCATE TABLE t_users` : MySQL doit répondre *command denied*.
7. *Appliquer une modification de `db_authentication.sql`* : `docker compose restart db` (la base est en mémoire et recréée depuis ce fichier à chaque démarrage). Tes utilisateurs ont disparu après un redémarrage ? C'est normal : mets-les dans le SQL, ou active la persistance (`README.md` de l'archive). Avec la persistance, il faut `docker compose down -v` puis `up -d` pour rejouer le SQL.
8. *Vérifier le stockage* : exporte `t_users` depuis phpMyAdmin. Tu ne dois voir aucun mot de passe, et deux utilisateurs avec le même mot de passe doivent avoir des hash différents (grâce au sel).

[sqli-param]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html#parameterized-queries
[sqli-least]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html#least-privilege
[input-impl]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html#implementing-input-validation
[pw-algos]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#password-hashing-algorithms
[pw-scrypt]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#scrypt
[pw-argon]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
[pw-salt]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#salting
[pw-pepper]: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering
[dbsec-perm]: https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html#creating-secure-permissions
[dbsec-cred]: https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html#storing-database-credentials-securely
[mysql2-prep]: https://sidorares.github.io/node-mysql2/docs/documentation/prepared-statements
[npm-argon2]: https://github.com/ranisalt/node-argon2#readme
[node-scrypt]: https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback
[node-random]: https://nodejs.org/api/crypto.html#cryptorandombytessize-callback
[node-hmac]: https://nodejs.org/api/crypto.html#cryptocreatehmacalgorithm-key-options
[node-tse]: https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b
[mysql-cu]: https://dev.mysql.com/doc/refman/8.4/en/create-user.html
[mysql-grant]: https://dev.mysql.com/doc/refman/8.4/en/grant.html#grant-table-privileges

## 03 JWT (`03-jwt.docx`)
1. Un JWT a 3 parties séparées par des points : décode-les (base64url) pour voir ce qu'elles contiennent.
2. La signature protège l'**intégrité**, pas la confidentialité : ne mets rien de secret dans le payload. OWASP : [un JWT signé n'est pas confidentiel][jwt-conf]
3. Pense à l'expiration (`exp`) et à l'endroit où le client garde le token (entête Bearer, stockage local, cookie) : chaque choix a ses risques. OWASP : [Web Storage][sess-storage] vs [cookie `HttpOnly`][sess-httponly]
4. *Clé perdue* : avec la clé HS256, n'importe qui fabrique un jeton valide. OWASP : [exigences sur la clé (MAC)][jwt-mac], [algorithme `none`][jwt-none], [confusion de clé][jwt-confusion]

### 03 JWT, implémentation dans l'application
1. *Deux moments* : **créer** le jeton (`jwt.sign`, paquet `jsonwebtoken`) juste après un login réussi, puis le **vérifier** (`jwt.verify`) à chaque requête vers une route protégée. Commence par le premier et affiche le jeton dans <https://jwt.io>.
   JS : [`jsonwebtoken` (sign / verify)][npm-jwt]
2. *Nouveaux paquets* : `docker compose exec nodejs npm install jsonwebtoken cookie-parser` (ou depuis ton PC dans `app/`, ou en éditant `package.json`). Le conteneur installe lui-même ce qui manque au redémarrage de l'app. `Cannot find module` quand même ? `docker compose logs nodejs` puis `docker compose restart nodejs`.
3. *La clé secrète* : comme le poivre, dans une variable d'environnement (`docker-compose.yml`), jamais dans le code. Longue et aléatoire, pas un mot de passe.
   OWASP : [exigences sur la clé (MAC)][jwt-mac]
4. *Vérifier à chaque requête* : écris un **middleware** `(req, res, next)` qui refuse (401) ou appelle `next()`, et branche-le sur `/user` seulement. Si tu le mets devant `/auth`, plus personne ne peut se connecter pour obtenir un jeton.
   JS : [écrire un middleware Express][express-mw] (exemple `validateCookies`)
5. *Cookie* : `res.cookie(nom, jeton, { httpOnly: true, ... })` pour l'envoyer. Pour le relire, `req.cookies` est `undefined` tant que tu n'as pas ajouté le middleware `cookie-parser`.
   OWASP : [`HttpOnly`][sess-httponly], [`SameSite`][sess-samesite], [`Secure`][sess-secure] · JS : [`res.cookie`][express-cookie], [`res.clearCookie`][express-clear], [`cookie-parser`][express-cp] · MDN : [Set-Cookie][mdn-cookie]
6. *Entête Bearer* (autre option) : le client envoie `Authorization: Bearer <jeton>` ; côté serveur, lis `req.headers.authorization`. Le client doit alors garder le jeton quelque part. OWASP : [Web Storage][sess-storage]
7. *Sécurité* : précise l'algorithme attendu dans `jwt.verify(..., { algorithms: ['HS256'] })` et donne une durée de vie courte (`expiresIn`). Teste un jeton modifié à la main : il doit être refusé.
   OWASP : [algorithme `none`][jwt-none], [confusion de clé][jwt-confusion]
8. *Déconnexion* : effacer le cookie ne rend pas le jeton invalide pour qui l'a copié. Pourquoi une durée de vie courte aide ? OWASP : [révocation d'un JWT][jwt-revoc]

[jwt-conf]: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html#signed-jwts-are-not-confidential
[jwt-mac]: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html#mac
[jwt-none]: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html#unsecured-jwts
[jwt-confusion]: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html#key-type-confusion
[jwt-revoc]: https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html#jwt-revocation
[sess-httponly]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#httponly-attribute
[sess-samesite]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#samesite-attribute
[sess-secure]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#secure-attribute
[sess-storage]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#html5-web-storage-api
[npm-jwt]: https://www.npmjs.com/package/jsonwebtoken
[express-mw]: https://expressjs.com/en/4x/guide/writing-middleware
[express-cookie]: https://expressjs.com/en/4x/api/response#rescookie
[express-clear]: https://expressjs.com/en/4x/api/response#resclearcookie
[express-cp]: https://expressjs.com/en/resources/middleware/cookie-parser
[mdn-cookie]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie

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
3. Écris tes vues dans `sql/2_create_views.sql` et tes utilisateurs dans `sql/3_create_users.sql` (garde le `USE db_students;` du début). Pour qu'ils soient exécutés au démarrage, regarde comment `1_db_student_setup.sql` est déjà monté dans `docker-compose.yml` : l'ordre d'exécution suit l'ordre alphabétique des noms. Ils ne sont rejoués que sur une base vide : remise à zéro `docker compose down -v` puis `up -d`, ce qui efface ce qui n'est pas dans les scripts. Base qui ne démarre pas ? `docker compose logs db`, corrige, puis remise à zéro.
4. Teste en te connectant avec le nouvel utilisateur dans phpMyAdmin : l'accès aux tables doit être refusé.

## 06 XSS
1. *Réfléchi* : que fait le serveur avec le paramètre `q` avant de l'écrire dans la page ?
2. *Stocké* : le commentaire est enregistré tel quel puis rendu à tous les visiteurs.
3. *Correction* : encode `& < > " '` en entités HTML au moment de **l'affichage** (ou utilise `textContent` côté navigateur). Une CSP est une défense en plus, pas à la place.

## 07 IA
Voir les conseils directement dans [la fiche](ia/ia-exercice.md). Si le score reste bas : change d'angle (rôle, langue, format) au lieu de répéter.
