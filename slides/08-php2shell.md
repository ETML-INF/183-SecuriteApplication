---
theme: default
title: "PHP2Shell (CVE-2026-109618 / CVE-2026-109619)"
info: "Comprendre une faille mémoire critique de PHP sans C ni débogueur : processus, allocation, nettoyage, fuite, exécution"
author: ETML
transition: slide-left
mdc: true
twoslash: false
colorSchema: dark
---

# PHP2Shell

## Quand la mémoire d'un serveur PHP n'est pas nettoyée entre deux visiteurs

<div class="pt-12">
  <span class="px-2 py-1 rounded bg-blue-500 text-white">
    ICT-183 - CVE-2026-109618 / CVE-2026-109619
  </span>
</div>

---

# Plan de la présentation

1. **Contexte** - un serveur PHP, c'est quoi concrètement ?
2. **La mémoire en 2 minutes** - allocation, usage, nettoyage
3. **CVE-2026-109618** - une erreur qui coupe le nettoyage
4. **CVE-2026-109619** - un état qui survit entre deux visiteurs
5. **La chaîne complète** - 3 payloads, de l'écriture à l'exécution
6. **Impact et défenses**

---
layout: section
---

# Partie 1
## Contexte : un serveur PHP, c'est quoi ?

---

# Un "worker" qui sert plusieurs visiteurs

<v-clicks>

- Un serveur PHP (ex. PHP-FPM) démarre quelques **processus** à l'avance ("workers")
- Chaque visite de site = une **requête**, traitée par un worker **disponible**
- Après la requête, le worker est **remis dans la pile** pour la requête suivante
- Un même worker peut donc traiter, l'un après l'autre, les requêtes de **plusieurs visiteurs différents**

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Analogie : une chambre d'hôtel. Le client change, mais parfois la chambre n'est pas totalement refaite avant le suivant.
</div>

</v-click>

---

# Entre deux requêtes, il y a un ménage à faire

<div class="grid grid-cols-2 gap-6">
<div>

### Ce qui devrait se passer

1. Requête A arrive, utilise de la mémoire
2. Requête A se termine
3. Cette mémoire est **nettoyée**
4. Requête B arrive dans une mémoire "propre"

<div class="flex gap-1 justify-center mt-4 font-mono text-xs">
  <div class="w-12 h-12 flex items-center justify-center rounded bg-blue-700 text-white">data</div>
  <span class="self-center text-gray-300">→</span>
  <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
  <span class="self-center text-gray-300">→</span>
  <div class="w-12 h-12 flex items-center justify-center rounded bg-blue-700 text-white">data B</div>
</div>

</div>
<v-click>
<div>

### Ce qu'on va casser

1. Requête A arrive, utilise de la mémoire
2. Requête A se termine **mal** (erreur)
3. Le nettoyage est **sauté**
4. Requête B arrive dans une mémoire **sale**

<div class="flex gap-1 justify-center mt-4 font-mono text-xs">
  <div class="w-12 h-12 flex items-center justify-center rounded bg-blue-700 text-white">data</div>
  <span class="self-center text-gray-300">→</span>
  <div class="w-12 h-12 flex items-center justify-center rounded bg-blue-700 text-white ring-2 ring-red-400">data</div>
  <span class="self-center text-gray-300">→</span>
  <div class="w-12 h-12 flex items-center justify-center rounded bg-blue-700 text-white ring-2 ring-red-400">data</div>
</div>

</div>
</v-click>
</div>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
Dans le cas cassé, B hérite de la donnée de A au lieu d'une case vide. C'est exactement ce mécanisme qui va servir de porte d'entrée dans les parties suivantes.
</div>

</v-click>

---
layout: section
---

# Partie 2
## La mémoire en 2 minutes

---

# Trois gestes, toujours les mêmes

<v-clicks>

- **Allouer** : réserver une case mémoire pour y mettre des données (ex. le contenu d'un formulaire envoyé)
- **Utiliser** : lire/écrire dans cette case pendant le traitement de la requête
- **Nettoyer** : remettre la case à zéro et la rendre disponible pour la prochaine requête

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white">
Le nettoyage n'est pas automatique par magie : c'est du code, écrit par des humains, qui doit s'exécuter jusqu'au bout.
</div>

</v-click>

---

# Le nettoyage est une étape du code, pas un réflexe

```text {1|2|3|4|5|all}
1. ALLOUER   réserver une case (taille X)
2. UTILISER  écrire les données reçues
3. TRAITER   exécuter la logique PHP
4. NETTOYER  vider la case, la marquer libre
5. FIN       worker prêt pour la suite
```

<div class="text-sm text-gray-200 mt-3 mb-1">Cas normal : toutes les étapes s'enchaînent</div>

<FlowShortcut />

<v-click>

<div class="text-sm text-gray-200 mt-3 mb-1">Cas « mémoire pleine » (OOM) : l'erreur court-circuite NETTOYER</div>

<FlowShortcut oom />

</v-click>

<v-click>

<div class="mt-3 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
Le nettoyage n'est pas « raté » : il n'est tout simplement <strong>jamais exécuté</strong>. La case garde son contenu.
</div>

</v-click>

---

# Légende des schémas suivants

<div class="flex gap-3 justify-center mt-8 font-mono text-sm">
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
    <span class="text-xs text-gray-200">case nettoyée</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 flex items-center justify-center rounded bg-blue-700 text-white">data</div>
    <span class="text-xs text-gray-200">donnée normale</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 flex items-center justify-center rounded bg-red-700 text-white text-center">open<br/>shell</div>
    <span class="text-xs text-gray-200">octets de l'attaquant</span>
  </div>
  <div class="flex flex-col items-center gap-2">
    <div class="w-16 h-16 flex items-center justify-center rounded bg-yellow-500 text-gray-900 font-bold text-center">→ ?</div>
    <span class="text-xs text-gray-200">pointeur / aiguillage</span>
  </div>
</div>

<div class="mt-6 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Ces 4 couleurs reviennent dans tous les schémas de la suite.
</div>

---
layout: section
---

# Partie 3
## CVE-2026-109618 : une erreur qui coupe le nettoyage

---

# Le déclencheur : une erreur "mémoire pleine"

<v-clicks>

- PHP fixe une limite de mémoire par requête ("memory limit")
- Une requête peut être construite pour **approcher volontairement cette limite**
- Quand la limite est atteinte, PHP **arrête brutalement** le traitement (erreur fatale "out of memory") :

```text
Fatal error: Allowed memory size of 134217728
bytes exhausted (tried to allocate 65536 bytes)
```

- Cet arrêt brutal **interrompt** le chemin normal, y compris l'étape de nettoyage

</v-clicks>

<v-click>

<div class="mt-3 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Analogie : le client de l'hôtel part en urgence (alarme incendie). Le ménage prévu n'a pas lieu.
</div>

</v-click>

<v-click>

<div class="mt-1 p-3 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white">
Sur un serveur PHP-FPM, le worker qui a affiché cette erreur fatale <strong>n'est pas détruit</strong> : il reste en vie et sert la requête d'après.
</div>

</v-click>

---

# Côté PHP : les réglages qui bornent la mémoire

```ini {1|2|3-4|5|all}
; php.ini (valeurs par défaut courantes)
memory_limit = 128M
upload_max_filesize = 2M
post_max_size = 8M
max_file_uploads = 20
```

<v-clicks>

- **memory_limit** : plafond de mémoire pour **une** requête PHP (le worker en reçoit un nouveau à chaque requête)
- **post_max_size** : taille maximale du corps de la requête HTTP (formulaire + fichiers)
- **upload_max_filesize** / **max_file_uploads** : taille et nombre des fichiers envoyés
- Dépasser **memory_limit** = erreur fatale, pas une simple exception à attraper

</v-clicks>

<v-click>

<div class="mt-3 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Ces valeurs sont des <strong>garde-fous</strong>, pas une protection : elles décident seulement <em>à quel moment</em> PHP s'arrête, pas ce qui se passe après.
</div>

</v-click>

---

# Le file upload : une porte d'entrée pour remplir la mémoire

```text {1|2-3|4|5-6|all}
Visiteur -> POST multipart/form-data
  -> PHP lit le corps de la requête et le découpe
     en champs et en fichiers
  -> chaque fichier va dans un fichier temporaire
  -> $_FILES décrit ces fichiers (nom, taille, tmp)
     et les champs texte vivent en mémoire
```

<div class="mt-3 grid grid-cols-2 gap-4 text-sm">
<div class="p-3 rounded border-l-4 border-green-400 bg-green-900 text-white">
<strong>Contrôlé par le serveur</strong><br/>
limites (post_max_size, memory_limit), dossier temporaire, moment du nettoyage
</div>
<div class="p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
<strong>Contrôlé par l'attaquant</strong><br/>
taille, nombre de champs, nom, <strong>contenu exact des octets</strong> envoyés
</div>
</div>

<v-click>

<div class="mt-3 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
C'est pourquoi un formulaire d'envoi suffit comme vecteur : l'attaquant choisit la <strong>quantité</strong> (pour approcher la limite) et le <strong>contenu</strong> (« open shell » + remplissage) qui atterrit en mémoire.
</div>

</v-click>

---

# Payload 1 : remplir puis faire planter

```text {1|2-3|4|5|6-7|all}
Requête A (l'attaquant)
  -> envoie des données calibrées pour remplir
     une case précise ("open shell" + remplissage)
  -> pousse PHP juste au-dessus de sa limite
  -> PHP arrête la requête : "out of memory"
  -> NETTOYER est sauté : la case reste occupée,
     jamais remise à zéro
```

<div class="mt-3 flex items-center justify-center gap-6 font-mono text-xs">
  <div class="flex flex-col items-center gap-2">
    <span class="text-gray-200">avant la requête A</span>
    <div class="flex gap-1">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
    </div>
  </div>
  <v-click at="6">
  <div class="flex flex-col items-center gap-2">
    <span class="text-red-300">après le plantage (OOM)</span>
    <div class="flex gap-1">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-red-700 text-white text-center text-[10px]">open<br/>shell</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
    </div>
  </div>
  </v-click>
</div>

<v-click at="7">

<div class="mt-3 p-3 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white">
Résultat de CVE-2026-109618 : la case contenant "open shell" reste dans le worker, jamais remise à zéro. Pour l'instant, ce n'est qu'une donnée inerte - rien ne l'exécute encore.
</div>

</v-click>

---

# Le film : du plantage au raccourci

<MemoryMovie :from="0" :to="5" />

<div class="mt-2 text-sm text-gray-200">
Lecture automatique avec ▶, ou pas à pas avec ◀ ▶|.
</div>

---
layout: section
---

# Partie 4
## CVE-2026-109619 : un état qui survit entre deux visiteurs

---

# Le même worker ressert la même case

<v-clicks>

- Le worker qui a planté n'est pas détruit : il est **remis en service** pour économiser des ressources
- La case mémoire "sale" de la partie 3 n'a pas disparu : elle est toujours là, en mémoire
- La requête suivante, d'un **autre visiteur**, peut recevoir **le même worker**, donc **la même case**
- Elle peut alors **lire** ce qui s'y trouve encore, au lieu d'une case vide

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
C'est le cœur de CVE-2026-109619 : un état qui aurait dû être libéré est réutilisé tel quel par une requête qui n'a rien à voir avec la précédente.
</div>

</v-click>

---

# Payload 2 : lire ce que l'hôte précédent a laissé

```text {1|2|3-4|5-6|all}
Requête B (peu après, même worker)
  -> envoie une requête normale
  -> le worker réutilise la case laissée "sale"
     par A
  -> PHP interprète ce contenu résiduel comme
     les données de B
```

<div class="mt-3 flex items-center justify-center gap-6 font-mono text-xs">
  <div class="flex flex-col items-center gap-2">
    <span class="text-gray-200">worker réutilisé pour B</span>
    <div class="flex gap-1">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-red-700 text-white text-center text-[10px]">open<br/>shell</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
    </div>
  </div>
  <v-click at="5">
  <div class="flex flex-col items-center gap-2">
    <span class="text-orange-300">B lit la case du milieu</span>
    <div class="flex gap-1">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-red-700 text-white text-center text-[10px] ring-4 ring-orange-400">open<br/>shell</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
    </div>
  </div>
  </v-click>
</div>

<v-click at="6">

<div class="mt-3 p-3 rounded border-l-4 border-orange-400 bg-orange-900 text-white">
À ce stade : une simple fuite d'information. La réponse renvoyée à B contient des fragments de ce que A avait mis dans la case, mais "open shell" reste de la donnée inerte - personne ne l'exécute encore.
</div>

</v-click>

---
layout: section
---

# Partie 5
## La chaîne complète : de l'écriture à l'exécution

---

# Deux rôles bien différents dans la mémoire

<v-clicks>

- **Écrire le code** : une case qui contient juste des octets ("open shell") - tant que rien ne va la lire comme instruction, elle est inoffensive
- **Rediriger l'exécution** : une autre case, ailleurs, contient un **pointeur** - une information du type "voici la prochaine instruction à exécuter"
- Le même bug mémoire (OOM + réutilisation) peut toucher **les deux cases**, pas forcément à la même requête
- Le code "open shell" a donc très bien pu être écrit par la requête A du payload 1 - **avant** que quoi que ce soit ne pointe vers lui

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
C'est la nuance clé : on n'exécute jamais une case "au hasard". On corrompt un pointeur pour qu'il désigne une case que l'on a préparée à l'avance.
</div>

</v-click>

---

# Pourquoi pas juste un crash ? Data vs pointeur

<div class="grid grid-cols-2 gap-6">
<div>

### Écrire une donnée (payload 1)

1. Allouer la case
2. Copier les octets dedans

<div class="mt-2 p-2 rounded border-l-4 border-blue-400 bg-blue-900 text-white text-sm">
Une seule écriture. Une interruption laisse juste des octets inertes, intacts.
</div>

</div>
<v-click>
<div>

### Écrire un pointeur (payload 3)

1. Mettre à jour un **champ lié** (type, validité...)
2. Écrire la **valeur** du pointeur

<div class="mt-2 p-2 rounded border-l-4 border-red-400 bg-red-900 text-white text-sm">
Deux écritures coordonnées. Une interruption <strong>entre les deux</strong> laisse une structure incohérente.
</div>

</div>
</v-click>
</div>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white">
Le reste du programme fait confiance à ces deux champs ensemble, sans les revérifier à chaque lecture : "si ce champ est là, le pointeur est forcément valide". C'est cette <strong>confiance implicite</strong>, pas la donnée elle-même, qui est détournée - pas une "redirection d'erreur", mais le moment précis de l'interruption qui décide ce qui reste incohérent.
</div>

</v-click>

<v-click>

<div class="mt-1 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Principe général de robustesse logicielle, pas une recette d'exploitation : une mise à jour en plusieurs étapes doit aboutir entièrement ou être annulée entièrement (atomicité), sinon une interruption au mauvais moment laisse un état incohérent.
</div>

</v-click>

---

# Payload 3 : corrompre le pointeur vers "open shell"

```text {1|2-3|4|5|6-7|8-9|all}
Requête C (l'attaquant) - écrit puis plante
  -> remplit une AUTRE case : celle d'un
     pointeur interne ("quelle fonction ensuite ?")
  -> l'écriture est interrompue au milieu (OOM)
  -> NETTOYER sauté : le pointeur reste incohérent
     (cf. slide précédent)

Requête D (plus tard, même worker) - exécute
  -> du code normal relit ce pointeur
  -> il désigne la case "open shell" => exécution
```

<div class="mt-3 flex items-center justify-center gap-4 font-mono text-xs">
  <div class="flex flex-col items-center gap-2">
    <span class="text-gray-200">fin requête C : pointeur corrompu</span>
    <div class="flex gap-1">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-yellow-500 text-gray-900 font-bold text-center">→ ?</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-red-700 text-white text-center text-[10px]">open<br/>shell</div>
    </div>
  </div>
  <v-click at="8">
  <div class="flex flex-col items-center gap-2">
    <span class="text-red-300">requête D : il désigne la case préparée</span>
    <div class="flex gap-1 items-center">
      <div class="w-12 h-12 flex items-center justify-center rounded bg-yellow-500 text-gray-900 font-bold text-center">→ 3</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-gray-700 text-gray-100">libre</div>
      <div class="w-12 h-12 flex items-center justify-center rounded bg-red-700 text-white text-center text-[10px] ring-4 ring-red-300">EXEC</div>
    </div>
  </div>
  </v-click>
</div>

<v-click at="9">

<div class="mt-3 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
D'où le nom PHP2Shell : on écrit du code inoffensif dans une case (requête A, payload 1), on le relit par accident ou par sonde (requête B, payload 2), on corrompt un pointeur ailleurs (requête C, payload 3) - puis une <strong>requête D</strong>, plus tard, suit ce pointeur et exécute.
</div>

</v-click>

<v-click at="9">

<div class="mt-1 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
À retenir : <strong>deux cases différentes, deux rôles différents</strong>. Relire la case « open shell » ne la transforme jamais en pointeur toute seule - ce sont de simples octets, inertes quel que soit le nombre de fois qu'on les relit. Il faut un <strong>second</strong> événement de corruption, qui touche spécifiquement la case du pointeur (requête C), pour que l'exécution soit redirigée vers la première case.
</div>

</v-click>

---

# Le film complet : de l'écriture à l'exécution

<MemoryMovie />

---

# Le fil à retenir

<div class="grid grid-cols-2 gap-6">
<div>

### Les 3 payloads

1. **Écrire + planter** (CVE-109618) : le code "open shell" reste en mémoire, non nettoyé
2. **Relire** (CVE-109619) : une autre requête tombe sur cette case et la lit
3. **Rediriger** : un pointeur corrompu désigne cette case -> exécution

</div>
<div>

### Les 3 notions mémoire

- **Allocation** : réserver une case
- **Nettoyage** : la vider après usage
- **Réutilisation** : la redonner à la requête suivante

</div>
</div>

<div class="mt-4 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Aucune de ces notions n'est propre à PHP : elles existent dans tout programme qui réutilise des processus pour aller plus vite.
</div>

---

# Le détail crucial : une mémoire pas étanche

<div class="p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
La mémoire d'un worker n'est <strong>pas étanche</strong> entre sa propre gestion et le traitement d'une requête, ni entre deux requêtes successives.
</div>

<v-clicks>

<div class="mt-2 p-2 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white text-sm">
Seule étanchéité <strong>garantie</strong> : celle de l'OS entre deux <strong>processus</strong> (deux workers différents). Dans un même worker, tout partage le même espace mémoire.
</div>

<div class="mt-2 p-2 rounded border-l-4 border-orange-400 bg-orange-900 text-white text-sm">
Étanchéité totale entre requêtes = <strong>1 worker = 1 requête</strong>, détruit juste après - reconstruire la chambre d'hôtel à chaque client.
</div>

<div class="mt-2 p-2 rounded border-l-4 border-blue-400 bg-blue-900 text-white text-sm">
Trop lent en pratique. On <strong>réutilise</strong> le worker pour la vitesse, et on accepte en échange qu'un nettoyage interrompu laisse une trace lisible, voire exécutable, pour la requête suivante.
</div>

</v-clicks>

<v-click>

<div class="mt-2 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
Ce compromis "vitesse contre étanchéité" est la cause racine de toute cette faille - pas une erreur de programmation isolée.
</div>

</v-click>

---
layout: section
---

# Partie 6
## Impact et défenses

---

# Pourquoi c'est critique

<v-clicks>

- **Pas d'authentification nécessaire** : une simple requête HTTP suffit à déclencher le problème
- **Toutes les versions de PHP 5.4 à 8.5.11** étaient concernées avant le correctif (octobre 2026)
- Des millions de serveurs exposés sur Internet, selon les chercheurs en sécurité
- Exploitation observée **en conditions réelles**, avant même la publication du correctif

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-red-400 bg-red-900 text-white">
Score CVSS 4.0 : 9.2 / 10 - exécution de code à distance, sans identifiant, sur un service exposé publiquement.
</div>

</v-click>

---

# Et dans un langage "memory-safe" ?

<v-clicks>

- Un langage comme **Rust** impose, **à la compilation**, les règles qu'on a identifiées comme la racine du problème : pas d'état "à moitié écrit" visible, pas de pointeur vers une case déjà libérée
- Le contrôle se fait **statiquement** (avant l'exécution), pas par une vérification à chaque accès mémoire -> la garantie n'a presque pas de coût en performance à l'exécution
- Par défaut, un échec d'allocation mémoire y **arrête tout le processus** plutôt que de continuer avec un état douteux - l'esprit même de `pm.max_requests`, mais appliqué automatiquement par le langage
- Nuance : un moteur dynamique performant garde souvent quelques zones `unsafe` explicites pour la vitesse - c'est là, et seulement là, que ce type de bug pourrait resurgir

</v-clicks>

<v-click>

<div class="mt-4 p-3 rounded border-l-4 border-blue-400 bg-blue-900 text-white">
Rust ne supprime pas le compromis vitesse/étanchéité du slide précédent - il déplace une grande partie du coût de la vérification de l'exécution vers la compilation, et réduit la "surface à risque" à un petit nombre d'endroits explicitement marqués.
</div>

</v-click>

---

# Défenses

<v-clicks>

<div class="mt-1 p-1 rounded border-l-4 border-green-400 bg-green-900 text-white">
Mettre à jour PHP vers une version corrigée (8.5.12, 8.4.27, 8.3.36 ou 8.2.35) - seule correction complète
</div>
<div class="mt-1 p-1 rounded border-l-4 border-green-400 bg-green-900 text-white">
En attendant : limiter la mémoire disponible par requête et désactiver les fonctionnalités qui facilitent le déclenchement (mesures temporaires seulement)
</div>
<div class="mt-1 p-1 rounded border-l-4 border-green-400 bg-green-900 text-white">
Ne jamais faire confiance à un "ça n'a jamais planté" : un processus censé être propre doit le rester même en cas d'erreur
</div>
<div class="mt-1 p-1 rounded border-l-4 border-green-400 bg-green-900 text-white">
<code>pm.max_requests</code> (PHP-FPM) : forcer chaque worker à redémarrer proprement après N requêtes, pour borner la durée de vie d'un worker potentiellement "sali"
</div>
<div class="mt-1 p-1 rounded border-l-4 border-yellow-400 bg-yellow-900 text-white">
Principe général (pas que PHP) : traiter toute erreur mémoire comme un événement de sécurité, pas juste un bug de stabilité
</div>

</v-clicks>

---
layout: center
class: text-center
---

<v-click every=1>

Une case mémoire mal nettoyée entre deux requêtes peut transformer un simple script en accès shell.

<div class="pt-12 mb-4">
  <span class="px-4 py-2 rounded bg-blue-500 text-white text-xl">
    Nettoyer après une erreur n'est pas optionnel
  </span>
</div>

# Questions ?

<div class="mt-8 text-gray-300">

Références : watchtowr.com, sansec.io, securitylabs.datadoghq.com, unit42.paloaltonetworks.com

</div>
</v-click>
