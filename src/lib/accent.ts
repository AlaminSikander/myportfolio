import type { Accent } from "@/types";

type AccentStyles = {
  text: string;
  bg: string;
  softBg: string;
  border: string;
  ring: string;
  dot: string;
  gradient: string;
  hoverBorder: string;
};

export const accentStyles: Record<Accent, AccentStyles> = {
  teal: {
    text: "text-mint-700",
    bg: "bg-mint-600",
    softBg: "bg-mint-50",
    border: "border-mint-100",
    ring: "ring-mint-100",
    dot: "bg-mint-500",
    gradient: "from-mint-400 to-mint-600",
    hoverBorder: "hover:border-mint-400",
  },
  blue: {
    text: "text-azure-600",
    bg: "bg-azure-600",
    softBg: "bg-azure-50",
    border: "border-azure-100",
    ring: "ring-azure-100",
    dot: "bg-azure-500",
    gradient: "from-azure-400 to-azure-600",
    hoverBorder: "hover:border-azure-400",
  },
  ember: {
    text: "text-ember-600",
    bg: "bg-ember-600",
    softBg: "bg-ember-50",
    border: "border-ember-100",
    ring: "ring-ember-100",
    dot: "bg-ember-500",
    gradient: "from-ember-400 to-ember-600",
    hoverBorder: "hover:border-ember-400",
  },
};
