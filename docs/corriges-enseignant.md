# Corrigés et points d'attention (enseignant)

Ne pas distribuer aux élèves avant la fin de l'exercice.

| Exercice | Corrigé |
|---|---|
| Définitions OWASP | `exercices/owasp/X-01-E-183-ALL-OWASP-Definition.docx` |
| Authentification | stacks construites sur le code de départ `02-auth.zip` (mêmes fichiers, commentaires `SOLUTION étape N`) : `exercices/auth/02X-auth-solution.zip` (requête préparée + validation, Argon2id avec poivre en `secret` et sel généré par l'app dans `useSalt`, variante `hashPasswordScrypt` sans dépendance, même schéma ; accepter aussi une copie sans colonne sel si Argon2 tire lui-même le sel, puisqu'il le range dans le hash PHC ; `app_user` SELECT/INSERT, `/auth/register`), dossier `auth-solution/`, ports 8089 (app) / 8088 (phpMyAdmin) ; `03X-token-solution.zip` (02X + JWT HS256 en cookie httpOnly, middleware sur `/user`, `/auth/logout`), dossier `token-solution/`, ports 8091 / 8090. john / 1234 dans les deux. Base en mémoire par défaut (réinitialisée à chaque démarrage), persistance optionnelle via `docker-compose.persist.yml` (voir `README.md` de chaque archive). Mode local possible (app sur le PC, DB Docker sur 127.0.0.1:6031/6033/6034, `app/.env`). |
| Juice Shop | tableau défi -> catégorie Top 10:2025 dans `docs/maintenance-2026.md` (T4) |
| Vues / procédures | `exercices/db-audit/X-views_stored_procedures.md`, `X-*.sql` |
| XSS | pas de corrigé fourni : échappement HTML des entrées affichées (voir diapo 16 de `06-xss.pptx`) |
| IA | réponses enseignant en bas de `exercices/ia/ia-exercice.md` |

Les sections "Vérifier que ça marche" des pages `thematiques/` servent à dépanner une stack Docker avant de chercher dans le code.
