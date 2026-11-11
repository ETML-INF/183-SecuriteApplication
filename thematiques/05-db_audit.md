# Base de données
Le principe d’une application est de présenter des informations à un utilisateur. Ceci implique donc d’avoir accès à des données.

Le but, dans cette situation, est de limiter au maximum cet accès en utilisant tous les outils nécessaires disponibles.

## Privilèges
Au point 4 de [l'exercice sur l'authentification](../exercices/auth/02-Auth.docx), un effort a déjà été entrepris pour réduire l’accès aux données.
Toutefois, cette méthode était drastique et n’est pas toujours applicable en production.

## Vue
Dans la plupart des moteurs de base de données, on peut définir une granularité très fine sur les droits en utilisant des vues.
Ainsi, on peut garder un user ‘root’ pour le DBA (database administrator), qui aura accès à toutes les tables, 
mais tout applicatif aura un compte dédié et pour éviter de complexifier un schéma pour la sécurité, on utilise le concept de ‘vue’
qui est une abstraction d’une table pour laquelle historiquement on ne pouvait que faire de la lecture et désormais on peut 
aussi faire de la modification...

## Procédures stockées
Permettent notamment de réaliser des opérations directes sur la base de données en liens avec des ‘trigger’... Et peut aussi être utilisé pour implémenter de la logique métier indépendante du client...

## Théorie
- Slides web : [Vues](../slides/05a-vues/){target="_blank"}, [Procédures stockées](../slides/05b-procedures/){target="_blank"}, [Marketplace et BAC](../slides/05c-marketplace-bac/){target="_blank"}
- Version PowerPoint : [Marketplace](../supports/05-pitch-procedure-pm2etml.pptx), [Vues et procédures stockées](../supports/05-db_audit.pptx)

## Pratique
- [Vues](../exercices/db-audit/e-183-ALL-Views.docx)
- [Procédures stockées](../exercices/db-audit/e-183-ALL-StoredProcedure.docx)
- [Ressources docker pour les vues et procédures stockées](../exercices/db-audit/docker-views-stored-procedure.zip)

### Vues (45 min)
Base `db_students`, console MySQL de phpMyAdmin. **Rendu** : répondre dans `e-183-ALL-Views.docx`.
1. **Échauffement** : requêtes sur les étudiants, leurs cours, dates et notes.
2. **`v_studentsGrades`** : nom, prénom, cours, date et note ; utilisateur `teacher` en lecture seule sur cette vue ; script appelé automatiquement par `docker-compose.yml`.
3. **`v_studentsBadGrades`** : même vue avec note < 4.0 ; tester avec `teacher` (module 123).
4. **`v_absentStudents`** : jours, périodes et motifs d'absence ; tester avec les absences de février 2024 (`MONTH()`, `YEAR()`).

### Procédures stockées (2 x 45 min)
**Rendu** : répondre dans `e-183-ALL-StoredProcedure.docx`.
1. Paramètres **OUT** (`sp_helloWorld`), **IN** (`sp_helloWorld2`) et utilisateur courant `USER()` (`sp_helloWorld3`) ; question sur le délimiteur.
2. **Audit** : table `t_audit_access_absences` et procédure `sp_get_absences` qui lit la vue des absences et journalise date et utilisateur.
3. **Permissions** : compte `John` qui peut uniquement exécuter `sp_get_absences`.
4. **Triggers** : journal textuel des opérations sur la table des absences, puis statistiques mensuelles par élève.

Théorie liée : slides [Vues](../slides/05a-vues/){target="_blank"} et [Procédures stockées](../slides/05b-procedures/){target="_blank"}. Solutions : `X-views_stored_procedures.md` et les scripts `X-*.sql` dans `exercices/db-audit/`.	

## Vérifier que ça marche
Après `docker compose up -d` dans le dossier `docker` (attendre ~20 s, MySQL initialise les scripts SQL) :

| Quoi | URL | Résultat attendu |
|---|---|---|
| phpMyAdmin | http://localhost:8084 | page de connexion, base `db_students` visible avec ses tables |

Si la base est vide : les scripts d'init ne s'exécutent qu'à la **première** création du volume. Refaire `docker compose down -v` puis `docker compose up -d`.
