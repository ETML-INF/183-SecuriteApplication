# Juice Shop : solutions

Essaie d'abord (`JuiceShop.docx`) : voir aussi les [indices](../indices.md). Image utilisée : `bkimminich/juice-shop:v20.3.0`.

| Défi | Piste de solution | Catégorie Top 10:2025 | Correction |
|---|---|---|---|
| Score Board | page non liée `/#/score-board`, route trouvée dans le JavaScript du client | A02 Security Misconfiguration | ne pas exposer de page d'administration ou de debug non protégée |
| DOM XSS | recherche : `<iframe src="javascript:alert(`xss`)">` | A05 Injection | `textContent` / encodage HTML à l'affichage |
| Bonus Payload | payload du tutoriel (iframe) dans la recherche | A05 Injection | idem |
| Confidential Document | répertoire `/ftp` exposé, fichier `acquisitions.md` | A02 Security Misconfiguration | désactiver le listing de répertoires, ne pas publier de fichiers internes |
| Error Handling | visiter `/rest/qwertz` : la trace d'erreur s'affiche | A10 Mishandling of Exceptional Conditions | message générique pour l'utilisateur, détails dans les logs |
| Login Admin | e-mail `admin@juice-sh.op'--` (ou `' OR 1=1--`), mot de passe quelconque | A05 Injection | requêtes préparées |
| View Basket | modifier l'identifiant du panier (`bid`, ou `/rest/basket/<id>`) pour voir celui d'un autre | A01 Broken Access Control | vérifier côté serveur que le panier appartient à l'utilisateur connecté |
| Login Jim | e-mail `jim@juice-sh.op'--` | A05 Injection | requêtes préparées |
| Login Bender | e-mail `bender@juice-sh.op'--` | A05 Injection | requêtes préparées |

Les catégories viennent de la révision 2026 (voir `docs/maintenance-2026.md`, T4). Un même défi peut se rattacher à plusieurs catégories : ce qui compte est de justifier le choix par la règle de sécurité qui aurait dû empêcher l'attaque.
