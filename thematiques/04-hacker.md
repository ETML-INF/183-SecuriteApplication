# White Hacker ?
Quoi de mieux pour s’entraîner que de se mettre dans la peau d’un hacker face à une application, supposée mal sécurisée...

## Juice shop

1. [Intro Juiceshop (slides)](../slides/04-juiceshop/){target="_blank"} ([version PowerPoint](../supports/04-Juiceshop.pptx))
2. [JuiceShop | Guide pratique](../exercices/hack/JuiceShop.docx)

**Durée** : 2-3 périodes. **Aides autorisées** : notes de cours, supports, Internet. **Rendu** : répondre directement dans `JuiceShop.docx`. Pour chaque challenge, indiquer la **catégorie du Top 10:2025**.

| Challenge | Où le trouver | À répondre |
|---|---|---|
| Page cachée du *score board* | deviner l'URL ou chercher dans ce qui n'est pas visible | catégorie Top 10 |
| DOM XSS (+ bonus *Payload*) | score board, 1 étoile, mot-clé « tutorial » | catégorie Top 10, avis sur le bonus |
| Confidential document | score board | catégorie Top 10 |
| Error handling | score board, 1 étoile, « tutorial » | catégorie, informations déduites de l'erreur |
| Login admin | score board, 2 étoiles, « tutorial » | catégorie Top 10 |
| Bonus : View Basket, Login Jim, Login Bender | 3 étoiles minimum | - |

Ensuite, **contre-mesures** : retrouver dans le [code source](https://github.com/juice-shop/juice-shop#from-sources) le fichier et les lignes impliqués pour chaque faille (DOM XSS, Error handling...) et proposer une correction. Outils utiles : console du navigateur (F12), curl/wget, grep/rg, prettier. Solution : `exercices/hack/X-JuiceShop.md`.


## DVNA
Si le juiceShop est maîtrisé ou déjà connu, une autre application avec quelques failles est [DVNA](https://github.com/appsecco/dvna/blob/master/docs/SUMMARY.md)

## Vérifier que ça marche
Après `docker run -d -p 3000:3000 bkimminich/juice-shop:v20.3.0` (le premier démarrage prend quelques secondes) :

| Quoi | URL | Résultat attendu |
|---|---|---|
| Application | http://localhost:3000 | la boutique de jus s'affiche |
| API | http://localhost:3000/rest/admin/application-version | JSON avec la version `20.3.0` |

Port 3000 déjà pris ? Utiliser `-p 3100:3000` et remplacer l'URL en conséquence.
