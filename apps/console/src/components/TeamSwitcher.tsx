"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import { graphql, useFragment } from "react-relay";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Link } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  TeamSwitcher_organizations$key,
  TeamSwitcher_organizations$data,
} from "./__generated__/TeamSwitcher_organizations.graphql";

export const teamSwitcherFragment = graphql`
  fragment TeamSwitcher_organizations on User {
    organizations(first: 25) @connection(key: "TeamSwitcher_organizations") {
      __id
      edges {
        node {
          id
          name
          logoUrl
        }
      }
    }
  }
`;

// Extended type to include plan field until Relay compiler generates the types
type Organization =
  TeamSwitcher_organizations$data["organizations"]["edges"][0]["node"] & {
    plan?: string;
  };

export function TeamSwitcher({
  organizations,
}: {
  organizations: TeamSwitcher_organizations$key;
}) {
  const { isMobile } = useSidebar();
  const data = useFragment(teamSwitcherFragment, organizations);
  const { currentOrganization, setCurrentOrganization } = useOrganization();

  useEffect(() => {
    console.log(data.organizations);

    if (
      data.organizations &&
      data.organizations.edges.length > 0 &&
      !currentOrganization
    ) {
      // Type assertion to include plan field
      setCurrentOrganization(data.organizations.edges[0].node);
    }
  }, [data.organizations, currentOrganization, setCurrentOrganization]);

  // If no organizations or data is still loading
  if (!currentOrganization) {
    return null;
  }

  // Convert logoUrl to a React component
  const LogoComponent = ({
    org,
    className,
  }: {
    org: Organization;
    className?: string;
  }) => {
    if (org.logoUrl) {
      return <img src={org.logoUrl} alt={org.name} className={className} />;
    }
    return null;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LogoComponent org={currentOrganization} className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentOrganization.name}
                </span>
                <span className="truncate text-xs">Free</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {data.organizations.edges.map((edge, index) => (
              <DropdownMenuItem
                key={edge.node.id}
                onClick={() => setCurrentOrganization(edge.node)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <LogoComponent org={edge.node} className="size-4 shrink-0" />
                </div>
                {edge.node.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/organizations/create"
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add organization
                </div>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
