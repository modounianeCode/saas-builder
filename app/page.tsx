"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FigmaBadge,
  DualPillButton,
  SectionHeader,
  RibbonMarquee,
  RotatingStamp,
} from "@/app/components/ui-primitives";
import {
  INITIAL_LEADS,
  INITIAL_SERVICES,
  INITIAL_RADARS,
  DEFAULT_AGENCY_PROFILE,
  STAGE_LABELS,
  formatMoney,
  type Currency,
  type CrmStage,
  type ProspectLead,
  type ServiceOffering,
  type SavedRadar,
  type AgencyProfile,
} from "@/app/lib/prospect-data";

export default function HomePage() {
  const [leads, setLeads] = useState<ProspectLead[]>(INITIAL_LEADS);
  const [services, setServices] = useState<ServiceOffering[]>(INITIAL_SERVICES);
  const [radars, setRadars] = useState<SavedRadar[]>(INITIAL_RADARS);
  const [profile, setProfile] = useState<AgencyProfile>(DEFAULT_AGENCY_PROFILE);
  const [currency, setCurrency] = useState<Currency>("FCFA");

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("Toutes");
  const [sourceFilter, setSourceFilter] = useState<
    "all" | "local_business" | "job_offer" | "no_website"
  >("all");

  // Active selected lead for the Dark Forest Green Studio section
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    INITIAL_LEADS[0].id
  );
  const [studioTab, setStudioTab] = useState<
    "diagnostic" | "decideurs" | "pitch"
  >("diagnostic");
  const [pitchChannel, setPitchChannel] = useState<
    "whatsapp" | "email" | "linkedin" | "followup"
  >("whatsapp");
  const [copiedMsg, setCopiedMsg] = useState(false);

  // Modals: New Live Audit & Settings
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);

  // New Audit Form
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newSector, setNewSector] = useState("Santé & Clinique");
  const [newCity, setNewCity] = useState("Dakar");
  const [newWebsiteUrl, setNewWebsiteUrl] = useState("");
  const [newSourceType, setNewSourceType] = useState<
    "local_business" | "job_offer"
  >("local_business");
  const [newJobTitle, setNewJobTitle] = useState("");

  // API Keys state in Settings
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [googlePlacesKey, setGooglePlacesKey] = useState("");
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Load persisted state from localStorage
  useEffect(() => {
    const savedLeads = localStorage.getItem("nds_leads_v1");
    const savedServices = localStorage.getItem("nds_services_v1");
    const savedProfile = localStorage.getItem("nds_profile_v1");
    const savedGemini = localStorage.getItem("nds_gemini_key");

    if (savedLeads) {
      try {
        setLeads(JSON.parse(savedLeads));
      } catch {
        // fallback to INITIAL_LEADS
      }
    } else {
      localStorage.setItem("nds_leads_v1", JSON.stringify(INITIAL_LEADS));
    }

    if (savedServices) {
      try {
        setServices(JSON.parse(savedServices));
      } catch {
        // fallback
      }
    } else {
      localStorage.setItem("nds_services_v1", JSON.stringify(INITIAL_SERVICES));
    }

    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch {
        // fallback
      }
    }

    if (savedGemini) {
      setGeminiApiKey(savedGemini);
    }
  }, []);

  const persistLeads = (updated: ProspectLead[]) => {
    setLeads(updated);
    localStorage.setItem("nds_leads_v1", JSON.stringify(updated));
  };

  const activeLead =
    leads.find((l) => l.id === selectedLeadId) || leads[0] || INITIAL_LEADS[0];

  const filteredLeads = leads.filter((l) => {
    const matchesQuery =
      !searchQuery.trim() ||
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.detectedWeaknesses.some((w) =>
        w.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCity =
      cityFilter === "Toutes" ||
      l.city.toLowerCase().includes(cityFilter.toLowerCase());

    const matchesSource =
      sourceFilter === "all" ||
      (sourceFilter === "local_business" && l.sourceType === "local_business") ||
      (sourceFilter === "job_offer" && l.sourceType === "job_offer") ||
      (sourceFilter === "no_website" && !l.hasWebsite);

    return matchesQuery && matchesCity && matchesSource;
  });

  const getRecommendedQuoteTotal = (lead: ProspectLead) => {
    const matched = services.filter((s) =>
      lead.recommendedServiceIds.includes(s.id)
    );
    const fcfa = matched.reduce((sum, s) => sum + s.priceFcfa, 0);
    const eur = matched.reduce((sum, s) => sum + s.priceEur, 0);
    return formatMoney(fcfa, eur, currency);
  };

  const handleStageChange = (leadId: string, nextStage: CrmStage) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, stage: nextStage } : l
    );
    persistLeads(updated);
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2000);
  };

  const handleRunLiveAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    setIsAuditing(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: newCompanyName,
          sector: newSector,
          city: newCity,
          websiteUrl: newWebsiteUrl,
          sourceType: newSourceType,
          jobTitleDetected: newJobTitle,
        }),
      });
      const data = await res.json();
      if (data.lead) {
        const updated = [data.lead, ...leads];
        persistLeads(updated);
        setSelectedLeadId(data.lead.id);
        setShowAuditModal(false);
        setNewCompanyName("");
        setNewWebsiteUrl("");
        setNewJobTitle("");
        const studioEl = document.getElementById("studio-ia");
        if (studioEl) studioEl.scrollIntoView({ behavior: "smooth" });
      }
    } finally {
      setIsAuditing(false);
    }
  };

  const handleTriggerRadarScan = async (radar: SavedRadar) => {
    const sampleNames =
      radar.type === "job_offer"
        ? [
            {
              name: "Groupe Sonatel / Partenaire Digital",
              sector: "Télécoms & Services",
              city: "Dakar",
              job: "Recrute : Ingénieur Frontend React / Next.js",
              url: "https://sonatel.sn",
            },
            {
              name: "Ivoire Logistique Express",
              sector: "Logistique & Fret",
              city: "Abidjan",
              job: "Recrute : Webmaster & Spécialiste SEO / Ads",
              url: "",
            },
          ]
        : [
            {
              name: "Centre Médical Almadies Santé",
              sector: "Santé & Spécialistes",
              city: "Dakar (Almadies)",
              job: "",
              url: "",
            },
            {
              name: "Résidences Ivoire Golf Club",
              sector: "Immobilier Haut Standing",
              city: "Abidjan (Cocody)",
              job: "",
              url: "https://ivoire-residences.ci",
            },
          ];

    const pick = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName: pick.name,
        sector: pick.sector,
        city: pick.city,
        websiteUrl: pick.url,
        sourceType: radar.type,
        jobTitleDetected: pick.job,
      }),
    });
    const data = await res.json();
    if (data.lead) {
      const updated = [data.lead, ...leads];
      persistLeads(updated);
      setSelectedLeadId(data.lead.id);
      setRadars((prev) =>
        prev.map((r) =>
          r.id === radar.id
            ? {
                ...r,
                newMatchesCount: r.newMatchesCount + 1,
                lastRun: "À l'instant",
              }
            : r
        )
      );
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("nds_profile_v1", JSON.stringify(profile));
    localStorage.setItem("nds_gemini_key", geminiApiKey);
    setSettingsSavedToast(true);
    setTimeout(() => {
      setSettingsSavedToast(false);
      setShowSettingsModal(false);
    }, 1200);
  };

  // Calculate total pipeline value
  const totalPipelineFcfa = leads.reduce((sum, l) => {
    const matched = services.filter((s) =>
      l.recommendedServiceIds.includes(s.id)
    );
    return sum + matched.reduce((a, b) => a + b.priceFcfa, 0);
  }, 0);
  const totalPipelineEur = leads.reduce((sum, l) => {
    const matched = services.filter((s) =>
      l.recommendedServiceIds.includes(s.id)
    );
    return sum + matched.reduce((a, b) => a + b.priceEur, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-white text-[#18241d]">
      {/* =====================================================================
          1. TOP FLOATING PILL NAVBAR (Reference Image: Forest Green Pill + Gold Badge)
         ===================================================================== */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-4 pt-2">
        <nav className="rounded-full bg-[#244635] text-white px-4 md:px-6 py-3 flex items-center justify-between shadow-lg border border-white/10">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-[#f6a71b] text-[#18241d] font-extrabold flex items-center justify-center text-lg shadow-xs">
              N
            </span>
            <span className="font-bold tracking-tight text-lg">
              Niane<span className="text-[#f6a71b]">.</span>
            </span>
          </a>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/85">
            <a
              href="#opportunites"
              className="text-[#f6a71b] underline decoration-[#f6a71b] underline-offset-4"
            >
              Opportunités ({leads.length})
            </a>
            <a href="#studio-ia" className="hover:text-[#f6a71b] transition">
              Audit 360° & Pitch IA
            </a>
            <a href="#crm-kanban" className="hover:text-[#f6a71b] transition">
              CRM Kanban
            </a>
            <a href="#catalogue" className="hover:text-[#f6a71b] transition">
              Mes Services ({currency})
            </a>
            <a href="#radars" className="hover:text-[#f6a71b] transition">
              Radars & Veille
            </a>
          </div>

          {/* Right Controls: Currency Switcher + Settings + White Pill CTA */}
          <div className="flex items-center gap-2.5">
            <div className="inline-flex rounded-full bg-[#1b3628] p-1 border border-white/15">
              {(["FCFA", "EUR"] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                    currency === cur
                      ? "bg-[#f6a71b] text-[#18241d]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="rounded-full bg-[#1b3628] text-white/90 hover:text-[#f6a71b] px-3 py-2 text-xs font-medium border border-white/15 transition cursor-pointer"
              title="Paramètres & Clés API"
            >
              ⚙ Paramètres
            </button>

            <button
              onClick={() => setShowAuditModal(true)}
              className="rounded-full bg-white text-[#18241d] px-4 py-2 text-xs md:text-sm font-bold hover:bg-[#f6a71b] transition shadow-xs cursor-pointer"
            >
              + Auditer un Prospect
            </button>
          </div>
        </nav>
      </header>

      {/* =====================================================================
          2. HERO SECTION (Reference Image: Figma Badge + Italic Gold Heading + Amber Circle)
         ===================================================================== */}
      <section className="max-w-6xl mx-auto px-4 pt-10 pb-8 md:pt-14 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <FigmaBadge>
              Radar IA de Prospection B2B • {profile.city}
            </FigmaBadge>

            <h1 className="text-4xl sm:text-5xl md:text-[54px] font-bold tracking-tight leading-[1.1]">
              Détectez les{" "}
              <span className="font-normal italic text-[#f6a71b] underline decoration-[#f6a71b]/60 underline-offset-8">
                Entreprises,
              </span>
              <br />
              Qui Ont Besoin de Vos
              <br />
              Compétences Digitales.
            </h1>

            <p className="text-base md:text-lg text-[#18241d]/70 max-w-xl leading-relaxed">
              Scannez automatiquement les PME locales (Dakar, Abidjan, Saly) et les
              offres d&apos;emploi Tech/Digital. L&apos;IA audite leurs lacunes
              (Web, SEO, Pixels, IA), trouve les décideurs et génère une{" "}
              <strong className="text-[#244635]">
                page de proposition interactive (/p/slug)
              </strong>{" "}
              prête à signer.
            </p>

            {/* Interactive Search & Filter Bar */}
            <div className="bg-[#f5f6f5] p-3 rounded-3xl border border-black/5 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par secteur, ville, besoin (ex: Clinique Dakar, Immobilier, React)..."
                    className="w-full rounded-2xl bg-white px-4 py-3 text-sm text-[#18241d] placeholder:text-[#18241d]/45 border border-black/10 focus:outline-none focus:border-[#244635]"
                  />
                </div>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-[#18241d] border border-black/10 focus:outline-none focus:border-[#244635] cursor-pointer"
                >
                  <option value="Toutes">🌍 Toutes les villes</option>
                  <option value="Dakar">🇸🇳 Dakar</option>
                  <option value="Saly">🇸🇳 Saly</option>
                  <option value="Abidjan">🇨🇮 Abidjan</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all", label: "Tous les prospects" },
                    { id: "local_business", label: "📍 Entreprises Locales" },
                    { id: "job_offer", label: "💼 Offres d'Emploi (Externalisation)" },
                    { id: "no_website", label: "⚠️ Sans Site Web" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setSourceFilter(
                          tab.id as
                            | "all"
                            | "local_business"
                            | "job_offer"
                            | "no_website"
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        sourceFilter === tab.id
                          ? "bg-[#244635] text-white"
                          : "bg-white text-[#18241d]/75 hover:bg-[#f6a71b]/20"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Signature Dual-Pill CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <DualPillButton
                label="Auditer une Entreprise / URL"
                onClick={() => setShowAuditModal(true)}
                icon="play"
              />
              <a
                href="#studio-ia"
                className="rounded-full border-2 border-[#18241d] px-6 py-2.5 text-sm font-semibold text-[#18241d] hover:bg-[#18241d] hover:text-white transition"
              >
                Ouvrir le Studio Pitch IA
              </a>
            </div>
          </div>

          {/* Right Column: Signature Amber Circle Composition (Reference Image Style) */}
          <div className="lg:col-span-5 relative flex items-center justify-center py-4">
            <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#f6a71b] flex flex-col items-center justify-center p-6 shadow-xl">
              {/* Decorative curved dark green arc like the reference image */}
              <div className="absolute -left-3 top-10 bottom-10 w-6 border-l-2 border-[#244635] rounded-l-full pointer-events-none" />

              {/* Rotating Stamp on Top Right */}
              <div className="absolute -top-4 -right-2 z-20">
                <RotatingStamp text="AUDIT IA • PROSPECTION B2B • " />
              </div>

              {/* Central Interactive Live Summary Card inside the Amber Circle */}
              <div className="bg-white rounded-3xl p-5 shadow-lg w-full max-w-[290px] border border-[#244635]/10 z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#244635] bg-emerald-50 px-2.5 py-1 rounded-full">
                    Pipeline Actif
                  </span>
                  <span className="text-xs font-bold text-[#f6a71b]">
                    ● Live IA
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-[#18241d]">
                  {formatMoney(totalPipelineFcfa, totalPipelineEur, currency)}
                </div>
                <div className="text-xs text-[#18241d]/65 mb-4">
                  Potentiel cumulé sur {leads.length} entreprises auditées
                </div>

                <div className="space-y-2 border-t border-black/5 pt-3">
                  {leads.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedLeadId(item.id);
                        document
                          .getElementById("studio-ia")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="w-full text-left flex items-center justify-between p-2 rounded-xl bg-[#f5f6f5] hover:bg-[#fef5e5] transition cursor-pointer"
                    >
                      <div className="truncate pr-2">
                        <div className="text-xs font-bold text-[#18241d] truncate">
                          {item.companyName}
                        </div>
                        <div className="text-[10px] text-[#18241d]/60">
                          {item.city} • {item.detectedWeaknesses.length} besoins
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#244635] text-[#f6a71b] text-[11px] font-bold px-2 py-0.5">
                        {item.opportunityScore}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating Pill Tags matching "Product Designer" and "UI/UX Designer" in Reference */}
              <div className="absolute -bottom-3 left-2 z-20 flex items-center gap-1">
                <span className="rounded-full bg-[#244635] text-white text-xs font-semibold px-4 py-2 shadow-md">
                  Audit 360° & Décideurs
                </span>
              </div>

              <div className="absolute bottom-14 -right-4 z-20">
                <span className="rounded-full bg-[#f6a71b] border-2 border-white text-[#18241d] text-xs font-bold px-4 py-2 shadow-md">
                  Devis Interactif {currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. SLANTED RIBBON MARQUEE BANNER (Reference Image: Amber strip over Forest Green)
         ===================================================================== */}
      <RibbonMarquee
        items={[
          "Audit Site Web & Mobile",
          "Détection SEO & Google Maps",
          "Radar Offres d'Emploi Tech",
          "Extraction WhatsApp & Décideurs",
          "Pitch IA Multi-Canal",
          "Page Devis Interactive (/p/slug)",
        ]}
      />

      {/* =====================================================================
          4. DETECTED OPPORTUNITIES CARDS (Reference Image: "Services I Provide" Gray Cards)
         ===================================================================== */}
      <section id="opportunites" className="max-w-6xl mx-auto px-4 py-14">
        <SectionHeader
          eyebrow="Opportunités Détectées"
          titlePrefix="Entreprises Ayant Besoin de"
          titleHighlight="Vos Compétences"
          action={
            <DualPillButton
              label="Nouvel Audit Live"
              onClick={() => setShowAuditModal(true)}
              icon="plus"
              size="sm"
            />
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => {
            const isSelected = lead.id === activeLead.id;
            const stageInfo = STAGE_LABELS[lead.stage];
            return (
              <div
                key={lead.id}
                className={`rounded-3xl bg-[#f5f6f5] p-6 transition-all flex flex-col justify-between border ${
                  isSelected
                    ? "border-[#244635] ring-2 ring-[#244635]/20 shadow-md"
                    : "border-black/5 hover:border-[#f6a71b] hover:shadow-sm"
                }`}
              >
                <div>
                  {/* Top Row: White Circle Icon (like Reference Image) + Opportunity Score */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center shrink-0">
                      <div className="w-8 h-8 rounded-lg bg-[#244635] text-[#f6a71b] flex items-center justify-center font-extrabold text-xs">
                        {lead.opportunityScore}%
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full ${stageInfo.badgeClass}`}
                      >
                        {stageInfo.label}
                      </span>
                      <span className="text-[11px] font-medium text-[#18241d]/60">
                        {lead.sourceType === "job_offer"
                          ? "💼 Offre d'emploi Tech"
                          : lead.hasWebsite
                          ? "🌐 Site Web audité"
                          : "⚠️ Sans Site Web"}
                      </span>
                    </div>
                  </div>

                  {/* Company Title & Meta */}
                  <div className="text-xs font-semibold text-[#244635] mb-1">
                    {lead.sector} • {lead.city}
                  </div>
                  <h3 className="text-xl font-bold text-[#18241d] leading-snug">
                    {lead.companyName}
                  </h3>

                  {lead.jobTitleDetected && (
                    <div className="mt-2 rounded-xl bg-[#fef5e5] border border-[#f6a71b]/40 px-3 py-1.5 text-xs font-semibold text-[#9a6200]">
                      📌 {lead.jobTitleDetected}
                    </div>
                  )}

                  {/* Detected Weaknesses List */}
                  <ul className="mt-4 space-y-1.5">
                    {lead.detectedWeaknesses.slice(0, 3).map((w, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#18241d]/75 flex items-start gap-2"
                      >
                        <span className="text-[#f6a71b] font-bold mt-0.5">●</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Footer: Decision Maker + Quote Estimate + Links */}
                <div className="mt-6 pt-4 border-t border-black/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#18241d]/65">
                      Décideur :{" "}
                      <strong className="text-[#18241d]">
                        {lead.decisionMakers[0]?.name}
                      </strong>
                    </span>
                    <span className="font-extrabold text-[#244635]">
                      {getRecommendedQuoteTotal(lead)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => {
                        setSelectedLeadId(lead.id);
                        document
                          .getElementById("studio-ia")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xs font-bold text-[#18241d] hover:text-[#244635] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Audit & Pitch IA</span>
                      <span className="text-[#f6a71b] text-base leading-none">
                        →
                      </span>
                    </button>

                    <Link
                      href={`/p/${lead.slug}`}
                      className="rounded-full bg-[#244635] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#1b3628] transition"
                    >
                      Voir Page /p/{lead.slug.slice(0, 12)}… ↗
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          5. DARK FOREST GREEN SECTION: LIVE 360° AUDIT & OUTREACH STUDIO
             (Reference Image: "Who is Olivia Smith?" Dark Green Section + Amber Circle with Pill Cluster)
         ===================================================================== */}
      <section id="studio-ia" className="bg-[#244635] text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Amber Gold Circle with clustered skill/audit pills (Reference Image) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#f6a71b] flex flex-col items-center justify-between p-7 shadow-2xl overflow-hidden">
                {/* Top Score Header inside Amber Circle */}
                <div className="w-full bg-white text-[#18241d] rounded-3xl p-4 shadow-md text-center z-10">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#244635]">
                    Diagnostic IA • {activeLead.city}
                  </div>
                  <div className="text-lg font-extrabold truncate mt-0.5">
                    {activeLead.companyName}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-3">
                    <div className="bg-[#f5f6f5] rounded-xl p-1.5">
                      <div className="text-[10px] text-[#18241d]/60">Web</div>
                      <div className="text-xs font-extrabold text-[#244635]">
                        {activeLead.pillarScores.web}%
                      </div>
                    </div>
                    <div className="bg-[#f5f6f5] rounded-xl p-1.5">
                      <div className="text-[10px] text-[#18241d]/60">SEO</div>
                      <div className="text-xs font-extrabold text-[#244635]">
                        {activeLead.pillarScores.seo}%
                      </div>
                    </div>
                    <div className="bg-[#f5f6f5] rounded-xl p-1.5">
                      <div className="text-[10px] text-[#18241d]/60">Ads</div>
                      <div className="text-xs font-extrabold text-[#244635]">
                        {activeLead.pillarScores.marketing}%
                      </div>
                    </div>
                    <div className="bg-[#f5f6f5] rounded-xl p-1.5">
                      <div className="text-[10px] text-[#18241d]/60">IA</div>
                      <div className="text-xs font-extrabold text-[#244635]">
                        {activeLead.pillarScores.automation}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clustered Floating Skill Pills at bottom of circle (Exact Reference Image Homage) */}
                <div className="flex flex-wrap items-center justify-center gap-2 z-10 pb-2">
                  <span className="rounded-full bg-[#244635] text-white text-xs font-semibold px-3.5 py-1.5 shadow-sm -rotate-3">
                    Refonte Web & Mobile
                  </span>
                  <span className="rounded-full bg-white text-[#18241d] text-xs font-bold px-3.5 py-1.5 shadow-sm rotate-2">
                    SEO Local Maps
                  </span>
                  <span className="rounded-full bg-[#244635] text-white text-xs font-semibold px-3.5 py-1.5 shadow-sm rotate-1">
                    Meta Pixel & Tracking
                  </span>
                  <span className="rounded-full bg-white text-[#18241d] text-xs font-bold px-3.5 py-1.5 shadow-sm -rotate-2">
                    Assistant WhatsApp IA
                  </span>
                  <span className="rounded-full bg-[#18241d] text-[#f6a71b] text-xs font-bold px-3.5 py-1.5 shadow-sm">
                    Score Opportunité : {activeLead.opportunityScore}/100
                  </span>
                </div>
              </div>

              {/* Lead Selector Dropdown under circle */}
              <div className="mt-5 w-full max-w-xs">
                <label className="block text-xs text-white/70 mb-1.5 text-center">
                  Changer de prospect analysé dans le Studio :
                </label>
                <select
                  value={activeLead.id}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full rounded-full bg-[#1b3628] text-white border border-white/20 px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#f6a71b] cursor-pointer"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.companyName} ({l.city}) — {l.opportunityScore}%
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Studio Content (Reference Image: "Who is Olivia Smith?" layout) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-medium mb-2">
                  <span className="w-4 h-0.5 bg-[#f6a71b] inline-block rounded-full" />
                  <span className="text-white/85">
                    Studio d&apos;Audit 360° & Prospection Multi-Canal
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Pourquoi{" "}
                  <span className="font-normal italic text-[#f6a71b]">
                    {activeLead.companyName}
                  </span>{" "}
                  a besoin de vous ?
                </h2>
              </div>

              <p className="text-sm md:text-base text-white/80 leading-relaxed">
                {activeLead.aiSummary}
              </p>

              {/* Gold Stats Row (Matching "600+ / 50+ / 18+" in Reference Image) */}
              <div className="grid grid-cols-3 gap-4 py-2 border-y border-white/15">
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#f6a71b]">
                    {activeLead.opportunityScore}/100
                  </div>
                  <div className="text-xs text-white/75 mt-0.5">
                    Score d&apos;Opportunité
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#f6a71b]">
                    {getRecommendedQuoteTotal(activeLead)}
                  </div>
                  <div className="text-xs text-white/75 mt-0.5">
                    Devis Recommandé
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-extrabold text-[#f6a71b]">
                    {activeLead.proposalViews} vues
                  </div>
                  <div className="text-xs text-white/75 mt-0.5">
                    Consultations du lien /p/
                  </div>
                </div>
              </div>

              {/* Studio Navigation Tabs */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "diagnostic", label: "1. Diagnostic & Faiblesses" },
                  {
                    id: "decideurs",
                    label: `2. Décideurs & Contacts (${activeLead.decisionMakers.length})`,
                  },
                  { id: "pitch", label: "3. Pitch IA (WhatsApp / Email / LinkedIn)" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() =>
                      setStudioTab(
                        t.id as "diagnostic" | "decideurs" | "pitch"
                      )
                    }
                    className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
                      studioTab === t.id
                        ? "bg-[#f6a71b] text-[#18241d]"
                        : "bg-[#1b3628] text-white/80 hover:text-white border border-white/10"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab 1: Diagnostic & Weaknesses */}
              {studioTab === "diagnostic" && (
                <div className="bg-[#1b3628] rounded-3xl p-5 border border-white/10 space-y-3">
                  {activeLead.auditChecks.map((chk, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-3 p-3 rounded-2xl bg-white/5"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            chk.passed
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-[#f6a71b] text-[#18241d]"
                          }`}
                        >
                          {chk.passed ? "✓" : "!"}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {chk.label}
                          </div>
                          <div className="text-xs text-white/65">
                            {chk.detail}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#f6a71b] shrink-0">
                        {chk.pillar}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2: Decision Makers & Direct Contact */}
              {studioTab === "decideurs" && (
                <div className="bg-[#1b3628] rounded-3xl p-5 border border-white/10 space-y-3">
                  {activeLead.decisionMakers.map((dm, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">
                            {dm.name}
                          </span>
                          <span className="text-[11px] rounded-full bg-[#f6a71b]/20 text-[#f6a71b] px-2.5 py-0.5 font-semibold">
                            {dm.source}
                          </span>
                        </div>
                        <div className="text-xs text-white/75 mt-0.5">
                          {dm.role}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/85">
                          <span>📧 {dm.email}</span>
                          <span>📱 {dm.whatsapp}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`https://wa.me/${dm.whatsapp.replace(
                            /[^0-9]/g,
                            ""
                          )}?text=${encodeURIComponent(
                            activeLead.outreach.whatsapp
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#f6a71b] text-[#18241d] px-3.5 py-2 text-xs font-bold hover:opacity-95 transition"
                        >
                          WhatsApp Direct ↗
                        </a>
                        <a
                          href={`mailto:${dm.email}?subject=${encodeURIComponent(
                            activeLead.outreach.emailSubject
                          )}&body=${encodeURIComponent(
                            activeLead.outreach.emailBody
                          )}`}
                          className="rounded-full bg-white/10 text-white px-3.5 py-2 text-xs font-semibold hover:bg-white/20 transition"
                        >
                          Email ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Multi-Channel Outreach Pitch Generator */}
              {studioTab === "pitch" && (
                <div className="bg-[#1b3628] rounded-3xl p-5 border border-white/10 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { id: "whatsapp", label: "💬 WhatsApp" },
                        { id: "email", label: "📧 Email Complet" },
                        { id: "linkedin", label: "🔗 LinkedIn" },
                        { id: "followup", label: "⏰ Relance J+3" },
                      ].map((ch) => (
                        <button
                          key={ch.id}
                          onClick={() =>
                            setPitchChannel(
                              ch.id as
                                | "whatsapp"
                                | "email"
                                | "linkedin"
                                | "followup"
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                            pitchChannel === ch.id
                              ? "bg-white text-[#18241d]"
                              : "bg-white/10 text-white/75 hover:text-white"
                          }`}
                        >
                          {ch.label}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const text =
                          pitchChannel === "whatsapp"
                            ? activeLead.outreach.whatsapp
                            : pitchChannel === "email"
                            ? `Objet: ${activeLead.outreach.emailSubject}\n\n${activeLead.outreach.emailBody}`
                            : pitchChannel === "linkedin"
                            ? activeLead.outreach.linkedin
                            : activeLead.outreach.followUpJ3;
                        handleCopyText(text);
                      }}
                      className="rounded-full bg-[#f6a71b] text-[#18241d] px-3.5 py-1 text-xs font-bold cursor-pointer"
                    >
                      {copiedMsg ? "✓ Copié !" : "Copier le message"}
                    </button>
                  </div>

                  <div className="bg-black/20 rounded-2xl p-4 text-xs md:text-sm text-white/90 whitespace-pre-line leading-relaxed border border-white/10">
                    {pitchChannel === "whatsapp" && activeLead.outreach.whatsapp}
                    {pitchChannel === "email" &&
                      `Objet : ${activeLead.outreach.emailSubject}\n\n${activeLead.outreach.emailBody}`}
                    {pitchChannel === "linkedin" && activeLead.outreach.linkedin}
                    {pitchChannel === "followup" &&
                      activeLead.outreach.followUpJ3}
                  </div>
                </div>
              )}

              {/* Bottom CTA Row with Signature Script Signature (like "Olivia Smith" in Reference) */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                <DualPillButton
                  label={`Ouvrir la Page Prospect (/p/${activeLead.slug.slice(
                    0,
                    14
                  )}…)`}
                  href={`/p/${activeLead.slug}`}
                  icon="arrow"
                />

                <div className="text-2xl italic font-serif text-[#f6a71b] tracking-wide select-none">
                  {profile.ownerName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. MINI-CRM KANBAN PIPELINE
         ===================================================================== */}
      <section id="crm-kanban" className="max-w-6xl mx-auto px-4 py-16">
        <SectionHeader
          eyebrow="Mini-CRM Commercial"
          titlePrefix="Suivi de Vos"
          titleHighlight="Propositions & Relances"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(
            [
              "to_contact",
              "contacted",
              "proposal_viewed",
              "negotiating",
              "won",
            ] as CrmStage[]
          ).map((stageKey) => {
            const stageLeads = leads.filter((l) => l.stage === stageKey);
            const stageMeta = STAGE_LABELS[stageKey];
            return (
              <div
                key={stageKey}
                className="rounded-3xl bg-[#f5f6f5] p-4 border border-black/5 flex flex-col justify-between min-h-[280px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4 px-1">
                    <span className="text-xs font-bold text-[#18241d]">
                      {stageMeta.label}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white text-[#244635] text-xs font-extrabold flex items-center justify-center shadow-2xs">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {stageLeads.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl p-3.5 shadow-2xs border border-black/5 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold text-[#244635] bg-emerald-50 px-2 py-0.5 rounded-full">
                            {item.city}
                          </span>
                          <span className="text-[11px] font-extrabold text-[#f6a71b]">
                            {item.opportunityScore}%
                          </span>
                        </div>

                        <div className="text-xs font-bold text-[#18241d] leading-snug">
                          {item.companyName}
                        </div>

                        <div className="text-xs font-extrabold text-[#244635]">
                          {getRecommendedQuoteTotal(item)}
                        </div>

                        <div className="pt-2 border-t border-black/5 flex items-center justify-between gap-1">
                          <select
                            value={item.stage}
                            onChange={(e) =>
                              handleStageChange(
                                item.id,
                                e.target.value as CrmStage
                              )
                            }
                            className="text-[11px] bg-[#f5f6f5] rounded-lg px-2 py-1 font-medium text-[#18241d] cursor-pointer"
                          >
                            <option value="to_contact">À contacter</option>
                            <option value="contacted">Contacté</option>
                            <option value="proposal_viewed">
                              Proposition vue
                            </option>
                            <option value="negotiating">En négociation</option>
                            <option value="won">Signé ✅</option>
                          </select>

                          <Link
                            href={`/p/${item.slug}`}
                            className="text-[11px] font-bold text-[#244635] hover:text-[#f6a71b]"
                          >
                            Devis ↗
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          7. CATALOGUE DE PRESTATIONS & RADARS DE VEILLE
             (Reference Image Bottom Section: Centered Italic Gold Header + Rounded Cards)
         ===================================================================== */}
      <section
        id="catalogue"
        className="max-w-6xl mx-auto px-4 py-14 border-t border-black/5"
      >
        <SectionHeader
          centered
          eyebrow="Catalogue & Signaux IA"
          titleHighlight="Vos Prestations & Tarifs"
          titleSuffix={`(${currency})`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="rounded-3xl bg-[#f5f6f5] p-6 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#244635] shadow-2xs">
                    {srv.category}
                  </span>
                  <span className="text-xs font-semibold text-[#18241d]/60">
                    Facturation {srv.billing}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#18241d] mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-[#18241d]/70 leading-relaxed mb-4">
                  {srv.shortDesc}
                </p>

                <div className="rounded-2xl bg-[#fef5e5] border border-[#f6a71b]/30 p-3 text-xs text-[#9a6200] mb-4">
                  <strong>Signal déclencheur IA :</strong> {srv.triggerSignal}
                </div>
              </div>

              <div className="pt-4 border-t border-black/10 flex items-baseline justify-between">
                <span className="text-xs font-medium text-[#18241d]/60">
                  Tarif configuré
                </span>
                <span className="text-xl font-extrabold text-[#244635]">
                  {formatMoney(srv.priceFcfa, srv.priceEur, currency)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saved Radars Section */}
      <section
        id="radars"
        className="max-w-6xl mx-auto px-4 py-14 border-t border-black/5"
      >
        <SectionHeader
          eyebrow="Veilles Automatisées"
          titlePrefix="Vos"
          titleHighlight="Radars de Détection"
          titleSuffix="Actifs"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {radars.map((radar) => (
            <div
              key={radar.id}
              className="rounded-3xl bg-[#f5f6f5] p-6 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-[#244635] text-white text-[11px] font-bold px-3 py-1">
                    {radar.frequency}
                  </span>
                  <span className="rounded-full bg-[#f6a71b] text-[#18241d] text-xs font-extrabold px-3 py-1">
                    +{radar.newMatchesCount} détectés
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#18241d]">
                  {radar.name}
                </h3>
                <p className="text-xs text-[#18241d]/70 mt-1">
                  Mots-clés : {radar.query}
                </p>
                <p className="text-xs text-[#244635] font-semibold mt-1">
                  📍 {radar.location}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-black/10 flex items-center justify-between">
                <span className="text-[11px] text-[#18241d]/55">
                  Dernier scan : {radar.lastRun}
                </span>
                <button
                  onClick={() => handleTriggerRadarScan(radar)}
                  className="rounded-full bg-white border border-[#244635]/30 text-[#244635] px-3.5 py-1.5 text-xs font-bold hover:bg-[#244635] hover:text-white transition cursor-pointer"
                >
                  ↻ Scanner maintenant
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          MODAL 1: LIVE AUDIT & NEW PROSPECT GENERATOR
         ===================================================================== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-black/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#244635]">
                  Moteur d&apos;Audit IA Live
                </span>
                <h3 className="text-2xl font-bold text-[#18241d]">
                  Analyser une Entreprise ou Offre
                </h3>
              </div>
              <button
                onClick={() => setShowAuditModal(false)}
                className="w-9 h-9 rounded-full bg-[#f5f6f5] text-[#18241d] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRunLiveAudit} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#f5f6f5]">
                <button
                  type="button"
                  onClick={() => setNewSourceType("local_business")}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    newSourceType === "local_business"
                      ? "bg-[#244635] text-white"
                      : "text-[#18241d]/70"
                  }`}
                >
                  📍 Entreprise Locale
                </button>
                <button
                  type="button"
                  onClick={() => setNewSourceType("job_offer")}
                  className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    newSourceType === "job_offer"
                      ? "bg-[#244635] text-white"
                      : "text-[#18241d]/70"
                  }`}
                >
                  💼 Offre d&apos;Emploi Tech
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18241d] mb-1">
                  Nom de l&apos;entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Ex: Clinique La Madeleine, Groupe Azalaï..."
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Secteur d&apos;activité
                  </label>
                  <input
                    type="text"
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value)}
                    placeholder="Ex: Santé, Immobilier, Hôtel..."
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Ville & Pays
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Ex: Dakar, Abidjan, Saly..."
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18241d] mb-1">
                  Site web à auditer (laisser vide si l&apos;entreprise n&apos;a pas de site)
                </label>
                <input
                  type="text"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  placeholder="Ex: https://exemple-entreprise.sn (ou vide)"
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm"
                />
              </div>

              {newSourceType === "job_offer" && (
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Intitulé du poste recherché par l&apos;entreprise
                  </label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    placeholder="Ex: Développeur React / WordPress, Traffic Manager..."
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2.5 text-sm"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#18241d]/70 cursor-pointer"
                >
                  Annuler
                </button>
                <DualPillButton
                  type="submit"
                  disabled={isAuditing}
                  label={
                    isAuditing
                      ? "Scan HTML/SEO & IA en cours..."
                      : "Lancer l'Audit & Générer le Devis"
                  }
                  icon="sparkle"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: SETTINGS & API KEYS (Gemini, Google Places, Agency Profile)
         ===================================================================== */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-black/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#244635]">
                  Configuration de l&apos;Outil Interne
                </span>
                <h3 className="text-2xl font-bold text-[#18241d]">
                  Profil Prestataire & Clés API
                </h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-9 h-9 rounded-full bg-[#f5f6f5] text-[#18241d] font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Votre Nom
                  </label>
                  <input
                    type="text"
                    value={profile.ownerName}
                    onChange={(e) =>
                      setProfile({ ...profile, ownerName: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Nom du Studio / Agence
                  </label>
                  <input
                    type="text"
                    value={profile.agencyName}
                    onChange={(e) =>
                      setProfile({ ...profile, agencyName: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    WhatsApp Business
                  </label>
                  <input
                    type="text"
                    value={profile.whatsapp}
                    onChange={(e) =>
                      setProfile({ ...profile, whatsapp: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18241d] mb-1">
                    Email Professionnel
                  </label>
                  <input
                    type="text"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-black/10">
                <label className="block text-xs font-bold text-[#244635] mb-1">
                  Clé API Google Gemini (pour l&apos;analyse IA & génération de pitchs)
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18241d]/75 mb-1">
                  Clé Google Places / SerpApi (Optionnel — mode hybride gratuit actif par défaut)
                </label>
                <input
                  type="password"
                  value={googlePlacesKey}
                  onChange={(e) => setGooglePlacesKey(e.target.value)}
                  placeholder="Optionnel..."
                  className="w-full rounded-xl border border-black/15 px-3.5 py-2 text-sm"
                />
              </div>

              {settingsSavedToast && (
                <div className="rounded-xl bg-emerald-50 text-[#244635] px-4 py-2 text-xs font-bold">
                  ✓ Paramètres enregistrés avec succès !
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#18241d]/70 cursor-pointer"
                >
                  Fermer
                </button>
                <DualPillButton
                  type="submit"
                  label="Enregistrer les Paramètres"
                  icon="arrow"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
