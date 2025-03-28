import { NavLink, Outlet, Route, Routes, To, useParams } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactNode, Suspense } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { graphql, useLazyLoadQuery } from "react-relay";
import { cn } from "@/lib/utils";
import { OrganizationLayoutOrganizationQuery } from "./__generated__/OrganizationLayoutOrganizationQuery.graphql";
import { OrganizationLayoutBreadcrumbControlOverviewQuery } from "./__generated__/OrganizationLayoutBreadcrumbControlOverviewQuery.graphql";
import { OrganizationLayoutBreadcrumbFrameworkOverviewQuery } from "./__generated__/OrganizationLayoutBreadcrumbFrameworkOverviewQuery.graphql";
import { OrganizationLayoutBreadcrumbPeopleOverviewQuery } from "./__generated__/OrganizationLayoutBreadcrumbPeopleOverviewQuery.graphql";
import { OrganizationLayoutBreadcrumbPolicyOverviewQuery } from "./__generated__/OrganizationLayoutBreadcrumbPolicyOverviewQuery.graphql";
import { OrganizationLayoutBreadcrumbVendorOverviewQuery } from "./__generated__/OrganizationLayoutBreadcrumbVendorOverviewQuery.graphql";

const BreadCrumbNavLink = ({
  to,
  children,
  className,
}: {
  to: To;
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <BreadcrumbLink asChild>
      <NavLink to={to} end>
        {({ isActive }) => (
          <BreadcrumbPage
            className={cn(
              "text-gray-300",
              isActive && "text-gray-700",
              className
            )}
          >
            {children}
          </BreadcrumbPage>
        )}
      </NavLink>
    </BreadcrumbLink>
  );
};

function BreadcrumbHome() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadCrumbNavLink to="/">Home</BreadCrumbNavLink>
        </BreadcrumbItem>
        <Outlet />
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadCrumbOrganization() {
  const { organizationId } = useParams();

  const data = useLazyLoadQuery<OrganizationLayoutOrganizationQuery>(
    graphql`
      query OrganizationLayoutOrganizationQuery($organizationId: ID!) {
        organization: node(id: $organizationId) {
          ... on Organization {
            name
          }
        }
      }
    `,
    { organizationId: organizationId! },
    { fetchPolicy: "store-or-network" }
  );

  return (
    <Breadcrumb className="select-none">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadCrumbNavLink to={`/organizations/${organizationId}`}>
            {data.organization?.name || "Home"}
          </BreadCrumbNavLink>
        </BreadcrumbItem>
        <Outlet />
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbFrameworkList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink to={`/organizations/${organizationId}/frameworks`}>
          Frameworks
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreateFramework() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbFrameworkOverview() {
  const { organizationId, frameworkId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationLayoutBreadcrumbFrameworkOverviewQuery>(
      graphql`
        query OrganizationLayoutBreadcrumbFrameworkOverviewQuery(
          $frameworkId: ID!
        ) {
          framework: node(id: $frameworkId) {
            id
            ... on Framework {
              name
            }
          }
        }
      `,
      { frameworkId: frameworkId! }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink
          to={`/organizations/${organizationId}/frameworks/${frameworkId}`}
        >
          {data.framework?.name}
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbUpdateFramework() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbVendorList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink to={`/organizations/${organizationId}/vendors`}>
          Vendors
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbVendorOverview() {
  const { organizationId, vendorId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationLayoutBreadcrumbVendorOverviewQuery>(
      graphql`
        query OrganizationLayoutBreadcrumbVendorOverviewQuery($vendorId: ID!) {
          vendor: node(id: $vendorId) {
            id
            ... on Vendor {
              name
            }
          }
        }
      `,
      { vendorId: vendorId! },
      { fetchPolicy: "store-or-network" }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink
          to={`/organizations/${organizationId}/vendors/${data.vendor.id}`}
        >
          {data.vendor.name}
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbPeopleList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink to={`/organizations/${organizationId}/people`}>
          People
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreatePeople() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPeopleOverview() {
  const { organizationId, peopleId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationLayoutBreadcrumbPeopleOverviewQuery>(
      graphql`
        query OrganizationLayoutBreadcrumbPeopleOverviewQuery($peopleId: ID!) {
          people: node(id: $peopleId) {
            id
            ... on People {
              fullName
            }
          }
        }
      `,
      { peopleId: peopleId! },
      { fetchPolicy: "store-or-network" }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink
          to={`/organizations/${organizationId}/people/${data.people.id}`}
        >
          {data.people.fullName}
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbControlOverview() {
  const { organizationId, frameworkId, controlId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationLayoutBreadcrumbControlOverviewQuery>(
      graphql`
        query OrganizationLayoutBreadcrumbControlOverviewQuery(
          $controlId: ID!
        ) {
          control: node(id: $controlId) {
            id
            ... on Control {
              name
            }
          }
        }
      `,
      { controlId: controlId! }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink
          to={`/organizations/${organizationId}/frameworks/${frameworkId}/controls/${controlId}`}
        >
          {data.control?.name}
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreateControl() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Control</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbUpdateControl() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update Control</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPolicyList() {
  const { organizationId } = useParams();
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink to={`/organizations/${organizationId}/policies`}>
          Policies
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbCreatePolicy() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Create Policy</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

function BreadcrumbPolicyOverview() {
  const { organizationId, policyId } = useParams();
  const data =
    useLazyLoadQuery<OrganizationLayoutBreadcrumbPolicyOverviewQuery>(
      graphql`
        query OrganizationLayoutBreadcrumbPolicyOverviewQuery($policyId: ID!) {
          policy: node(id: $policyId) {
            id
            ... on Policy {
              name
            }
          }
        }
      `,
      { policyId: policyId! },
      { fetchPolicy: "store-or-network" }
    );

  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadCrumbNavLink
          to={`/organizations/${organizationId}/policies/${policyId}`}
        >
          {data.policy?.name}
        </BreadCrumbNavLink>
      </BreadcrumbItem>
      <Outlet />
    </>
  );
}

function BreadcrumbUpdatePolicy() {
  return (
    <>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Update</BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );
}

export default function OrganizationLayout() {
  return (
    <SidebarProvider>
      <Suspense>
        <AppSidebar className="p-4" />
      </Suspense>
      <SidebarInset>
        <div className="mx-auto w-lg md:w-xl lg:w-3xl xl:w-4xl 2xl:w-5xl p-8">
          <header className="flex shrink-0 items-center gap-2">
            <Routes>
              <Route
                element={
                  <Suspense>
                    <BreadCrumbOrganization />
                  </Suspense>
                }
              >
                <Route path="frameworks" element={<BreadcrumbFrameworkList />}>
                  <Route
                    path=":frameworkId"
                    element={
                      <Suspense>
                        <BreadcrumbFrameworkOverview />
                      </Suspense>
                    }
                  >
                    <Route
                      path="controls/create"
                      element={<BreadcrumbCreateControl />}
                    />
                    <Route
                      path="controls/:controlId"
                      element={
                        <Suspense>
                          <BreadcrumbControlOverview />
                        </Suspense>
                      }
                    >
                      <Route
                        path="update"
                        element={<BreadcrumbUpdateControl />}
                      />
                    </Route>
                    <Route
                      path="update"
                      element={<BreadcrumbUpdateFramework />}
                    />
                  </Route>
                  <Route
                    path="create"
                    element={<BreadcrumbCreateFramework />}
                  />
                </Route>
                <Route path="people" element={<BreadcrumbPeopleList />}>
                  <Route
                    path=":peopleId"
                    element={
                      <Suspense>
                        <BreadcrumbPeopleOverview />
                      </Suspense>
                    }
                  />
                  <Route path="create" element={<BreadcrumbCreatePeople />} />
                </Route>
                <Route path="vendors" element={<BreadcrumbVendorList />}>
                  <Route
                    path=":vendorId"
                    element={
                      <Suspense>
                        <BreadcrumbVendorOverview />
                      </Suspense>
                    }
                  />
                </Route>
                <Route path="policies" element={<BreadcrumbPolicyList />}>
                  <Route
                    path=":policyId"
                    element={
                      <Suspense>
                        <BreadcrumbPolicyOverview />
                      </Suspense>
                    }
                  >
                    <Route path="update" element={<BreadcrumbUpdatePolicy />} />
                  </Route>
                  <Route path="create" element={<BreadcrumbCreatePolicy />} />
                </Route>
                <Route
                  path="settings"
                  element={
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  }
                />
              </Route>

              <Route path="*" element={<BreadcrumbHome />}>
                <Route
                  path="create"
                  element={
                    <>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Create Organization</BreadcrumbPage>
                      </BreadcrumbItem>
                    </>
                  }
                />
              </Route>
            </Routes>
          </header>
          <div className="mt-7 w-full">
            <Outlet />
          </div>
        </div>
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
