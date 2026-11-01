# XSS
X = cross

S = site

S = scripting

# Théorie
- [Intro Vidéo](https://eduvaud.sharepoint.com/:v:/r/sites/ETML_INF_MAITRES_Teams/Documents%20partages/General/Supports%20de%20cours/ICT/183-SecuriteApplication/b-UnitesEnseignement/XSS-video.mkv?csf=1&web=1&e=qRq50q)
- [Powerpoint XSS](../supports/06-xss.pptx)

# Pratique
- [Recherche et livre d'or](../exercices/xss/e-183-ALL-XSS.docx)

# Vérifier que ça marche
| Exercice | Démarrage | URL | Résultat attendu |
|---|---|---|---|
| HTTP payload | `docker compose up -d` dans `docker-xss-http-payload` | http://localhost:8087/search-results?q=test | la page affiche le terme cherché "test" |
| Stocké | `docker compose up -d` dans `docker-xss-stored` | http://localhost:8086 | page "livre d'or" avec formulaire de commentaire |
| Stocké (base) | idem | http://localhost:8085 | phpMyAdmin |

Ne lance qu'un exercice à la fois si un port est déjà occupé.
