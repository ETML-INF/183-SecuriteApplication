# Risques et dangers pour une app

![Screenshot](images/screenshot_20251031_160014.png)


## Introduction
- Educarte: [hackers, intimité violée](https://eduvaud.sharepoint.com/:v:/r/sites/ETML_INF_MAITRES_Teams/Documents%20partages/General/Supports%20de%20cours/ICT/183-SecuriteApplication/b-UnitesEnseignement/educarte%20-%20Hackers,%20l%27intimit%C3%A9%20viol%C3%A9e%20-%2052min%20-%20ict183.mkv?csf=1&web=1&e=mz0SeT)

## Théorie
- Slides OWASP Top 10:2025 (version web) :
  - [Introduction](../slides/01a-owasp-intro/){target="_self"}
  - [A01 à A05](../slides/01b-owasp-a01-a05/){target="_self"}
  - [A06 à A10](../slides/01c-owasp-a06-a10/){target="_self"}
  - [Il était une fois... Superman](../slides/01d-superman/){target="_self"}
- Version PowerPoint : [01-Owasp](../supports/01-Owasp.pdf) ([PPT](../supports/01-Owasp.pptx)), [01-superman](../supports/01-superman.pptx)
- Voir aussi [Sécurité IA](07-ia.md) (LLM Top 10)

## Pratique
### Activité 1 : l'impact des risques (15 min)
- En groupes de 3, sans aide extérieure, réfléchir sur l'application de gestion des infractions :
  - les causes de risques qui pourraient lui nuire (effet direct)
  - les risques qui pourraient impacter l'entreprise et ses revenus (effet indirect)
- Un post-it par idée, à placer sur le tableau blanc (repris dans le mot de la fin)
- Consignes dans les [slides d'introduction](../slides/01a-owasp-intro/){target="_self"}

### Top10 : définitions (5 min)
- Travail individuel : [E-183-ALL-OWASP-Definition](../exercices/owasp/01-E-183-ALL-OWASP-Definition.docx) (à imprimer)
- Objectif : citer les 10 risques dans l'ordre et les expliquer avec ses propres mots
- Solutions : [slides A01 à A05](../slides/01b-owasp-a01-a05/){target="_self"} et [A06 à A10](../slides/01c-owasp-a06-a10/){target="_self"}

### CWE : Présentation (30 min + 5-7 min par risque)
- En groupes de 2, un risque du Top 10 par groupe, à partir de <https://owasp.org/Top10/2025/>
- Choisir une **CWE** (*Common Weakness Enumeration*, liste de faiblesses logicielles ou matérielles, <https://cwe.mitre.org/>) liée au risque
- À produire : un document synthétique basé sur le modèle [P-183-ALL-RisqueN.pptx](../exercices/owasp/P-183-ALL-RisqueN.pptx), renommé avec le nom du risque traité (RisqueN remplacé par le nom du risque)
- Déposer la présentation dans Teams, puis la présenter à la classe (5-7 min max par risque)
- Détails : [slides A06 à A10](../slides/01c-owasp-a06-a10/){target="_self"} (activité 2)

### Attaque récente : État des lieux
- Travail individuel : trouver une attaque informatique récente et la noter sur un post-it
- La situer dans le risque OWASP concerné, puis donner sa **cause** et quelques **conséquences**
- Exemple pour démarrer : Log4j
- Détails : [slides A06 à A10](../slides/01c-owasp-a06-a10/){target="_self"} (activité 3)

### Mot de la fin
- Reprendre les post-it de l'activité 1 et les placer dans les catégories du Top 10
- Qu'avez-vous appris ? Quel sentiment avez-vous maintenant ?

## Actualité
- [Amazon down... TJ RTS](https://www.rts.ch/info/monde/2025/article/panne-d-amazon-web-services-des-millions-d-utilisateurs-impactes-29034582.html)
