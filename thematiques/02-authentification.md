# Authentification

## Introduction
L’authentification est un aspect fondamental qui comprend plusieurs étapes cruciales afin de garantir
la sécurité d’une application.
De plus, à l’authentification, s’ajoute la notion de [session](03-session.md) qui, n’étant pas prise en compte par HTTP (stateless),
doit être gérée d’une manière ou d’une autre...

Les élément suivants vont donc être abordés:
- Notion générale de session
- Code pour faire la vérification du user/password
- Stockage des mot de passe

## Théorie
- [Slides mots de passe](../slides/02a-mot-de-passe/){target="_blank"} (version web)
- [Version PowerPoint](../supports/02-Auth.pptx) (slides 1..20)

## Pratique

### Webapp d’authentification

#### Bases (injection SQL...)
- [Authentification-pratique](../exercices/auth/02-Auth.docx)
- [Auth app](../exercices/auth/02-auth.zip)

**Durée** : 30 min. **Aides autorisées** : support de cours, notes personnelles, cheatsheets OWASP. **Rendu** : répondre directement dans `02-Auth.docx`.

Étapes de l'exercice (chacune se termine par une *checklist* à valider) :
1. **Mise en place** : extraire l'archive, lire son `README.md` (la base est **réinitialisée à chaque démarrage**, voir plus bas), `docker compose up -d`, faire un commit initial (`git init`), choisir un outil de requêtage (Bruno, Thunder, curl).
2. **Schéma** : compléter le dessin des étapes qui permettent au serveur d'établir qu'un utilisateur est authentifié (mot de passe contrôlé, salé, haché, poivré).
3. **Injection** : expliquer pourquoi le code est sensible à l'injection SQL et proposer un payload qui connecte l'utilisateur `tartampion`.
4. **Protection contre l'injection** : corriger le code (sans changer la requête, puis en adaptant la requête). Le payload précédent ne doit plus fonctionner.
5. **Accès à la base** : connexion avec un utilisateur à droits restreints (moindres privilèges) ; vérifier que `drop database` / `truncate table` ne passent pas via HTTP (voir les [indices](../exercices/indices.md) : l'injection étant corrigée à l'étape 4, il faut tester autrement).
6. **Protection des données** : hacher, saler et poivrer les mots de passe. Un export de la DB ne doit pas les révéler, ni `johnTheRipper` ni une rainbow table ne doivent aboutir.

Théorie liée : [slides mots de passe](../slides/02a-mot-de-passe/){target="_blank"} (activité 1).

## Ressources
- [OWASP Password_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
)
- https://proton.me/fr/business/pass/breach-observatory
- [JWT Handbook](../supports/02-jwt-handbook-v0_14_2.pdf)

## Vérifier que ça marche
Après `docker compose up -d` dans le dossier `auth` dézippé :

| Quoi       | URL / commande                                                                                                                   | Résultat attendu                                                                                    |
|------------|----------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| phpMyAdmin | http://localhost:8082                                                                                                            | page de connexion (root / root)                                                                     |
| API        | `curl -i http://localhost:8083/user`                                                                                             | HTTP 200 (texte "User: ...")                                                                        |
| Login      | `curl -i -X POST http://localhost:8083/auth -H "Content-Type: application/json" -d "{\"username\":\"john\",\"password\":\"x\"}"` | HTTP 401 `{"error":"Invalid username or password"}` (une réponse JSON, pas de "connection refused") |

Si rien ne répond : `docker compose ps` (3 conteneurs *running*), puis `docker compose logs nodejs`.

::: warning La base est en mémoire (par défaut)
La base est **recréée depuis `db_authentication.sql` à chaque démarrage** du conteneur `db` (`restart`, `up` après un `down`, redémarrage du PC) :
- modifier `db_authentication.sql` (étapes 5 et 6), puis `docker compose restart db`
- tout ce qui a été ajouté via l'API ou phpMyAdmin est **perdu** au redémarrage. Ce qui doit rester (ex. `john` avec son sel et son hash) va dans le fichier SQL
- le code (`app/`) n'est jamais concerné (mappé avec bindfs...).

**Garder les données** (option) : renommer `docker-compose.persist.yml` en `docker-compose.override.yml`, puis `docker compose up -d`. Le SQL n'est alors rejoué que sur une base vide : après chaque modification, `docker compose down -v` puis `docker compose up -d`. Détails dans le `README.md` de l'archive.
:::

**Lancer l'app avec son Node local** : la base reste dans Docker, sur `127.0.0.1:6031` (6033 pour 02X, 6034 pour 03X). `docker compose stop nodejs`, décommenter `app/.env`, puis `cd app && npm install && npm start`. Détails dans le `README.md`.
