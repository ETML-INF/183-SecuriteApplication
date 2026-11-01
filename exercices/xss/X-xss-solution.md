# XSS : solution

Essaie d'abord l'exercice (`e-183-ALL-XSS.docx`) : voir aussi les [indices](../indices.md).

## XSS réfléchi (`docker-xss-http-payload`, port 8087)

**La faille** : `/search-results` écrit le paramètre `q` tel quel dans la page HTML.

```js
const searchResults = `<h1>Search results</h1><p>Search results for "${searchTerm}".</p>`;
```

**Exploitation** : `http://localhost:8087/search-results?q=<script>alert(document.cookie)</script>`

**Correction** : encoder les caractères HTML au moment d'écrire dans la page (le module `escape-html` est déjà importé dans `server.mjs`).

```js
const searchResults = `<h1>Search results</h1><p>Search results for "${escapeHtml(searchTerm)}".</p>`;
```

`escape-html` figure déjà dans le `package.json` de ce projet : il suffit de l'utiliser (le dossier `app` est monté dans le conteneur, `nodemon` redémarre seul).

## XSS stocké (`docker-xss-stored`, port 8086)

**La faille** : le commentaire est enregistré tel quel (les requêtes SQL sont paramétrées, pas d'injection SQL ici), puis `index.html` l'écrit avec `innerHTML`, donc pour **tous** les visiteurs.

```js
commentsContainer.innerHTML += `<div>${comment.comText}</div>`;
```

**Exploitation** : poster le commentaire `<img src=x onerror="alert(document.cookie)">` (un `<script>` inséré via `innerHTML` ne s'exécute pas, un attribut `onerror` oui).

**Correction côté navigateur** : ne jamais interpréter le texte comme du HTML.

```js
comments.forEach(comment => {
  const div = document.createElement('div');
  div.textContent = comment.comText;
  commentsContainer.appendChild(div);
});
```

Variante côté serveur : encoder avec `escapeHtml` avant de renvoyer le JSON (mais encoder à l'**affichage** reste la règle).

## Défenses en plus (pas à la place)
- Cookies de session en `HttpOnly` : le script injecté ne lit pas `document.cookie`.
- En-tête `Content-Security-Policy: default-src 'self'` : bloque les scripts inline.
- Catégorie Top 10:2025 : A05 Injection.

_Testé le 2026-11-01 : sans correction, `q=<script>…` est renvoyé tel quel et un commentaire `<img onerror>` s'exécute dans le navigateur ; avec correction, le texte s'affiche encodé (`&lt;script&gt;`) et rien ne s'exécute._
