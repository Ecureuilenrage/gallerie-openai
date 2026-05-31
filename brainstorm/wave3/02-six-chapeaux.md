# Vague 3 — Brainstorming SIX CHAPEAUX DE BONO

> Méthode : les Six Chapeaux de De Bono. Seed : **9281**. Mots déclencheurs injectés : **brume, échafaudage, constellation, tiroir, soie, écho**.
> Mission : inventer de l'INÉDIT pour une galerie qui célèbre PLUSIEURS participants. Stack : React + TS + MUI v6 + Framer Motion v11 PUR. Aucune nouvelle dépendance.

---

## Six chapeaux

### 🤍 Chapeau BLANC — Faits, données, contraintes objectives

- On a N projets (tuiles), chacun = thumbnail + vidéo, titre + auteur(s), au clic ouvre `kind:'site'` ou `kind:'page'`.
- Contrainte dure de perf : **une seule `<video>` montée à la fois**. Tout le reste = poster/image statique ou frame extraite.
- Contrainte dure de perception : **dès le premier coup d'œil, on doit voir qu'il y a PLUSIEURS auteurs** (jamais l'illusion d'une seule œuvre).
- Outils disponibles et mesurés : `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `drag`, `AnimatePresence`, `layout`/`layoutId`, CSS 3D (`perspective`, `preserve-3d`, `rotateX/Y`, `backface-visibility`), `clip-path`, `mask-image`, `mix-blend-mode`, filtres CSS.
- Faits sur l'attention : un œil humain perçoit la « pluralité » par répétition de motif (rythme), pas par lecture séquentielle. Donc un GRID/rythme visible bat un focus unique pour communiquer « plusieurs ».
- Faits de repli : `prefers-reduced-motion` doit court-circuiter tout scroll-jacking, toute 3D animée, tout autoplay. Mobile = pas de survol fiable → il faut un équivalent au tap/scroll.
- Le brief BANNIT : carrousel à flèches, parallaxe décorative cliché, autoplay vidéo massif, grille statique plate.
- Déjà construit (à dépasser) : Grid, Bento, Masonry, JustifiedRows, EditorialList, Stack, MasonryParallax, HorizontalScroll, RevealOnScroll, ZoomScroll, Carousel, Coverflow, HoverExpand, SwipeDeck, SpotlightFocus, Book, Wheel, Lighthouse, MaterialAwaken, MagneticField, Confetti, Loom, Tuning.
- **Mot _échafaudage_** : factuellement, une galerie est une structure portante d'objets. Le squelette (la grille de lignes, les montants) peut DEVENIR le motif visuel au lieu d'être caché → idée d'ossature visible.

### ❤️ Chapeau ROUGE — Émotion, intuition, ressenti 5s

- Cible de ressenti : **CALME / PREMIUM**. Donc : lenteur maîtrisée, espace, matière, pas de saccade, pas de clignotement.
- Intuition : le « premium » naît du **délai gracieux** — les choses arrivent une fraction de seconde après le geste, avec inertie (spring doux), comme du verre lourd qui pivote.
- **Mot _soie_** : on veut que le mouvement ait la qualité d'un tissu — il continue un instant après qu'on lâche, il a du poids et de la fluidité. `useSpring` avec damping élevé = soie.
- **Mot _brume_** : émotionnellement, la brume crée du mystère et de la profondeur. Ce qui est loin est flouté/désaturé ; ce qu'on approche devient net. Sensation de « lever le voile ». Très premium, très musée.
- Intuition de pluralité chaleureuse : on veut sentir une **communauté** d'auteurs, pas un catalogue froid. Les visages/noms doivent respirer. **Mot _constellation_** : une communauté = des points reliés, chacun brille, l'ensemble forme une figure.
- Ce qui DÉPLAIT instinctivement : tout ce qui force, tout ce qui crie (autoplay massif), tout ce qui est plat et prévisible (grille morte).
- Désir secret : **manipuler de la matière avec ses mains** (drag), comme ranger des objets précieux. **Mot _tiroir_** : ouvrir/fermer, révéler ce qui est rangé — geste intime et satisfaisant.

### 🖤 Chapeau NOIR — Risques, critiques, ce qui peut casser

- **Risque vidéo** : si on ne monte qu'une `<video>`, toute mécanique « plein cadre » risque de masquer la pluralité → il FAUT des posters multiples visibles autour de la vidéo active.
- **Risque scroll-jacking** : transformer le scroll natif en machine d'état (pile, coverflow piloté scroll) frustre si mal calibré ; sur trackpad/molette les deltas varient énormément → besoin de normalisation et d'un fallback de scroll libre.
- **Risque 3D / `preserve-3d`** : empilements de contextes 3D + `mix-blend-mode` + filtres = bugs de compositing (z-fighting, blend cassé sur Safari), coût GPU élevé sur mobile.
- **Risque brume/flou** : `filter: blur()` animé est COÛTEUX. À grande échelle = jank. Mitigation : flouter des posters basse-résolution, ou pré-rendre, ou limiter le rayon, ou utiliser `mask-image` plutôt que blur.
- **Risque « inédit pour l'inédit »** : un concept trop conceptuel peut nuire à la lisibilité de l'info essentielle (qui ? quel projet ?). Le titre+auteur doit TOUJOURS rester lisible.
- **Risque mobile** : tout ce qui repose sur survol/curseur s'effondre. Tout concept doit avoir un repli tap/scroll natif explicite.
- **Risque accessibilité** : reduced-motion doit donner une vue plate, navigable, complète — pas une version dégradée vide.
- **Mot _écho_** (côté noir) : attention aux répétitions d'animation en cascade — si chaque tuile « écho » la précédente avec délai, on peut créer une latence perçue agaçante. Le stagger doit rester court.
- **Risque de redite** : « pile au scroll » et « coverflow scroll » existent déjà (Stack, Coverflow, ZoomScroll). Tout nouveau concept doit ajouter une DIMENSION nouvelle (manipulation directe, métaphore spatiale, révélation matière), pas re-emballer.

### 💛 Chapeau JAUNE — Bénéfices, optimisme, valeur

- Le **drag + spring** (soie) donne un sentiment de contrôle premium quasi gratuit avec Framer (`drag`, `dragConstraints`, `useSpring`) → fort WOW desktop, et marche au touch sur mobile (bonus : pas de repli à inventer, le drag EST tactile).
- La **profondeur par brume** (net devant / flou-désaturé derrière) communique instantanément la hiérarchie ET la pluralité (on voit plein de cartes en profondeur) → résout le problème « une seule vidéo » : la vidéo nette devant, les voisins flous derrière mais bien présents.
- `layoutId` + `AnimatePresence` permettent des **transitions partagées magiques** (une tuile se déplie en plein écran sans coupure) → effet « OS spatial » premium sans WebGL.
- La métaphore **constellation/tiroir/échafaudage** offre des structures de navigation NON-LINÉAIRES inédites (pas un rail horizontal de plus) → on échappe au carrousel banni.
- Tout est **réutilisable** : un moteur de profondeur (depth manager) + un moteur de drag-inertie sert plusieurs concepts → catalogue large à coût marginal décroissant.
- Bénéfice perf : poster statique partout + une seule vidéo = budget tenable même avec 30 projets.

### 💚 Chapeau VERT — Créativité, alternatives, GÉNÉRATION D'IDÉES

Connexions des 6 mots → graines de concepts :

- **brume** → un espace où la profondeur est rendue par flou/désaturation/voile ; on « marche » vers les projets et le brouillard se lève → *Concept A : Brume de Profondeur*.
- **échafaudage** → l'ossature de la grille devient visible et structurante ; on grimpe/parcourt une charpente de modules où la vidéo s'« accroche » à une travée → *Concept B : Échafaudage Vivant*.
- **constellation** → les projets sont des étoiles dans un champ 2.5D draggable ; relier = naviguer ; chaque auteur = un astre nommé → *Concept C : Constellation Draggable*.
- **tiroir** → des panneaux/tiroirs empilés que l'on tire (drag) pour révéler la vidéo cachée derrière ; pluralité = tranches de tiroirs visibles → *Concept D : Mur de Tiroirs*.
- **soie** → la matière du mouvement : un voile/drapé qu'on déplace au curseur révèle le projet en dessous (mask-image suivant le pointeur) → *Concept E : Voile de Soie*.
- **écho** → un projet sélectionné « résonne » : ses échos plus petits/flous l'entourent en anneaux, les autres projets forment ces échos → *Concept F : Chambre d'Écho* (fusionnable avec constellation).

Idées combinatoires complémentaires :
- Profondeur (brume) + drag-inertie (soie) = naviguer en Z dans un brouillard de cartes.
- Échafaudage + layoutId = une travée se détache et se déplie en fiche projet.
- Voile de soie + mix-blend-mode = la vidéo « transparaît » par contraste sous le voile.

### 💙 Chapeau BLEU — Synthèse, processus, décision

- On retient **6 concepts** ci-dessous, chacun ancré sur un des 3 patterns aimés (pile / coverflow-scroll / panneaux-survol) MAIS transcendé par une dimension nouvelle (profondeur-matière, manipulation directe, navigation non-linéaire).
- Filtrage Noir→Jaune appliqué : on privilégie les concepts où la pluralité reste évidente, le repli mobile est natif (drag/tap), et le flou est maîtrisé (posters basse-déf, rayon limité).
- Règle transverse appliquée à TOUS : titre+auteur toujours lisible ; une seule `<video>` active (la cible focus) ; reduced-motion = vue plate complète.
- Décision de fin : voir CLASSEMENT + TOP 2.

---

## CONCEPTS

### Concept A — « BRUME » (Depth Fog Navigator)
*On avance dans un brouillard de projets ; ce qu'on approche se révèle net et s'anime, le reste flotte en profondeur.*

- **Mécanique cœur** : un champ de cartes disposées sur plusieurs plans Z (translateZ via `perspective` + `preserve-3d`). Un `useMotionValue` « profondeur » piloté au scroll (`useScroll`) OU au drag vertical avance la caméra. `useTransform` mappe la profondeur de chaque carte → `scale`, `opacity`, `blur` (désaturation via `filter: grayscale+blur`) et `y`. `useSpring` (damping ~30) lisse l'avancée = sensation de **soie**. La carte la plus proche du plan focal franchit un seuil → devient nette, saturée, et accueille la `<video>`.
- **Multiplicité** : à tout instant 6–12 posters flous/désaturés flottent dans la **brume** derrière et autour du net → on voit immédiatement une foule de projets/auteurs. Les noms en petit sous chaque poster restent lisibles même flous (texte net en overlay, pas flouté).
- **Vidéo** : une seule `<video>`, montée uniquement sur la carte qui franchit le plan focal ; à la sortie du focus → retour au poster, démontage. Crossfade via `AnimatePresence`.
- **Axe de navigation** : MIX — scroll OU drag vertical avancent dans la profondeur ; survol d'un voisin = léger « appel » (il s'avance un peu, magnétique).
- **Palette** : SOMBRE / cinéma (la brume sur fond charbon = profondeur, le net éclate). Premium musée nocturne.
- **Repli mobile / reduced-motion** : mobile = scroll vertical natif avance la profondeur (pas de survol requis), flou réduit à 2 plans. Reduced-motion = grille verticale plate de posters nets, vidéo au tap, zéro flou animé (flou statique pré-rendu max).
- **Pas un cliché banni** : ce n'est pas de la parallaxe décorative (le flou/Z est la NAVIGATION elle-même, porteuse d'info de hiérarchie), pas un carrousel (axe Z non linéaire), pas autoplay massif (1 vidéo au seuil). Inédit vs ZoomScroll : ici la profondeur est un VOLUME habité (plusieurs plans simultanés) avec révélation matière, pas un simple zoom 2D d'une rangée.
- **Risque/difficulté** : coût GPU du `blur` animé → mitiger avec posters basse-déf + rayon de flou plafonné + `will-change`. Z-index/compositing à surveiller sur Safari.

---

### Concept B — « ÉCHAFAUDAGE » (Living Scaffold)
*Une charpente de modules visible ; le scroll fait coulisser les travées et une seule s'anime en se détachant de l'ossature.*

- **Mécanique cœur** : une ossature CSS (lignes/montants fins, `border`/`box-shadow`) forme une grille 3D légèrement inclinée (`rotateX(8deg) rotateY(-6deg)` en `preserve-3d`). Les projets sont des « panneaux » accrochés aux travées. `useScroll` translate l'ossature ; `useTransform` fait que la travée arrivant au centre se **détache** (translateZ + `layout`) et s'épaissit. Survol d'un panneau → il avance d'un cran sur son montant (`whileHover`). Clic → `layoutId` déplie le panneau hors de l'ossature en fiche plein cadre.
- **Multiplicité** : l'**échafaudage** lui-même montre des dizaines d'alvéoles remplies de posters → la structure clame « beaucoup de projets » d'emblée. L'ossature visible = signature visuelle inédite.
- **Vidéo** : seule la travée détachée au centre monte sa `<video>` ; les autres alvéoles = posters. Démontage au changement de travée.
- **Axe de navigation** : scroll (coulissement des travées) + survol (avancée d'un panneau) + clic (`layoutId` dépliage).
- **Palette** : CLAIRE / neutre (béton clair, lignes graphite) — l'ossature d'architecte respire le premium éditorial/produit. Variante sombre possible (blueprint).
- **Repli mobile / reduced-motion** : mobile = échafaudage redressé à plat (`rotate` 0), scroll vertical, tap pour vidéo. Reduced-motion = grille modulaire statique avec ossature visible (le motif reste, l'animation tombe).
- **Pas un cliché banni** : l'ossature porteuse est un parti pris graphique jamais vu dans la liste existante ; pas une grille plate (3D + détachement + dépliage layoutId) ; pas un carrousel (mouvement vertical structurel). Inédit vs Bento/Grid : ici la STRUCTURE est le héros et elle est dynamique/3D.
- **Risque/difficulté** : lisibilité de l'ossature inclinée vs contenu (équilibre fin) ; `layout` + 3D peut donner des sauts → tester `layoutDependency` et désactiver 3D pendant la transition de dépliage.

---

### Concept C — « CONSTELLATION » (Draggable Star Field)
*Les projets sont des astres dans un ciel 2.5D qu'on déplace à la main ; approcher un astre l'allume et le nomme.*

- **Mécanique cœur** : un grand plan draggable (`drag`, `dragConstraints`, `dragElastic`, momentum via Framer) contient les cartes-astres positionnées en grappes (graine 9281 pour le semis). `useMotionValue` x/y du plan → `useTransform` donne à chaque astre une **parallaxe par couche de profondeur** (les plus « proches » bougent plus). Distance au centre de l'écran → `useTransform` → taille/luminosité/halo. L'astre le plus central s'« allume » (scale up, halo, vidéo). Des liens fins (`<svg>` lignes animées) relient les astres d'une même grappe = la figure de **constellation**, qui rend la communauté visible. Inertie `useSpring` = **soie**.
- **Multiplicité** : tout le ciel est peuplé d'astres nommés (auteur sous chaque point) → la pluralité EST le sujet. Les liens dessinent explicitement « un collectif ».
- **Vidéo** : seul l'astre central allumé monte la `<video>` ; les autres = posters circulaires/halos. Démontage dès qu'un autre passe au centre.
- **Axe de navigation** : DRAG (cœur), avec inertie ; survol = halo d'appel ; clic = ouverture site/page (avec `layoutId` du halo vers la fiche).
- **Palette** : SOMBRE / cinéma (ciel profond, astres lumineux). Le contraste sert la lisibilité des noms.
- **Repli mobile / reduced-motion** : drag = tactile natif → mobile excellent sans rien changer. Reduced-motion = liste/grille de « grappes » navigable, liens statiques, pas de parallaxe ; vidéo au tap.
- **Pas un cliché banni** : navigation libre 2D non linéaire = ni carrousel ni grille statique ; les liens-constellation sont inédits dans la liste ; pas de parallaxe décorative car la parallaxe encode ici la profondeur des grappes (info). Inédit vs MagneticField : ici c'est un ESPACE explorable nommé avec topologie de communauté, pas seulement un effet d'attraction local.
- **Risque/difficulté** : risque de désorientation (où suis-je ?) → ajouter une mini-carte ou recentrage spring ; performance du `<svg>` de liens si beaucoup d'astres → limiter aux liens intra-grappe proches.

---

### Concept D — « TIROIRS » (Wall of Drawers)
*Un mur de tiroirs ; on en tire un (drag) et la vidéo du projet se révèle dans la profondeur dégagée.*

- **Mécanique cœur** : une grille de panneaux-« façades de tiroir ». Chaque tiroir est `drag="y"` (ou x) avec `dragConstraints` + `dragSnapToOrigin`. Pendant le tirage, `useTransform` sur la position du tiroir → révèle la cavité derrière (translateZ, ombre interne, `mask-image` qui dévoile progressivement le contenu). Un seul tiroir « ouvert » à la fois (state) → les autres se referment en spring (**soie**). `layoutId` relie la façade au contenu déployé. Le geste de **tiroir** = manipulation directe satisfaisante.
- **Multiplicité** : le mur entier de façades fermées (chacune un poster + nom gravé) montre tous les projets en rythme régulier → pluralité immédiate. Ouvrir un tiroir n'efface pas les autres (ils restent autour).
- **Vidéo** : la `<video>` ne se monte QUE dans le tiroir ouvert (la cavité révélée) ; à la fermeture/ouverture d'un autre → démontage.
- **Axe de navigation** : DRAG (tirer le tiroir) en cœur ; clic = ouverture rapide ; scroll = parcourir le mur. Survol = la façade s'entrouvre de quelques px (teasing).
- **Palette** : CLAIRE / neutre matière (bois clair / papier / métal brossé) — meuble premium, tactile. Variante sombre (classeur d'archive cinéma).
- **Repli mobile / reduced-motion** : drag = natif tactile, parfait mobile (tirer du doigt). Reduced-motion = tiroirs qui s'ouvrent par tap en fondu, pas d'animation de glissement ; vue plate des façades sinon.
- **Pas un cliché banni** : pas un carrousel (pas de rail/flèches), pas une grille morte (manipulation drag + révélation profondeur), pas de parallaxe déco. Inédit vs HoverExpand/SwipeDeck : ici la révélation est une OUVERTURE physique en Z avec mask, métaphore mobilier, pas un simple élargissement de panneau.
- **Risque/difficulté** : gérer le conflit drag-tiroir vs scroll-page (axes) ; `mask-image` animé + `<video>` dans la cavité = surveiller perf ; UX du « comment je referme » à rendre évidente (poignée, snap).

---

### Concept E — « SOIE » (Silk Veil Reveal)
*Un voile translucide couvre les projets ; on le déplace au curseur/doigt et le projet dessous apparaît net sous la traîne du voile.*

- **Mécanique cœur** : une couche-voile plein écran (`mix-blend-mode`, léger flou/désaturation) recouvre une grille de posters. Un `useMotionValue` suit le pointeur (`onPointerMove`) ; un `mask-image` radial-gradient (ou `clip-path` circulaire) « troue » le voile autour du curseur → dessous, le poster devient net et coloré, comme révélé sous la **soie**. `useSpring` sur le centre du masque = traîne fluide (le voile « suit » avec inertie). Quand le trou stationne sur un projet > X ms → ce projet monte sa `<video>` dans la zone révélée. Le voile ondule subtilement (`animate` sur background-position).
- **Multiplicité** : sous le voile, on devine TOUTE la grille (posters désaturés visibles en transparence) → on sait qu'il y a beaucoup de projets ; on en révèle un à la fois. Pluralité = champ entier deviné, focus = zone nette.
- **Vidéo** : une seule `<video>`, dans la zone révélée stationnaire ; quitte la zone → poster.
- **Axe de navigation** : SURVOL/curseur en cœur (desktop WOW) ; clic = ouvrir.
- **Palette** : peut VARIER — voile clair laiteux sur posters (premium frais) OU voile sombre fumé (cinéma). Le `mix-blend-mode` rend la matière.
- **Repli mobile / reduced-motion** : mobile (pas de hover) = le « trou » suit le doigt en drag, ou repli direct = grille de posters nets sans voile (révélation au tap). Reduced-motion = voile retiré, grille nette plate, vidéo au tap.
- **Pas un cliché banni** : ce n'est pas Spotlight existant (ici c'est de la MATIÈRE textile avec mask+blend qui ondule et révèle la couleur/netteté, pas un simple cône de lumière) ; pas de parallaxe, pas d'autoplay massif. Métaphore tissu inédite.
- **Risque/difficulté** : `mask-image` + `mix-blend-mode` + flou = pile de compositing lourde, risque Safari ; le repli mobile sans hover doit être vraiment soigné (le concept perd son sel au tactile).

---

### Concept F — « ÉCHO » (Resonance Rings)
*Sélectionner un projet le fait résonner : ses échos — les autres projets — l'entourent en anneaux concentriques qui s'estompent.*

- **Mécanique cœur** : un projet focal au centre ; les autres projets sont disposés sur des anneaux concentriques (rayon = pertinence/ordre). `useTransform` mappe le rayon de chaque anneau → `scale`, `opacity`, flou (échos lointains plus petits/flous). Scroll OU drag fait « pulser » : on pousse un écho au centre → il devient focal, l'ancien focal recule en devenant un **écho** (transition `layout`/`layoutId`, stagger court pour éviter latence — leçon du chapeau Noir). Rotation douce des anneaux au drag (`drag` rotatif via angle). `useSpring` = amorti soyeux.
- **Multiplicité** : les anneaux d'échos = des dizaines de projets visibles simultanément, en couronnes → pluralité spectaculaire et lisible (chaque écho nommé). Métaphore : un collectif qui résonne autour d'une œuvre.
- **Vidéo** : seul le projet focal central monte la `<video>` ; les échos = posters décroissants. Démontage au changement de focal.
- **Axe de navigation** : MIX — scroll/drag pour faire pulser/tourner, clic sur un écho pour le ramener au centre puis ouvrir.
- **Palette** : SOMBRE / cinéma (les anneaux qui s'estompent dans le noir = profondeur, écho visuel). Variante claire (ondes sur fond ivoire).
- **Repli mobile / reduced-motion** : mobile = tap sur un écho le centre (animation layout), drag rotatif au doigt. Reduced-motion = anneaux statiques, sélection en fondu instantané, pas de pulsation.
- **Pas un cliché banni** : disposition concentrique radiale ≠ carrousel/grille ; pas de parallaxe déco ; 1 vidéo. Inédit vs Wheel (roue 1D) : ici c'est un champ radial 2D multi-anneaux avec re-centrage `layoutId` et métaphore de résonance.
- **Risque/difficulté** : densité d'éléments aux anneaux extérieurs (lisibilité des noms) → plafonner le nombre d'échos affichés et paginer par pulsation ; calcul des positions polaires à garder cheap.

---

## CLASSEMENT (préférence de l'agent Six Chapeaux)

1. **A — BRUME (Depth Fog Navigator)** — le plus aligné sur CALME/PREMIUM + résout élégamment « 1 vidéo / plusieurs participants » par la profondeur habitée ; ancré sur coverflow-scroll mais transcendé en VOLUME. WOW desktop fort, repli mobile honnête.
2. **C — CONSTELLATION (Draggable Star Field)** — manipulation directe (drag soie) + métaphore de communauté explicite (liens) ; tactile-natif donc mobile excellent ; le plus « interface spatiale/OS » et inédit.
3. **D — TIROIRS (Wall of Drawers)** — manipulation directe la plus satisfaisante, métaphore mobilier premium, repli drag mobile parfait, pluralité claire.
4. **B — ÉCHAFAUDAGE (Living Scaffold)** — signature graphique éditoriale forte (ossature héros) ; un cran plus risqué en lisibilité.
5. **E — SOIE (Silk Veil Reveal)** — effet WOW desktop superbe mais dépend du survol → repli mobile affaiblit le concept ; compositing lourd.
6. **F — ÉCHO (Resonance Rings)** — beau et original mais densité/lisibilité aux anneaux extérieurs = risque ; proche conceptuellement de Wheel.

### Hypothèses posées (non bloquantes)
- N ≈ 12–30 projets : assez pour que « profondeur » et « anneaux » respirent ; si N < 8, A/C/F perdent en densité → privilégier B/D.
- Posters basse-déf disponibles pour chaque projet (sinon flou/désaturation = extraire une frame de la vidéo au build).
- Auteur(s) tiennent en une ligne courte (overlay texte net jamais flouté/masqué).
- Le seed 9281 sert à semer les positions (constellation/brume) de façon stable et reproductible.

### Questions ouvertes
- Tolérance exacte au scroll-jacking (A, B, F) : faut-il toujours garder un scroll natif d'évasion ?
- Combien de plans Z (A) / d'anneaux (F) avant que le GPU mobile décroche ? (à benchmarker).
- Le flou animé (A, E) est-il acceptable perf-wise, ou faut-il systématiquement pré-rendre des posters flous ?
- Faut-il un « depth/drag engine » mutualisé (A+C+D+F partagent un moteur d'inertie + mapping profondeur) pour industrialiser le catalogue ?
