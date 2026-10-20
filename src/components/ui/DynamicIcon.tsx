import { createElement } from "react";
import type { LucideProps } from "lucide-react";
import { getIcon } from "@/lib/icons";

/** Renders one of the admin-selectable icons by its stored id. */
export function DynamicIcon({ name, ...props }: LucideProps & { name: string | null | undefined }) {
  return createElement(getIcon(name), props);
}
