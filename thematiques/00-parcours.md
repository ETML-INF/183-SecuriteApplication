# Parcours du module 183 en une page

## Ce que l'on fait, dans quel ordre

| # | Thématique | Ce que tu fais | Durée indicative | Livrable |
|---|---|---|---|---|
| 1 | [Risques et dangers](01-dangers.md) | OWASP Top 10:2025, histoire Superman, questions de définition | 1 période de théorie + exercice | docx de définitions |
| 2 | [Authentification](02-authentification.md) | Attaquer puis corriger une app Node (injection SQL, hachage, sel, poivre) | 30 min | `02-Auth.docx` rempli |
| 3 | [Session et JWT](03-session.md) | Questions JWT, puis intégrer un token dans l'app | 1 période | `03-jwt.docx` rempli + code |
| 4 | [White hacker](04-hacker.md) | Juice Shop : trouver la faille, la classer dans le Top 10:2025 | 2-3 périodes | `JuiceShop.docx` rempli |
| 5 | [Audit et base de données](05-db_audit.md) | Vues, utilisateurs restreints, procédures stockées | 45 min + 45 min | docx Views + StoredProcedure |
| 6 | [XSS](06-xss.md) | Exploiter puis corriger un XSS réfléchi et stocké | 60 min | `e-183-ALL-XSS.docx` rempli |
| 7 | [Sécurité IA](07-ia.md) | Prompt injection (Agent Breaker), sortie non maîtrisée | 30 min | fiche d'exercice |
| 8 | [Questions orales](08-questions.md) | Révision des 46 questions | 1 période | - |

Chaque exercice se rend en **répondant directement dans le document** fourni.

## Comment c'est évalué
1. **Test écrit** sur un scénario fictif (50 %) : identifier et classer les risques (Top 10:2025), proposer des contre-mesures adaptées.
2. **Test oral** sur 46 questions connues à l'avance (50 %) : [liste des questions](../exercices/ListeDesQuestions.md).

Les exercices ne sont pas notés individuellement : ils te préparent aux deux tests. Si tu sais faire les exercices et expliquer pourquoi, tu sais répondre aux deux tests.

## Si tu bloques
1. Relis le support de la thématique (section *Théorie*).
2. Regarde la section **Vérifier que ça marche** de la page de la thématique : si l'URL de test ne répond pas, le problème est dans Docker, pas dans ton code.
3. Consulte les [indices](../exercices/indices.md) (ils ne donnent pas la réponse, seulement la direction).
4. Après avoir essayé, compare avec la solution : elle se trouve dans le dossier de l'exercice (`exercices/…`), dans un fichier qui commence par `X-` ou dans les archives `02X-…` et `03X-…`.
5. Demande à l'enseignant.

## Prérequis techniques
- Docker Desktop démarré (`docker version` répond).
- Un répertoire de travail (ex. `C:\Docker`), une archive extraite par exercice, un `git init` + commit initial avant de modifier le code.
- Ports utilisés : 8082-8087 (autres) et 3000 (Juice Shop). Si un port est occupé, arrête l'autre stack (`docker compose down`) avant de lancer la suivante.
