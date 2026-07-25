# TERREAU.md — référentiel du site pour les skills Terreau

Ce fichier centralise **tout ce qui est spécifique à ce site** pour les skills `terreau-*` :
identité, positionnement, ICP, angles différenciants, concurrents à exclure, pages canoniques,
ciblage des mots-clés, organisation du contenu, conventions visuelles, pages evergreen et
confidentialité de la stratégie.

Les skills `terreau-*` sont génériques et partagées entre tous les sites : elles ne contiennent
aucune valeur de ce fichier, elles le lisent.

---

## 1. Identité du site

- **Marque** : Rolebase
- **Domaine** : `rolebase.io`
- **URL de base** : `https://rolebase.io`
- **Année de fondation** : non renseignée
- **Localisation** : non renseignée
- **Nature** : produit SaaS open source, plateforme de gouvernance d'équipe (rôles, organigramme,
  réunions, décisions par consentement)
- **Langue du contenu** : bilingue anglais / français, **anglais par défaut**
  (`website.config.ts` : `langs: ['en', 'fr']`, `defaultLang: 'en'`)

Ces valeurs alimentent les schémas `Organization`, les URL absolues et le ton.

---

## 2. Positionnement & ICP

Rolebase clarifie qui fait quoi et donne aux équipes une autonomie réelle : cartographier les rôles,
mener de meilleures réunions, laisser chaque équipe s'auto-organiser. Plateforme open source, plan
gratuit jusqu'à 5 membres actifs, plan Startup à 5 €/utilisateur/mois, offre Entreprise sur devis.

**Mapping ICP par thème** :

| Thème du contenu | ICP à nommer |
|---|---|
| Gouvernance partagée, sociocratie, holacratie, rôles | organisations en gouvernance partagée (PME, coopératives, associations) |
| Réunions, prise de décision, alignement | équipes et managers d'équipes autonomes |
| Organigramme, clarté des responsabilités | dirigeants et responsables d'organisation en croissance |

**Types de page et intention de recherche** :

- **Pages commerciales** : `/` (accueil), `/features`, `/pricing`, `/client-cases`. Intention
  transactionnelle (le chercheur est prêt à adopter un outil).
- **Pages informationnelles** : `/blog`, `/docs`, `/guides`, `/glossary`, `/developers`, `/api`.
  Intention informationnelle, doivent renvoyer vers une page commerciale.

Les URL portent le préfixe de locale (`/en/...`, `/fr/...`) : un lien interne doit utiliser le
préfixe de la locale du contenu qui le contient.

**Action de conversion** :

- **Principale** : créer un compte gratuit (`/signup`), sans carte bancaire, jusqu'à 5 membres actifs.
- **Secondaire** : demander une démo et un devis (offre Entreprise).

---

## 3. Arguments différenciants / angles défendables

À mobiliser dans les contenus comparatifs et les paragraphes de positionnement, dans cet ordre :

1. **Open source** : le produit est ouvert et vérifiable, pas une boîte noire SaaS. Argument fort
   face aux outils propriétaires du même segment.
2. **Prise en main et rapport qualité/prix reconnus** : Capterra Best Value 2023, Capterra Best Ease
   of Use 2023, Software Advice Customer Support 2023.
3. **Accès gratuit réel** : toutes les fonctionnalités jusqu'à 5 membres actifs, sans carte
   bancaire, puis un plan payant qui suit la croissance.
4. **Couverture de bout en bout de la gouvernance** : rôles et organigramme, réunions, décisions,
   feedback entre pairs, dans un seul outil plutôt qu'un assemblage.
5. **Cas clients publics** : citer les études de cas de la collection `client-cases/` avec un lien
   vers leur page.

Vérifier toute affirmation produit contre le code de l'application (`packages/webapp`) avant de la
publier : ne jamais promettre une fonctionnalité qui n'existe pas.

---

## 4. Concurrents

### À ne jamais citer

Ne jamais mentionner ces entreprises dans les contenus (listicles, blog, comparatifs, ads, pages
SEO), même dans un format dont l'objectif est de citer honnêtement des concurrents.

- aucun pour l'instant

### Catégories comparables

Rolebase se situe au croisement de l'organigramme, de la gouvernance et des réunions. Toujours
nommer explicitement la catégorie comparée : certaines méritent un « Rolebase ne remplace pas X »
honnête.

- **Outils de gouvernance et d'auto-organisation** (Holaspirit, Peerdom, GlassFrog) : les
  concurrents les plus directs, à comparer sur les rôles, les cercles, les réunions et le prix.
- **Organigrammes et people ops** (Lucidchart, Organimi, ChartHop, SIRH avec module organigramme) :
  cartographient une hiérarchie de postes, pas des rôles ni des responsabilités distribuées.
- **Gestion de projet et de tâches** (Asana, ClickUp, Notion, Monday) : couvrent le « qui fait quoi »
  au niveau de la tâche, pas au niveau du rôle et de la décision. Souvent complémentaires.
- **Wiki et base de connaissances** (Notion, Confluence) : hébergent la documentation de
  gouvernance, sans la structurer ni la faire vivre.
- **Outils de réunion** (Fellow, Hypercontext, Range) : ordres du jour et comptes rendus, sans lien
  avec la structure des rôles.

---

## 5. Pages canoniques par thème

Les pages qui portent le positionnement, les chiffres et la FAQ d'un thème sont les pages
commerciales et la documentation : `src/content/pages/features/`, `src/content/pages/pricing/`,
`src/content/pages/index/`, plus les collections `docs/`, `guides/` et `client-cases/`.

**Méthode** : pour un thème donné, parcourir ces collections et repérer les pages dont le sujet
recouvre le thème. Les lire avant de rédiger (claims, chiffres, cas clients, FAQ), et lier vers
elles depuis le nouveau contenu.

**Ciblage keyword d'un article** : un article informationnel cible sa propre page `/blog/` ; un
keyword transactionnel pointe vers la page commerciale que l'article booste (`/features`,
`/pricing`).

---

## 6. Ciblage des mots-clés par type de page

- **Pages informationnelles** : keywords informationnels — « qu'est-ce que X », « comment X »,
  « guide X », « X vs Y » en intention d'apprentissage.
- **Pages commerciales** : keywords **transactionnels** d'un site produit / SaaS (le chercheur est
  prêt à adopter) :
  - `logiciel X`, `outil X`, `application X`, `plateforme X`
  - `meilleur X`, `top X`, `comparatif X`
  - `alternative à Y`, `Y alternative`
  - `X gratuit`, `X open source`, `essai X`, `X pricing`, `X en ligne`

Test : le chercheur est-il prêt à passer à l'action (adopter, tester, acheter) ? Si oui, bonne seed
transactionnelle. S'il apprend un concept, c'est informationnel → blog.

**Volume** : ne jamais suivre un terme à 0 volume confirmé.

---

## 7. Où vit le contenu

Astro + MDX + Tailwind, i18n par dossier, dans le dossier `website/` du monorepo.

- **Collections éditoriales** (`src/content/`) : `blog/`, `client-cases/`, `docs/`, `guides/`,
  `developers/`, `api/`, `glossary/`, `pages/` (index, features, pricing, contact, partners, legal,
  privacy, terms, 404), `translations/` (traductions d'UI).
- **Un contenu = un dossier**, avec un fichier par locale et les assets co-localisés :
  `src/content/<collection>/<slug>/en.mdx` + `fr.mdx` + `image.jpg`.
- **Schémas de collection** : `src/content.config.ts` (source de vérité des champs de frontmatter).
- **Templates de page** : `src/pages/[lang]/` (un seul jeu de routes pour les deux locales),
  `src/pages/index.astro` pour la redirection racine.
- **Composants JSON-LD** : `src/components/JsonLd.astro`, `src/components/JsonLdHome.astro` ;
  l'`Organization` et le `WebSite` du site sont émis par `src/layouts/BaseLayout.astro`.
- **Composants MDX** : tous les `.astro` de `src/components/` sont auto-découverts et disponibles
  dans les MDX sans import.
- **i18n** : utilitaires dans `src/utils/i18n.ts`, config de langues dans `website.config.ts`.

**Frontmatter d'un article de blog** :

```yaml
title: 'Titre de l'article'      # sert de H1 et de headline JSON-LD, viser ≤ 60 caractères
h1: 'H1 affiché'                 # optionnel, remplace le H1 visible quand il diffère du title
summary: 'Résumé en une phrase'  # sous le titre et sur les cartes, 120-160 caractères
date: YYYY-MM-DD
update: YYYY-MM-DD               # optionnel, date de dernière mise à jour factuelle
image: './thumbnail.jpg'
author: 'Nom'                    # optionnel
similarPosts: ['slug-1', 'slug-2']
takeaways: []                    # points clés affichés en encadré en tête d'article
draft: false
hideInlineCta: false
```

`date`, `image`, `similarPosts` restent identiques entre `en.mdx` et `fr.mdx` ; seuls `title`,
`h1`, `summary`, `takeaways` et le corps sont traduits. La version FR est un article français
natif, pas une traduction littérale.

**Skills d'édition propres au site** : `post-alternative` (articles « alternative à X »),
`landing-page`. Les charger avant d'éditer ces contenus.

---

## 8. Génération d'images

La génération passe par l'API Terreau (`POST /images/generate`), via la skill
`terreau-generate-image`. Le site n'a pas de script local : ce qui est propre à Rolebase, ce sont
les blocs de style ci-dessous, que la skill copie verbatim dans le prompt (bloc 2).

**Bloc de style par défaut (à copier verbatim)** :

```text
Marque Rolebase : fond crème chaud #FDF6EA, violet primaire #9870F0, orange chaud #FB9803,
neutres gris chauds, ambiance humaine et chaleureuse.

Thumbnails et visuels d'article :
- Fond crème clair et chaud, jamais sombre. La marque est chaleureuse et humaine, pas corporate.
- Violet et orange en accents focaux : la plupart des objets en gris chaud, avec le violet
  #9870F0 et l'orange #FB9803 qui éclairent l'élément clé.
- Lumière douce et directionnelle, bloom léger, dégradés doux. Pas de contraste dur, pas de néon.
- Conceptuel, pas littéral : métaphore du sujet (passation, alignement, gouvernance, énergie,
  rôles) plutôt qu'une représentation directe.
- Humain quand c'est possible : figures 3D douces en posture collaborative. Les formes abstraites
  restent organiques (arrondies, souples) plutôt que tranchantes.
- Scène 3D isométrique ou mise en scène, douce et amicale. Ni hyper-réaliste, ni gamey.
- Point focal unique, silhouette forte, lisible à 300 px de large.
- Éviter l'imagerie de pyramide corporate et les cadres en costume : préférer des professionnels
  modernes, divers et décontractés.

Thèmes de la marque : rôles, organigramme, gouvernance, auto-organisation, collaboration, feedback
entre pairs.
```

**Preset avatar (à copier verbatim à la place du bloc par défaut)** : pour les avatars de membres
(organigramme de démo), où tout un jeu doit être homogène. Le prompt ne décrit alors **que la
personne** (cheveux, peau, pilosité, lunettes, haut simple), jamais le style, le cadrage ni le fond.
Générer en carré (512x512) et garder une formulation identique d'un avatar à l'autre.

```text
Flat 2D vector avatar illustration. Bold clean shapes, soft flat shading, simple modern
cartoon-vector style. NOT realistic, NOT photographic, NOT 3D, NOT rendered. A single character,
head-and-shoulders portrait, centered and filling the entire square frame edge to edge, with both
shoulders and the upper chest clearly visible and the shoulders touching the bottom edge; the head
sits in the upper-middle and is not oversized. Plain flat single solid pale background (soft warm
cream #FDF6EA or a light neutral) with a subtle hint of Rolebase purple #9870F0. Absolutely no
circular crop, no round frame, no border, no badge, no vignette, no desk, no props, no scene, just
the character on a flat background. Keep composition, zoom, lighting and art style identical so
every avatar in the set matches.
```

Le modèle sort ~1024 px : réduire ensuite pour le web
(`sips -s format jpeg -s formatOptions 80 -Z 192 in.png --out out.jpg`, ≈8 Ko par avatar).

---

## 9. Screenshots

- **Screenshots Rolebase partagés** entre plusieurs contenus :
  `website/src/assets/screenshots/` (`rolebase-homepage.png`, `rolebase-features.png`,
  `rolebase-pricing.png`). Référencés depuis un MDX de blog par
  `![...](../../../assets/screenshots/rolebase-homepage.png)`.
- **Screenshots de concurrents pour un article** : co-localisés avec le MDX dans
  `website/src/content/blog/<slug>/<concurrent>.png`, référencés par `![...](./<concurrent>.png)`.

---

## 10. Pages evergreen

Pages à garder factuellement à jour, avec leur cadence. La skill `terreau-update-evergreen` respecte
la fenêtre de cooldown.

**Trimestriel (1 refresh max par 90 jours)** :

- aucune pour l'instant

**Mensuel (1 refresh max par 30 jours)** :

- aucune pour l'instant

---

## 11. Publication et vérifications

- **Build** : `npm run build` depuis `website/` (le serveur de dev tourne en local, lire sa sortie
  suffit souvent).
- **Social preview** : pas de script dédié, l'image Open Graph vient du champ `image` du frontmatter.
- **Longueurs SERP** : `title` ≤ 60 caractères, `summary` ≤ 160 caractères.
- **Parité des locales** : `en.mdx` et `fr.mdx` existent tous les deux, avec `date`, `image` et
  `similarPosts` identiques ; tous les slugs de `similarPosts` pointent vers des dossiers existants ;
  les liens internes portent le bon préfixe de locale.
- **Commit** : jamais sans validation humaine.

---

## 12. Confidentialité de la stratégie SEO

La stratégie SEO est confidentielle. Ne jamais mentionner SERP, mots-clés, volumes de recherche,
difficulté (KD), CPC ni positions dans les messages adressés à l'utilisateur : ces données servent
en interne uniquement, pour raisonner et agir, pas pour être exposées telles quelles.
