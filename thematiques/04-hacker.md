# White Hacker ?
Quoi de mieux pour s’entraîner que de se mettre dans la peau d’un hacker face à une application, supposée mal sécurisée...

## Juice shop

1. [Intro Juiceshop (slides)](https://etml-inf.github.io/183-SecuriteApplication/slides/04-juiceshop/) ([version PowerPoint](../supports/04-Juiceshop.pptx))
2. [JuiceShop | Guide pratique](../exercices/hack/JuiceShop.docx)


## DVNA
Si le juiceShop est maîtrisé ou déjà connu, une autre application avec quelques failles est [DVNA](https://github.com/appsecco/dvna/blob/master/docs/SUMMARY.md)

## Vérifier que ça marche
Après `docker run -d -p 3000:3000 bkimminich/juice-shop:v20.3.0` (le premier démarrage prend quelques secondes) :

| Quoi | URL | Résultat attendu |
|---|---|---|
| Application | http://localhost:3000 | la boutique de jus s'affiche |
| API | http://localhost:3000/rest/admin/application-version | JSON avec la version `20.3.0` |

Port 3000 déjà pris ? Utiliser `-p 3100:3000` et remplacer l'URL en conséquence.
