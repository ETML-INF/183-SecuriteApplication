---
theme: default
title: "OWASP Juice Shop"
info: "Introduction au white hacking avec OWASP Juice Shop : 5 challenges guidés"
author: ETML
transition: slide-left
mdc: true
---

# OWASP Juice Shop

## Se mettre dans la peau d'un hacker

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - Thématique 04
  </span>
</div>

---

# Les objectifs

À la fin de la session, vous serez capables de :

<v-clicks>

- **Comprendre**, par des exemples réels, les failles potentielles d'une application web

</v-clicks>

<!--
Faire reformuler aux élèves la définition de cet objectif.
-->

---

# Plan de la présentation

1. **L'outil** - Juice Shop, challenges et niveaux
2. **Rappel HTTP** - requête, réponse, HTML vs JavaScript
3. **5 challenges** - Score Board, DOM XSS, Confidential Document, Error Handling, Login Admin
4. **Pour aller plus loin** - challenges suivants et contre-mesures

<div class="mt-6 p-3 bg-yellow-600 rounded text-yellow-200">

Chaque challenge a sa solution **repliée** : essayer d'abord, ouvrir ensuite.

</div>

---
layout: section
---

# Partie 1
## L'outil

---

# OWASP Juice Shop

<v-clicks>

- Site développé par **OWASP**
- Comprend de **nombreuses failles** de sécurité
- Outil pédagogique pour comprendre **concrètement** les failles de sécurité

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-700 rounded text-blue-300">

Application locale : <http://localhost:3000> (voir la [page de la thématique](https://etml-inf.github.io/183-SecuriteApplication/thematiques/04-hacker) pour le démarrage Docker).

</div>

</v-click>

<!--
Faire reformuler aux élèves ce qu'est Juice Shop : une appli volontairement vulnérable.
-->

---

# Les challenges

Les failles sont expliquées au travers de différents **challenges** :

<v-clicks>

- Difficulté de **1 à 5** étoiles
- Challenges en **mode guidé**
- **Notifications d'aide** pour réaliser le challenge

</v-clicks>

---

# Rappel : HTTP

<div class="grid grid-cols-2 gap-6">
<div>

### Requête

```http
GET /rest/products HTTP/1.1
Host: localhost:3000
Cookie: ...

(corps)
```

- `GET` / `POST` / `PUT` + ressource
- Entête (texte)
- Corps (texte / bytes)

</div>
<v-click>
<div>

### Réponse

```http
HTTP/1.1 200 OK
Content-Type: application/json

(corps)
```

- Ligne de statut
- Entête (texte)
- Corps (texte / bytes)

</div>
</v-click>
</div>

<v-click>

<div class="mt-4 p-3 bg-blue-800 rounded text-blue-100">

À distinguer : **HTML** (contenu) vs **JavaScript** (exécuté par le navigateur), cookies, storage local, ...

</div>

</v-click>

---

# Aide : traduire le site

<v-clicks>

- Traduire le site en français (la traduction n'est pas parfaite)
- Menu en haut à gauche
- « Aide pour commencer »

</v-clicks>

---
layout: section
---

# Partie 2
## Les challenges

---

# 1er challenge : Score Board

<div class="mt-4 p-4 bg-blue-700 rounded text-blue-300 text-xl">

Découvrir la page cachée du tableau des scores.

</div>

<v-click>

<details class="mt-8">
<summary>Voir la solution</summary>

- Ouvrir les **outils développeurs** (`F12`)
- Parcourir les **fichiers sources**
- Atteindre <http://localhost:3000/#/score-board>

</details>

</v-click>

<!--
Le but est d'amener l'élève à lire le code du client : tout ce qui est envoyé au navigateur est visible.
-->

---

# 2ème challenge : DOM XSS

<div class="mt-4 p-4 bg-blue-700 rounded text-blue-300 text-xl">

Faire exécuter du code dans le navigateur via la barre de recherche.

</div>

<v-click>

<details class="mt-8">
<summary>Voir la solution</summary>

Dans la barre de recherche :

```html
<h1>hello world</h1><ul><li>test</li></ul>
```

```html
<iframe src="javascript:alert(`xss`)">
```

</details>

</v-click>

<!--
Le premier payload montre que le HTML saisi est interprété ; le second prouve l'exécution de JavaScript.
Lien avec la thématique 06 (XSS).
-->

---

# Challenge bonus : Bonus Payload

<div class="mt-4 p-4 bg-yellow-600 rounded text-yellow-200 text-xl">

Bonus Payload

</div>

<v-click>

<div class="mt-6">

Partir du challenge **DOM XSS** : quel payload plus riche peut-on injecter ?

</div>

</v-click>

<!--
Les notifications d'aide de Juice Shop guident l'élève pour ce challenge.
-->

---

# 3ème challenge : Confidential Document

<div class="mt-4 p-4 bg-blue-700 rounded text-blue-300 text-xl">

Trouver un document confidentiel.

</div>

<v-click>

<details class="mt-8">
<summary>Voir la solution</summary>

1. Se rendre dans la page « **À propos de nous** »
2. Cliquer sur le lien « *Lisez nos CGU ennuyantes si vous êtes intéressé par ce genre de trucs.* »
3. Dans l'URL, supprimer `Legal.md`
4. Trouver le document confidentiel

</details>

</v-click>

---

# 4ème challenge : Error Handling

<div class="mt-4 p-4 bg-blue-700 rounded text-blue-300 text-xl">

Gestion des erreurs : provoquer une erreur de l'application.

</div>

<v-click>

<details class="mt-8">
<summary>Voir la solution</summary>

Se rendre sur <http://localhost:3000/rest/qwertz>

**Qu'en déduisez-vous ?**

</details>

</v-click>

<!--
Discussion : que révèle le message d'erreur (technologie, chemins, version) ? Lien avec Security Misconfiguration.
-->

---

# 5ème challenge : Login Admin

<div class="mt-4 p-4 bg-blue-700 rounded text-blue-300 text-xl">

Se connecter en tant qu'administrateur.

</div>

<v-click>

<details class="mt-8">
<summary>Voir la solution</summary>

Dans le formulaire d'identification :

```text
' or 1=1--
```

Pour cibler l'admin, trouver son adresse puis :

```text
admin@juice-sh.op'--
```

</details>

</v-click>

<!--
Injection SQL : la condition devient toujours vraie, le reste de la requête est mis en commentaire.
-->

---

# Challenges suivants

Niveau **3 étoiles** :

<v-clicks>

- View Basket
- Login Jim
- Login Bender

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-yellow-600 rounded text-yellow-200">

Pour chaque challenge réussi : le **classer** dans le Top 10:2025 (document `JuiceShop.docx`).

</div>

</v-click>

---
layout: center
class: text-center
---

# Contre-mesures

<v-click every=1>

Il est temps d'aller maintenant vers le **code source** pour identifier le code impliqué...

<div class="pt-12 mb-4">
  <span class="px-4 py-2 rounded bg-blue-500 text-white text-xl">
    Comprendre l'attaque pour mieux la corriger
  </span>
</div>

# Questions ?

<div class="mt-8 text-gray-500">

Guide pratique : [JuiceShop.docx](https://etml-inf.github.io/183-SecuriteApplication/exercices/hack/JuiceShop.docx)

</div>
</v-click>
