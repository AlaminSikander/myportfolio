import {
  Bot,
  Briefcase,
  Bug,
  Code2,
  Megaphone,
  MonitorCog,
  Plug,
  Search,
  ShieldCheck,
  ShoppingCart,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const iconOptions: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "shield", label: "Shield (QA)", icon: ShieldCheck },
  { id: "bug", label: "Bug", icon: Bug },
  { id: "bot", label: "Bot (Automation)", icon: Bot },
  { id: "plug", label: "Plug (API)", icon: Plug },
  { id: "search", label: "Search (SEO)", icon: Search },
  { id: "megaphone", label: "Megaphone (Marketing)", icon: Megaphone },
  { id: "code", label: "Code (Development)", icon: Code2 },
  { id: "users", label: "People (Management)", icon: Users },
  { id: "workflow", label: "Workflow (Operations)", icon: Workflow },
  { id: "briefcase", label: "Briefcase", icon: Briefcase },
  { id: "cart", label: "Cart (E-commerce)", icon: ShoppingCart },
  { id: "monitor", label: "Monitor (IT)", icon: MonitorCog },
];

export const iconIds = iconOptions.map((option) => option.id) as [string, ...string[]];

export function getIcon(id: string | null | undefined): LucideIcon {
  return iconOptions.find((option) => option.id === id)?.icon ?? ShieldCheck;
}
