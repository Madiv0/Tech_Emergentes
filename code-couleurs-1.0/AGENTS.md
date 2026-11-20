# Conventions du projet

- Nom affiché exact : code-couleurs-1.0, suivi de (test) uniquement quand le mode test est ON. Interface et documentation en français.
- Application statique sans dépendance : index.html (structure/règles), styles.css (présentation), game.js (moteur/API), app.js (interface), game.test.js (tests).
- Ouvrir index.html pour jouer ; lancer node --test game.test.js pour vérifier le moteur. Aucun build.
- Respecter les six règles du README : palette/API rouge, bleu, vert, jaune, orange, violet dans cet ordre ; quatre positions, répétitions permises, dix essais.
- Garder le secret hors du DOM pendant la partie. Refuser les entrées invalides sans mutation. Compter les occurrences restantes après les bien placées ; vérifier la victoire avant la défaite au dixième essai.
- Garder les scripts classiques et l’export CommonJS pour l’ouverture locale et les tests sans dépendance.
- Après un changement moteur, lancer les tests. Après un changement visuel, vérifier navigateur, largeur 360 px, clavier, messages, historique et nouvelle partie.
- Actualiser le README (historique, vérifications, limites) avec les changements réels. Enrichir ce fichier seulement de conventions utiles issues de difficultés rencontrées.
- Sous Windows, fractionner les longues commandes de création de fichiers : la taille de ligne de commande est limitée.

- Mode test manuel : OFF par défaut, ON vert avec rôle switch et état aria-checked. Le code choisi passe par la même validation et le même moteur que le mode jeu ; seules sa sélection et sa préparation diffèrent.
- En mode test, « Nouvelle partie » revient au choix du code. Repasser sur OFF tire un code aléatoire. Ne pas conserver le code choisi dans les champs après le démarrage. Vérifier le parcours ON/OFF avec node --test game.test.js et manuellement dans le navigateur.
- À la reprise du projet, lire dans README.md la section « Contexte pour reprendre le projet » ainsi que les règles, l’historique et les limites. Respecter la demande explicite de l’utilisateur : ne rien modifier d’autre sans demande ; limiter le travail au changement demandé et à sa vérification/documentation.
