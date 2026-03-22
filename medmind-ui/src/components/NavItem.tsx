import React from "react";

export const NavItem = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center px-5 py-1.5 transition-all duration-200 active:scale-90 ${
      active
        ? "bg-primary/10 text-primary rounded-2xl"
        : "text-on-surface-variant/60 hover:text-on-surface-variant"
    }`}
  >
    {icon}
    <span className="font-label text-[10px] font-bold tracking-wider uppercase mt-1">
      {label}
    </span>
  </button>
);
