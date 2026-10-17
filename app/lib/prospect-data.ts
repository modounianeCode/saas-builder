export type Currency = "FCFA" | "EUR";

export type CrmStage =
  | "saved"
  | "to_contact"
  | "contacted"
  | "proposal_viewed"
  | "negotiating"
  | "won";

export interface ServiceOffering {
  id: string;
  title: string;
  category: "Web & Mobile" | "SEO & Maps" | "Marketing & Ads" | "IA & Automatisation" | "Externalisation Tech";
  shortDesc: string;
  deliverables: string[];
  priceFcfa: number;
  priceEur: number;
  billing: "unique" | "mensuel";
  triggerSignal: string;
}

export interface DecisionMaker {
  name: string;
  role: string;
  email: string;
  whatsapp: string;
  linkedin: string;
  source: "Scraping Site" | "LinkedIn & Déduction" | "Annonce Emploi";
}

export interface AuditCheckItem {
  label: string;
  passed: boolean;
  detail: string;
  pillar: "web" | "seo" | "marketing" | "automation";
}

export interface ProspectLead {
  id: string;
  slug: string;
  companyName: string;
  sector: string;
  city: string;
  country: "Sénégal" | "Côte d'Ivoire" | "Bénin" | "Mali";
  sourceType: "local_business" | "job_offer";
  jobTitleDetected?: string;
  websiteUrl: string | null;
  hasWebsite: boolean;
  googleRating?: number;
  googleReviewsCount?: number;
  opportunityScore: number; // 0-100 (plus le score est haut, plus le besoin est fort)
  pillarScores: {
    web: number;
    seo: number;
    marketing: number;
    automation: number;
  };
  detectedWeaknesses: string[];
  aiSummary: string;
  criticalPoints: {
    title: string;
    impact: string;
  }[];
  auditChecks: AuditCheckItem[];
  decisionMakers: DecisionMaker[];
  recommendedServiceIds: string[];
  selectedServiceIds: string[];
  stage: CrmStage;
  proposalViews: number;
  lastViewedAt?: string;
  outreach: {
    whatsapp: string;
    emailSubject: string;
    emailBody: string;
    linkedin: string;
    followUpJ3: string;
  };
}

export interface SavedRadar {
  id: string;
  name: string;
  type: "local_business" | "job_offer";
  query: string;
  location: string;
  frequency: "Quotidien" | "Hebdomadaire";
  newMatchesCount: number;
  lastRun: string;
  active: boolean;
}

export interface AgencyProfile {
  ownerName: string;
  agencyName: string;
  title: string;
  city: string;
  whatsapp: string;
  email: string;
  bookingUrl: string;
  yearsExp: string;
  projectsCount: string;
  sectorsCount: string;
}

export const DEFAULT_AGENCY_PROFILE: AgencyProfile = {
  ownerName: "Modou Niane",
  agencyName: "Niane Digital Studio",
  title: "Architecte Web, SEO & Solutions IA B2B",
  city: "Dakar & Abidjan",
  whatsapp: "+221 77 000 00 00",
  email: "contact@nianedigital.com",
  bookingUrl: "https://cal.com/niane-digital/audit-15min",
  yearsExp: "8+",
  projectsCount: "120+",
  sectorsCount: "25+",
};

export const INITIAL_SERVICES: ServiceOffering[] = [
  {
    id: "srv-web-refonte",
    title: "Création / Refonte Site Web Haute Conversion",
    category: "Web & Mobile",
    shortDesc:
      "Site vitrine ou institutionnel ultra-rapide (Next.js / WordPress Pro), 100% adapté mobile avec tunnel de prise de RDV et WhatsApp direct.",
    deliverables: [
      "Design UI/UX sur-mesure & Responsive Mobile",
      "Optimisation vitesse PageSpeed > 90/100 & HTTPS",
      "Intégration prise de RDV en ligne + bouton WhatsApp Business",
      "Hébergement haute disponibilité & panneau d'administration",
    ],
    priceFcfa: 650000,
    priceEur: 990,
    billing: "unique",
    triggerSignal: "Site absent, non responsive ou lent sur mobile",
  },
  {
    id: "srv-seo-local",
    title: "Pack Domination SEO Local & Google Maps",
    category: "SEO & Maps",
    shortDesc:
      "Positionnement dans le Top 3 Google Maps et recherche locale sur votre ville pour capter les clients intentionnistes.",
    deliverables: [
      "Correction complète des balises Title, Meta, H1/H2 & Sitemap",
      "Optimisation complète de la fiche Google Business Profile",
      "Système automatisé de collecte d'avis clients 5 étoiles",
      "Création de 5 pages locales ciblées par service",
    ],
    priceFcfa: 300000,
    priceEur: 450,
    billing: "unique",
    triggerSignal: "Balises SEO manquantes ou faible visibilité Google Maps",
  },
  {
    id: "srv-ads-tracking",
    title: "Infrastructure Tracking (Meta Pixel / GTM) & Acquisition",
    category: "Marketing & Ads",
    shortDesc:
      "Installation des pixels de reciblage et campagnes d'acquisition ciblées pour transformer les visiteurs en prospects qualifiés.",
    deliverables: [
      "Installation Google Tag Manager, Analytics 4 & Meta Pixel",
      "Configuration des événements de conversion (Appels, WhatsApp, Formulaires)",
      "Mise en place d'une campagne de reciblage (Retargeting)",
      "Tableau de bord mensuel des prospects générés",
    ],
    priceFcfa: 250000,
    priceEur: 380,
    billing: "mensuel",
    triggerSignal: "Absence de Meta Pixel ou Google Analytics / GTM",
  },
  {
    id: "srv-ai-chatbot",
    title: "Assistant IA & Qualification Automatique WhatsApp / Web",
    category: "IA & Automatisation",
    shortDesc:
      "Agent IA entraîné sur vos offres qui répond 24h/24 sur votre site et WhatsApp pour qualifier les demandes et fixer les rendez-vous.",
    deliverables: [
      "Widget Assistant IA intégré au site web + connexion WhatsApp",
      "Base de connaissances personnalisée (tarifs, horaires, services)",
      "Qualification automatique et notification directe de vos équipes",
      "Synchronisation automatique avec votre agenda / CRM",
    ],
    priceFcfa: 400000,
    priceEur: 610,
    billing: "unique",
    triggerSignal: "Absence de chat en ligne, de réponse instantanée ou prise de RDV",
  },
  {
    id: "srv-tech-outsourcing",
    title: "Renfort Développement & Équipe Tech Dédiée (Externalisation)",
    category: "Externalisation Tech",
    shortDesc:
      "Alternative agile au recrutement interne : prise en charge immédiate de vos besoins de développement web, mobile ou maintenance.",
    deliverables: [
      "Développeur Senior opérationnel en 48h (zéro frais de recrutement)",
      "Livraisons hebdomadaires (Sprints) & code revu",
      "Maintenance évolutive, sécurité et sauvegardes",
      "Contrat flexible sans charges sociales",
    ],
    priceFcfa: 850000,
    priceEur: 1300,
    billing: "mensuel",
    triggerSignal: "Offre d'emploi Tech/Digital ouverte depuis plus de 15 jours",
  },
];

export const INITIAL_LEADS: ProspectLead[] = [
  {
    id: "lead-1",
    slug: "clinique-dentaire-pasteur-dakar",
    companyName: "Clinique Dentaire Pasteur & Sourire",
    sector: "Santé & Clinique Privée",
    city: "Dakar (Plateau)",
    country: "Sénégal",
    sourceType: "local_business",
    websiteUrl: "https://clinique-sourire-dakar.sn",
    hasWebsite: true,
    googleRating: 4.1,
    googleReviewsCount: 19,
    opportunityScore: 92,
    pillarScores: {
      web: 42,
      seo: 35,
      marketing: 20,
      automation: 15,
    },
    detectedWeaknesses: [
      "Aucune prise de RDV en ligne ni bouton WhatsApp",
      "Site lent sur mobile (score 42/100) et design daté (2018)",
      "Aucun Pixel Meta ni Google Analytics installé",
      "Seulement 19 avis Google Maps malgré une forte concurrence au Plateau",
    ],
    aiSummary:
      "La clinique bénéficie d'un excellent emplacement au Plateau à Dakar, mais son site web ne convertit pas les patients sur mobile : impossible de réserver un créneau en ligne ou de contacter le secrétariat en 1 clic sur WhatsApp.",
    criticalPoints: [
      {
        title: "Friction majeure à la prise de rendez-vous mobile",
        impact:
          "Plus de 78% des recherches de dentistes à Dakar se font sur smartphone. L'absence de bouton WhatsApp et de réservation en ligne fait perdre des patients pressés.",
      },
      {
        title: "Déficit de visibilité SEO Local ('Dentiste Dakar Plateau')",
        impact:
          "Les balises H1 et Meta Description sont absentes, laissant 3 cliniques concurrentes capter le trafic Google Maps gratuit.",
      },
      {
        title: "Zéro suivi des visiteurs (Pas de Pixel ni Analytics)",
        impact:
          "Les visiteurs qui consultent vos tarifs d'implants ou d'orthodontie repartent sans pouvoir être reciblés.",
      },
    ],
    auditChecks: [
      {
        label: "Certificat SSL / HTTPS actif",
        passed: true,
        detail: "Certificat valide détecté",
        pillar: "web",
      },
      {
        label: "Performance & Ergonomie Mobile",
        passed: false,
        detail: "Temps de chargement 6.4s sur 4G • Tableau non adapté mobile",
        pillar: "web",
      },
      {
        label: "Balises SEO (Title, Meta Description, H1)",
        passed: false,
        detail: "Title générique 'Accueil' • Meta description manquante",
        pillar: "seo",
      },
      {
        label: "Pixel Meta & Google Analytics / GTM",
        passed: false,
        detail: "Aucun script de tracking détecté dans le DOM",
        pillar: "marketing",
      },
      {
        label: "Prise de RDV en ligne & Widget WhatsApp",
        passed: false,
        detail: "Seul un numéro fixe est affiché en bas de page",
        pillar: "automation",
      },
    ],
    decisionMakers: [
      {
        name: "Dr. Amadou Sow",
        role: "Fondateur & Chirurgien-Dentiste Chef",
        email: "a.sow@clinique-sourire-dakar.sn",
        whatsapp: "+221774128900",
        linkedin: "https://linkedin.com/in/dr-amadou-sow-dakar",
        source: "LinkedIn & Déduction",
      },
      {
        name: "Aïssatou Diop",
        role: "Responsable Administrative",
        email: "contact@clinique-sourire-dakar.sn",
        whatsapp: "+221778231145",
        linkedin: "https://linkedin.com/company/clinique-sourire-dakar",
        source: "Scraping Site",
      },
    ],
    recommendedServiceIds: ["srv-web-refonte", "srv-seo-local", "srv-ai-chatbot"],
    selectedServiceIds: ["srv-web-refonte", "srv-seo-local", "srv-ai-chatbot"],
    stage: "proposal_viewed",
    proposalViews: 4,
    lastViewedAt: "Il y a 25 min",
    outreach: {
      whatsapp:
        "Bonjour Dr. Sow 👋 J'ai réalisé un diagnostic rapide de la présence digitale de la Clinique Sourire au Plateau. Votre clinique a une excellente réputation, mais votre site mobile fait perdre des demandes de RDV (absence de réservation rapide / WhatsApp et lenteur mobile). Je vous ai préparé une page d'audit visuel avec 3 pistes concrètes ici : https://nianedigital.com/p/clinique-dentaire-pasteur-dakar — Qu'en pensez-vous ?",
      emailSubject:
        "Diagnostic digital — Clinique Sourire Dakar (3 opportunités de nouveaux patients)",
      emailBody:
        "Bonjour Dr. Sow,\n\nEn recherchant des cliniques dentaires au Plateau à Dakar, j'ai analysé le site clinique-sourire-dakar.sn.\n\nNous avons relevé 3 freins techniques qui limitent vos prises de rendez-vous :\n1. Un temps de chargement de 6.4s sur mobile.\n2. L'absence de prise de RDV en 1 clic (WhatsApp / Agenda en ligne).\n3. Des balises SEO locales manquantes sur Google Maps.\n\nJ'ai synthétisé cet audit ainsi qu'un plan d'action chiffré sur cette page dédiée :\n👉 https://nianedigital.com/p/clinique-dentaire-pasteur-dakar\n\nSeriez-vous disponible 10 minutes cette semaine pour en discuter ?\n\nBien cordialement,\nModou Niane",
      linkedin:
        "Bonjour Dr. Sow, félicitations pour le développement de la Clinique Sourire à Dakar. J'ai préparé un court audit de votre site web montrant comment capter +40% de prises de RDV sur mobile : https://nianedigital.com/p/clinique-dentaire-pasteur-dakar. Au plaisir d'échanger !",
      followUpJ3:
        "Bonjour Dr. Sow, je me permets une courte relance suite à l'audit préparé pour la Clinique Sourire (https://nianedigital.com/p/clinique-dentaire-pasteur-dakar). Souhaitez-vous que l'on active d'abord le module de prise de RDV WhatsApp & SEO local ?",
    },
  },
  {
    id: "lead-2",
    slug: "immo-prestige-cocody-abidjan",
    companyName: "Immo Prestige Cocody",
    sector: "Immobilier & Promotion",
    city: "Abidjan (Cocody)",
    country: "Côte d'Ivoire",
    sourceType: "local_business",
    websiteUrl: null,
    hasWebsite: false,
    googleRating: 4.5,
    googleReviewsCount: 34,
    opportunityScore: 96,
    pillarScores: {
      web: 0,
      seo: 25,
      marketing: 30,
      automation: 10,
    },
    detectedWeaknesses: [
      "Aucun site web officiel (uniquement une page Facebook)",
      "Perte de tous les acheteurs et expatriés cherchant sur Google",
      "Catalogue de biens impossible à filtrer par budget ou quartier",
      "Aucune qualification automatique des demandes de visites",
    ],
    aiSummary:
      "Agence immobilière très active à Cocody avec 34 avis positifs, mais qui dépend à 100% d'une page Facebook sans site web propre. Les investisseurs et la diaspora qui cherchent sur Google tombent systématiquement sur ses concurrents.",
    criticalPoints: [
      {
        title: "Absence totale de site web professionnel",
        impact:
          "Pour des transactions immobilières à forte valeur à Cocody, l'absence de site web et d'adresses emails professionnelles réduit la confiance des acheteurs et de la diaspora.",
      },
      {
        title: "Biens immobiliers invisibles sur les recherches Google",
        impact:
          "Les publications Facebook disparaissent en 48h et ne sont pas référencées sur 'Achat villa Cocody Abidjan'.",
      },
      {
        title: "Traitement manuel chronophage des messages WhatsApp",
        impact:
          "Vos agents répondent manuellement aux mêmes questions (prix, localisation, disponibilité) sans pré-qualification.",
      },
    ],
    auditChecks: [
      {
        label: "Présence d'un site web officiel",
        passed: false,
        detail: "Aucun domaine web actif associé à la fiche Google / Facebook",
        pillar: "web",
      },
      {
        label: "Fiche Google Business Profile",
        passed: true,
        detail: "Fiche présente à Cocody (4.5/5 • 34 avis) mais sans lien de site",
        pillar: "seo",
      },
      {
        label: "Catalogue filtrable & Capture de leads",
        passed: false,
        detail: "Aucun moteur de recherche de biens ni formulaire acheteur",
        pillar: "marketing",
      },
      {
        label: "Qualification IA des acheteurs / locataires",
        passed: false,
        detail: "Aucun assistant de pré-qualification budgétaire",
        pillar: "automation",
      },
    ],
    decisionMakers: [
      {
        name: "Jean-Marc Kouassi",
        role: "Directeur Général",
        email: "jmkouassi@immoprestige-ci.com",
        whatsapp: "+2250708451290",
        linkedin: "https://linkedin.com/in/jean-marc-kouassi-immo",
        source: "LinkedIn & Déduction",
      },
    ],
    recommendedServiceIds: ["srv-web-refonte", "srv-seo-local", "srv-ads-tracking"],
    selectedServiceIds: ["srv-web-refonte", "srv-seo-local"],
    stage: "to_contact",
    proposalViews: 0,
    outreach: {
      whatsapp:
        "Bonjour M. Kouassi 👋 J'ai vu les excellents avis d'Immo Prestige à Cocody (4.5/5), mais j'ai remarqué que vous n'aviez pas encore de site web dédié pour capter les acheteurs et la diaspora sur Google. J'ai préparé une maquette de proposition et un diagnostic ici : https://nianedigital.com/p/immo-prestige-cocody-abidjan — Disponible pour y jeter un œil ?",
      emailSubject:
        "Immo Prestige Cocody : Capter les acheteurs Google & Diaspora avec votre portail web",
      emailBody:
        "Bonjour M. Kouassi,\n\nImmo Prestige bénéficie déjà d'une belle réputation à Cocody (34 avis clients), mais l'absence de site web officiel laisse le trafic Google ('Villa Cocody', 'Investir Abidjan') à vos concurrents.\n\nJ'ai préparé un diagnostic de présence digitale et une proposition de portail immobilier clé-en-main sur cette page :\n👉 https://nianedigital.com/p/immo-prestige-cocody-abidjan\n\nOn en discute 10 minutes cette semaine ?\n\nCordialement,\nModou Niane",
      linkedin:
        "Bonjour M. Kouassi, bravo pour votre activité immobilière à Cocody. J'ai préparé un diagnostic montrant comment un portail web relié à votre WhatsApp peut doubler vos mandats et demandes qualifiées : https://nianedigital.com/p/immo-prestige-cocody-abidjan",
      followUpJ3:
        "Bonjour M. Kouassi, avez-vous eu l'occasion de consulter la proposition de portail immobilier préparée pour Immo Prestige Cocody ?",
    },
  },
  {
    id: "lead-3",
    slug: "teranga-logistics-recrutement-dev",
    companyName: "Teranga Fret & Logistique SA",
    sector: "Logistique & Transport International",
    city: "Dakar (Port Autonome)",
    country: "Sénégal",
    sourceType: "job_offer",
    jobTitleDetected: "Recrute : Développeur Fullstack React / Node.js & Refonte Portail Client",
    websiteUrl: "https://terangafret.sn",
    hasWebsite: true,
    googleRating: 4.3,
    googleReviewsCount: 41,
    opportunityScore: 89,
    pillarScores: {
      web: 55,
      seo: 60,
      marketing: 45,
      automation: 30,
    },
    detectedWeaknesses: [
      "Offre d'emploi Développeur Fullstack ouverte depuis 24 jours sans recrutement",
      "Portail de suivi de colis actuel lent et non responsive",
      "Opportunité immédiate d'externalisation agile sans charges salariales fixes",
    ],
    aiSummary:
      "Teranga Fret cherche à recruter un développeur Fullstack sur EmploiSenegal depuis plus de 3 semaines pour moderniser son portail client et automatiser le suivi des expéditions. Une prestation externe permet de démarrer en 48h.",
    criticalPoints: [
      {
        title: "Besoin technique urgent confirmé par leur offre d'emploi",
        impact:
          "Chaque semaine de retard sur le recrutement bloque la modernisation de leur portail de tracking client.",
      },
      {
        title: "Économie de temps et zéro risque RH en externalisant",
        impact:
          "Au lieu d'attendre 3 mois d'intégration d'un profil temps plein, vous livrez le portail et assurez la maintenance dès cette semaine.",
      },
      {
        title: "Automatisation WhatsApp du suivi conteneur / colis",
        impact:
          "Possibilité d'intégrer un bot WhatsApp permettant aux clients de suivre leur expédition avec leur numéro de BL.",
      },
    ],
    auditChecks: [
      {
        label: "Offre d'emploi Tech active détectée",
        passed: false,
        detail: "Annonce 'Développeur Fullstack React/Node' publiée sur EmploiSenegal",
        pillar: "web",
      },
      {
        label: "Portail Client & Espace Tracking",
        passed: false,
        detail: "Interface actuelle en PHP legacy sans version mobile fluide",
        pillar: "automation",
      },
      {
        label: "Certificat HTTPS & Domaine Corporate",
        passed: true,
        detail: "Domaine terangafret.sn sécurisé",
        pillar: "seo",
      },
      {
        label: "Automatisation du support expéditions",
        passed: false,
        detail: "Aucun suivi automatisé par WhatsApp Business",
        pillar: "marketing",
      },
    ],
    decisionMakers: [
      {
        name: "Cheikh Tidiane Ba",
        role: "Directeur des Opérations & SI",
        email: "ct.ba@terangafret.sn",
        whatsapp: "+221776543210",
        linkedin: "https://linkedin.com/in/cheikh-tidiane-ba-logistics",
        source: "Annonce Emploi",
      },
    ],
    recommendedServiceIds: ["srv-tech-outsourcing", "srv-ai-chatbot"],
    selectedServiceIds: ["srv-tech-outsourcing", "srv-ai-chatbot"],
    stage: "negotiating",
    proposalViews: 7,
    lastViewedAt: "Il y a 2 heures",
    outreach: {
      whatsapp:
        "Bonjour M. Ba 👋 J'ai vu que Teranga Fret recherchait un Développeur Fullstack React/Node pour faire évoluer votre portail client. Plutôt que d'attendre plusieurs mois de recrutement, nous pouvons prendre en charge le développement et l'automatisation du suivi colis dès cette semaine. J'ai préparé un plan d'intervention chiffré ici : https://nianedigital.com/p/teranga-logistics-recrutement-dev",
      emailSubject:
        "Alternative agile à votre recrutement Développeur Fullstack — Teranga Fret",
      emailBody:
        "Bonjour M. Ba,\n\nJ'ai pris connaissance de votre offre d'emploi pour un poste de Développeur Fullstack React/Node.js chez Teranga Fret.\n\nSi votre objectif est de livrer rapidement votre nouveau portail client et d'automatiser le suivi des expéditions sans supporter la lourdeur d'un recrutement CDI, nous pouvons intervenir immédiatement en équipe dédiée.\n\nDécouvrez notre audit de votre plateforme actuelle et notre proposition d'accompagnement sur :\n👉 https://nianedigital.com/p/teranga-logistics-recrutement-dev\n\nDisponible demain pour un point téléphonique de 15 minutes ?\n\nBien cordialement,\nModou Niane",
      linkedin:
        "Bonjour M. Ba, suite à l'annonce Fullstack publiée par Teranga Fret, je vous ai préparé une proposition d'externalisation clé-en-main opérationnelle en 48h : https://nianedigital.com/p/teranga-logistics-recrutement-dev",
      followUpJ3:
        "Bonjour M. Ba, avez-vous déjà finalisé votre recrutement Fullstack ou souhaitez-vous que l'on démarre un premier sprint test sur votre portail client ?",
    },
  },
  {
    id: "lead-4",
    slug: "hotel-royal-baobab-saly",
    companyName: "Hôtel & Spa Royal Baobab",
    sector: "Hôtellerie & Tourisme",
    city: "Saly Portudal",
    country: "Sénégal",
    sourceType: "local_business",
    websiteUrl: "https://royalbaobab-saly.com",
    hasWebsite: true,
    googleRating: 4.4,
    googleReviewsCount: 128,
    opportunityScore: 85,
    pillarScores: {
      web: 62,
      seo: 48,
      marketing: 25,
      automation: 20,
    },
    detectedWeaknesses: [
      "Dépendance aux plateformes Booking/Expedia (15% à 20% de commission)",
      "Moteur de réservation directe lent et complexe sur mobile",
      "Absence de Pixel Meta pour recibler les visiteurs qui abandonnent leur réservation",
    ],
    aiSummary:
      "Le Royal Baobab paie d'importantes commissions aux plateformes de réservation car son site web ne facilite pas la réservation en direct ni le reciblage publicitaire.",
    criticalPoints: [
      {
        title: "Commissions Booking.com évitables grâce à la réservation directe",
        impact:
          "Un tunnel de réservation directe optimisé + bouton WhatsApp Conciergerie augmente de +30% les réservations sans commission.",
      },
      {
        title: "Aucun reciblage des visiteurs indécis (Pas de Meta Pixel)",
        impact:
          "92% des touristes comparent plusieurs hôtels à Saly avant de réserver. Sans Pixel, impossible de leur remontrer vos offres sur Instagram/Facebook.",
      },
      {
        title: "Assistant IA multilingue (FR/EN) absent",
        impact:
          "Les demandes internationales le soir restent sans réponse immédiate.",
      },
    ],
    auditChecks: [
      {
        label: "Certificat SSL / HTTPS actif",
        passed: true,
        detail: "HTTPS configuré",
        pillar: "web",
      },
      {
        label: "Tunnel de réservation directe mobile",
        passed: false,
        detail: "5 étapes complexes sur smartphone • fort taux d'abandon",
        pillar: "web",
      },
      {
        label: "Pixels de Retargeting Meta & Google Ads",
        passed: false,
        detail: "Aucun pixel détecté pour recibler les paniers abandonnés",
        pillar: "marketing",
      },
      {
        label: "Conciergerie IA 24/7 (FR/EN) & WhatsApp",
        passed: false,
        detail: "Formulaire de contact classique uniquement",
        pillar: "automation",
      },
    ],
    decisionMakers: [
      {
        name: "Sophie Gomis",
        role: "Directrice Commerciale & Marketing",
        email: "direction@royalbaobab-saly.com",
        whatsapp: "+221775009988",
        linkedin: "https://linkedin.com/in/sophie-gomis-hospitality",
        source: "Scraping Site",
      },
    ],
    recommendedServiceIds: ["srv-ads-tracking", "srv-ai-chatbot", "srv-web-refonte"],
    selectedServiceIds: ["srv-ads-tracking", "srv-ai-chatbot"],
    stage: "contacted",
    proposalViews: 2,
    lastViewedAt: "Hier",
    outreach: {
      whatsapp:
        "Bonjour Mme Gomis 👋 J'ai analysé le parcours de réservation directe du Royal Baobab à Saly. J'ai identifié 3 leviers rapides pour augmenter vos réservations en direct (et réduire vos commissions Booking) : https://nianedigital.com/p/hotel-royal-baobab-saly",
      emailSubject:
        "Augmenter les réservations directes de l'Hôtel Royal Baobab Saly (Audit Digital)",
      emailBody:
        "Bonjour Mme Gomis,\n\nVoici un diagnostic rapide du site royalbaobab-saly.com montrant comment récupérer davantage de réservations en direct sans commission intermédiaire :\n👉 https://nianedigital.com/p/hotel-royal-baobab-saly\n\nBien cordialement,\nModou Niane",
      linkedin:
        "Bonjour Mme Gomis, j'ai préparé un audit sur l'optimisation des réservations directes pour l'Hôtel Royal Baobab Saly : https://nianedigital.com/p/hotel-royal-baobab-saly",
      followUpJ3:
        "Bonjour Mme Gomis, je reviens vers vous concernant le diagnostic des réservations directes du Royal Baobab Saly.",
    },
  },
];

export const INITIAL_RADARS: SavedRadar[] = [
  {
    id: "radar-1",
    name: "Cliniques & Cabinets Médicaux — Dakar",
    type: "local_business",
    query: "Clinique dentaire, Cabinet médical, Esthétique",
    location: "Dakar, Sénégal",
    frequency: "Quotidien",
    newMatchesCount: 5,
    lastRun: "Aujourd'hui à 09:30",
    active: true,
  },
  {
    id: "radar-2",
    name: "Promoteurs & Agences Immobilières — Abidjan",
    type: "local_business",
    query: "Agence immobilière, Promoteur immobilier",
    location: "Cocody & Marcory, Abidjan",
    frequency: "Quotidien",
    newMatchesCount: 8,
    lastRun: "Aujourd'hui à 08:15",
    active: true,
  },
  {
    id: "radar-3",
    name: "Offres d'emploi Développeur / SEO / Webmaster",
    type: "job_offer",
    query: "React, Next.js, WordPress, SEO, Traffic Manager",
    location: "Sénégal & Côte d'Ivoire (EmploiSenegal, Emploi.ci)",
    frequency: "Quotidien",
    newMatchesCount: 3,
    lastRun: "Il y a 1 heure",
    active: true,
  },
];

export const STAGE_LABELS: Record<
  CrmStage,
  { label: string; badgeClass: string }
> = {
  saved: {
    label: "Sauvegardé",
    badgeClass: "bg-stone-200 text-stone-800",
  },
  to_contact: {
    label: "À contacter",
    badgeClass: "bg-[#fef5e5] text-[#9a6200] border border-[#f6a71b]/40",
  },
  contacted: {
    label: "Contacté",
    badgeClass: "bg-blue-50 text-blue-800 border border-blue-200",
  },
  proposal_viewed: {
    label: "Proposition vue 👀",
    badgeClass: "bg-[#f6a71b] text-[#18241d] font-semibold",
  },
  negotiating: {
    label: "En négociation",
    badgeClass: "bg-emerald-100 text-[#244635] border border-[#244635]/30",
  },
  won: {
    label: "Signé ✅",
    badgeClass: "bg-[#244635] text-white font-semibold",
  },
};

export function formatMoney(amountFcfa: number, amountEur: number, currency: Currency): string {
  if (currency === "FCFA") {
    return `${amountFcfa.toLocaleString("fr-FR")} FCFA`;
  }
  return `${amountEur.toLocaleString("fr-FR")} €`;
}

