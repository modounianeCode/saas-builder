import React from "react";

export function FigmaBadge({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`relative inline-flex items-center px-4 py-1.5 text-sm font-medium tracking-tight border ${
        dark
          ? "border-white/40 text-white bg-white/5"
          : "border-[#244635]/40 text-[#18241d] bg-white"
      }`}
    >
      {/* 4 Figma selection corner squares */}
      <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#f6a71b] border border-[#244635]/30" />
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#f6a71b] border border-[#244635]/30" />
      <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#f6a71b] border border-[#244635]/30" />
      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#f6a71b] border border-[#244635]/30" />
      {children}
    </div>
  );
}

export function DualPillButton({
  label,
  onClick,
  href,
  type = "button",
  disabled = false,
  icon = "arrow",
  size = "md",
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  icon?: "arrow" | "play" | "sparkle" | "plus";
  size?: "sm" | "md";
}) {
  const content = (
    <span
      className={`group inline-flex items-center rounded-full bg-[#f6a71b] p-1 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] ${
        disabled ? "opacity-60 pointer-events-none" : "cursor-pointer"
      }`}
    >
      <span
        className={`rounded-full bg-[#244635] text-white font-medium tracking-tight transition-colors group-hover:bg-[#1b3628] ${
          size === "sm" ? "px-4 py-2 text-xs" : "px-6 py-2.5 text-sm"
        }`}
      >
        {label}
      </span>
      <span
        className={`ml-1.5 mr-0.5 rounded-full bg-white text-[#18241d] flex items-center justify-center shadow-xs transition-transform group-hover:translate-x-0.5 ${
          size === "sm" ? "w-7 h-7" : "w-9 h-9"
        }`}
      >
        {icon === "play" && (
          <svg
            className="w-3.5 h-3.5 fill-current ml-0.5"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {icon === "arrow" && (
          <svg
            className="w-4 h-4 stroke-current"
            fill="none"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14m-6-6 6 6-6 6"
            />
          </svg>
        )}
        {icon === "sparkle" && (
          <svg
            className="w-4 h-4 stroke-current"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z"
            />
          </svg>
        )}
        {icon === "plus" && (
          <svg
            className="w-4 h-4 stroke-current"
            fill="none"
            strokeWidth="2.4"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m-7-7h14"
            />
          </svg>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <a href={href} className="inline-block">
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-block bg-transparent border-0 p-0"
    >
      {content}
    </button>
  );
}

export function SectionHeader({
  eyebrow,
  titlePrefix,
  titleHighlight,
  titleSuffix,
  dark = false,
  centered = false,
  action,
}: {
  eyebrow: string;
  titlePrefix?: string;
  titleHighlight: string;
  titleSuffix?: string;
  dark?: boolean;
  centered?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col ${
        centered
          ? "items-center text-center"
          : "md:flex-row md:items-end justify-between"
      } gap-4 mb-10`}
    >
      <div>
        <div className="inline-flex items-center gap-2 text-sm font-medium mb-2">
          <span className="w-4 h-0.5 bg-[#f6a71b] inline-block rounded-full" />
          <span className={dark ? "text-white/85" : "text-[#18241d]/80"}>
            {eyebrow}
          </span>
        </div>
        <h2
          className={`text-3xl md:text-4xl font-bold tracking-tight leading-tight ${
            dark ? "text-white" : "text-[#18241d]"
          }`}
        >
          {titlePrefix && <span>{titlePrefix} </span>}
          <span className="font-normal italic text-[#f6a71b]">
            {titleHighlight}
          </span>
          {titleSuffix && <span> {titleSuffix}</span>}
        </h2>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StarburstIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" />
    </svg>
  );
}

export function RibbonMarquee({ items }: { items: string[] }) {
  const repeated = [...items, ...items];
  return (
    <div className="relative my-8 select-none overflow-hidden py-3">
      {/* Slanted dark green backing strip */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-[#244635] -rotate-1 scale-105 rounded-xs" />
      {/* Foreground amber marquee bar */}
      <div className="relative bg-[#f6a71b] text-[#18241d] py-3.5 shadow-sm overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
          {repeated.map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-8">
              <span className="text-lg md:text-xl font-bold tracking-tight">
                {item}
              </span>
              <StarburstIcon className="w-5 h-5 text-[#18241d]/80 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RotatingStamp({ text = "AUDIT IA • PROSPECTION B2B • " }: { text?: string }) {
  return (
    <div className="relative w-24 h-24 rounded-full bg-[#244635] text-white flex items-center justify-center shadow-lg border-2 border-white">
      <svg
        viewBox="0 0 100 100"
        className="w-20 h-20 animate-spin-slow fill-current text-white"
      >
        <defs>
          <path
            id="circlePath"
            d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
          />
        </defs>
        <text fontSize="10.2" fontWeight="700" letterSpacing="1.8">
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </svg>
      <div className="absolute w-8 h-8 rounded-full bg-[#f6a71b] text-[#18241d] flex items-center justify-center">
        <svg
          className="w-4 h-4 stroke-current"
          fill="none"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 17L17 7M7 7h10v10"
          />
        </svg>
      </div>
    </div>
  );
}

