# Sessions
Fortement liée à [l'authentification](02-authentification.md), la gestion des sessions en WEB est un défi de part la nature du protocole HTTP qui est ‘stateless’, ce qui veut dire ‘sans état’.
Ainsi une requête, au niveau HTTP, n’a pas de rapport avec une autre...
Il faut donc utiliser un moyen annexe pour donner l’impression à l’utilisateur que son authentification est valide durant un certain temps...

## Théorie
- [Slides sessions](../slides/03a-sessions/){target="_self"} (version web)
- [Slides JWT](../slides/03b-jwt/){target="_self"} (version web)
- [Slides signature JWT](../slides/03c-jwt-signature/){target="_self"} (version web)
- [Version PowerPoint](../supports/02-Auth.pptx) (slides 2..9, 20+)

## Pratique

### JWT

#### Répondre aux questions théoriques
- JWT [pdf](../exercices/auth/03-jwt.pdf) | [docx](../exercices/auth/03-jwt.docx) | [Ressources](../exercices/auth/03-jwt-data.zip)

**Durée** : 15 min. **Rendu** : répondre directement dans `03-jwt.docx`. Objectifs : décrire le contenu d'un JWT, expliquer deux types de jetons et les risques de sécurité liés aux jetons.
1. Citer les **trois éléments** d'un JWT et leur utilité ([slides JWT](../slides/03b-jwt/){target="_self"}).
2. Expliquer la différence entre **HS256 et RS256** ([slides signature](../slides/03c-jwt-signature/){target="_self"}).
3. Expliquer comment un attaquant pourrait exploiter une **clé secrète ou privée perdue**.
4. **Décoder** les jetons `jwt_User1.txt` et `jwt_User2.txt` (`base64 -di`, <https://jwt.io>, [JWT Handbook](../supports/02-jwt-handbook-v0_14_2.pdf)) : quelles informations, la signature est-elle valide, que s'est-il passé avec le jeton 2 ?

#### Implémenter dans l’application
Reprendre l'application de la thématique [Authentification](02-authentification.md) : générer le token après un login réussi, le renvoyer au client et exiger qu'il soit présenté à chaque requête (activité 2 des [slides signature](../slides/03c-jwt-signature/){target="_self"} : démarrer le serveur, tester les URLs avec un client HTTP, identifier les fichiers à modifier).
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

D’ailleurs, express-jwt se base sur l’enête...

## Vérifier que ça marche
Les ressources `03-jwt-data.zip` ne sont pas une stack Docker. Pour l'intégration dans l'app d'authentification, repartir de la stack de la thématique [Authentification](02-authentification.md) et refaire son test (http://localhost:8083/user).
