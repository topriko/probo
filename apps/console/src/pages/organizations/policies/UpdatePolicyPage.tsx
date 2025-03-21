import { PageTemplateSkeleton } from "@/components/PageTemplate";
import { lazy, Suspense } from "react";
import { useLocation } from "react-router";
import { ErrorBoundaryWithLocation } from "../ErrorBoundary";

const UpdatePolicyView = lazy(() => import("./UpdatePolicyView"));

export function UpdatePolicyViewSkeleton() {
  return (
    <PageTemplateSkeleton
      title="Update Policy"
      description="Update an existing policy"
    >
      <div className="flex items-center mb-6">
        <div className="mr-4">
          <div className="h-12 w-12 bg-muted animate-pulse rounded-lg" />
        </div>
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded" />
        </div>
      </div>
      <div className="bg-muted animate-pulse rounded-lg h-[600px]" />
    </PageTemplateSkeleton>
  );
}

export function UpdatePolicyPage() {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<UpdatePolicyViewSkeleton />}>
      <ErrorBoundaryWithLocation>
        <UpdatePolicyView />
      </ErrorBoundaryWithLocation>
    </Suspense>
  );
}
