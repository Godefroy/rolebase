import type { AstroUserConfig } from 'astro'

type Redirects = NonNullable<AstroUserConfig['redirects']>

// Static redirections only, wildcards in netlify.toml
export const redirects: Redirects = {
  '/sitemap.xml': '/sitemap-index.xml',
  '/demande-demo': '/fr/contact',
  '/book-a-demo': '/en/contact',
  '/tarifs': '/fr/pricing',
  '/pricing': '/en/pricing',

  // Removed glossary entry "Topic/Sujet" → Discussions documentation
  '/en/glossary/sujet': '/en/docs/threads',
  '/fr/glossary/sujet': '/fr/docs/threads',

  // Platform feature pages (old site → new /features)
  '/plateforme/flowchart': '/en/features',
  '/plateforme/organigramme': '/fr/features',
  '/plateforme/roles': '/fr/features',
  '/plateforme/team-management': '/en/features',
  '/plateforme/gestion-equipe': '/fr/features',
  '/plateforme/tasks': '/en/features',
  '/plateforme/taches': '/fr/features',
  '/plateforme/subjects': '/en/features',
  '/plateforme/sujets': '/fr/features',
  '/plateforme/meetings': '/en/features',
  '/plateforme/reunions': '/fr/features',
  '/plateforme/knowledge-management': '/fr/features',
  '/plateforme/onboarding-offboarding': '/fr/features',
  '/plateforme/annuaire-intelligent': '/fr/features',
  '/plateforme/recherche-intelligente': '/fr/features',
  '/plateforme/capture-du-knowledge': '/fr/features',
  '/plateforme/registre-des-decisions': '/fr/features',
  '/plateforme/comptes-rendus-de-reunions': '/fr/features',
  '/plateforme/diffusion-de-linformation': '/fr/features',
  '/plateforme/reunions-dequipe': '/fr/features',
  '/plateforme/responsabilites-des-equipes': '/fr/features',
  '/plateforme/optimisation-des-temps-de-reunions': '/fr/features',
  '/plateforme/resumes-de-reunion-par-ia': '/fr/features',
  '/plateforme/fil-dactualites': '/fr/features',
  '/plateforme/next-step-de-reunion': '/fr/features',

  // Alternatives
  '/alternatives': '/fr/features',
  '/alternatives/holaspirit': '/fr/blog/alternative-holaspirit',
  '/alternatives/glassfrog': '/fr/blog/alternative-glassfrog',
  '/alternatives/notion': '/fr/features',
  '/alternatives/slite': '/fr/features',
  '/alternatives/lucidchart': '/fr/features',

  // Pour qui → homepage (no equivalent in new site)
  '/pour-qui/pme': '/fr',
  '/pour-qui/entreprise-liberee': '/fr',
  '/pour-qui/equipe-autonome': '/fr',

  // Main page redirects (old site → new localized site)
  '/contact': '/fr/contact',
  '/blog': '/fr/blog',
  '/cas-clients': '/fr/client-cases',
  '/cas-clients/scop-evea': '/fr/client-cases/scop-evea',
  '/cas-clients/lonestone': '/fr/client-cases/lonestone',
  '/glossaire-rbm': '/fr/glossary',
  '/privacy': '/fr/privacy',
  '/legal': '/fr/legal',
  '/conditions-generales-de-vente': '/fr/terms',
  '/conditions-dutilisation-de-lia-par-rolebase': '/fr/legal',
  '/faq': '/fr',
  '/integrations': '/fr/features',
  '/calculateur-deconomie-de-temps': '/fr',

  // Documentation redirects (old /documentation/* → new /fr/docs/*)
  '/documentation/pour-commencer': '/fr/docs/getting-started',
  '/documentation/onboarding-rolebase': '/fr/docs/getting-started',
  '/documentation/creer-organigramme': '/fr/docs/org-chart',
  '/documentation/partager-organigramme': '/fr/docs/org-chart',
  '/documentation/import-organisation': '/fr/docs/import',
  '/documentation/google-calendar': '/fr/docs/apps-integrations',
  '/documentation/inviter-des-collaborateurs': '/fr/docs/members',
  '/documentation/supprimer-un-collaborateur': '/fr/docs/members',
  '/documentation/creer-modele-reunion': '/fr/docs/meetings',
  '/documentation/reunion-recurrente': '/fr/docs/meetings',
  '/documentation/utilisation-des-reunions-dequipe-dans-rolebase':
    '/fr/docs/meetings',
  '/documentation/comment-generer-un-resume-de-reunion-par-ia-avec-rolebase':
    '/fr/docs/meetings',
  '/documentation/comment-utiliser-les-next-steps-de-reunion-dans-rolebase':
    '/fr/docs/meetings',
  '/documentation/utilisation-du-registre-des-decisions-sur-rolebase':
    '/fr/docs/decisions',
  '/documentation/comment-utiliser-le-fil-dactualites-rolebase':
    '/fr/docs/news-feed',
  '/documentation/page-blanche': '/fr/docs/threads',
  '/documentation/comment-capturer-votre-connaissance-interne-avec-rolebase':
    '/fr/docs/threads',
  '/documentation/comment-utiliser-la-recherche-intelligente-de-rolebase':
    '/fr/docs',

  // Blog redirects: pre-2026 posts (FR old slugs)
  '/blog/10-bonnes-pratiques-pour-la-gouvernance-collaborative':
    '/fr/blog/collaborative-governance',
  '/blog/10-conseils-pour-des-retours-constructifs-entre-pairs':
    '/fr/blog/peer-feedback',
  '/blog/3-solutions-pour-ameliorer-la-communication-dequipe':
    '/fr/blog/team-communication',
  '/blog/5-etapes-pour-optimiser-vos-reunions-dequipe':
    '/fr/blog/optimize-meetings',
  '/blog/7-outils-essentiels-pour-la-gestion-dequipes-horizontales':
    '/fr/blog/horizontal-tools',
  '/blog/checklist-mise-en-place-dune-structure-horizontale':
    '/fr/blog/horizontal-checklist',
  '/blog/comment-attribuer-des-roles-en-reunion':
    '/fr/blog/assign-roles-meetings',
  '/blog/comment-decider-en-collectif-avec-la-decision-par-consentement':
    '/fr/blog/consent-decision',
  '/blog/comment-definir-les-roles-dans-une-organisation-horizontale':
    '/fr/blog/define-roles',
  '/blog/comment-donner-un-feedback-constructif-avec-la-methode-oscar':
    '/fr/blog/oscar-feedback',
  '/blog/comment-faire-des-comptes-rendus-de-reunions-gagner-du-temps-nourrir-la-documentation-interne':
    '/fr/blog/meeting-minutes',
  '/blog/comment-integrer-lamelioration-continue-au-management-horizontal':
    '/fr/blog/continuous-improvement',
  '/blog/comment-integrer-le-feedback-dans-la-gestion-horizontale':
    '/fr/blog/feedback-horizontal',
  '/blog/comment-la-gestion-horizontale-renforce-la-confiance':
    '/fr/blog/horizontal-trust',
  '/blog/creer-un-organigramme-pour-votre-entreprise':
    '/fr/blog/create-org-chart',
  '/blog/differences-entre-structure-plate-et-hierarchique':
    '/fr/blog/flat-vs-hierarchical',
  '/blog/faq-management-horizontal-et-productivite-dequipe':
    '/fr/blog/horizontal-faq',
  '/blog/guide-complet-sur-lanalyse-de-sentiment-dequipe':
    '/fr/blog/sentiment-analysis',
  '/blog/guide-complet-transition-vers-un-management-horizontal':
    '/fr/blog/horizontal-transition',
  '/blog/guide-ultime-des-organigrammes-open-source':
    '/fr/blog/open-source-org-charts',
  '/blog/holacratie-vs-sociocratie-quelles-differences':
    '/fr/blog/holacracy-vs-sociocracy',
  '/blog/introduction-a-la-sociocratie-une-approche-dynamique-de-la-gouvernance':
    '/fr/blog/sociocracy-intro',
  '/blog/introduction-a-lholacratie-repenser-la-gouvernance-organisationnelle':
    '/fr/blog/holacracy-intro',
  '/blog/introduction-au-role-based-management-votre-solution-contre-les-silos':
    '/fr/blog/role-based-management',
  '/blog/introduction-aux-methodes-agiles': '/fr/blog/agile-methods',
  '/blog/la-reunion-de-gouvernance-pour-faire-evoluer-son-organisation':
    '/fr/blog/governance-meeting',
  '/blog/la-reunion-tactique-ou-reunion-de-triage': '/fr/blog/tactical-meeting',
  '/blog/la-reunionite-aigue-definition-en-entreprise-et-nos-solutions-pour-y-dire-stop':
    '/fr/blog/meeting-overload',
  '/blog/le-role-de-leader-en-holacratie': '/fr/blog/holacracy-leader',
  '/blog/leadership-horizontal-vs-leadership-traditionnel':
    '/fr/blog/horizontal-leadership',
  '/blog/les-meilleures-solutions-open-source-pour-creer-un-organigramme':
    '/fr/blog/open-source-org-chart-tools',
  '/blog/management-horizontal-vs-vertical-avantages-et-differences':
    '/fr/blog/horizontal-vs-vertical',
  '/blog/mieux-attribuer-les-roles-avec-lelection-sans-candidat':
    '/fr/blog/election-without-candidate',
  '/blog/pourquoi-remplacer-la-fiche-de-poste-par-des-roles':
    '/fr/blog/roles-vs-job-descriptions',
  '/blog/reunion-a-distance-efficaces-nos-secrets-pour-lentreprise-hybride-ou-full-remote':
    '/fr/blog/remote-meetings',
  '/blog/reunionite-le-pourquoi-selon-un-chercheur-et-nos-5-conseils-pour-la-combattre':
    '/fr/blog/meeting-overload-tips',

  // Blog redirects: 2026 posts (EN old slugs)
  '/blog/the-dynamic-organisational-chart-or-the-org-chart-of-the-future':
    '/en/blog/dynamic-org-chart',
  '/blog/the-movement-that-has-been-questioning-management-for-over-50-years':
    '/en/blog/management-movement',
  '/blog/the-no-1-pitfall-of-business-owners-when-scaling-and-how-to-avoid-it':
    '/en/blog/scaling-pitfall',
  '/blog/the-subtle-but-constant-ways-your-team-is-losing-energy-and-focus':
    '/en/blog/team-energy-loss',
  '/blog/why-hierarchy-isnt-a-very-good-way-of-organising-work-today':
    '/en/blog/hierarchy-problems',
  '/blog/how-to-craft-incredibly-productive-meetings':
    '/en/blog/productive-meetings',
  '/blog/how-to-actually-make-project-handovers-between-teams-efficient':
    '/en/blog/project-handovers',
}
