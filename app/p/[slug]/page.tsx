"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  DEFAULT_AGENCY_PROFILE,
  formatMoney,
  type Currency,
  type ProspectLead,
  type ServiceOffering,
} from "@/app/lib/prospect-data";

export default function PublicProposalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white text-[#18241d]">
          Chargement de votre audit personnalisé...
        </div>
      }
    >
      <ProposalContent />
    </Suspense>
  );
}

function ProposalContent() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || "";

  const [lead, setLead] = useState<ProspectLead | null>(null);
  const [services, setServices] = useState<ServiceOffering[]>(INITIAL_SERVICES);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency>("FCFA");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const savedLeadsRaw = localStorage.getItem("nds_leads_v1");
    const savedServicesRaw = localStorage.getItem("nds_services_v1");

    const allLeads: ProspectLead[] = savedLeadsRaw
      ? JSON.parse(savedLeadsRaw)
      : INITIAL_LEADS;
    const allServices: ServiceOffering[] = savedServicesRaw
      ? JSON.parse(savedServicesRaw)
      : INITIAL_SERVICES;

    setServices(allServices);

    const found =
      allLeads.find((l) => l.slug === slug) || INITIAL_LEADS[0];

    if (found) {
      // Increment view count and mark as proposal_viewed if earlier stage
      const updatedLeads = allLeads.map((item) => {
        if (item.id === found.id) {
          const nextStage =
            item.stage === "saved" ||
            item.stage === "to_contact" ||
            item.stage === "contacted"
              ? "proposal_viewed"
              : item.stage;
          return {
            ...item,
            proposalViews: (item.proposalViews || 0) + 1,
            lastViewedAt: "À l'instant",
            stage: nextStage,
          };
        }
        return item;
      });
      localStorage.setItem("nds_leads_v1", JSON.stringify(updatedLeads));
      setLead(found);
      setSelectedIds(
        found.selectedServiceIds?.length
          ? found.selectedServiceIds
          : found.recommendedServiceIds
      );
      if (found.stage === "won") {
        setAccepted(true);
      }
    }
  }, [slug]);

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-[#18241d]">
        Chargement de votre audit personnalisé...
      </div>
    );
  }

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedServices = services.filter((s) => selectedIds.includes(s.id));
  const totalFcfa = selectedServices.reduce((acc, s) => acc + s.priceFcfa, 0);
  const totalEur = selectedServices.reduce((acc, s) => acc + s.priceEur, 0);

  const handleAcceptProposal = () => {
    setAccepted(true);
    const savedLeadsRaw = localStorage.getItem("nds_leads_v1");
    const allLeads: ProspectLead[] = savedLeadsRaw
      ? JSON.parse(savedLeadsRaw)
      : INITIAL_LEADS;
    const updated = allLeads.map((item) =>
      item.id === lead.id
        ? {
            ...item,
            stage: "won" as const,
            selectedServiceIds: selectedIds,
            lastViewedAt: "Proposition validée ✅",
          }
        : item
    );
    localStorage.setItem("nds_leads_v1", JSON.stringify(updated));
  };

  const whatsappDirectUrl = `https://wa.me/${DEFAULT_AGENCY_PROFILE.whatsapp.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Bonjour ${DEFAULT_AGENCY_PROFILE.ownerName}, j'ai consulté la page d'audit pour ${lead.companyName} et je souhaite échanger sur la proposition (${formatMoney(
      totalFcfa,
      totalEur,
      currency
    )}).`
  )}`;

  return (
    <div className="min-h-screen bg-white text-[#18241d]">
      {/* Top Floating Pill Navbar (Olivia Reference Style) */}
      <header className="max-w-6xl mx-auto px-4 pt-6">
        <nav className="rounded-full bg-[#244635] text-white px-4 md:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#f6a71b] text-[#18241d] font-bold flex items-center justify-center text-lg">
              N
            </span>
            <div>
              <span className="font-bold tracking-tight text-base">
                {DEFAULT_AGENCY_PROFILE.agencyName}
              </span>
              <span className="text-[#f6a71b] font-bold">.</span>
              <span className="hidden sm:inline-block ml-2 text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                Dossier : {lead.companyName}
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-white/85">
            <a href="#diagnostic" className="hover:text-[#f6a71b] transition">
              Diagnostic 360°
            </a>
            <a href="#devis" className="hover:text-[#f6a71b] transition">
              Plan d&apos;Action & Devis
            </a>
            <Link
              href="/"
              className="text-xs text-[#f6a71b] underline underline-offset-4"
            >
              ← Retour au Back-Office Prestataire
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full bg-[#1b3628] p-1 border border-white/15">
              {(["FCFA", "EUR"] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                    currency === cur
                      ? "bg-[#f6a71b] text-[#18241d]"
                      : "text-white/75 hover:text-white"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white text-[#18241d] px-4 py-2 text-xs md:text-sm font-semibold hover:bg-[#f6a71b] transition"
            >
              Discuter sur WhatsApp
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <FigmaBadge>
              Audit Digital & Proposition Sur-Mesure • {lead.city}
            </FigmaBadge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.12]">
              Potentiel de Croissance Digitale pour{" "}
              <span className="font-normal italic text-[#f6a71b] underline decoration-[#f6a71b]/50 underline-offset-8">
                {lead.companyName}
              </span>
            </h1>

            <p className="text-base md:text-lg text-[#18241d]/75 leading-relaxed max-w-2xl">
              {lead.aiSummary}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <DualPillButton
                label="Personnaliser & Valider le Devis"
                href="#devis"
                icon="arrow"
              />
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border-2 border-[#18241d] px-6 py-2.5 text-sm font-semibold text-[#18241d] hover:bg-[#18241d] hover:text-white transition"
              >
                Poser une question sur WhatsApp
              </a>
            </div>
          </div>

          {/* Right Hero Circular Amber Graphic (Olivia Reference Style) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-[#f6a71b] flex flex-col items-center justify-center p-8 shadow-xl">
              <div className="absolute -top-4 -right-2">
                <RotatingStamp text="AUDIT CERTIFIÉ IA • CROISSANCE B2B • " />
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-lg w-full max-w-xs text-center border border-[#244635]/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#244635]/70">
                  Score d&apos;Opportunité Commerciale
                </span>
                <div className="text-5xl font-extrabold text-[#244635] my-2">
                  {lead.opportunityScore}
                  <span className="text-xl text-[#f6a71b]">/100</span>
                </div>
                <p className="text-xs text-[#18241d]/70">
                  {lead.detectedWeaknesses.length} leviers prioritaires détectés sur{" "}
                  {lead.city}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                  <div className="bg-[#f5f6f5] p-2.5 rounded-xl">
                    <div className="text-[11px] text-[#18241d]/60">Web & Mobile</div>
                    <div className="text-sm font-bold text-[#244635]">
                      {lead.pillarScores.web}/100
                    </div>
                  </div>
                  <div className="bg-[#f5f6f5] p-2.5 rounded-xl">
                    <div className="text-[11px] text-[#18241d]/60">SEO & Maps</div>
                    <div className="text-sm font-bold text-[#244635]">
                      {lead.pillarScores.seo}/100
                    </div>
                  </div>
                  <div className="bg-[#f5f6f5] p-2.5 rounded-xl">
                    <div className="text-[11px] text-[#18241d]/60">Ads & Pixels</div>
                    <div className="text-sm font-bold text-[#244635]">
                      {lead.pillarScores.marketing}/100
                    </div>
                  </div>
                  <div className="bg-[#f5f6f5] p-2.5 rounded-xl">
                    <div className="text-[11px] text-[#18241d]/60">IA & WhatsApp</div>
                    <div className="text-sm font-bold text-[#244635]">
                      {lead.pillarScores.automation}/100
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Pill Tags like Reference */}
              <span className="absolute -bottom-3 left-4 rounded-full bg-[#244635] text-white text-xs font-semibold px-4 py-2 shadow-md">
                {lead.sector}
              </span>
              <span className="absolute top-6 -left-4 rounded-full bg-white text-[#18241d] border border-[#244635]/20 text-xs font-semibold px-4 py-1.5 shadow-md">
                {lead.hasWebsite ? "Site Web Analysé" : "Création Site Clé-en-Main"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <RibbonMarquee
        items={[
          "Audit Technique 360°",
          "Optimisation Mobile & Vitesse",
          "Visibilité Google Maps",
          "Automatisation WhatsApp & IA",
          "Devis Transparent FCFA & EUR",
        ]}
      />

      {/* Section 1: 3 Critical Findings */}
      <section id="diagnostic" className="max-w-6xl mx-auto px-4 py-14">
        <SectionHeader
          eyebrow="Diagnostic Détaillé"
          titlePrefix="Les 3 Freins qui Limitent"
          titleHighlight="Vos Conversions"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lead.criticalPoints.map((pt, i) => (
            <div
              key={i}
              className="rounded-3xl bg-[#f5f6f5] p-7 border border-black/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-full bg-white shadow-xs flex items-center justify-center mb-5">
                  <span className="w-8 h-8 rounded-lg bg-[#244635] text-[#f6a71b] font-bold flex items-center justify-center text-sm">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#18241d] mb-2">
                  {pt.title}
                </h3>
                <p className="text-sm text-[#18241d]/75 leading-relaxed">
                  {pt.impact}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-semibold text-[#244635]">
                <span>Priorité Haute</span>
                <span className="text-[#f6a71b]">Impact Direct CA →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Checklist */}
        <div className="mt-10 rounded-3xl bg-[#f5f6f5] p-6 md:p-8 border border-black/5">
          <h3 className="text-lg font-bold mb-4">
            Points de contrôle techniques inspectés sur {lead.companyName}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lead.auditChecks.map((chk, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 flex items-start gap-3.5 shadow-2xs"
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    chk.passed
                      ? "bg-emerald-100 text-[#244635]"
                      : "bg-[#fef5e5] text-[#b87400]"
                  }`}
                >
                  {chk.passed ? "✓" : "!"}
                </span>
                <div>
                  <div className="text-sm font-semibold text-[#18241d]">
                    {chk.label}
                  </div>
                  <div className="text-xs text-[#18241d]/65 mt-0.5">
                    {chk.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Interactive Proposal & Quote Calculator in Dark Forest Green */}
      <section id="devis" className="bg-[#244635] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHeader
            dark
            eyebrow="Proposition Commerciale Interactive"
            titlePrefix="Plan d'Action &"
            titleHighlight="Devis Sur-Mesure"
            action={
              <div className="inline-flex rounded-full bg-[#1b3628] p-1 border border-white/15">
                {(["FCFA", "EUR"] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                      currency === cur
                        ? "bg-[#f6a71b] text-[#18241d]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Afficher en {cur}
                  </button>
                ))}
              </div>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Selectable Services List */}
            <div className="lg:col-span-8 space-y-4">
              {services.map((srv) => {
                const isSelected = selectedIds.includes(srv.id);
                const isRecommended = lead.recommendedServiceIds.includes(srv.id);
                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`rounded-3xl p-6 transition cursor-pointer border ${
                      isSelected
                        ? "bg-white text-[#18241d] border-[#f6a71b] shadow-lg"
                        : "bg-[#1b3628]/80 text-white border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 w-5 h-5 accent-[#244635] rounded cursor-pointer"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-lg">{srv.title}</span>
                            {isRecommended && (
                              <span className="rounded-full bg-[#f6a71b] text-[#18241d] text-[11px] font-bold px-2.5 py-0.5">
                                Recommandé suite à l&apos;audit
                              </span>
                            )}
                          </div>
                          <p
                            className={`text-xs mt-1 ${
                              isSelected ? "text-[#18241d]/70" : "text-white/70"
                            }`}
                          >
                            {srv.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div
                          className={`text-xl font-extrabold ${
                            isSelected ? "text-[#244635]" : "text-[#f6a71b]"
                          }`}
                        >
                          {formatMoney(srv.priceFcfa, srv.priceEur, currency)}
                        </div>
                        <div
                          className={`text-[11px] ${
                            isSelected ? "text-[#18241d]/60" : "text-white/60"
                          }`}
                        >
                          Facturation {srv.billing}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-current/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {srv.deliverables.map((deliv, dIdx) => (
                        <div
                          key={dIdx}
                          className="text-xs flex items-center gap-2"
                        >
                          <span className="text-[#f6a71b] font-bold">●</span>
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sticky Quote Summary Card */}
            <div className="lg:col-span-4 bg-white text-[#18241d] rounded-3xl p-7 shadow-xl sticky top-6">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#244635]">
                Récapitulatif de votre investissement
              </div>
              <h3 className="text-2xl font-bold mt-1">{lead.companyName}</h3>

              <div className="my-5 space-y-2.5 border-y border-black/10 py-4 text-sm">
                {selectedServices.length === 0 ? (
                  <p className="text-xs text-[#18241d]/60">
                    Cochez au moins une prestation à gauche pour simuler votre devis.
                  </p>
                ) : (
                  selectedServices.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-medium line-clamp-1">
                        {s.title}
                      </span>
                      <span className="text-xs font-bold text-[#244635] shrink-0">
                        {formatMoney(s.priceFcfa, s.priceEur, currency)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-baseline justify-between mb-6">
                <span className="text-sm font-semibold text-[#18241d]/70">
                  Total Estimé
                </span>
                <span className="text-3xl font-extrabold text-[#244635]">
                  {formatMoney(totalFcfa, totalEur, currency)}
                </span>
              </div>

              {accepted ? (
                <div className="rounded-2xl bg-emerald-50 border border-[#244635]/30 p-4 text-center space-y-2">
                  <div className="text-base font-bold text-[#244635]">
                    ✅ Proposition Validée !
                  </div>
                  <p className="text-xs text-[#18241d]/75">
                    {DEFAULT_AGENCY_PROFILE.ownerName} a reçu votre sélection et vous recontacte sous 2h.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleAcceptProposal}
                    className="w-full rounded-full bg-[#f6a71b] p-1 flex items-center justify-between hover:scale-[1.01] transition cursor-pointer"
                  >
                    <span className="flex-1 rounded-full bg-[#244635] text-white py-3 px-4 text-sm font-semibold text-center">
                      Valider cette Proposition
                    </span>
                    <span className="w-10 h-10 rounded-full bg-white text-[#18241d] flex items-center justify-center font-bold ml-1">
                      ✓
                    </span>
                  </button>

                  <a
                    href={whatsappDirectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full block text-center rounded-full border-2 border-[#244635] text-[#244635] py-2.5 text-xs font-bold hover:bg-[#244635] hover:text-white transition"
                  >
                    Discuter sur WhatsApp ({DEFAULT_AGENCY_PROFILE.whatsapp})
                  </a>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-black/10 flex items-center justify-between text-xs text-[#18241d]/60">
                <span>Préparé par {DEFAULT_AGENCY_PROFILE.ownerName}</span>
                <span className="italic font-serif text-[#244635] font-semibold">
                  {DEFAULT_AGENCY_PROFILE.agencyName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
