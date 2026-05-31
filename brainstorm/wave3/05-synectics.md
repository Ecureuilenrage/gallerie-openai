# Vague 3 — Agent SYNECTICS (analogies)

> Méthode : rendre l'étrange familier et le familier étrange. On part de 4 analogies (directe, personnelle, symbolique, fantastique), on y injecte les 6 mots aléatoires (**banc de poissons, tectonique, métronome, sève, kaléidoscope, douane**), puis on fait émerger des concepts de galerie inédits.
> Seed : **7724**. Stack : React + TS + MUI v6 + Framer Motion v11 **pur**. Une seule `<video>` active à la fois. Pluralité des participants toujours visible.
> Contrat technique observé dans le code : vues reçoivent `projects: Project[]` ; `ProjectTile` accepte `playing` (lecture vidéo contrôlée par la vue) ou `previewOnHover` ; primitives dispo : `useScroll`, `useTransform`, `useSpring`, `useMotionValue`, `animate`, `drag`, `AnimatePresence`, `layout/layoutId`, `useReducedMotion`, CSS 3D (`perspective`, `preserve-3d`, `rotateX/Y`, `backfaceVisibility`), `clip-path`, `mask-image`, `mix-blend-mode`, filters.

---

## 1. Les 4 analogies travaillées

### (a) Analogie DIRECTE — emprunts à d'autres domaines

- **Banc de poissons (biologie / nature).** Un banc n'a pas de chef : chaque poisson suit 3 règles locales (cohésion, alignement, séparation) et l'ensemble produit une forme fluide qui se resserre, ondule, explose face au prédateur. *Familier→étrange* : et si les tuiles n'étaient pas posées sur une grille mais **maintenues en formation par des règles de voisinage** ? Le curseur joue le prédateur : la nuée s'écarte localement puis se recompose. La multiplicité devient *intrinsèque* : un banc, par définition, c'est « beaucoup ».
- **Tectonique (géologie).** Des plaques massives glissent l'une sous l'autre (subduction), s'écartent (rifting), créent des failles. Lent, inéluctable, premium par sa gravité. *Étrange→familier* : le scroll devient un **mouvement de plaques** — des bandes de projets qui coulissent en sens opposés et, aux lignes de faille, **révèlent** une couche en dessous (la vidéo, ou les crédits). Calme + tension géologique = exactement « audacieux mais maîtrisé ».
- **Métronome (musique / mécanique).** Battement régulier, autorité tranquille, il *cadence* sans précipiter. *Familier→étrange* : et si la galerie avait un **tempo** ? Un balancier unique, piloté par le scroll, qui pointe successivement chaque projet — un seul est « sur le temps fort » (vidéo active), les autres attendent leur mesure. Le geste devient direction d'orchestre.
- **Douane (administratif / rituel de passage).** Un poste-frontière : on présente, on tamponne, on franchit un seuil. *Étrange→premium* : chaque projet est un **pays** ; entrer dans la galerie, c'est franchir une succession de guichets où l'on tamponne (révèle) avant de passer. Le seuil donne de la valeur — un musée fait pareil avec ses salles.

### (b) Analogie PERSONNELLE — « si J'ÉTAIS une tuile / un participant »

> Si **j'étais une tuile** dans cette galerie, je ne voudrais pas être une ligne dans un tableur. Je voudrais **respirer** quand on me regarde et **m'effacer poliment** quand on regarde mon voisin — sans jamais disparaître, parce que je suis fier d'être *parmi* les autres.
> Si j'étais le **participant** : je veux que mon nom existe en même temps que ceux des autres (pas un projecteur égoïste). Je veux qu'on sente la **sève** — qu'il y a de la vie qui circule entre nous, qu'on appartient au même organisme (le lab). Quand le visiteur me « choisit », je veux m'ouvrir comme une feuille au soleil, pas claquer comme une pop-up.

Émergence : la **sève** = un flux visible qui relie les tuiles (lignes/veines animées, gradient qui circule, `mask` qui progresse de tuile en tuile). La métaphore organique répond au brief CALME/PREMIUM et à « célébrer PLUSIEURS participants » : on est un *arbre*, pas une liste.

### (c) Analogie SYMBOLIQUE — titre paradoxal en 2 mots

- **« Foule immobile »** — beaucoup de présences, mais rien ne bouge tant qu'on ne sollicite pas. (calme + multiplicité)
- **« Faille douce »** — la rupture (tectonique) rendue veloutée. (audace maîtrisée)
- **« Silence cadencé »** — le métronome sans bruit : un rythme qu'on *voit*. (mouvement premium)
- **« Frontière vivante »** — la douane qui respire. (seuil + sève)

Ces oxymores sont des boussoles de ton : toujours **tension + retenue**.

### (d) Analogie FANTASTIQUE — magie sans contrainte, puis retour au faisable

> *Magie* : un **kaléidoscope** géant où chaque éclat de verre est un projet ; je tourne le tube et les projets se reflètent à l'infini en symétries mouvantes ; la lumière qui passe au travers (une seule source : la vidéo) **colore** tous les fragments en même temps. Les portails de douane sont des miroirs : franchir = traverser le reflet.
>
> *Retour au faisable (Framer pur)* : pas d'infini réel, mais une **symétrie radiale de 5–7 secteurs** en CSS `transform: rotate()` autour d'un centre, le scroll faisant tourner l'ensemble (`useTransform` scroll→rotate). La « lumière unique » = la **vidéo du projet au centre** dont un `mask`/`mix-blend-mode` teinte les secteurs voisins (reflets = mêmes thumbnails sous filtres/blend différents). On garde la sensation kaléidoscopique sans WebGL.

---

## 2. Concepts inédits (issus des analogies)

> Pour chacun : Nom + accroche · Mécanique cœur (primitives) · Multiplicité · Vidéo · Navigation · Palette · Repli mobile / reduced-motion · Pourquoi pas un cliché banni + inédit vs existant · Risque.

---

### Concept A — « Banc » (*Foule immobile*)
**Accroche :** *Les projets nagent en formation ; votre curseur est le prédateur qui les écarte, puis ils se recomposent.*

- **Mécanique cœur.** N tuiles positionnées sur une **trame organique** (formation type banc : grille perturbée par bruit déterministe seedé 7724, donc reproductible). Chaque tuile a un `useMotionValue` x/y avec `useSpring` (stiffness basse, damping élevé → glisse, premium). On suit le curseur via un `useMotionValue` global (pointermove sur le conteneur) ; pour chaque tuile, `useTransform` calcule un vecteur de répulsion (distance au curseur → déplacement inverse, atténué). Résultat : la nuée **s'ouvre localement** autour du pointeur et se referme dès qu'il s'éloigne. Pas de physique N-corps (trop coûteux) : répulsion *du seul curseur*, le reste est ressort vers la position d'ancrage. Survol prolongé d'une tuile = elle « sort du banc » (scale + `zIndex`, layout), ses voisines s'écartent.
- **Multiplicité.** C'est l'essence : on voit d'emblée 15–30 silhouettes en mouvement coordonné. « Beaucoup » est lisible avant tout texte.
- **Vidéo.** Une seule `<video>` : celle de la tuile **tenue sous le curseur** > 350 ms (debounce) → `playing` passe à true sur cette tuile uniquement ; en sortant, retour au thumbnail. Au repos (curseur hors zone), aucune vidéo — calme total.
- **Navigation.** Survol (cœur) + clic (ouvre le lien). Pas de scroll requis ; le banc tient dans le viewport et « dérive » très lentement (offset sinusoïdal `useTransform(time)` via `animate` en boucle douce) pour rester vivant sans solliciter.
- **Palette.** **Sombre** (encre profonde, tuiles légèrement lumineuses) : un banc se lit mieux comme points clairs sur fond sombre — sensation aquatique/abyssale, premium. Accent froid (cyan/argent).
- **Repli mobile / reduced-motion.** Mobile : pas de curseur → la répulsion suit le **toucher-glissé** (un doigt écarte la nuée localement) ; au repos, dérive coupée, devient une grille libre scrollable. reduced-motion : springs remplacés par positions statiques (vraie grille organique figée), répulsion désactivée, survol = simple élévation.
- **Pourquoi pas un cliché + inédit.** Ce n'est ni grille statique (ça bouge en permanence, doucement), ni parallaxe (pas de couches qui défilent), ni carrousel. Vs `MagneticField` (existant : attraction magnétique d'éléments individuels vers le curseur) : ici c'est l'inverse — **répulsion + cohésion de groupe**, comportement *collectif* émergent, pas attraction point par point. Vs `SwipeDeck`/`Stack` : aucun empilement.
- **Risque.** Perf si N grand (limiter à ~24 tuiles animées, throttle pointermove via `requestAnimationFrame`/motionValue natif). Risque de « gadget » si la répulsion est trop forte → la garder subtile, c'est une *respiration* pas un explosion.

---

### Concept B — « Faille » (*Faille douce*)
**Accroche :** *Deux plaques de projets glissent en sens inverse ; à la ligne de faille, le sol s'ouvre et révèle ce qu'il y a dessous.*

- **Mécanique cœur.** Deux (ou trois) **bandes horizontales** de tuiles. `useScroll` du conteneur → `useTransform` : la bande du haut translate vers la gauche, celle du bas vers la droite (subduction). Au centre vertical, une **ligne de faille** : une bande étroite où, via `clip-path`/`mask-image` piloté par le scroll, les tuiles touchées par la faille **s'écartent** (rotateX léger des deux lèvres en `preserve-3d`) pour laisser voir une **strate inférieure** (vidéo du projet à la faille + crédits). Effet de couches géologiques sans parallaxe cliché : ce n'est pas « le fond bouge moins vite », c'est « **le terrain se déchire** ».
- **Multiplicité.** Les deux+ bandes montrent en permanence ~8–12 projets qui défilent en opposition : la tension visuelle dit « il y en a beaucoup, et ça continue des deux côtés ».
- **Vidéo.** La `<video>` unique vit **dans la faille** : le projet dont la lèvre est actuellement au centre joue dans la fente révélée. Quand le scroll déplace la faille vers un autre projet, on swap la source (un seul élément `<video>` réutilisé). Hors faille : thumbnails.
- **Navigation.** Scroll (cœur, vertical→déchirure progressive). Clic sur une tuile = ouvre. Drag latéral optionnel pour pousser une plaque.
- **Palette.** **Claire en surface, sombre dans la faille** : les plaques en pierre claire/papier, la fente révèle une profondeur encre + la lumière de la vidéo. Le contraste *est* le concept (croûte vs magma).
- **Repli mobile / reduced-motion.** Mobile : une seule plaque, la faille devient un **accordéon** qui s'ouvre au tap (révèle vidéo+crédits). reduced-motion : pas de rotateX ni de translation opposée ; la faille devient une simple ligne de séparation cliquable (disclosure), bandes en scroll normal.
- **Pourquoi pas un cliché + inédit.** Anti-parallaxe (le mouvement est *opposé* et *narratif*, pas un simple décalage de vitesse). Vs `HorizontalScroll` (existant : une rangée qui défile) : ici **deux flux antagonistes + révélation par déchirure verticale**. Vs `RevealOnScroll` : la révélation n'est pas un fondu, c'est une *ouverture mécanique du sol*. Inédit : la métaphore tectonique appliquée au layout.
- **Risque.** Coordonner clip-path + 3D + scroll sans à-coups demande du soin (tout dériver d'un seul `scrollYProgress`). Lisibilité : éviter que les deux sens opposés donnent le mal de mer → vitesses douces, springs.

---

### Concept C — « Métronome » (*Silence cadencé*)
**Accroche :** *Un balancier unique cadence la galerie ; un seul projet est « sur le temps fort » à la fois, les autres attendent leur mesure.*

- **Mécanique cœur.** Les projets sont disposés en **arc** (éventail léger, comme les graduations d'un métronome). Un **balancier** central (barre fine + masse) dont l'angle = `useTransform(useScroll → angle)` ou `useSpring` autour d'une position cible. Le projet **pointé** par le balancier passe en avant-plan (scale up, `layoutId` partagé pour la promotion fluide, élévation, crédits dépliés). Le scroll fait osciller le balancier de projet en projet — chaque arrêt « tic » sur un projet (snap via `animate` vers l'angle de la graduation la plus proche). Le rythme est *visuel et silencieux* (oxymore assumé).
- **Multiplicité.** L'arc de graduations montre TOUS les projets simultanément comme des « battements » en attente ; le balancier en désigne un. On comprend l'orchestre entier + le soliste du moment.
- **Vidéo.** La `<video>` unique = le projet pointé par le balancier (au temps fort). Quand le balancier passe au suivant, swap. Entre deux temps, thumbnails uniquement → la vidéo est *cadencée*, jamais un mur d'autoplay.
- **Navigation.** Scroll (cœur, pilote l'angle) + clic (ouvre le projet pointé ; cliquer une graduation y amène le balancier — snap). Clavier : flèches = battement suivant/précédent.
- **Palette.** **Claire, premium horlogère** : blanc cassé/ivoire, balancier laiton/graphite, ombres longues douces. Évoque l'instrument de précision → « audacieux mais maîtrisé ».
- **Repli mobile / reduced-motion.** Mobile : l'arc devient une **colonne** ; le « balancier » est un curseur qui se cale sur le projet le plus proche du centre d'écran au scroll. reduced-motion : pas d'oscillation continue ; chaque scroll/clic **téléporte** le focus (`animate` court ou instant), pas de balancement.
- **Pourquoi pas un cliché + inédit.** Pas un carrousel à flèches (le moteur est un balancier physique piloté au scroll, pas des boutons next/prev). Vs `Wheel` (existant : roue qui tourne) : ici un **pendule** (oscillation bornée, snap rythmique, métaphore tempo), pas une rotation continue. Vs `SpotlightFocus` : le focus est *cadencé/rythmé*, déterminé par un mécanisme visible. Inédit : la notion de **tempo** dans une galerie.
- **Risque.** Le balancier doit *sembler* mécanique sans paraître saccadé : doser `useSpring` (assez d'inertie pour la masse, assez de damping pour le calme). Accessibilité du « projet pointé » : annoncer en `aria-live`.

---

### Concept D — « Sève » (*Frontière vivante*)
**Accroche :** *Les projets sont les feuilles d'un même arbre ; la sève circule de l'un à l'autre et celui qu'elle atteint s'épanouit.*

- **Mécanique cœur.** Les tuiles sont reliées par un **réseau de veines** (SVG paths fins, organiques, tracés une fois). La **sève** = une progression animée le long des veines : un `mask-image`/gradient animé via `useMotionValue`+`animate` qui parcourt le chemin et, en atteignant une feuille (tuile), la fait *gonfler* (scale + saturation des filtres CSS, `layout`). Le scroll **accélère/inverse** le flux (`useTransform(scrollVelocity → débit)`). Survol d'une feuille = on **dévie la sève** vers elle (elle s'épanouit, ses voisines reçoivent un reflux). Mouvement continu mais lent, sensation organique premium.
- **Multiplicité.** L'arbre/réseau entier est visible : toutes les feuilles + les liens qui disent « même organisme » (le lab). Célèbre la *communauté* de participants, pas juste une liste.
- **Vidéo.** La `<video>` unique joue dans la feuille **actuellement irriguée** (point culminant de la sève) ; en se déplaçant, la sève « éteint » l'ancienne (retour thumbnail) et « allume » la nouvelle. Une seule à la fois, par construction du flux.
- **Navigation.** Mix : scroll (débit/sens de la sève) + survol (dévier vers une feuille) + clic (ouvre). Au repos, la sève circule en boucle douce → vivant sans agressif.
- **Palette.** **Sombre verdoyante** OU **claire végétale** selon l'heure ; je propose **sombre** (forêt nocturne, veines luminescentes type bioluminescence) — premium, met la vidéo et la saturation en valeur. Accent : vert d'eau lumineux.
- **Repli mobile / reduced-motion.** Mobile : veines simplifiées en une **tige verticale** ; le scroll fait monter la sève, la feuille au centre s'épanouit. reduced-motion : flux figé ; les veines restent comme décor statique, la feuille active est choisie au survol/scroll sans animation de parcours.
- **Pourquoi pas un cliché + inédit.** Aucun des bannis (pas de flèches, pas de parallaxe, pas d'autoplay massif, pas de grille). Vs `Loom`/`Lighthouse`/`MaterialAwaken` (existants) : ici un **réseau organique connecté** (graphe de veines + flux), métaphore biologique de circulation — aucune vue existante ne relie *explicitement* les tuiles par un flux animé. Inédit : la **connectivité visible entre participants** comme moteur.
- **Risque.** Tracer un réseau lisible pour N variable (6→9→plus) sans spaghetti : générer les veines déterministes (seed 7724) avec contraintes (arbre couvrant, pas de croisements). Animer un `mask` le long d'un path SVG en Framer pur demande de la finesse (offset de gradient ou `pathLength` sur un trait masque). Tester perf des filtres.

---

### Concept E — « Douane » (*portails de seuil*)
**Accroche :** *La galerie est une frontière : chaque projet est un pays, et on le découvre en franchissant son guichet — tampon, puis passage.*

- **Mécanique cœur.** Au repos, une **rangée de portiques/guichets** vus de biais en 3D (`perspective` + `rotateY` sur le conteneur, comme un couloir de douane). Le scroll/drag **avance dans le couloir** (`useScroll → z`/translateZ simulé par scale+x des portiques). Quand un guichet arrive **au seuil** (centre, de face), il se « tamponne » : une animation `clip-path` (cercle/tampon) révèle le contenu plein cadre + crédits, comme un coup de tampon sur un passeport. Continuer = franchir (le portique s'écarte de part et d'autre via `rotateY` opposés, on traverse vers le suivant). Métaphore de **seuil/rituel** = sensation muséale premium.
- **Multiplicité.** Le couloir montre toujours la **file** de guichets devant et derrière → « il y a une succession de participants à franchir ». La perspective en file = beaucoup, ordonnés.
- **Vidéo.** La `<video>` unique = le guichet **au seuil** (de face) : au moment du « tampon », la vidéo se révèle via le clip-path. Les guichets en perspective restent thumbnails. Un seul de face = une seule vidéo.
- **Navigation.** Scroll (cœur : avancer dans le couloir) + clic (au seuil = ouvrir/franchir = lien ; sur un guichet lointain = l'amener au seuil). Drag horizontal alternatif.
- **Palette.** **Claire, institutionnelle revisitée** : marbre clair, lignes nettes, accent « tampon » coloré (le seul point de couleur saturée = l'encre du tampon par projet, donc *varie par projet*). Sobriété de hall premium.
- **Repli mobile / reduced-motion.** Mobile : couloir → **pile verticale** de cartes-passeport, tap = tamponner/ouvrir. reduced-motion : pas de rotateY 3D ni de tampon animé ; transition simple (fade/disclosure) entre guichets, le clip-path devient une apparition nette.
- **Pourquoi pas un cliché + inédit.** Pas de flèches, pas de parallaxe, pas de grille. Anti-coverflow malgré la 3D : ici c'est un **couloir frontal qu'on traverse** (mouvement en Z + rituel de tampon), pas des pochettes inclinées qu'on fait défiler latéralement. Vs `Book` (existant, on tourne des pages) : ici on **franchit des seuils** avec révélation par tampon `clip-path`. Inédit : la **dramaturgie du passage** (présenter → tamponner → franchir).
- **Risque.** Le 3D en couloir peut être désorientant si trop profond ; limiter l'amplitude. Le « tampon » doit être élégant, pas gadget cartoon → clip-path doux + son visuel discret (pas de bruit réel). Gérer le swap vidéo au franchissement sans flash.

---

### Concept F — « Kaléidoscope » (*Foule immobile*, variante radiale) — concept bonus, plus risqué
**Accroche :** *Tournez le tube : les projets se reflètent en symétrie radiale, et la lumière d'une seule vidéo teinte tous les éclats.*

- **Mécanique cœur.** Disposition en **secteurs radiaux** (5–7) autour d'un centre. Chaque secteur contient des tuiles ; le scroll/drag fait **tourner l'ensemble** (`useTransform(scrollY → rotate)` sur le conteneur, `useSpring` pour l'inertie). Symétrie « miroir » obtenue en **dupliquant** les thumbnails dans des secteurs voisins avec `scaleX(-1)` + filtres/`mix-blend-mode` différents (reflets, pas vraie multiplication infinie). Le secteur **au sommet** (12 h) est le projet « actif » et **non réfléchi** (vrai, net) ; en tournant, un autre arrive au sommet.
- **Multiplicité.** Très dense visuellement : on voit beaucoup de fragments → impression de richesse/foule. Attention : il faut que les *vrais* projets restent identifiables (voir risque).
- **Vidéo.** La `<video>` unique = projet au sommet (net). Sa luminosité « colore » les secteurs voisins via un overlay en `mix-blend-mode` partagé (la « lumière du kaléidoscope »). En tournant, swap.
- **Navigation.** Drag rotatif (cœur, comme tourner un tube) + scroll. Clic sur le secteur sommet = ouvre.
- **Palette.** **Sombre**, pour que les reflets/blend et la lumière vidéo ressortent (verre + lumière). Couleurs qui varient par projet via la teinte de sa vidéo.
- **Repli mobile / reduced-motion.** Mobile : réduire à 3 secteurs ou basculer en simple **roue** tactile (1 projet net à la fois). reduced-motion : supprimer la rotation continue et les reflets multiples → garder un seul anneau de tuiles qu'on parcourt par snap.
- **Pourquoi pas un cliché + inédit.** Pas de flèches/parallaxe/grille. Vs `Wheel` (existant) : la roue montre des projets *distincts* ; ici la **symétrie réfléchie + lumière partagée** crée un effet optique kaléidoscopique inédit. Risqué mais très « WOW desktop ».
- **Risque.** **Le plus élevé du lot** : les reflets peuvent nuire à la lisibilité des participants (on doit *comprendre* qui est qui, pas juste admirer des motifs). Mitigation : ne réfléchir que 2 secteurs adjacents, garder les vrais projets dominants, légender clairement le sommet. Si la lisibilité souffre, déclasser.

---

## 3. CLASSEMENT

| Rang | Concept | Force | Faisabilité Framer pur | Adéquation brief (calme/premium/multiplicité) |
|------|---------|-------|------------------------|-----------------------------------------------|
| 1 | **B — Faille** | Métaphore forte, anti-parallaxe net, révélation mécanique | Bonne (tout dérivé de `scrollYProgress` + clip-path + rotateX) | Excellente — tension géologique maîtrisée |
| 2 | **C — Métronome** | Idée de *tempo* vraiment neuve, élégante | Bonne (`useSpring` angle + snap `animate`) | Excellente — horloger, calme, soliste cadencé |
| 3 | **D — Sève** | Connectivité entre participants = sens fort pour un lab | Moyenne (réseau lisible + mask sur path délicat) | Très bonne — organique premium |
| 4 | **A — Banc** | Multiplicité *incarnée*, vivant | Bonne mais attention perf (répulsion curseur) | Bonne — risque léger « gadget » |
| 5 | **E — Douane** | Dramaturgie de seuil muséale | Moyenne (3D couloir + tampon à doser) | Bonne — peut désorienter |
| 6 | **F — Kaléidoscope** | Le plus spectaculaire | Risquée (lisibilité des reflets) | Incertaine — à prototyper avant de trancher |

**TOP 2 retenus : B — Faille** et **C — Métronome.**

---

## 4. Hypothèses & questions ouvertes

- **Hypothèse données.** `Project` expose `thumbnail`, `previewVideo`, `title`, `author`, `kind`, `href`, `width/height` (confirmé dans le code). Les concepts ne supposent rien de plus. Si des **crédits étendus** (rôle, description) existaient, D (sève) et E (douane) en bénéficieraient pour la « révélation au seuil ».
- **Hypothèse N.** Le shell teste 6 ou 9 projets ; les vues doivent tenir au-delà. Banc et Sève sont les plus sensibles à N → génération déterministe (seed 7724) recommandée pour positions/veines.
- **Hypothèse une seule `<video>`.** Tous les concepts respectent « une `<video>` active » en réutilisant un unique élément dont on swap la `src` selon l'élément focal (faille / temps fort / feuille irriguée / seuil / sommet) — pattern déjà vu dans le code (`playing` contrôlé par la vue).
- **Question ouverte — palette « varie par vue ».** Faille = clair/sombre contrasté ; Métronome = clair horloger ; Sève/Banc/Kaléido = sombre. Faut-il une **règle d'accent dérivée du projet actif** (teinte extraite/déclarée) pour que la couleur « varie par vue » de façon vivante ? À décider au design.
- **Question ouverte — desktop WOW vs mobile correct.** Faille, Douane et Kaléido reposent sur la 3D/scroll desktop ; leurs replis mobiles (accordéon, pile, roue) sont *corrects* mais perdent le concept. Acceptable selon le brief ; à valider.
- **Question ouverte — combiner ?** Le **flux de sève** (D) pourrait servir de *liant* discret par-dessus une autre vue pour signifier « même lab » sans être une vue à part entière. À explorer si on veut un fil rouge de branding (même si « branding : aucun »).

---

*Mots aléatoires injectés et tracés : banc de poissons (A), tectonique (B), métronome (C), sève (D), douane (E), kaléidoscope (F). Seed 7724 réutilisé pour toute génération déterministe (positions banc, veines sève).*
