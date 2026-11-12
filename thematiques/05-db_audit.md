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
Elles permettent notamment de réaliser des opérations directes sur la base de données en liens avec des ‘trigger’... Elles peuvent aussi être utilisées pour implémenter de la logique métier indépendante du client...

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

## Où écrire les réponses SQL
L'archive s'extrait dans le dossier `docker-views-stored-procedure/` (détails dans son `README.md`) :
- `sql/2_create_views.sql` : tes vues (puis procédures et triggers, avec `DELIMITER`) ;
- `sql/3_create_users.sql` : tes utilisateurs et leurs `GRANT`.

Au départ, seul `sql/1_db_student_setup.sql` est exécuté : faire exécuter tes scripts au démarrage fait partie de l'étape 2 (`docker-compose.yml`, voir le `TODO`). Les scripts commencent par `USE db_students;` : ne pas l'enlever (ils sont exécutés sans base sélectionnée). Essaie dans la console phpMyAdmin, puis recopie ce qui marche dans le script.

::: warning La base est conservée, les scripts ne sont rejoués que sur une base vide
Ce que tu fais dans phpMyAdmin reste après un redémarrage. Mais modifier `2_` / `3_` ne change rien à la base existante. Pour rejouer les scripts : **remise à zéro** `docker compose down -v` puis `docker compose up -d`. Cela **efface** tout ce qui n'est pas dans les scripts : recopie ton travail d'abord.
:::

## Vérifier que ça marche
Après `docker compose up -d` dans le dossier `docker-views-stored-procedure` (la commande attend que MySQL soit prêt) :

| Quoi        | URL                                                                | Résultat attendu                                                            |
|-------------|--------------------------------------------------------------------|-----------------------------------------------------------------------------|
| phpMyAdmin  | http://localhost:8084                                              | page de connexion (root / root), base `db_students` visible avec ses tables |
| Tes scripts | remise à zéro, puis connexion avec ton utilisateur (ex. `teacher`) | ta vue est lisible, les tables sont refusées                                |

`dependency failed to start ... unhealthy` au démarrage, ou vues absentes : un script est en erreur. `docker compose logs db` (chercher `ERROR`), corriger, puis **remise à zéro** (sinon la base reste à moitié initialisée).
