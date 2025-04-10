import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Search, Loader2, X, LinkIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import {
  fetchQuery,
  graphql,
  useFragment,
  useMutation,
  useRelayEnvironment,
} from "react-relay";
import { useParams, Link } from "react-router";
import {
  ControlLinkedMitigationsQuery$data,
  ControlLinkedMitigationsQuery,
} from "./__generated__/ControlLinkedMitigationsQuery.graphql";
import {
  ControlOrganizationMitigationsQuery$data,
  ControlOrganizationMitigationsQuery,
} from "./__generated__/ControlOrganizationMitigationsQuery.graphql";
import { ControlFragment_Control$key } from "./__generated__/ControlFragment_Control.graphql";
import {
  ControlLinkedPoliciesQuery$data,
  ControlLinkedPoliciesQuery,
} from "./__generated__/ControlLinkedPoliciesQuery.graphql";
import {
  ControlOrganizationPoliciesQuery$data,
  ControlOrganizationPoliciesQuery,
} from "./__generated__/ControlOrganizationPoliciesQuery.graphql";

const controlFragment = graphql`
  fragment ControlFragment_Control on Control {
    id
    description
    name
    referenceId
  }
`;

// New query to fetch linked mitigations
const linkedMitigationsQuery = graphql`
  query ControlLinkedMitigationsQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        mitigations(first: 100) @connection(key: "Control__mitigations") {
          edges {
            node {
              id
              name
              description
              category
              importance
              state
            }
          }
        }
      }
    }
  }
`;

// Query to fetch all mitigations for the organization
const organizationMitigationsQuery = graphql`
  query ControlOrganizationMitigationsQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        mitigations(first: 100) @connection(key: "Organization__mitigations") {
          edges {
            node {
              id
              name
              description
              category
              importance
              state
            }
          }
        }
      }
    }
  }
`;

// Query to fetch linked policies
const linkedPoliciesQuery = graphql`
  query ControlLinkedPoliciesQuery($controlId: ID!) {
    control: node(id: $controlId) {
      id
      ... on Control {
        policies(first: 100) @connection(key: "Control__policies") {
          edges {
            node {
              id
              name
              content
              status
              reviewDate
            }
          }
        }
      }
    }
  }
`;

// Query to fetch all policies for the organization
const organizationPoliciesQuery = graphql`
  query ControlOrganizationPoliciesQuery($organizationId: ID!) {
    organization: node(id: $organizationId) {
      id
      ... on Organization {
        policies(first: 100) @connection(key: "Organization__policies") {
          edges {
            node {
              id
              name
              content
              status
              reviewDate
            }
          }
        }
      }
    }
  }
`;

// Mutation to create a mapping between a control and a mitigation
const createMitigationMappingMutation = graphql`
  mutation ControlCreateMitigationMappingMutation(
    $input: CreateControlMitigationMappingInput!
  ) {
    createControlMitigationMapping(input: $input) {
      success
    }
  }
`;

// Mutation to delete a mapping between a control and a mitigation
const deleteMitigationMappingMutation = graphql`
  mutation ControlDeleteMitigationMappingMutation(
    $input: DeleteControlMitigationMappingInput!
  ) {
    deleteControlMitigationMapping(input: $input) {
      success
    }
  }
`;

// Mutation to create a mapping between a control and a policy
const createPolicyMappingMutation = graphql`
  mutation ControlCreatePolicyMappingMutation(
    $input: CreateControlPolicyMappingInput!
  ) {
    createControlPolicyMapping(input: $input) {
      success
    }
  }
`;

// Mutation to delete a mapping between a control and a policy
const deletePolicyMappingMutation = graphql`
  mutation ControlDeletePolicyMappingMutation(
    $input: DeleteControlPolicyMappingInput!
  ) {
    deleteControlPolicyMapping(input: $input) {
      success
    }
  }
`;

export function Control({
  controlKey,
}: {
  controlKey: ControlFragment_Control$key;
}) {
  const { organizationId /* frameworkId */ } = useParams<{
    organizationId: string;
    frameworkId: string;
  }>();
  const control = useFragment(controlFragment, controlKey);
  const { toast } = useToast();
  const environment = useRelayEnvironment();

  // State for mitigation mapping
  const [isMitigationMappingDialogOpen, setIsMitigationMappingDialogOpen] =
    useState(false);
  const [linkedMitigationsData, setLinkedMitigationsData] =
    useState<ControlLinkedMitigationsQuery$data | null>(null);
  const [organizationMitigationsData, setOrganizationMitigationsData] =
    useState<ControlOrganizationMitigationsQuery$data | null>(null);
  const [mitigationSearchQuery, setMitigationSearchQuery] = useState("");
  const [isLoadingMitigations, setIsLoadingMitigations] = useState(false);
  const [isLinkingMitigation, setIsLinkingMitigation] = useState(false);
  const [isUnlinkingMitigation, setIsUnlinkingMitigation] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Policy state
  const [isPolicyMappingDialogOpen, setIsPolicyMappingDialogOpen] =
    useState(false);
  const [linkedPoliciesData, setLinkedPoliciesData] =
    useState<ControlLinkedPoliciesQuery$data | null>(null);
  const [organizationPoliciesData, setOrganizationPoliciesData] =
    useState<ControlOrganizationPoliciesQuery$data | null>(null);
  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [isLinkingPolicy, setIsLinkingPolicy] = useState(false);
  const [isUnlinkingPolicy, setIsUnlinkingPolicy] = useState(false);

  // Create mutation hooks
  const [commitCreateMitigationMapping] = useMutation(
    createMitigationMappingMutation
  );
  const [commitDeleteMitigationMapping] = useMutation(
    deleteMitigationMappingMutation
  );
  const [commitCreatePolicyMapping] = useMutation(createPolicyMappingMutation);
  const [commitDeletePolicyMapping] = useMutation(deletePolicyMappingMutation);

  // Load initial linked mitigations data
  useEffect(() => {
    if (control.id) {
      setIsLoadingMitigations(true);
      fetchQuery<ControlLinkedMitigationsQuery>(
        environment,
        linkedMitigationsQuery,
        {
          controlId: control.id,
        }
      ).subscribe({
        next: (data) => {
          setLinkedMitigationsData(data);
          setIsLoadingMitigations(false);
        },
        error: (error: Error) => {
          console.error("Error loading initial mitigations:", error);
          setIsLoadingMitigations(false);
        },
      });
    }
  }, [control.id, environment]);

  // Load mitigations data
  const loadMitigationsData = useCallback(() => {
    if (!organizationId || !control.id) return;

    setIsLoadingMitigations(true);

    // Fetch all mitigations for the organization
    fetchQuery<ControlOrganizationMitigationsQuery>(
      environment,
      organizationMitigationsQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationMitigationsData(data);
      },
      complete: () => {
        // Fetch linked mitigations for this control
        fetchQuery<ControlLinkedMitigationsQuery>(
          environment,
          linkedMitigationsQuery,
          {
            controlId: control.id,
          }
        ).subscribe({
          next: (data) => {
            setLinkedMitigationsData(data);
            setIsLoadingMitigations(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked mitigations:", error);
            setIsLoadingMitigations(false);
            toast({
              title: "Error",
              description: "Failed to load linked mitigations.",
              variant: "destructive",
            });
          },
        });
      },
      error: (error: Error) => {
        console.error("Error fetching organization mitigations:", error);
        setIsLoadingMitigations(false);
        toast({
          title: "Error",
          description: "Failed to load mitigations.",
          variant: "destructive",
        });
      },
    });
  }, [control.id, environment, organizationId, toast]);

  // Helper functions
  const getMitigations = useCallback(() => {
    if (!organizationMitigationsData?.organization?.mitigations?.edges)
      return [];
    return organizationMitigationsData.organization.mitigations.edges.map(
      (edge) => edge.node
    );
  }, [organizationMitigationsData]);

  const getLinkedMitigations = useCallback(() => {
    if (!linkedMitigationsData?.control?.mitigations?.edges) return [];
    return linkedMitigationsData.control.mitigations.edges.map(
      (edge) => edge.node
    );
  }, [linkedMitigationsData]);

  const isMitigationLinked = useCallback(
    (mitigationId: string) => {
      const linkedMitigations = getLinkedMitigations();
      return linkedMitigations.some(
        (mitigation) => mitigation.id === mitigationId
      );
    },
    [getLinkedMitigations]
  );

  const getMitigationCategories = useCallback(() => {
    const mitigations = getMitigations();
    const categories = new Set<string>();

    mitigations.forEach((mitigation) => {
      if (mitigation.category) {
        categories.add(mitigation.category);
      }
    });

    return Array.from(categories).sort();
  }, [getMitigations]);

  const filteredMitigations = useCallback(() => {
    const mitigations = getMitigations();
    if (!mitigationSearchQuery && !categoryFilter) return mitigations;

    return mitigations.filter((mitigation) => {
      // Filter by search query
      const matchesSearch =
        !mitigationSearchQuery ||
        mitigation.name
          .toLowerCase()
          .includes(mitigationSearchQuery.toLowerCase()) ||
        (mitigation.description &&
          mitigation.description
            .toLowerCase()
            .includes(mitigationSearchQuery.toLowerCase()));

      // Filter by category
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === "all" ||
        mitigation.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, getMitigations, mitigationSearchQuery]);

  // Handle link/unlink functions
  const handleLinkMitigation = useCallback(
    (mitigationId: string) => {
      if (!control.id) return;

      setIsLinkingMitigation(true);

      commitCreateMitigationMapping({
        variables: {
          input: {
            controlId: control.id,
            mitigationId: mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingMitigation(false);

          if (errors) {
            console.error("Error linking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to link mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mitigations data
          fetchQuery<ControlLinkedMitigationsQuery>(
            environment,
            linkedMitigationsQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMitigationsData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mitigations:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mitigation successfully linked to control.",
          });
        },
        onError: (error) => {
          setIsLinkingMitigation(false);
          console.error("Error linking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to link mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreateMitigationMapping, control.id, environment, toast]
  );

  const handleUnlinkMitigation = useCallback(
    (mitigationId: string) => {
      if (!control.id) return;

      setIsUnlinkingMitigation(true);

      commitDeleteMitigationMapping({
        variables: {
          input: {
            controlId: control.id,
            mitigationId: mitigationId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingMitigation(false);

          if (errors) {
            console.error("Error unlinking mitigation:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink mitigation. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked mitigations data
          fetchQuery<ControlLinkedMitigationsQuery>(
            environment,
            linkedMitigationsQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedMitigationsData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked mitigations:", error);
            },
          });

          toast({
            title: "Success",
            description: "Mitigation successfully unlinked from control.",
          });
        },
        onError: (error) => {
          setIsUnlinkingMitigation(false);
          console.error("Error unlinking mitigation:", error);
          toast({
            title: "Error",
            description: "Failed to unlink mitigation. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeleteMitigationMapping, control.id, environment, toast]
  );

  const handleOpenMitigationMappingDialog = useCallback(() => {
    loadMitigationsData();
    setIsMitigationMappingDialogOpen(true);
  }, [loadMitigationsData]);

  // Load initial linked policies data
  useEffect(() => {
    if (control.id) {
      setIsLoadingPolicies(true);
      fetchQuery<ControlLinkedPoliciesQuery>(environment, linkedPoliciesQuery, {
        controlId: control.id,
      }).subscribe({
        next: (data) => {
          setLinkedPoliciesData(data);
          setIsLoadingPolicies(false);
        },
        error: (error: Error) => {
          console.error("Error loading initial policies:", error);
          setIsLoadingPolicies(false);
        },
      });
    }
  }, [control.id, environment]);

  // Load policies data
  const loadPoliciesData = useCallback(() => {
    if (!organizationId || !control.id) return;

    setIsLoadingPolicies(true);

    // Fetch all policies for the organization
    fetchQuery<ControlOrganizationPoliciesQuery>(
      environment,
      organizationPoliciesQuery,
      {
        organizationId,
      }
    ).subscribe({
      next: (data) => {
        setOrganizationPoliciesData(data);
      },
      complete: () => {
        // Fetch linked policies for this control
        fetchQuery<ControlLinkedPoliciesQuery>(
          environment,
          linkedPoliciesQuery,
          {
            controlId: control.id,
          }
        ).subscribe({
          next: (data) => {
            setLinkedPoliciesData(data);
            setIsLoadingPolicies(false);
          },
          error: (error: Error) => {
            console.error("Error fetching linked policies:", error);
            setIsLoadingPolicies(false);
            toast({
              title: "Error",
              description: "Failed to load linked policies.",
              variant: "destructive",
            });
          },
        });
      },
      error: (error: Error) => {
        console.error("Error fetching organization policies:", error);
        setIsLoadingPolicies(false);
        toast({
          title: "Error",
          description: "Failed to load policies.",
          variant: "destructive",
        });
      },
    });
  }, [control.id, environment, organizationId, toast]);

  // Policy helper functions
  const getPolicies = useCallback(() => {
    if (!organizationPoliciesData?.organization?.policies?.edges) return [];
    return organizationPoliciesData.organization.policies.edges.map(
      (edge) => edge.node
    );
  }, [organizationPoliciesData]);

  const getLinkedPolicies = useCallback(() => {
    if (!linkedPoliciesData?.control?.policies?.edges) return [];
    return linkedPoliciesData.control.policies.edges.map((edge) => edge.node);
  }, [linkedPoliciesData]);

  const isPolicyLinked = useCallback(
    (policyId: string) => {
      const linkedPolicies = getLinkedPolicies();
      return linkedPolicies.some((policy) => policy.id === policyId);
    },
    [getLinkedPolicies]
  );

  const filteredPolicies = useCallback(() => {
    const policies = getPolicies();
    if (!policySearchQuery) return policies;

    return policies.filter((policy) => {
      return (
        !policySearchQuery ||
        policy.name.toLowerCase().includes(policySearchQuery.toLowerCase()) ||
        (policy.content &&
          policy.content
            .toLowerCase()
            .includes(policySearchQuery.toLowerCase()))
      );
    });
  }, [getPolicies, policySearchQuery]);

  // Policy link/unlink handlers
  const handleLinkPolicy = useCallback(
    (policyId: string) => {
      if (!control.id) return;

      setIsLinkingPolicy(true);

      commitCreatePolicyMapping({
        variables: {
          input: {
            controlId: control.id,
            policyId: policyId,
          },
        },
        onCompleted: (_, errors) => {
          setIsLinkingPolicy(false);

          if (errors) {
            console.error("Error linking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to link policy. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked policies data
          fetchQuery<ControlLinkedPoliciesQuery>(
            environment,
            linkedPoliciesQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedPoliciesData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked policies:", error);
            },
          });

          toast({
            title: "Success",
            description: "Policy successfully linked to control.",
          });
        },
        onError: (error) => {
          setIsLinkingPolicy(false);
          console.error("Error linking policy:", error);
          toast({
            title: "Error",
            description: "Failed to link policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitCreatePolicyMapping, control.id, environment, toast]
  );

  const handleUnlinkPolicy = useCallback(
    (policyId: string) => {
      if (!control.id) return;

      setIsUnlinkingPolicy(true);

      commitDeletePolicyMapping({
        variables: {
          input: {
            controlId: control.id,
            policyId: policyId,
          },
        },
        onCompleted: (_, errors) => {
          setIsUnlinkingPolicy(false);

          if (errors) {
            console.error("Error unlinking policy:", errors);
            toast({
              title: "Error",
              description: "Failed to unlink policy. Please try again.",
              variant: "destructive",
            });
            return;
          }

          // Refresh linked policies data
          fetchQuery<ControlLinkedPoliciesQuery>(
            environment,
            linkedPoliciesQuery,
            {
              controlId: control.id,
            }
          ).subscribe({
            next: (data) => {
              setLinkedPoliciesData(data);
            },
            error: (error: Error) => {
              console.error("Error refreshing linked policies:", error);
            },
          });

          toast({
            title: "Success",
            description: "Policy successfully unlinked from control.",
          });
        },
        onError: (error) => {
          setIsUnlinkingPolicy(false);
          console.error("Error unlinking policy:", error);
          toast({
            title: "Error",
            description: "Failed to unlink policy. Please try again.",
            variant: "destructive",
          });
        },
      });
    },
    [commitDeletePolicyMapping, control.id, environment, toast]
  );

  const handleOpenPolicyMappingDialog = useCallback(() => {
    loadPoliciesData();
    setIsPolicyMappingDialogOpen(true);
  }, [loadPoliciesData]);

  // UI helper functions
  const formatImportance = (importance: string | undefined): string => {
    if (!importance) return "Unknown";

    switch (importance) {
      case "LOW":
        return "Low";
      case "MEDIUM":
        return "Medium";
      case "HIGH":
        return "High";
      case "CRITICAL":
        return "Critical";
      default:
        return importance;
    }
  };

  const formatState = (state: string | undefined): string => {
    if (!state) return "Unknown";

    switch (state) {
      case "NOT_STARTED":
        return "Not Started";
      case "IN_PROGRESS":
        return "In Progress";
      case "IMPLEMENTED":
        return "Implemented";
      case "NOT_APPLICABLE":
        return "Not Applicable";
      default:
        return state;
    }
  };

  const getImportanceColor = (importance: string | undefined): string => {
    if (!importance) return "bg-secondary-bg text-secondary";

    switch (importance) {
      case "LOW":
        return "bg-success-bg text-success";
      case "MEDIUM":
        return "bg-info-bg text-info";
      case "HIGH":
        return "bg-warning-bg text-warning";
      case "CRITICAL":
        return "bg-danger-bg text-danger";
      default:
        return "bg-secondary-bg text-secondary";
    }
  };

  const getStateColor = (state: string | undefined): string => {
    if (!state) return "bg-secondary-bg text-secondary";

    switch (state) {
      case "NOT_STARTED":
        return "bg-secondary-bg text-secondary";
      case "IN_PROGRESS":
        return "bg-info-bg text-info";
      case "IMPLEMENTED":
        return "bg-success-bg text-success";
      case "NOT_APPLICABLE":
        return "bg-warning-bg text-warning";
      default:
        return "bg-secondary-bg text-secondary";
    }
  };

  return (
    <div className="w-auto p-5 flex items-start gap-5">
      <div className="font-mono text-lg px-1 py-0.25 rounded-sm bg-active-bg border-mid-b border font-bold">
        {control.referenceId}
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-medium">{control.name}</h2>

        {/* Control Description */}
        {control.description && (
          <div className="mt-4 text-tertiary">{control.description}</div>
        )}

        {/* Security Measures Section */}
        <div className="mt-8">
          {/* Mitigation Mapping Dialog */}
          <Dialog
            open={isMitigationMappingDialogOpen}
            onOpenChange={setIsMitigationMappingDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Link Security Measures to Control</DialogTitle>
                <DialogDescription>
                  Search and select security measures to link to this control.
                  This helps track which security measures address this control.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search security measures by name or description..."
                      value={mitigationSearchQuery}
                      onChange={(e) => setMitigationSearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
                <div className="w-[200px]">
                  <Select
                    value={categoryFilter || "all"}
                    onValueChange={(value) =>
                      setCategoryFilter(value === "all" ? null : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {getMitigationCategories().map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isLoadingMitigations ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-info" />
                    <span className="ml-2">Loading security measures...</span>
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {filteredMitigations().length === 0 ? (
                      <div className="text-center py-8 text-secondary">
                        No security measures found. Try adjusting your search or
                        select a different category.
                      </div>
                    ) : (
                      <table className="w-full bg-level-1">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">
                              Importance
                            </th>
                            <th className="py-3 px-4 font-medium">State</th>
                            <th className="py-3 px-4 font-medium text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMitigations().map((mitigation) => {
                            const isLinked = isMitigationLinked(mitigation.id);
                            return (
                              <tr
                                key={mitigation.id}
                                className="border-b hover:bg-invert-bg"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium">
                                    {mitigation.name}
                                  </div>
                                  {mitigation.description && (
                                    <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                                      {mitigation.description}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${getImportanceColor(
                                      mitigation.importance
                                    )} inline-block`}
                                  >
                                    {formatImportance(mitigation.importance)}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                                      mitigation.state
                                    )} inline-block`}
                                  >
                                    {formatState(mitigation.state)}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isLinked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnlinkMitigation(mitigation.id)
                                      }
                                      disabled={isUnlinkingMitigation}
                                      className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                                    >
                                      {isUnlinkingMitigation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Unlink</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleLinkMitigation(mitigation.id)
                                      }
                                      disabled={isLinkingMitigation}
                                      className="text-xs h-7  text-info border-info-b hover:bg-h-info-bg"
                                    >
                                      {isLinkingMitigation ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <LinkIcon className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Link</span>
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button onClick={() => setIsMitigationMappingDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Linked Mitigations List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-secondary">
                Security measures
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenMitigationMappingDialog}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Security Measures</span>
              </Button>
            </div>

            {isLoadingMitigations ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-info" />
                <span className="ml-2">Loading security measures...</span>
              </div>
            ) : linkedMitigationsData?.control?.mitigations?.edges &&
              linkedMitigationsData.control.mitigations.edges.length > 0 ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Importance</th>
                      <th className="py-3 px-4 font-medium">State</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLinkedMitigations().map((mitigation) => (
                      <tr
                        key={mitigation.id}
                        className="border-b hover:bg-invert-bg"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{mitigation.name}</div>
                          {mitigation.description && (
                            <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                              {mitigation.description}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getImportanceColor(
                              mitigation.importance
                            )} inline-block`}
                          >
                            {formatImportance(mitigation.importance)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getStateColor(
                              mitigation.state
                            )} inline-block`}
                          >
                            {formatState(mitigation.state)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-xs h-7"
                            >
                              <Link
                                to={`/organizations/${organizationId}/mitigations/${mitigation.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUnlinkMitigation(mitigation.id)
                              }
                              disabled={isUnlinkingMitigation}
                              className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                            >
                              Unlink
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary border rounded-md">
                No security measures linked to this control yet. Click
                &quot;Link Security Measures&quot; to connect some.
              </div>
            )}
          </div>
        </div>

        {/* Policies Section */}
        <div className="mt-8">
          {/* Policy Mapping Dialog */}
          <Dialog
            open={isPolicyMappingDialogOpen}
            onOpenChange={setIsPolicyMappingDialogOpen}
          >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle>Link Policies to Control</DialogTitle>
                <DialogDescription>
                  Search and select policies to link to this control. This helps
                  track which policies address this control.
                </DialogDescription>
              </DialogHeader>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-tertiary" />
                    <Input
                      placeholder="Search policies by name or content..."
                      value={policySearchQuery}
                      onChange={(e) => setPolicySearchQuery(e.target.value)}
                      className="w-full pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                {isLoadingPolicies ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 animate-spin text-info" />
                    <span className="ml-2">Loading policies...</span>
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto pr-2">
                    {filteredPolicies().length === 0 ? (
                      <div className="text-center py-8 text-secondary">
                        No policies found. Try adjusting your search.
                      </div>
                    ) : (
                      <table className="w-full bg-level-1">
                        <thead className="sticky top-0 bg-white">
                          <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                            <th className="py-3 px-4 font-medium">Name</th>
                            <th className="py-3 px-4 font-medium">Status</th>
                            <th className="py-3 px-4 font-medium">
                              Review Date
                            </th>
                            <th className="py-3 px-4 font-medium text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredPolicies().map((policy) => {
                            const isLinked = isPolicyLinked(policy.id);
                            return (
                              <tr
                                key={policy.id}
                                className="border-b hover:bg-invert-bg"
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium">
                                    {policy.name}
                                  </div>
                                  {policy.content && (
                                    <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                                      {policy.content}
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div
                                    className={`px-2 py-0.5 rounded-full text-xs ${
                                      policy.status === "ACTIVE"
                                        ? "bg-success-bg text-success"
                                        : "bg-secondary-bg text-secondary"
                                    } inline-block`}
                                  >
                                    {policy.status}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  {policy.reviewDate
                                    ? new Date(
                                        policy.reviewDate
                                      ).toLocaleDateString()
                                    : "Not set"}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  {isLinked ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleUnlinkPolicy(policy.id)
                                      }
                                      disabled={isUnlinkingPolicy}
                                      className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                                    >
                                      {isUnlinkingPolicy ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <X className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Unlink</span>
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      onClick={() =>
                                        handleLinkPolicy(policy.id)
                                      }
                                      disabled={isLinkingPolicy}
                                      className="text-xs h-7 text-info border-info-b hover:bg-h-info-bg"
                                    >
                                      {isLinkingPolicy ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <LinkIcon className="w-4 h-4" />
                                      )}
                                      <span className="ml-1">Link</span>
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="mt-4">
                <Button onClick={() => setIsPolicyMappingDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Linked Policies List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-secondary">Policies</h3>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                onClick={handleOpenPolicyMappingDialog}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Link Policies</span>
              </Button>
            </div>

            {isLoadingPolicies ? (
              <div className="flex items-center justify-center h-24">
                <Loader2 className="w-6 h-6 animate-spin text-info" />
                <span className="ml-2">Loading policies...</span>
              </div>
            ) : linkedPoliciesData?.control?.policies?.edges &&
              linkedPoliciesData.control.policies.edges.length > 0 ? (
              <div className="overflow-x-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-secondary bg-invert-bg">
                      <th className="py-3 px-4 font-medium">Name</th>
                      <th className="py-3 px-4 font-medium">Status</th>
                      <th className="py-3 px-4 font-medium">Review Date</th>
                      <th className="py-3 px-4 font-medium text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getLinkedPolicies().map((policy) => (
                      <tr
                        key={policy.id}
                        className="border-b hover:bg-invert-bg"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium">{policy.name}</div>
                          {policy.content && (
                            <div className="text-xs text-secondary line-clamp-1 mt-0.5">
                              {policy.content}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              policy.status === "ACTIVE"
                                ? "bg-success-bg text-success"
                                : "bg-secondary-bg text-secondary"
                            } inline-block`}
                          >
                            {policy.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {policy.reviewDate
                            ? new Date(policy.reviewDate).toLocaleDateString()
                            : "Not set"}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="text-xs h-7"
                            >
                              <Link
                                to={`/organizations/${organizationId}/policies/${policy.id}`}
                              >
                                View
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUnlinkPolicy(policy.id)}
                              disabled={isUnlinkingPolicy}
                              className="text-xs h-7 text-danger border-danger-b hover:bg-h-danger-bg"
                            >
                              Unlink
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary border rounded-md">
                No policies linked to this control yet. Click &quot;Link
                Policies&quot; to connect some.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
