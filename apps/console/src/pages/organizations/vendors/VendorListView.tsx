import { Suspense, useEffect, useState, useTransition } from "react";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
  useMutation,
  usePaginationFragment,
} from "react-relay";
import { useSearchParams, useParams } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Store, ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import Fuse from "fuse.js";
import { useToast } from "@/hooks/use-toast";
import { PageTemplate } from "@/components/PageTemplate";
import { VendorListViewSkeleton } from "./VendorListPage";
import { VendorListViewQuery as VendorListViewQueryType } from "./__generated__/VendorListViewQuery.graphql";
import { VendorListViewCreateVendorMutation } from "./__generated__/VendorListViewCreateVendorMutation.graphql";
import { VendorListViewDeleteVendorMutation } from "./__generated__/VendorListViewDeleteVendorMutation.graphql";
import { VendorListViewPaginationQuery } from "./__generated__/VendorListViewPaginationQuery.graphql";
import { VendorListView_vendors$key } from "./__generated__/VendorListView_vendors.graphql";

const ITEMS_PER_PAGE = 25;

const vendorListViewQuery = graphql`
  query VendorListViewQuery(
    $organizationId: ID!
    $first: Int
    $after: CursorKey
    $last: Int
    $before: CursorKey
  ) {
    organization: node(id: $organizationId) {
      id

      ...VendorListView_vendors
        @arguments(first: $first, after: $after, last: $last, before: $before)
    }
  }
`;

const vendorListFragment = graphql`
  fragment VendorListView_vendors on Organization
  @refetchable(queryName: "VendorListViewPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int" }
    after: { type: "CursorKey" }
    last: { type: "Int" }
    before: { type: "CursorKey" }
  ) {
    vendors(
      first: $first
      after: $after
      last: $last
      before: $before
      orderBy: { direction: ASC, field: NAME }
    ) @connection(key: "VendorListView_vendors") {
      __id
      edges {
        node {
          id
          name
          description
          createdAt
          updatedAt
          riskTier
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

const createVendorMutation = graphql`
  mutation VendorListViewCreateVendorMutation(
    $input: CreateVendorInput!
    $connections: [ID!]!
  ) {
    createVendor(input: $input) {
      vendorEdge @prependEdge(connections: $connections) {
        node {
          id
          name
          description
          createdAt
          updatedAt
          riskTier
        }
      }
    }
  }
`;

const deleteVendorMutation = graphql`
  mutation VendorListViewDeleteVendorMutation(
    $input: DeleteVendorInput!
    $connections: [ID!]!
  ) {
    deleteVendor(input: $input) {
      deletedVendorId @deleteEdge(connections: $connections)
    }
  }
`;

// Define a proper type for the vendor items
interface VendorItem {
  id: string;
  name: string;
  createdAt: string;
}

// TODO: Remove this once we have a real list of vendors
const vendorsList: VendorItem[] = [
  { id: "1", name: "Amazon Web Services", createdAt: new Date().toISOString() },
  {
    id: "2",
    name: "Google Cloud Platform",
    createdAt: new Date().toISOString(),
  },
  { id: "3", name: "Microsoft Azure", createdAt: new Date().toISOString() },
  { id: "4", name: "Salesforce", createdAt: new Date().toISOString() },
  { id: "5", name: "Slack", createdAt: new Date().toISOString() },
  { id: "6", name: "Zoom", createdAt: new Date().toISOString() },
  { id: "7", name: "Dropbox", createdAt: new Date().toISOString() },
  { id: "8", name: "Trello", createdAt: new Date().toISOString() },
  { id: "9", name: "Asana", createdAt: new Date().toISOString() },
  { id: "10", name: "Notion", createdAt: new Date().toISOString() },
  { id: "11", name: "GitHub", createdAt: new Date().toISOString() },
  { id: "12", name: "GitLab", createdAt: new Date().toISOString() },
  { id: "13", name: "Bitbucket", createdAt: new Date().toISOString() },
  { id: "14", name: "Docker", createdAt: new Date().toISOString() },
  { id: "15", name: "Kubernetes", createdAt: new Date().toISOString() },
  { id: "16", name: "Jenkins", createdAt: new Date().toISOString() },
  { id: "17", name: "CircleCI", createdAt: new Date().toISOString() },
];

function LoadAboveButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load above"}
      </Button>
    </div>
  );
}

function LoadBelowButton({
  isLoading,
  hasMore,
  onLoadMore,
}: {
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="flex justify-center">
      <Button
        variant="outline"
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className="w-full"
      >
        {isLoading ? "Loading..." : "Load below"}
      </Button>
    </div>
  );
}

function VendorListContent({
  queryRef,
}: {
  queryRef: PreloadedQuery<VendorListViewQueryType>;
}) {
  const { toast } = useToast();
  const data = usePreloadedQuery<VendorListViewQueryType>(
    vendorListViewQuery,
    queryRef
  );
  const [, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVendors, setFilteredVendors] = useState<VendorItem[]>([]);
  const [createVendor] =
    useMutation<VendorListViewCreateVendorMutation>(createVendorMutation);
  const [deleteVendor] =
    useMutation<VendorListViewDeleteVendorMutation>(deleteVendorMutation);
  const { organizationId } = useParams();

  const {
    data: vendorsConnection,
    loadNext,
    loadPrevious,
    hasNext,
    hasPrevious,
    isLoadingNext,
    isLoadingPrevious,
  } = usePaginationFragment<
    VendorListViewPaginationQuery,
    VendorListView_vendors$key
  >(vendorListFragment, data.organization);

  const vendors =
    vendorsConnection.vendors.edges.map((edge) => edge.node) ?? [];
  const pageInfo = vendorsConnection.vendors.pageInfo;

  const fuse = new Fuse(vendorsList, {
    keys: ["name"],
    threshold: 0.3,
  });

  return (
    <PageTemplate
      title="Vendors"
      description="Vendors are third-party services that your company uses. Add them to
      keep track of their risk and compliance status."
    >
      <div className="space-y-6">
        <div className="rounded-xl border bg-level-1 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Store className="h-5 w-5" />
            <h3 className="font-medium">Add a vendor</h3>
          </div>
          <div className="flex gap-2 relative">
            <Input
              type="text"
              placeholder="Type vendor's name"
              value={searchTerm}
              style={{ borderRadius: "0.3rem" }}
              onChange={(e) => {
                const value = e.target.value;
                setSearchTerm(value);
                if (value.trim() === "") {
                  setFilteredVendors([]);
                } else {
                  const results = fuse
                    .search(value)
                    .map((result) => result.item);
                  setFilteredVendors(results);
                }
              }}
            />

            {searchTerm.trim() !== "" && (
              <>
                {filteredVendors.length > 0 ? (
                  <div
                    style={{ borderRadius: "0.3rem" }}
                    className="absolute top-full left-0 mt-1 w-[calc(100%-100px)] max-h-48 overflow-y-auto border bg-invert-bg shadow-md z-10"
                  >
                    {filteredVendors.map((vendor: VendorItem) => (
                      <button
                        key={vendor.id}
                        className="w-full px-3 py-2 text-left bg-invert-bg hover:bg-h-subtle-bg"
                        onClick={() => {
                          createVendor({
                            variables: {
                              connections: [vendorsConnection.vendors.__id],
                              input: {
                                organizationId: data.organization.id,
                                name: vendor.name,
                                description: "",
                                serviceStartAt: new Date().toISOString(),
                                serviceCriticality: "LOW",
                                riskTier: "GENERAL",
                              },
                            },
                            onCompleted() {
                              setSearchTerm("");
                              setFilteredVendors([]);
                              toast({
                                title: "Vendor added",
                                description:
                                  "The vendor has been added successfully",
                              });
                            },
                          });
                        }}
                      >
                        {vendor.name}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{ borderRadius: "0.3rem" }}
                    className="absolute top-full left-0 mt-1 w-[calc(100%-100px)] border bg-level-0 shadow-md z-10"
                  >
                    <button
                      className="w-full px-3 py-2 text-left hover:bg-accent-bg flex items-center gap-2"
                      onClick={() => {
                        createVendor({
                          variables: {
                            connections: [vendorsConnection.vendors.__id],
                            input: {
                              organizationId: data.organization.id,
                              name: searchTerm.trim(),
                              description: "",
                              serviceStartAt: new Date().toISOString(),
                              serviceCriticality: "LOW",
                              riskTier: "GENERAL",
                            },
                          },
                          onCompleted() {
                            setSearchTerm("");
                            setFilteredVendors([]);
                            toast({
                              title: "Vendor created",
                              description:
                                "The new vendor has been created successfully",
                            });
                          },
                        });
                      }}
                    >
                      <span className="font-medium">Create new vendor:</span>{" "}
                      {searchTerm}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {vendors.map((vendor) => (
            <Link
              key={vendor?.id}
              to={`/organizations/${organizationId}/vendors/${vendor?.id}`}
              className="block"
            >
              <div className="flex items-center justify-between p-4 rounded-xl border bg-level-1 hover:bg-accent-bg/5 transition-colors">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{vendor?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{vendor?.name}</p>
                    {vendor?.description && (
                      <>
                        <span className="text-tertiary">•</span>
                        <p className="text-sm text-tertiary">
                          {vendor.description}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      vendor.riskTier === "CRITICAL"
                        ? "bg-danger-bg text-danger rounded-full px-3 py-0.5 text-xs font-medium"
                        : vendor?.riskTier === "SIGNIFICANT"
                        ? "bg-warning-bg text-warning rounded-full px-3 py-0.5 text-xs font-medium"
                        : "bg-success-bg text-success rounded-full px-3 py-0.5 text-xs font-medium"
                    }
                  >
                    {vendor.riskTier}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-tertiary hover:bg-transparent hover:[&>svg]:text-danger"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent navigation
                      if (
                        window.confirm(
                          "Are you sure you want to delete this vendor?"
                        )
                      ) {
                        deleteVendor({
                          variables: {
                            connections: [vendorsConnection.vendors.__id],
                            input: {
                              vendorId: vendor.id,
                            },
                          },
                          onCompleted() {
                            toast({
                              title: "Vendor deleted",
                              description:
                                "The vendor has been deleted successfully",
                            });
                          },
                        });
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 transition-colors" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-tertiary" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <LoadAboveButton
        isLoading={isLoadingPrevious}
        hasMore={hasPrevious}
        onLoadMore={() => {
          startTransition(() => {
            setSearchParams((prev) => {
              prev.set("before", pageInfo?.startCursor || "");
              prev.delete("after");
              return prev;
            });
            loadPrevious(ITEMS_PER_PAGE);
          });
        }}
      />
      <LoadBelowButton
        isLoading={isLoadingNext}
        hasMore={hasNext}
        onLoadMore={() => {
          startTransition(() => {
            setSearchParams((prev) => {
              prev.set("after", pageInfo?.endCursor || "");
              prev.delete("before");
              return prev;
            });
            loadNext(ITEMS_PER_PAGE);
          });
        }}
      />
    </PageTemplate>
  );
}

export default function VendorListView() {
  const [searchParams] = useSearchParams();
  const [queryRef, loadQuery] =
    useQueryLoader<VendorListViewQueryType>(vendorListViewQuery);

  const { organizationId } = useParams();

  useEffect(() => {
    const after = searchParams.get("after");
    const before = searchParams.get("before");

    loadQuery({
      organizationId: organizationId!,
      first: before ? undefined : ITEMS_PER_PAGE,
      after: after || undefined,
      last: before ? ITEMS_PER_PAGE : undefined,
      before: before || undefined,
    });
  }, [loadQuery, organizationId]);

  if (!queryRef) {
    return <VendorListViewSkeleton />;
  }

  return (
    <Suspense fallback={<VendorListViewSkeleton />}>
      <VendorListContent queryRef={queryRef} />
    </Suspense>
  );
}
