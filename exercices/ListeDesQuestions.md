# Liste des 46 questions orales (édition 2026)

Le test oral porte sur ces 46 questions, connues à l'avance (50 % de la note du module).
Lors de l'examen, des questions te sont tirées dans cette liste, avec des questions
complémentaires pour vérifier que tu as compris et que tu sais l'appliquer à un cas nouveau.

Référence : OWASP Top 10:2025 et OWASP Top 10 for LLM Applications (2025).

## OWASP Top 10:2025
- **OWASP1** : Qu'est-ce qu'OWASP et quels sont ses projets les plus significatifs ?
- **OWASP2** : Citez dans l'ordre les 5 premiers éléments du Top 10:2025.
- **OWASP3** : Qu'est-ce que le Broken Access Control (A01), SSRF compris ?
- **OWASP4** : Que sont les Security Misconfiguration (A02) ?
- **OWASP5** : Que sont les Software Supply Chain Failures (A03) ?
- **OWASP6** : Que sont les Cryptographic Failures (A04) ?
- **OWASP7** : Qu'est-ce que l'injection (A05) ?
- **OWASP8** : Qu'est-ce que l'Insecure Design (A06) ?
- **OWASP9** : Que sont les Authentication Failures (A07) ?
- **OWASP10** : Que sont les Software or Data Integrity Failures (A08) ?
- **OWASP11** : Que sont les Security Logging and Alerting Failures (A09) et à quoi servent les journaux ?
- **OWASP12** : Que sont les Mishandling of Exceptional Conditions (A10) ? Donnez un exemple.
- **OWASP13** : Choisissez un risque du Top 10:2025 et expliquez-le (mécanisme, impact, exemple, contre-mesure).

## Mots de passe, hachage, authentification
- **LOGIN1** : Donnez 1 exemple de mot de passe 1) craqué instantanément 2) craqué en quelques minutes / heures 3) craqué en plusieurs années.
- **LOGIN2** : Qu'est-ce que le poivre et quelles sont ses spécificités ?
- **LOGIN3** : Un mot de passe peut être haché ou chiffré. Quelle est la différence et comment peut-on, dans les deux cas, retrouver le mot de passe initial si c'est possible ?
- **LOGIN4** : Qu'est-ce que le sel et quelles sont ses spécificités ?
- **LOGIN5** : Expliquez les étapes nécessaires à l'enregistrement d'un mot de passe dans une base de données.
- **HASH1** : Citez quelques algorithmes de hachage et expliquez pourquoi MD5 est compromis.
- **HASH2** : Quelles sont les librairies utilisées pour hacher des mots de passe ?
- **HASH3** : À quoi sert le hachage dans le stockage des mots de passe ? Comment le réalise-t-on ?
- **AUTH1** : Qu'est-ce que l'authentification à plusieurs facteurs ?
- **AUTH2** : Quels attributs protègent un cookie de session (HttpOnly, Secure, SameSite) et contre quoi ?
- **AUTH3** : Quelle est la différence entre authentification et autorisation ? Donnez un exemple de chacune.

## Jetons
- **JWT1** : Comment est construit un jeton JWT ?
- **JWT2** : Quelle est l'utilité d'un jeton JWT ? Que cherche-t-on à accomplir en utilisant des jetons ?
- **TOKEN1** : Qu'est-ce qu'un access token ?
- **TOKEN2** : Comment sécuriser votre application avec un token ? Quel est le processus et quelles sont les méthodes utilisées ?

## Injection SQL
- **ISQL1** : Avec quel contenu (texte) pouvez-vous tester un site sur sa vulnérabilité à l'injection SQL simple ?
- **ISQL2** : Peut-on modifier le contenu d'une base de données avec une injection SQL et si oui, avec quel contenu envoyé au serveur ?
- **ISQL3** : Comment se protéger d'une injection SQL en Node.js (requêtes préparées) et quel compte MySQL l'application doit-elle utiliser ?
- **ISQL4** : Comment faut-il configurer un site Node.js et/ou son serveur MySQL afin qu'une erreur de syntaxe SQL ne soit pas rapportée clairement à un hacker ?

## XSS
- **XSS1** : Que veut dire l'acronyme XSS (anglais/français) et qu'est-ce que cela implique pour un utilisateur qui se rendrait sur un site avec une telle faille ?
- **XSS2** : Comment peut-on se protéger d'une faille XSS en Node.js ?
- **XSS3** : Qu'est-ce que le DOM Injection ?
- **XSS4** : Une faille XSS peut-elle amener un hacker à obtenir un login / mot de passe (haché ou pas) ou un cookie de session, et si oui, comment ?

## Divers
- **MISC1** : Quels sont les problèmes potentiels posés par l'utilisation d'une librairie tierce ?
- **MISC2** : Expliquez le chiffrement au repos et en transit.
- **MISC3** : Qu'est-ce qu'une CVE et qu'est-ce qu'une CWE ? À quoi servent-elles à un développeur ?

## Sécurité de l'IA (OWASP LLM Top 10)
- **IA1** : Qu'est-ce que la Prompt Injection (LLM01) ? Donnez un exemple et dites pourquoi elle est difficile à éliminer.
- **IA2** : Qu'est-ce que l'Improper Output Handling (LLM05) ? Quel lien avec le XSS et l'injection que vous connaissez déjà ?
- **IA3** : Qu'est-ce que l'Excessive Agency (LLM06) ? Que change un agent IA qui utilise des outils et agit seul, et quelles mesures limitent les dégâts ?

## Test d'une application (White hacker)
- **HACK1** : Comment abordez-vous le test d'une application que vous ne connaissez pas (Juice Shop) ? Qu'est-ce que le « black box testing » et quels outils utilisez-vous (navigateur, ZAP, Burp) ?
- **HACK2** : Décrivez un défi Juice Shop que vous avez résolu : la faille, la catégorie du Top 10:2025, comment vous l'avez exploitée et comment la corriger.

## Base de données
- **DB1** : Pourquoi l'application ne doit-elle pas se connecter à la base en `root` ? Qu'apporte un utilisateur dédié avec des privilèges restreints, et une vue ?
- **DB2** : À quoi sert une procédure stockée et quel est son intérêt pour la sécurité ?
