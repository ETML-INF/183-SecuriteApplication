---
theme: default
title: "Protection des mots de passe"
info: "Risques, hachage, sel, poivre et rainbow tables"
author: ETML
transition: slide-left
mdc: true
---

# Protection des mots de passe

## Stocker sans trahir ses utilisateurs

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - Thématique 02
  </span>
</div>

---

# Plan de la présentation

1. **Les risques** - ce qui peut mal tourner avec un mot de passe stocké
2. **La prévention** - côté utilisateur et côté technique
3. **Sel et poivre** - rendre chaque hash unique
4. **Rainbow tables** - l'attaque que le sel neutralise
5. **Activité** - protéger un mot de passe

---
layout: section
---

# Partie 1
## Les risques

---

# Risques

<v-clicks>

- Les personnes de la compagnie pourraient **voir** le mot de passe
- Un mot de passe stocké en clair peut être **réutilisé** tel quel (même site ou autre site)
- Un mot de passe, même haché, peut être **comparé** à d'autres hashés
- Un mot de passe simple est sensible à une attaque par **force brute**

</v-clicks>

<!--
Demander aux élèves les risques liés aux mots de passe stockés dans une base de données.
-->

---

# Moyens de prévention pour les utilisateurs

<v-clicks>

- Activer la **double authentification**
- Choisir un mot de passe **différent pour chaque site**
- Choisir un mot de passe **complexe**

</v-clicks>

---
layout: section
---

# Partie 2
## Les moyens techniques

---

# Moyens techniques

<v-clicks>

- **Politique** de mot de passe
- **Sel**
- **Poivre**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-700 rounded text-blue-300">

Sel et poivre sont ajoutés au mot de passe **avant le hachage** afin de rendre le hash unique par rapport à tous les autres utilisateurs.

</div>

</v-click>

<v-click>

<div class="mt-4 p-3 bg-green-700 rounded text-green-200">

Utiliser un algorithme de hachage **lent**, conçu pour les mots de passe : **Argon2id** (recommandé), scrypt, bcrypt.

</div>

</v-click>

<v-click>

<div class="mt-4 p-3 bg-red-700 rounded text-red-100">

Pas de MD5 ou SHA-256 seuls : **trop rapides**.

</div>

</v-click>

<!--
Référence : https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
-->

---

# Le sel

<v-clicks>

- Chaîne de caractères **aléatoires** ajoutée au mot de passe avant le hash
- **Propre à chaque utilisateur** (chacun son sel)
- Stocké **en clair** dans la base de données
- Peu de risque si le sel fuite
- Protège contre les attaques par **table précalculée** (rainbow table)

</v-clicks>

<!--
Question : que se passe-t-il si deux utilisateurs choisissent le même mot de passe, mais que chacun a un sel différent ? (Les hashes sont différents.)
-->

---

# Le poivre

Le sel est l'option la plus connue, mais on peut l'améliorer avec un **poivre**.

<v-clicks>

- Chaîne de caractères ajoutée au mot de passe, comme le sel
- **Identique pour tous** les utilisateurs
- **Jamais stocké** dans la base de données
- Le mettre dans une **variable d'environnement** est la bonne pratique

</v-clicks>

---

# Hash table

<v-clicks>

- Table de hashes **précalculés** qui permettent de remonter vers le mot de passe original
- On y trouve les hashes de toutes les combinaisons jusqu'à une certaine longueur
- On y trouve aussi les hashes des mots de passe les plus courants

</v-clicks>

---

# Rainbow table

<v-clicks>

- Table de hachage **optimisée en taille**
- Le but est toujours de retrouver le mot de passe original en clair

</v-clicks>

---

# Protection par le sel

<v-clicks>

- Sans sel, les mots de passe sont **vulnérables** aux rainbow tables
- Les rainbow tables devraient être **recalculées** en incluant le sel (et pour chaque sel)
- Le sel rend leur génération **beaucoup plus complexe et lente**

</v-clicks>

---

# Ressource

**OWASP Password Storage Cheat Sheet**

<https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>

---
layout: center
class: text-center
---

# Activité 1

## Protéger un mot de passe

<div class="mt-8 text-gray-500">

Débuter le projet **nodejstoken** avec la première partie de l'énoncé *02-Auth.docx*

</div>
