import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { Suspense } from "react";
import { lazy } from "@probo/react-lazy";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const AssetView = lazy(() => import("./AssetView"));

export function AssetViewSkeleton() {
  return (
    <PageTemplateSkeleton>
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-48 bg-subtle-bg animate-pulse rounded" />
          <div className="h-4 w-96 bg-subtle-bg animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-20 bg-subtle-bg animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    </PageTemplateSkeleton>
  );
}

export function AssetPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<AssetViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <AssetView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
