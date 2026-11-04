---
theme: default
title: "Signature des JWT : HS256 et RS256"
info: "Fonctions SHA, génération de clés avec openssl, signatures symétrique et asymétrique"
author: ETML
transition: slide-left
mdc: true
---

# Signature des JWT

## SHA, clés RSA, HS256 et RS256

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - Thématique 03
  </span>
</div>

---
layout: section
---

# Partie 1
## Les SHA

---

# Définition : Secure Hash

Famille de fonctions de hachage standardisées :

<v-clicks>

- **SHA-0**
- **SHA-1**
- **SHA-2** (SHA-256, SHA-512...)
- **SHA-3**

</v-clicks>

---
layout: section
---

# Partie 2
## Générer une paire de clés (RSA)

---

# Génération de la clé privée

```bash {all|1-2|3-4}
# RSA
openssl genpkey -algorithm RSA -out server.key -pkeyopt rsa_keygen_bits:4096
# ECDSA
openssl genpkey -algorithm EC -out server.key -pkeyopt ec_paramgen_curve:P-256
```

---

# Conversion de la clé publique

```bash {all|1-2|3-4|5-6}
# PEM
openssl pkey -in server.key -pubout -out public.pem
# DER
openssl pkey -in server.key -outform DER -pubout -out public.der
# Alternative
ssh-keygen -e -m PEM -f id_rsa.pub > public.pem
```

<v-click>

<div class="mt-4 p-3 bg-blue-700 rounded text-blue-300">

Ressource utile : <https://www.cryptool.org/en/cto/openssl>

</div>

</v-click>

---
layout: section
---

# Partie 3
## RS256 vs HS256

---

# HS256

**HMAC with SHA-256**

<v-clicks>

- HMAC : *Hash-Based Message Authentication Code*
- Algorithme **symétrique**
- Une **clé unique** génère et valide la signature
- Seul le serveur émetteur du jeton est capable de prouver que le jeton n'a pas été forgé

</v-clicks>

---

# RS256

**RSA Signature with SHA-256**

<v-clicks>

- Algorithme **asymétrique**
- Une **paire de clés** privée / publique
- La clé privée **signe**, la clé publique **vérifie**

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-green-700 rounded text-green-200">

La clé publique peut être donnée à tous les services qui doivent vérifier le token, sans leur permettre d'en forger.

</div>

</v-click>

---

# Comparaison

| | HS256 | RS256 |
|---|---|---|
| Type | Symétrique | Asymétrique |
| Clés | 1 secret partagé | Privée + publique |
| Signe avec | Le secret | La clé privée |
| Vérifie avec | Le même secret | La clé publique |

---
layout: center
class: text-center
---

# Activité 2

## Les jetons JWT (pratique)

<div class="mt-8 text-gray-500">

Énoncé : *E-183-ALL-JWT-TOKEN-Pratique.docx*

</div>

---

# Par quoi commencer ?

<v-clicks>

- **Démarrer** le serveur
- **Tester** les URLs avec un client HTTP
- Dans le code : **passer en revue** les fichiers et comprendre leur fonction
- **Identifier** les fichiers à modifier

</v-clicks>

<v-click>

<div class="mt-4 p-3 bg-blue-700 rounded text-blue-300">

Sites utiles : <https://jwt.io> · <https://www.npmjs.com/package/jsonwebtoken>

</div>

</v-click>
