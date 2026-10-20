import Form from "next/form";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { btn, inputClass } from "./styles";

/** Server-rendered filter bar: submits as a GET request so filters live in the URL. */
export function SearchFilters({
  action,
  query,
  status,
  placeholder = "Search…",
  statusOptions = [
    { value: "", label: "All statuses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
  ],
}: {
  action: string;
  query: string;
  status: string;
  placeholder?: string;
  statusOptions?: { value: string; label: string }[] | null;
}) {
  const filtered = Boolean(query || status);
  return (
    <Form action={action} className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center" role="search">
      <div className="relative flex-1">
        <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder={placeholder}
          aria-label="Search"
          className={cn(inputClass, "pl-10")}
        />
      </div>
      {statusOptions ? (
        <select name="status" defaultValue={status} aria-label="Filter by status" className={cn(inputClass, "sm:w-44")}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : null}
      <div className="flex gap-2">
        <button type="submit" className={cn(btn.base, btn.dark)}>
          Apply
        </button>
        {filtered ? (
          <Link href={action} className={cn(btn.base, btn.ghost)}>
            Clear
          </Link>
        ) : null}
      </div>
    </Form>
  );
}
