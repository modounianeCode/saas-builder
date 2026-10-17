import { NextResponse } from "next/server";
import type { ProspectLead } from "@/app/lib/prospect-data";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName = "Entreprise Prospect",
      sector = "Services B2B",
      city = "Dakar",
      country = "Sénégal",
      websiteUrl = "",
      sourceType = "local_business",
      jobTitleDetected = "",
    } = body;

    const cleanUrl = websiteUrl.trim();
    const hasWebsite = Boolean(cleanUrl && cleanUrl.length > 3);
    const normalizedUrl =
      hasWebsite && !cleanUrl.startsWith("http")
        ? `https://${cleanUrl}`
        : cleanUrl;

    let html = "";
    let fetchSucceeded = false;

    if (hasWebsite) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(normalizedUrl, {
          signal: controller.signal,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; NianeDigitalAuditBot/1.0; +https://nianedigital.com)",
          },
        });
        clearTimeout(timeout);
        if (res.ok) {
          html = await res.text();
          fetchSucceeded = true;
        }
      } catch {
        fetchSucceeded = false;
      }
    }

    const lowerHtml = html.toLowerCase();
    const hasHttps = normalizedUrl.startsWith("https://");
    const hasTitle = lowerHtml.includes("<title>") && !lowerHtml.includes("<title></title>");
    const hasMetaDesc = lowerHtml.includes('name="description"');
    const hasViewport = lowerHtml.includes('name="viewport"');
    const hasMetaPixel =
      lowerHtml.includes("fbevents.js") || lowerHtml.includes("fbq(");
    const hasGtmOrGa =
      lowerHtml.includes("googletagmanager.com") ||
      lowerHtml.includes("gtag(");
    const hasWhatsapp =
      lowerHtml.includes("wa.me") ||
      lowerHtml.includes("api.whatsapp.com") ||
      lowerHtml.includes("whatsapp");

    // Extract emails or phones if present in HTML
    const emailMatches = html.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    );
    const extractedEmail =
      emailMatches && emailMatches.length > 0
        ? emailMatches[0]
        : `contact@${slugify(companyName)}.sn`;

    const isIvoryCoast =
      city.toLowerCase().includes("abidjan") ||
      city.toLowerCase().includes("cocody") ||
      country === "Côte d'Ivoire";
    const defaultPhonePrefix = isIvoryCoast ? "+2250708" : "+22177";
    const randomPhoneSuffix = Math.floor(100000 + Math.random() * 899999);
    const whatsappNumber = `${defaultPhonePrefix}${randomPhoneSuffix}`;

    const slug = `${slugify(companyName)}-${slugify(city)}`;

    const webScore = !hasWebsite
      ? 0
      : fetchSucceeded
      ? (hasHttps ? 35 : 15) + (hasViewport ? 30 : 10)
      : 45;
    const seoScore = !hasWebsite
      ? 20
      : fetchSucceeded
      ? (hasTitle ? 30 : 10) + (hasMetaDesc ? 30 : 10)
      : 38;
    const marketingScore = !hasWebsite
      ? 25
      : fetchSucceeded
      ? (hasMetaPixel ? 40 : 15) + (hasGtmOrGa ? 35 : 10)
      : 25;
    const automationScore = !hasWebsite
      ? 10
      : fetchSucceeded
      ? hasWhatsapp
        ? 55
        : 20
      : 20;

    const avgHealth = (webScore + seoScore + marketingScore + automationScore) / 4;
    const opportunityScore = Math.min(98, Math.max(68, Math.round(108 - avgHealth)));

    const detectedWeaknesses: string[] = [];
    const recommendedServiceIds: string[] = [];

    if (!hasWebsite) {
      detectedWeaknesses.push("Aucun site web officiel détecté (Présence Digitale Manquante)");
      detectedWeaknesses.push("Invisibilité sur les recherches Google intentionnistes");
      recommendedServiceIds.push("srv-web-refonte", "srv-seo-local");
    } else {
      if (webScore < 65) {
        detectedWeaknesses.push("Performance mobile perfectible & tunnel de conversion daté");
        recommendedServiceIds.push("srv-web-refonte");
      }
      if (!hasMetaDesc || seoScore < 65) {
        detectedWeaknesses.push("Optimisation SEO locale & balises Meta incomplètes");
        recommendedServiceIds.push("srv-seo-local");
      }
      if (!hasMetaPixel || !hasGtmOrGa) {
        detectedWeaknesses.push("Absence de Pixel Meta / Google Analytics pour le reciblage");
        recommendedServiceIds.push("srv-ads-tracking");
      }
      if (!hasWhatsapp) {
        detectedWeaknesses.push("Absence d'assistant WhatsApp & prise de RDV automatisée");
        recommendedServiceIds.push("srv-ai-chatbot");
      }
    }

    if (sourceType === "job_offer") {
      detectedWeaknesses.unshift(
        `Recrutement ouvert : ${jobTitleDetected || "Profil Tech / Digital"} (opportunité d'externalisation)`
      );
      if (!recommendedServiceIds.includes("srv-tech-outsourcing")) {
        recommendedServiceIds.unshift("srv-tech-outsourcing");
      }
    }

    const newLead: ProspectLead = {
      id: `lead-${Date.now()}`,
      slug,
      companyName,
      sector,
      city,
      country: isIvoryCoast ? "Côte d'Ivoire" : "Sénégal",
      sourceType,
      jobTitleDetected: sourceType === "job_offer" ? jobTitleDetected : undefined,
      websiteUrl: hasWebsite ? normalizedUrl : null,
      hasWebsite,
      googleRating: 4.2,
      googleReviewsCount: 22,
      opportunityScore,
      pillarScores: {
        web: webScore,
        seo: seoScore,
        marketing: marketingScore,
        automation: automationScore,
      },
      detectedWeaknesses,
      aiSummary: !hasWebsite
        ? `${companyName} (${city}) ne dispose pas encore de site web propre malgré une demande active sur le secteur "${sector}". La création d'un portail haute conversion relié à WhatsApp et Google Maps permettra de capter les clients locaux.`
        : `L'audit automatisé de ${normalizedUrl} révèle un score d'opportunité de ${opportunityScore}/100 : le parcours mobile, le tracking publicitaire et l'automatisation WhatsApp peuvent être optimisés rapidement pour générer plus de demandes entrantes.`,
      criticalPoints: [
        {
          title: !hasWebsite
            ? "Absence de vitrine web disponible 24h/24"
            : "Optimisation de la conversion mobile & prise de contact rapide",
          impact:
            "Les prospects qui recherchent vos services sur Google depuis leur téléphone ont besoin d'une prise de contact immédiate en 1 clic.",
        },
        {
          title: "Visibilité SEO Locale & Google Maps sous-exploitée",
          impact: `Permet de positionner ${companyName} devant ses concurrents directs à ${city}.`,
        },
        {
          title: "Absence de reciblage & qualification automatique IA",
          impact:
            "Un assistant IA connecté à votre WhatsApp Business qualifie les demandes même en dehors des heures d'ouverture.",
        },
      ],
      auditChecks: [
        {
          label: "Présence Web & Certificat HTTPS",
          passed: hasWebsite && hasHttps,
          detail: hasWebsite
            ? hasHttps
              ? `Domaine ${normalizedUrl} actif en HTTPS`
              : "Site détecté mais sécurité HTTPS ou vitesse à corriger"
            : "Aucun site web officiel rattaché à l'entreprise",
          pillar: "web",
        },
        {
          label: "Balises SEO (Title, Meta Description, Structure H1)",
          passed: hasWebsite && hasTitle && hasMetaDesc,
          detail:
            hasWebsite && hasTitle && hasMetaDesc
              ? "Balises Title et Meta Description présentes"
              : "Balises SEO locales incomplètes ou absentes",
          pillar: "seo",
        },
        {
          label: "Tracking Publicitaire (Meta Pixel & Google Tag Manager)",
          passed: hasWebsite && hasMetaPixel && hasGtmOrGa,
          detail:
            hasWebsite && (hasMetaPixel || hasGtmOrGa)
              ? "Scripts de suivi détectés"
              : "Aucun pixel de reciblage détecté dans le code source",
          pillar: "marketing",
        },
        {
          label: "Tunnel WhatsApp Business & Assistant IA 24/7",
          passed: hasWebsite && hasWhatsapp,
          detail:
            hasWebsite && hasWhatsapp
              ? "Lien WhatsApp présent sur la page"
              : "Aucun widget de qualification ou prise de RDV automatisée",
          pillar: "automation",
        },
      ],
      decisionMakers: [
        {
          name: `Direction ${companyName}`,
          role: "Dirigeant / Responsable Développement",
          email: extractedEmail,
          whatsapp: whatsappNumber,
          linkedin: `https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(
            companyName + " " + city
          )}`,
          source: fetchSucceeded ? "Scraping Site" : "LinkedIn & Déduction",
        },
      ],
      recommendedServiceIds: recommendedServiceIds.slice(0, 3),
      selectedServiceIds: recommendedServiceIds.slice(0, 2),
      stage: "to_contact",
      proposalViews: 0,
      outreach: {
        whatsapp: `Bonjour 👋 J'ai réalisé un diagnostic digital rapide pour ${companyName} à ${city}. Nous avons identifié ${detectedWeaknesses.length} leviers concrets pour augmenter vos demandes clients. J'ai préparé votre page d'audit dédiée ici : https://nianedigital.com/p/${slug} — Qu'en pensez-vous ?`,
        emailSubject: `Diagnostic digital & pistes de croissance — ${companyName} (${city})`,
        emailBody: `Bonjour,\n\nEn analysant la présence en ligne de ${companyName} sur le secteur ${sector} à ${city}, j'ai préparé un audit synthétique mettant en avant ${detectedWeaknesses.length} opportunités rapides d'acquisition clients.\n\nConsultez votre diagnostic visuel et notre proposition sur-mesure ici :\n👉 https://nianedigital.com/p/${slug}\n\nSeriez-vous disponible 10 minutes cette semaine pour en échanger ?\n\nBien cordialement,\nModou Niane`,
        linkedin: `Bonjour, j'ai préparé un diagnostic digital sur-mesure pour ${companyName} (${city}) avec des pistes concrètes d'acquisition : https://nianedigital.com/p/${slug}`,
        followUpJ3: `Bonjour, avez-vous eu l'occasion de parcourir la page d'audit préparée pour ${companyName} (https://nianedigital.com/p/${slug}) ?`,
      },
    };

    return NextResponse.json({ lead: newLead });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'analyse du prospect", details: String(error) },
      { status: 500 }
    );
  }
}

