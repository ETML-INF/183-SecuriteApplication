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
- [Auth app - nodejstoken](../exercices/auth/02-nodejstoken.zip)

**Durée** : 30 min. **Aides autorisées** : support de cours, notes personnelles, cheatsheets OWASP. **Rendu** : répondre directement dans `02-Auth.docx`.

Étapes de l'exercice (chacune se termine par une *checklist* à valider) :
1. **Mise en place** : extraire l'archive, `docker compose up -d`, faire un commit initial (`git init`), choisir un outil de requêtage (Bruno, Thunder, curl).
2. **Schéma** : compléter le dessin des étapes qui permettent au serveur d'établir qu'un utilisateur est authentifié (mot de passe contrôlé, salé, haché, poivré).
3. **Injection** : expliquer pourquoi le code est sensible à l'injection SQL et proposer un payload qui connecte l'utilisateur `tartampion`.
4. **Protection contre l'injection** : corriger le code (sans changer la requête, puis en adaptant la requête). Le payload précédent ne doit plus fonctionner.
5. **Accès à la base** : connexion avec un utilisateur à droits restreints (moindres privilèges) ; vérifier que `drop database` / `truncate table` ne passent pas via HTTP.
6. **Protection des données** : hacher, saler et poivrer les mots de passe. Un export de la DB ne doit pas les révéler, ni `johnTheRipper` ni une rainbow table ne doivent aboutir.

Théorie liée : [slides mots de passe](../slides/02a-mot-de-passe/){target="_blank"} (activité 1). Solution : `02X-nodejstoken-auth_salt_jwt_cookie.zip` dans `exercices/auth/`.


## Ressources
- [OWASP Password_Storage_Cheat_Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
)
- https://proton.me/fr/business/pass/breach-observatory
- [JWT Handbook](../supports/02-jwt-handbook-v0_14_2.pdf)

## Vérifier que ça marche
Après `docker compose up -d` dans le dossier `nodejstoken` (attendre ~20 s que MySQL démarre) :

| Quoi | URL / commande | Résultat attendu |
|---|---|---|
| phpMyAdmin | http://localhost:8082 | page de connexion (root / root) |
| API | `curl -i http://localhost:8083/user` | HTTP 200 (texte "User: ...") |
| Login | `curl -i -X POST http://localhost:8083/auth -H "Content-Type: application/json" -d "{\"username\":\"john\",\"password\":\"x\"}"` | HTTP 401 `{"error":"Invalid username or password"}` (une réponse JSON, pas de "connection refused") |

Si rien ne répond : `docker compose ps` (3 conteneurs *running*), puis `docker compose logs app`.
