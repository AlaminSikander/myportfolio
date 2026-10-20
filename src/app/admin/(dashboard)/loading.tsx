import { Skeleton, TableSkeleton } from "@/components/admin/ui";

export default function Loading() {
  return (
    <div>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 mb-8 h-4 w-80 max-w-full" />
      <TableSkeleton />
    </div>
  );
}
