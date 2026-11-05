# XSS
X = cross

S = site

S = scripting

# Théorie
- [Intro Vidéo](https://eduvaud.sharepoint.com/:v:/r/sites/ETML_INF_MAITRES_Teams/Documents%20partages/General/Supports%20de%20cours/ICT/183-SecuriteApplication/b-UnitesEnseignement/XSS-video.mkv?csf=1&web=1&e=qRq50q)
- [Slides XSS](https://etml-inf.github.io/183-SecuriteApplication/slides/06-xss/) (version web)
- [Version PowerPoint](../supports/06-xss.pptx)

# Pratique
- [Recherche et livre d'or](../exercices/xss/e-183-ALL-XSS.docx)

**Durée** : 60 min. **Rendu** : répondre directement dans `e-183-ALL-XSS.docx`. Deux environnements Docker : `docker-xss-http-payload.zip` et `docker-xss-stored.zip`.
1. **Questions** : définir l'échappement de caractères et son but, puis donner 6 caractères courants à échapper avec leur forme échappée.
2. **XSS réfléchi (recherche)** : repérer l'élément vulnérable, forger une URL qui exécute un script, expliquer la faille, corriger.
3. **XSS stocké (livre d'or)** : repérer les deux éléments vulnérables, injecter un script ou un lien, expliquer la faille.
4. **Payload `<img src="x" onerror="alert('XSS')">`** : expliquer ce que l'attaquant cherche à provoquer et quel mécanisme il contourne.
5. **Corriger** les deux éléments du livre d'or et résumer les points à retenir.

Théorie liée : [slides XSS](https://etml-inf.github.io/183-SecuriteApplication/slides/06-xss/). Solution : `exercices/xss/X-xss-solution.md`.

# Vérifier que ça marche
| Exercice | Démarrage | URL | Résultat attendu |
|---|---|---|---|
| HTTP payload | `docker compose up -d` dans `docker-xss-http-payload` | http://localhost:8087/search-results?q=test | la page affiche le terme cherché "test" |
| Stocké | `docker compose up -d` dans `docker-xss-stored` | http://localhost:8086 | page "livre d'or" avec formulaire de commentaire |
| Stocké (base) | idem | http://localhost:8085 | phpMyAdmin |

Ne lance qu'un exercice à la fois si un port est déjà occupé.
