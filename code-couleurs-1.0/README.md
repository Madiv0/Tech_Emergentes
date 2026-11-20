# code-couleurs-1.0

Version actuelle : **1.0**, créée le 20 novembre 2026.

Jeu de déduction en français inspiré du jeu de société Mastermind. L’ordinateur est le **CODEUR** : il crée une combinaison secrète. Le joueur est le **DÉCODEUR** : il cherche à la trouver en un minimum de propositions.

## Jouer

Ouvrir **index.html** dans un navigateur moderne. Aucun téléchargement de dépendance, compilation, serveur ou accès Internet nécessaire. Sélectionner un emplacement, puis une couleur ; cliquer sur un emplacement rempli pour le modifier. Valider la proposition et consulter les indices. Le bouton « Les règles » explique également les règles et les deux exemples.

## Mode test manuel

Le bouton à bascule **Test OFF / Test ON**, en haut de l’interface, est grisé et sur **OFF** à chaque ouverture ou rechargement. En position **ON**, il devient vert et la mention **(test)** apparaît à côté de code-couleurs-1.0 ainsi que dans le titre de l’onglet.

1. Cliquer sur **Test OFF** pour passer sur ON. La partie précédente est remise à zéro et les commandes de proposition attendent la préparation du test.
2. Choisir les quatre couleurs du code secret, de gauche à droite, dans les listes « Position 1 » à « Position 4 ». Les répétitions sont permises.
3. Cliquer sur **Démarrer le test**. Un code incomplet ou invalide est refusé avec une explication, sans consommer d’essai. Un code valide lance la partie, ferme le panneau de préparation et efface ses champs ; le code reste caché pendant le jeu.
4. Jouer normalement : mêmes couleurs, dix essais, mêmes indices, victoire, défaite, historique et verrouillage. Seule l’origine du code secret change : il est choisi par le testeur au lieu d’être tiré par l’ordinateur.
5. **Nouvelle partie** en mode test permet de choisir un nouveau code et de démarrer un autre test. Repasser sur **OFF** remet à zéro la partie et lance le mode jeu avec un code aléatoire. Le mode n’est pas mémorisé au rechargement.

## Règles de cette version (mode jeu)

1. La palette commune est exactement, dans cet ordre : rouge, bleu, vert, jaune, orange, violet. Au début, quatre couleurs sont tirées au hasard avec répétitions possibles ; ce code ordonné reste fixe et caché pendant la partie.
2. Le joueur dispose de dix essais. Chaque proposition contient quatre couleurs de gauche à droite et reste modifiable avant validation.
3. Une proposition incomplète ou contenant une couleur non autorisée est refusée avec une explication, sans consommer d’essai ni modifier l’historique.
4. Chaque proposition valide consomme un essai. Les propositions et indices restent consultables jusqu’à la nouvelle partie.
5. On compte d’abord les couleurs bien placées, puis les couleurs présentes mais mal placées parmi les occurrences restantes. Chaque occurrence compte au maximum une fois. Les indices donnent deux nombres, sans désigner les positions.
6. Quatre couleurs bien placées donnent la victoire, y compris au dixième essai. Dix propositions sans victoire donnent la défaite. Toute proposition après la fin est refusée. « Nouvelle partie » tire un code et remet à zéro essais, historique et indices. Un nouveau tirage peut produire le même code.

Exemple 1 : secret rouge – bleu – vert – jaune ; proposition rouge – vert – bleu – orange : **1 bien placée et 2 mal placées**.

Exemple 2 : secret rouge – rouge – bleu – vert ; proposition rouge – rouge – rouge – rouge : **2 bien placées et 0 mal placée**. Les deux rouges supplémentaires ne comptent pas.

## Source et organisation

Source des règles : cahier des charges fourni par l’utilisateur dans la conversation Codex du 20 novembre 2026, y compris les deux exemples. Mastermind est la référence d’inspiration ; aucune règle additionnelle du jeu commercial n’est appliquée. Code et interface réalisés avec Codex, sans ressources graphiques ni bibliothèques tierces.

- index.html : structure et règles.
- styles.css : présentation responsive, couleurs, focus.
- game.js : moteur indépendant, tirage et API locale.
- app.js : interactions et affichage.
- game.test.js : tests du moteur et parcours du mode test avec une interface simulée sous Node.js.
- AGENTS.md : conventions réutilisables.

## API JavaScript locale

Il n’y a pas de serveur ni d’API HTTP. Dans le navigateur, window.CodeCouleurs expose COLORS, MAX_ATTEMPTS, score(secret, guess) et createGame(). Les six identifiants sont exactement rouge, bleu, vert, jaune, orange, violet en minuscules et dans cet ordre.

createGame() renvoie submit(tableauDeQuatreCouleurs), snapshot(), reset(codeOptionnel) et prepareTest(). reset() conserve le tirage aléatoire normal ; reset(code) valide et copie le code choisi avant toute mutation, ou lève TypeError si ce code est invalide. prepareTest() vide la partie et passe au statut setup, sans tirer de code ni autoriser de proposition. Un état contient status (setup, playing, won, lost), attempts, remaining, history et secret. Chaque entrée d’historique contient guess, wellPlaced et misplaced. submit ajoute ok et, en cas de refus, error. secret vaut null pendant la préparation et en cours de jeu, puis contient le code à la fin. Les instantanés sont des copies ; le secret est conservé dans une fermeture JavaScript. score lève TypeError si un code est invalide. En CommonJS, importer le moteur avec require('./game.js').

## Historique des choix et modifications avec Codex

### 1.0 — 20 novembre 2026

- Création depuis un dossier vide d’une application statique en français, ouvrable directement, sans dépendances.
- Séparation du moteur et de l’interface pour vérifier les règles indépendamment.
- Tirage indépendant par Web Crypto avec rejet du biais de modulo ; répétitions autorisées.
- Décompte des occurrences restantes, priorité à la victoire au dixième essai, verrouillage après la fin.
- Plateau de dix lignes, sélection modifiable, validation explicite, indices numériques, révélation finale et remise à zéro.
- Lettres sur les couleurs, libellés accessibles, commandes clavier natives et annonces de statut.
- Mise en page adaptée aux petits écrans ; le panneau de saisie précède l’historique sur mobile.
- Ajout des tests exhaustifs de toutes les paires de codes et des transitions de partie.
- Ajout à la demande de l’utilisateur du mode test manuel ON/OFF : code choisi et validé par le testeur, titre marqué (test), règles de partie inchangées. Version conservée à 1.0.

## Vérifications et limites

Exécuter **node --test game.test.js** (Node.js 18 ou plus récent). Les tests couvrent les exemples, les 1 679 616 paires secret/proposition avec une formule indépendante, les entrées invalides (dont les tableaux creux), l’absence de mutation, les victoires aux essais 1 et 10, la défaite, le verrouillage, la réinitialisation et le tirage avec répétitions/rejet.

Contrôle manuel : ouvrir index.html ; valider une proposition vide et vérifier que le compteur reste à zéro ; composer quatre couleurs, en modifier une, valider et vérifier que l’historique et le compteur avancent une fois ; poursuivre jusqu’à la fin et vérifier le code révélé et les commandes désactivées ; relancer et vérifier la remise à zéro. Tester aussi « Effacer », les règles et leur fermeture avec Échap, la navigation Tab/Entrée/Espace et une fenêtre étroite (360 px).

Contrôles manuels du mode test :

- Vérifier OFF gris et absence de (test) au chargement ; passer sur ON et vérifier le vert, le déplacement du curseur de bascule et le titre marqué (test). Vérifier aussi la bascule avec Tab puis Espace/Entrée.
- Cliquer sur « Démarrer le test » avec un code incomplet : message et compteur à zéro. Compléter puis modifier une couleur avant de démarrer.
- Reproduire l’exemple 1 avec le secret rouge – bleu – vert – jaune et la proposition rouge – vert – bleu – orange : 1 bien placée et 2 mal placées.
- Relancer en mode test et reproduire l’exemple 2 avec le secret rouge – rouge – bleu – vert et la proposition rouge – rouge – rouge – rouge : 2 bien placées et 0 mal placée.
- Avec le secret rouge – bleu – vert – jaune, proposer neuf fois orange – orange – orange – orange, puis le code exact : victoire au dixième essai. Refaire avec dix propositions orange : défaite et code révélé. Vérifier le blocage après chaque fin.
- Vérifier que « Nouvelle partie » redemande un code en mode test, que OFF relance une partie aléatoire et que recharger revient sur OFF. Contrôler également le formulaire et la bascule à 360 px.

Limites connues : état uniquement en mémoire (recharger commence une nouvelle partie), aucun compte ni sauvegarde. Le secret n’est pas affiché pendant la partie mais les outils de développement peuvent inspecter le programme local : ce n’est pas un système antitriche. Le hasard ne promet ni difficulté optimale ni code différent à chaque tirage. Les tests du moteur ne remplacent pas les contrôles visuels, clavier et lecteur d’écran. Compatibilité visée : navigateurs modernes prenant en charge Web Crypto, dialog et les scripts classiques ; navigateurs anciens non pris en charge.

### Résultats obtenus le 20 novembre 2026

- node --test game.test.js : **6 tests réussis, 0 échec**, dont les 1 679 616 paires de codes.
- node --check app.js et git diff --check : aucune erreur signalée.
- Contrôle ponctuel sous Node avec un DOM minimal simulé : identifiants HTML uniques et présents, initialisation, refus d’une proposition vide, victoire, défaite au dixième essai, verrouillage, modification d’un emplacement, effacement, nouvelle partie et ouverture/fermeture des règles réussis. Cette simulation ne vérifie ni le rendu ni le comportement natif du navigateur.
- Contrôle visuel non réalisé : la politique de sécurité du navigateur intégré a refusé l’ouverture du protocole file://. Le rendu sur ordinateur/mobile, le clavier natif et le lecteur d’écran restent à contrôler manuellement avec la procédure ci-dessus.

### Vérification après ajout du mode test — 20 novembre 2026

- node --test game.test.js : **8 tests réussis, 0 échec**, incluant le moteur à code choisi et le parcours d’interface simulé OFF → préparation → démarrage → indices → victoire/défaite → nouvelle partie → OFF. Le tirage aléatoire n’est pas utilisé pendant la préparation ou le démarrage d’un test.
- Syntaxe de app.js et game.js vérifiée avec node --check. Le contrôle visuel dans un navigateur reste à effectuer manuellement, selon la limite d’ouverture locale signalée ci-dessus.

## Contexte pour reprendre le projet

Mémo de reprise enregistré le 20 novembre 2026 à la demande de l’utilisateur. Cette section synthétise la conversation ; les demandes détaillées, règles, choix, commandes et limites sont conservés dans les sections précédentes.

### Demandes et périmètre à respecter

- Créer un jeu inspiré de Mastermind, affichable et jouable dans un navigateur, nommé exactement **code-couleurs-1.0**. La version reste **1.0** ; aucun changement de version n’a été demandé.
- L’ordinateur joue le codeur, le joueur le décodeur. Appliquer strictement les six règles et les deux exemples du présent README, sans ajouter de variantes.
- Fournir et maintenir README.md (version, présentation, règles, source, historique des choix et modifications avec Codex, vérifications et limites) et un AGENTS.md court et exact (organisation, commandes, contraintes, vérification), enrichi seulement d’enseignements réels.
- Puis ajouter uniquement la possibilité de tests manuels depuis l’interface : interrupteur ON/OFF en haut, OFF gris et discret par défaut, ON vert reconnaissable à sa forme et sa couleur, mention (test) à côté du nom. Le testeur choisit et valide le code secret avec « Démarrer le test » ; le reste de la partie fonctionne exactement comme en mode jeu.
- Consigne explicite de l’utilisateur : **« ne modifie rien d’autre à moins que je te le demande »**. Conserver un périmètre limité aux changements demandés, à leur vérification et à leur documentation ; ne pas entreprendre de refonte ou d’ajout de fonctionnalités spontanés.
- Dernière demande : conserver le contexte de toute cette conversation pour pouvoir continuer le projet une autre fois. Ce mémo et les instructions de reprise dans AGENTS.md répondent à cette demande sans changer le jeu.

### État au moment de la pause

Le jeu initial et le mode test manuel sont implémentés. L’application est locale, statique, sans dépendance ni serveur requis. Ouvrir index.html pour jouer. En mode test, le code choisi est effacé des champs au démarrage et reste caché pendant la partie. « Nouvelle partie » revient à la préparation d’un test ; OFF relance une partie avec un code aléatoire. Changer de mode remet la partie à zéro. Le rechargement revient au mode OFF.

La dernière exécution de node --test game.test.js a donné **8 tests réussis, 0 échec**, dont toutes les paires de codes et les nouveaux parcours de test sur interface simulée. La syntaxe JavaScript a été contrôlée. Aucune vérification visuelle réelle n’a pu être terminée : le navigateur intégré a refusé file:// pour des raisons de politique de sécurité. Ne pas présenter la simulation DOM comme une validation du rendu, du clavier natif ou du lecteur d’écran. Les scénarios manuels à exécuter sont décrits ci-dessus. Aucun retour de l’utilisateur sur ses propres essais n’a encore été reçu.

Au relevé Git de cette session, les sept fichiers du projet sont non suivis ; aucun commit ni déploiement n’a été effectué. Ne pas supposer qu’une sauvegarde distante existe.

### Prochaine reprise

Lire AGENTS.md puis ce README, vérifier l’état réel des fichiers et du dépôt, puis suivre la prochaine demande de l’utilisateur. Les vérifications manuelles restent identifiées, sans autoriser d’autres modifications. Pour rappeler le contexte dans une nouvelle conversation, l’utilisateur peut demander : « Reprends le projet code-couleurs-1.0 et lis AGENTS.md ainsi que le contexte de reprise du README. »

## Jalon Git — jalon-1

Le tag Git **jalon-1** repère la version **code-couleurs-1.0** avec son mode test manuel, publiée dans le dossier `code-couleurs-1.0` du dépôt [Madiv0/Tech_Emergentes](https://github.com/Madiv0/Tech_Emergentes).

- Commit repéré : `e0db0df1dd8c5d2cd2912a3ffa59bb7941efedf1` — « Ajout de code-couleurs-1.0 avec mode test manuel ».
- [Consulter cette version figée](https://github.com/Madiv0/Tech_Emergentes/tree/jalon-1/code-couleurs-1.0).
- Dans un clone du dépôt, récupérer les tags avec `git fetch origin --tags`, puis vérifier la cible avec `git rev-parse jalon-1` ou consulter le commit avec `git show --no-patch jalon-1`.

Ce jalon a été ajouté à la demande de l’utilisateur après le premier commit GitHub. Le commit de documentation qui suit le tag enregistre ce repère ; il ne modifie ni le code du jeu ni la cible du tag. Les huit tests précédemment réussis et les limites de vérification visuelle restent les références pour cette version.

## Preuve de test — couleurs répétées

- **Version testée avec l’identifiant du commit** : code-couleurs-1.0, tag `jalon-1`, commit `e0db0df1dd8c5d2cd2912a3ffa59bb7941efedf1` (fichiers du jeu vérifiés identiques).
- **La situation de départ** : nouvelle partie, secret Rouge – Rouge – Bleu – Orange ; proposition Rouge – Rouge – Rouge – Rouge.
- **Le résultat attendu** : 2 couleurs bien placées, 0 mal placée ; les deux rouges supplémentaires ne comptent pas.
- **Le résultat obtenu** : conforme, 2 bien placées et 0 mal placée ; 1 essai utilisé, 9 restants, partie en cours.
- **La limite** : test d’intégration sur interface simulée sous Node.js ; rendu et interactions dans un navigateur réel non vérifiés.

## Questions ouvertes

- Le jeu publié fonctionne-t-il correctement dans un navigateur réel, sur ordinateur et à une largeur de 360 px ?
- Toutes les commandes sont-elles utilisables au clavier, notamment la sélection des couleurs et le mode test ?
- Les lettres et les libellés permettent-ils de distinguer les couleurs sans dépendre uniquement de leur apparence ?
- Les indices annoncés par un lecteur d’écran sont-ils compréhensibles ?

## Correction d’une difficulté rencontrée avec Codex

**Problème initial** : la première tentative de création de tous les fichiers en une seule commande a échoué sous Windows, car la commande était trop longue.

**Preuve avant correction** : l’exécution a renvoyé « The filename or extension is too long. (os error 206) ».

**Correction effectuée** : Codex a fractionné la création des fichiers en plusieurs commandes plus courtes. Cette contrainte a ensuite été ajoutée dans AGENTS.md.

**Preuve après correction** : les sept fichiers du projet ont été créés et la première suite de six tests s’est exécutée avec succès, sans échec. Après l’ajout du mode test, la suite comporte huit tests réussis.

**Limite** : cette correction concerne la procédure de création des fichiers, pas un défaut des règles du jeu. Les tests automatisés ne remplacent pas une vérification dans un navigateur réel.
