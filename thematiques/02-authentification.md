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
- [Slides mots de passe](https://etml-inf.github.io/183-SecuriteApplication/slides/02a-mot-de-passe/) (version web)
- [Version PowerPoint](../supports/02-Auth.pptx) (slides 1..20)

## Pratique

### Webapp d’authentification

#### Bases (injection SQL...)
- [Authentification-pratique](../exercices/auth/02-Auth.docx)
- [Auth app - nodejstoken](../exercices/auth/02-nodejstoken.zip)


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
