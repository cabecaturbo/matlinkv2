import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <Skeleton className="h-36 w-full rounded-xl sm:h-48" />
      <Skeleton className="-mt-12 ml-2 h-24 w-24 rounded-full" />
      <Skeleton className="mt-4 h-9 w-64" />
      <Skeleton className="mt-3 h-6 w-40" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    </div>
  );
}
