---
theme: default
title: "Les sessions web"
info: "Principe d'une session, HTTP stateless et maintien de la connexion"
author: ETML
transition: slide-left
mdc: true
---

# Les sessions web

## Rester connecté sur un protocole sans mémoire

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - Thématique 03
  </span>
</div>

---

# Les objectifs

À la fin de la séquence, vous serez capables de :

<v-clicks>

- **Expliquer** le principe d'une session
- **Connaître** les dangers liés à la gestion de mot de passe
- **Décrire** le contenu d'un token JWT
- **Valider** un token JWT à l'aide de jwt.io

</v-clicks>

<!--
Faire reformuler aux élèves la définition de ces objectifs.
-->

---

# Le principe : l'authentification

```mermaid {scale: 0.8}
sequenceDiagram
    participant C as Client
    participant S as Serveur
    participant D as Database
    C->>S: 1. Nom + mot de passe
    S->>D: Recherche de l'utilisateur
    D-->>S: Hash + sel stockés
    Note over S: 2. Vérification
    S-->>C: Réponse
```

<v-click>

<div class="mt-4 p-3 bg-blue-700 rounded text-blue-300">

**Vérification** : le mot de passe salé et haché correspond-il au contenu de la base de données ?

</div>

</v-click>

<!--
Demander aux élèves ce qui se passe lors de la vérification. Poser ensuite le problème : et après ?
-->

---

# Brainstorm

<div class="mt-12 p-6 bg-yellow-600 rounded text-yellow-200 text-2xl text-center">

Comment maintenir la connexion « ouverte » entre le client et le serveur ?

</div>

<v-click>

<div class="mt-6 text-center text-xl">

Et d'abord, que veut dire « ouverte » ?

</div>

</v-click>

<!--
HTTP est stateless : chaque requête est indépendante. Laisser les élèves proposer des pistes (cookie, identifiant de session, jeton...).
-->

---
layout: center
class: text-center
---

# Questions ?

<div class="mt-8 text-gray-500">

Prochaine étape : la protection des mots de passe

</div>
