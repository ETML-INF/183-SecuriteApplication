# Prompts d'images - Superman et l'OWASP Top 10 (2025)

Un prompt par slide, dans l'ordre de l'histoire. Générer chaque image en **16:9 ou 3:2**, sans texte superflu.
Nommer les fichiers exactement comme ci-dessous (extension `.jpg`). Si le générateur donne du PNG, convertir ou le dire pour adapter les slides.
Les anciens fichiers du dossier (SVG, anciennes images) seront remplacés.

## Style commun (à coller au début de chaque prompt)

> Comic book illustration, bold black ink outlines, flat vibrant colors, retro Silver Age comic style, 16:9 cinematic composition. Text only where specified, no logos, no watermarks.

## Personnages (à répéter à l'identique)

- **Le héros** : "a muscular caped hero in a blue suit with a red cape, yellow belt and a yellow-and-red shield emblem on the chest, short black hair with a curl on the forehead". Si « Superman » est refusé, garder cette description.
- **Lex** : "a bald, smug villain in a purple and green armored power suit".
- **Robots gardiens** : "boxy grey security robots with one red glowing eye".
- **La kryptonite** : "a glowing green crystal". Le héros n'en est **jamais proche** (il reste à distance ou la regarde de loin).
- **Lieu** : "a dark gothic fortress tower with a giant green crystal cannon on its roof". À l'intérieur : couloirs en béton sombre, tuyaux, éclairage vert.

## Images

| Fichier | Slide | Prompt (à placer après le style et les personnages) |
|---|---|---|
| `image0.jpg` | Ouverture | *Garder l'image « Once upon a time » (livre ouvert avec château) déjà utilisée.* |
| `image1.jpg` | Mission | The bald villain in purple and green armor proudly standing in front of his dark gothic fortress tower, a giant green crystal cannon on the roof firing a beam into a stormy sky, evil grin. |
| `image2.jpg` | A01 | The caped hero disguised as a delivery man (blue cap saying "DELIVERY"), holding a "DELIVERY" badge against a card reader; a heavy door labelled "VIP LAB - TOP SECRET" opens wide, a green crystal glows far inside; two surprised guards in the background. The hero looks at the glowing crystal with a queasy face and steps back, not entering. |
| `image3.jpg` | A02 | Inside a concrete control room, the caped hero (delivery cap pushed back) sits in front of an old computer. The screen shows a login form with "admin / admin", a red "DEMO MODE" banner and a panel "Factory default settings" (default accounts, test data). A yellow sticky note "admin/admin" on the monitor. Unopened cardboard boxes around. |
| `image4.jpg` | A03 | Close-up of a computer screen in the control room listing "ROBOTS - PARTS INVENTORY": supplier "Shady Parts Inc.", component "unknown firmware, radio receiver (undeclared)" in red. Next to the screen, a small grey robot opened on a workbench, a tiny suspicious chip with a red antenna visible inside; the caped hero leans in, studying it. |
| `image5.jpg` | A04 | The caped hero crouching in a dark corridor of the fortress, holding a small walkie-talkie to his ear, yellow radio waves coming from a wall-mounted antenna box. A big white comic speech burst shows "1 2 3 4" in large red digits and a broken open red padlock. |
| `image6.jpg` | A05 | The caped hero typing on a small maintenance terminal on the chest of a grey security robot. The screen shows a field "Code: 1234 OK" then a text input containing "x' OR 1=1 ; UPDATE alarm SET on=0 ; --", and below in green "CORRIDORS: OPEN" and "ALARM: OFF". In the background, corridor doors swinging open and a red alarm lamp switched off. |
| `image7.jpg` | A06 | The caped hero in a corridor facing a large wall-mounted plan "FORTRESS DESIGN v1.0": all rooms (Lab, Armory, Prison, Hangar, Vault...) connected by thick red lines to a single red box "MASTER CONTROL"; a stamp "NO PLAN B" in red; he looks at the red box with a raised chin, understanding. |
| `image8.jpg` | A07 | In front of a massive metal door labelled "MASTER CONTROL ROOM", a grey security robot with one red eye and a screen on its chest saying "WELCOME BOSS ✔". The caped hero stands facing it with a confident smile, speech bubble "I'm the boss!". No keypad, no second-factor prompt. |
| `image9.jpg` | A08 | Inside the master control room: the caped hero at a big console, finger on a big button, a laptop screen showing "UPDATE v6.6.6 - unsigned" and a green progress bar. Through a window behind him, grey robots unplug the green crystal from the cannon and load it into a rocket on a launch pad. The hero stays far from the crystal. |
| `image10.jpg` | A09 | Security room: many CCTV monitors showing the hero crossing the fortress corridors, a security guard sleeping at his desk with a mug "World's okayest guard", a red "ALERT" lamp switched off, a dusty box labelled "LOGS" covered with spider webs. Through the window, the rocket with the green crystal flying into the night sky; the bald villain looks up at it, astonished. |
| `image11.jpg` | A10 | The fortress in a power failure: the bald villain furiously pulling a master power lever at a sparking console with a red sign "POWER FAILURE", while emergency exit doors swing wide open on their own and the caped hero walks calmly out into the night; lightning in the sky. |

## Cohérence entre les images

- Casquette « DELIVERY » : A01 et A02 uniquement (il l'enlève ensuite).
- Superman reste à l'intérieur de la forteresse de A02 à A09, et ne touche jamais le cristal.
- Les robots ont toujours un œil rouge unique.
- Le décor intérieur reste le même : béton sombre, tuyaux, éclairage vert.
