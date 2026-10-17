# Plan d'Architecture & Cahier des Charges — Plateforme de Prospection & Audit IA B2B

## 1. Vision du Projet

Application interne de **prospection commerciale et d'audit digital automatisé par IA** dédiée aux métiers du **Digital & de la Tech** (développement web/mobile, création de sites, SEO, marketing digital, automatisation/IA, design) ciblant prioritairement le marché d'**Afrique francophone (Sénégal, Côte d'Ivoire, etc. — devises FCFA / EUR)**.

L'outil permet de :
1. **Identifier des entreprises locales ou des offres d'emploi** ayant besoin de compétences digitales.
2. **Auditer automatiquement leur présence en ligne** (ou l'absence de site web) pour détecter leurs faiblesses techniques et marketing.
3. **Identifier les décideurs et leurs coordonnées** (WhatsApp, téléphone, email, LinkedIn).
4. **Associer automatiquement les faiblesses détectées à votre catalogue de services** chiffré en FCFA et EUR.
5. **Générer une page d'audit & proposition interactive unique (`/p/[slug]`)** ainsi que des **messages de prospection multi-canaux (WhatsApp, Email, LinkedIn)** rédigés par Google Gemini.
6. **Suivre l'ensemble du cycle commercial dans un Mini-CRM Kanban** avec radars de veille automatisés.

---

## 2. Parcours Utilisateur Global (Workflow)

```
[1. Configuration] ──► Définition du profil prestataire, catalogue d'offres (FCFA/EUR) & clés API
        │
        ▼
[2. Découverte]    ──► Recherche d'entreprises locales (Maps/Web/CSV) OU Radar d'offres d'emploi Tech/Digital
        │
        ▼
[3. Audit IA 360°] ──► Scan adaptatif (Site existant vs Pas de site) + Analyse SEO/Mobile/Pixels/Stack + Gemini
        │
        ▼
[4. Matching]      ──► Score d'opportunité (0-100) + Sélection automatique des prestations recommandées
        │
        ▼
[5. Action & Lien] ──► Génération du pitch (WhatsApp/Email/LinkedIn) + Page publique interactive (/p/[slug])
        │
        ▼
[6. Suivi CRM]     ──► Pipeline Kanban (Sauvegardé ➔ Contacté ➔ Proposition vue ➔ Négociation ➔ Signé) + Alertes
```

---

## 3. Spécifications Fonctionnelles Détaillées

### Module 1 : Découverte & Acquisition de Leads
1. **Recherche Hybride d'Entreprises Locales (`Métier + Ville`)** :
   - Exemples : *"Clinique dentaire Dakar"*, *"Agence immobilière Abidjan"*, *"Hôtel Saly"*, *"Cabinet comptable Dakar"*.
   - **Mode gratuit par défaut** : combinaison d'OpenStreetMap (Overpass/Nominatim), de recherche web publique et de Google Gemini Search Grounding.
   - **Import rapide** : saisie d'une URL unique, d'une liste d'URLs ou import d'un fichier CSV.
   - **Connecteurs optionnels** : possibilité d'activer Google Places API ou SerpApi depuis la page Paramètres.
2. **Radar d'Offres d'Emploi (Opportunités d'Externalisation)** :
   - Agrégation automatisée de flux publics (EmploiSenegal, Emploi.ci, SenJob, etc.) et recherche web ciblée sur les postes Tech/Digital.
   - **Analyseur d'annonce rapide** : possibilité de coller le lien ou le texte d'une offre (LinkedIn ou jobboard) pour que Gemini identifie l'entreprise et rédige une proposition de prestation externe (alternative au recrutement).

### Module 2 : Moteur d'Audit Adaptatif à 2 Vitesses & IA (Google Gemini)
1. **Cas A — L'entreprise possède un site web** :
   - **Qualité du site & Performance** : vérification HTTPS/SSL, balise viewport (responsive mobile), temps de réponse serveur, métriques Google PageSpeed Insights.
   - **SEO & Visibilité locale** : présence et longueur du `title`, `meta description`, hiérarchie `H1/H2`, `sitemap.xml`, `robots.txt`, note et volume d'avis Google Maps.
   - **Marketing & Conversion** : détection de Meta Pixel (Facebook/Instagram Ads), Google Analytics / Google Tag Manager, bouton WhatsApp Business, module de prise de rendez-vous en ligne, formulaires de capture de leads, liens vers réseaux sociaux.
   - **Stack Technique & Automatisation** : détection du CMS/Framework (WordPress, Wix, Shopify, PHP ancien, etc.), détection de widget de chat ou chatbot IA.
2. **Cas B — L'entreprise n'a pas de site web** (uniquement une page Facebook/Instagram ou une fiche locale) :
   - Diagnostic automatique **"Présence Digitale Manquante"** mettant en évidence la perte de crédibilité et de clients sur Google, avec recommandation d'un pack création de site web clé-en-main + SEO local.
3. **Diagnostic & Scoring Gemini** :
   - Calcul d'un **Score d'Opportunité Commerciale (0 à 100)**.
   - Génération d'un résumé exécutif en 3 points critiques compréhensibles par un dirigeant non-technique.

### Module 3 : Identification des Décideurs & Coordonnées (Cascade en 3 étapes)
1. **Étape 1 — Scraping multi-pages du site** :
   - Analyse automatique des pages *Accueil*, *Contact*, *À propos*, *Mentions légales* pour extraire :
     - Adresses email (`contact@`, emails nominatifs).
     - Numéros de téléphone locaux et **WhatsApp** (`+221`, `+225`, etc.).
     - Liens vers les pages et profils LinkedIn, Facebook, Instagram.
2. **Étape 2 — Recherche ciblée des décideurs** :
   - Identification des dirigeants (*Gérant*, *Fondateur*, *Directeur Général*, *Directeur Marketing*, *DRH*) via recherche web/LinkedIn et déduction du format d'email nominatif.
3. **Étape 3 — Enrichissement API optionnel** :
   - Intégration prête pour Hunter.io / Apollo si une clé API est renseignée dans les paramètres.

### Module 4 : Catalogue Modulaire de Prestations & Devis Multi-Devises
- **Catalogue pré-configuré et éditable** :
  - Chaque service comporte : un titre, une catégorie (*Web*, *SEO*, *Marketing/Ads*, *IA & Automatisation*, *Développement sur-mesure*), la liste des livrables, les **signaux déclencheurs** (liés aux résultats d'audit), et un tarif en **FCFA (XOF)** et **EUR (€)** (forfait unique ou abonnement mensuel).
- **Matching automatique** :
  - Lorsqu'un audit détecte une lacune (ex. *Pas de Pixel Meta* ou *Site lent sur mobile*), les prestations correspondantes sont automatiquement pré-sélectionnées pour construire la proposition.

### Module 5 : Page d'Audit & Proposition Interactive (`/p/[slug]`)
- **Accès public sans mot de passe** via une URL propre et personnalisée (ex. `/p/clinique-pasteur-dakar`).
- **Contenu de la page** :
  1. En-tête personnalisé avec le nom de l'entreprise prospectée et votre identité de prestataire.
  2. **Bilan visuel de l'audit** : scores par pilier (Web, SEO, Marketing, Automatisation) et explication claire des opportunités manquées.
  3. **Plan d'action & Devis interactif à options** : le prospect peut cocher/décocher les prestations recommandées, basculer entre **FCFA** et **EUR**, et voir le total se recalculer en temps réel.
  4. **Boutons d'action (CTA)** :
     - *"Valider cette proposition"* (enregistre l'accord et les options choisies dans le CRM).
     - *"Discuter sur WhatsApp"* (ouvre une discussion directe avec vous).
     - *"Planifier un appel"*.
- **Tracking en temps réel** :
  - Compteur de vues, date de dernière consultation et passage automatique du prospect dans la colonne **"Proposition vue"** ou **"En négociation"** du CRM.

### Module 6 : Studio de Prospection Multi-Canal (IA)
- **Génération simultanée sur 3 canaux** :
  1. **Message WhatsApp** (court, direct, adapté aux usages business en Afrique de l'Ouest, avec le lien `/p/[slug]`).
  2. **Email de prospection** (objet accrocheur + corps structuré autour des problèmes détectés + lien d'audit).
  3. **Note / Message LinkedIn** (approche directe pour le dirigeant).
- **Séquence de relance** : génération automatique des messages de **Relance J+3** et **Relance J+7**.
- **Envoi en 1 clic** :
  - Bouton *"Ouvrir dans WhatsApp"* (`https://wa.me/...` pré-rempli avec le numéro du prospect et le message).
  - Bouton *"Ouvrir dans mon client Email"* (`mailto:` pré-rempli).
  - Bouton *"Copier le message"*.

### Module 7 : Mini-CRM Kanban & Radars de Veille ("Saved Radars")
- **Pipeline Kanban interactif** :
  - Colonnes : `Sauvegardé` ➔ `À contacter` ➔ `Contacté` ➔ `Proposition vue` ➔ `En négociation` ➔ `Gagné` / `Perdu`.
  - Filtres par secteur, ville, score d'opportunité et source (Maps/Web vs Offre d'emploi).
- **Radars de veille & Alertes** :
  - Enregistrement de recherches récurrentes (ex. *"Restaurants Dakar"*, *"Offres WordPress Sénégal"*).
  - Centre de notifications interne signalant les nouvelles entreprises ou annonces détectées (avec route API dédiée pour exécution manuelle ou tâche planifiée Cron).

### Module 8 : Sécurité & Paramètres
- **Protection de l'espace d'administration** :
  - Authentification administrateur protégeant toutes les routes `/dashboard/*` et `/api/admin/*`.
  - Les routes `/p/[slug]` et l'API d'interaction prospect restent publiques.
- **Page Paramètres complète** :
  - Identité du prestataire / agence (Nom, Logo, Email, Numéro WhatsApp, Lien Calendly/RDV, Devises par défaut).
  - Configuration des clés API (Clé `GEMINI_API_KEY` modifiable depuis l'interface, clés optionnelles Google Places / SerpApi / Hunter).

---

## 4. Stack Technique & Architecture des Fichiers

- **Framework** : Next.js (App Router, TypeScript, Tailwind CSS)
- **Base de données** : PostgreSQL (compatible Supabase) avec **Prisma ORM** (et fallback local fluide pour le développement immédiat)
- **Moteur IA** : `@google/genai` (Google Gemini 2.5 Flash)
- **Analyse Web & Scraping** : `cheerio` + `fetch` serveur + API Google PageSpeed Insights
- **Icônes & UI** : `lucide-react` + composants Tailwind modernes

### Structure des Routes
- `/` — Redirection vers le tableau de bord ou page de connexion admin
- `/login` — Connexion sécurisée à l'outil interne
- `/dashboard` — Vue d'ensemble (KPIs, opportunités à fort score, dernières vues de propositions, alertes)
- `/dashboard/discover` — Moteur de recherche d'entreprises locales & Radar d'offres d'emploi
- `/dashboard/leads` — Mini-CRM (Vue Kanban & Liste détaillée des prospects)
- `/dashboard/leads/[id]` — Fiche complète d'une entreprise : Audit 360°, Décideurs, Studio de messages IA, Éditeur de proposition/devis
- `/dashboard/radars` — Gestion des veilles automatiques et centre d'alertes
- `/dashboard/services` — Gestion du catalogue de prestations et tarifs (FCFA / EUR)
- `/dashboard/settings` — Configuration du profil prestataire et des clés API
- `/p/[slug]` — **Page publique interactive d'audit et de proposition commerciale** pour le prospect

---

## 5. Plan d'Implémentation par Phases

- **Phase 1 : Base de données, Modèles & Données de Démonstration**
  - Mise en place du schéma Prisma (Settings, ServiceOffering, Lead, WebsiteAudit, DecisionMaker, Proposal, OutreachMessage, SavedRadar, AlertNotification).
  - Initialisation des données de démonstration réalistes (catalogue de services tech/digital en FCFA/EUR + prospects exemples à Dakar et Abidjan).
- **Phase 2 : Moteur d'Audit Technique 360° & Intégration Google Gemini**
  - Création du service d'analyse HTML/SEO/Mobile/Pixels/Stack/Contacts (`lib/audit-engine.ts`).
  - Création du service IA Gemini (`lib/gemini.ts`) pour le diagnostic, le matching de services et la génération des messages multi-canaux.
- **Phase 3 : Moteur de Découverte (Entreprises Locales & Offres d'Emploi)**
  - Implémentation de la recherche hybride (OpenStreetMap + Web + Gemini Search + Import URL/CSV) et du scanner d'offres d'emploi Afrique francophone.
- **Phase 4 : Interface Back-Office (Dashboard, Découverte, Fiche Prospect, CRM Kanban, Catalogue, Paramètres)**
  - Développement de toutes les vues de gestion interne et du studio de prospection (WhatsApp, Email, LinkedIn).
- **Phase 5 : Page Publique Interactive (`/p/[slug]`) & Tracking Temps Réel**
  - Développement de la landing page prospect avec calculateur de devis dynamique (FCFA/EUR), validation en 1 clic et remontée d'état dans le CRM.

