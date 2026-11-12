# Sessions
Fortement liée à [l'authentification](02-authentification.md), la gestion des sessions en WEB est un défi de part la nature du protocole HTTP qui est ‘stateless’, ce qui veut dire ‘sans état’.
Ainsi une requête, au niveau HTTP, n’a pas de rapport avec une autre...
Il faut donc utiliser un moyen annexe pour donner l’impression à l’utilisateur que son authentification est valide durant un certain temps...

## Théorie
- [Slides sessions](../slides/03a-sessions/){target="_blank"} (version web)
- [Slides JWT](../slides/03b-jwt/){target="_blank"} (version web)
- [Slides signature JWT](../slides/03c-jwt-signature/){target="_blank"} (version web)
- [Version PowerPoint](../supports/02-Auth.pptx) (slides 2..9, 20+)

## Pratique

### JWT

#### Répondre aux questions théoriques
- JWT [pdf](../exercices/auth/03-jwt.pdf) | [docx](../exercices/auth/03-jwt.docx) | [Ressources](../exercices/auth/03-jwt-data.zip)

**Durée** : 15 min. **Rendu** : répondre directement dans `03-jwt.docx`. Objectifs : décrire le contenu d'un JWT, expliquer deux types de jetons et les risques de sécurité liés aux jetons.
1. Citer les **trois éléments** d'un JWT et leur utilité ([slides JWT](../slides/03b-jwt/){target="_blank"}).
2. Expliquer la différence entre **HS256 et RS256** ([slides signature](../slides/03c-jwt-signature/){target="_blank"}).
3. Expliquer comment un attaquant pourrait exploiter une **clé secrète ou privée perdue**.
4. **Décoder** les jetons `jwt_User1.txt` et `jwt_User2.txt` (`base64 -di`, <https://jwt.io>, [JWT Handbook](../supports/02-jwt-handbook-v0_14_2.pdf)) : quelles informations, la signature est-elle valide, que s'est-il passé avec le jeton 2 ?

#### Implémenter dans l’application
Reprendre l'application de la thématique [Authentification](02-authentification.md) : générer le token après un login réussi, le renvoyer au client et exiger qu'il soit présenté à chaque requête (activité 2 des [slides signature](../slides/03c-jwt-signature/){target="_blank"} : démarrer le serveur, tester les URLs avec un client HTTP, identifier les fichiers à modifier).
- Intégrer JWT
    - [Documentation officielle pour express-jwt](https://www.npmjs.com/package/express-jwt) 
	OU
    - [Suggestion de tutoriel avec jsonwebtoken](https://dev.to/hamzakhan/securing-your-expressjs-app-jwt-authentication-step-by-step-aom)

##### Aide
Pour gérer un token, il faut à la fois le générer dans le backend après un login réussi et à la fois le renvoyer au client et faire en sorte que ce dernier le renvoie à chaque requête. 

Pour s’aider on peut utiliser:

- l’entête BEARER
- le storage local
- un cookie

D’ailleurs, express-jwt se base sur l’entête...

D'autres pistes dans les [indices](../exercices/indices.md) (section *03 JWT, implémentation*).

##### Point de départ et solution
- **Point de départ** : application de la thématique 02. Si elle n'est pas terminée, partir de [`02X-auth-solution.zip`](../exercices/auth/02X-auth-solution.zip) (requête préparée, hachage salé/poivré, DB à droits restreints).
- **Solution** (après avoir essayé) : [`03X-token-solution.zip`](../exercices/auth/03X-token-solution.zip) = 02X + JWT dans un cookie `httpOnly`. Seuls `server.mjs`, `routes/Auth.mjs`, `controllers/UserController.mjs`, `package.json` changent, plus deux nouveaux fichiers `utils/jwt.mjs` et `middleware/requireAuth.mjs` ; à la racine, `docker-compose.yml` (clé `JWT_SECRET`, ports), et les ports dans `README.md`, `.env` et `app/.env`.

*Comme en thématique 02, la base est **réinitialisée à chaque démarrage** (utilisateurs inscrits perdus, `john` / `1234` toujours là) ; pour la garder, voir le `README.md` de l'archive.*

## Vérifier que ça marche
Les ressources `03-jwt-data.zip` ne sont pas une stack Docker (seulement les jetons à décoder).

Pour l'intégration dans l'application, le test change : `/user` doit maintenant **refuser** une requête sans jeton.

Exemple (adapter le port 8091 si nécessaire, probablement 8083):

| Quoi          | Commande                                                                                                                                           | Résultat attendu                                                          |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|
| Sans jeton    | `curl -i http://localhost:8091/user`                                                                                                               | HTTP 401                                                                  |
| Login         | `curl -i -c cookies.txt -X POST http://localhost:8091/auth -H "Content-Type: application/json" -d "{\"username\":\"john\",\"password\":\"1234\"}"` | HTTP 200 et entête `Set-Cookie: authToken=...; HttpOnly; SameSite=Strict` |
| Avec jeton    | `curl -i -b cookies.txt http://localhost:8091/user`                                                                                                | HTTP 200 `User: john`                                                     |
| Jeton modifié | coller le jeton dans <https://jwt.io>, changer `sub`, le renvoyer (`-b "authToken=..."`)                                                           | HTTP 401 (signature invalide)                                             |
| Déconnexion   | `curl -i -b cookies.txt -c cookies.txt -X POST http://localhost:8091/auth/logout` puis refaire *Avec jeton*                                        | HTTP 401                                                                  |

Dans Bruno / Thunder, le cookie est conservé automatiquement après le login (sinon, copier la valeur de `Set-Cookie`).
