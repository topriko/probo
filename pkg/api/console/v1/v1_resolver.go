package console_v1

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.63

import (
	"context"
	"fmt"

	"github.com/getprobo/probo/pkg/api/console/v1/schema"
	"github.com/getprobo/probo/pkg/api/console/v1/types"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/getprobo/probo/pkg/probo/coredata"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// StateTransisions is the resolver for the stateTransisions field.
func (r *controlResolver) StateTransisions(ctx context.Context, obj *types.Control, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.ControlStateTransitionConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListControlStateTransitions(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list control tasks: %w", err)
	}

	return types.NewControlStateTransitionConnection(page), nil
}

// Tasks is the resolver for the tasks field.
func (r *controlResolver) Tasks(ctx context.Context, obj *types.Control, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.TaskConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListControlTasks(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list control tasks: %w", err)
	}

	return types.NewTaskConnection(page), nil
}

// StateTransisions is the resolver for the stateTransisions field.
func (r *evidenceResolver) StateTransisions(ctx context.Context, obj *types.Evidence, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.EvidenceStateTransitionConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListEvidenceStateTransitions(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list evidence state transitions: %w", err)
	}

	return types.NewEvidenceStateTransitionConnection(page), nil
}

// Controls is the resolver for the controls field.
func (r *frameworkResolver) Controls(ctx context.Context, obj *types.Framework, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.ControlConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListFrameworkControls(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list framework controls: %w", err)
	}

	return types.NewControlConnection(page), nil
}

// CreateVendor is the resolver for the createVendor field.
func (r *mutationResolver) CreateVendor(ctx context.Context, input types.CreateVendorInput) (*types.CreateVendorPayload, error) {
	vendor, err := r.proboSvc.CreateVendor(ctx, probo.CreateVendorRequest{
		OrganizationID:       input.OrganizationID,
		Name:                 input.Name,
		Description:          input.Description,
		ServiceStartAt:       input.ServiceStartAt,
		ServiceTerminationAt: input.ServiceTerminationAt,
		ServiceCriticality:   input.ServiceCriticality,
		RiskTier:             input.RiskTier,
		StatusPageURL:        input.StatusPageURL,
		TermsOfServiceURL:    input.TermsOfServiceURL,
		PrivacyPolicyURL:     input.PrivacyPolicyURL,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot create vendor: %w", err)
	}
	return &types.CreateVendorPayload{
		VendorEdge: types.NewVendorEdge(vendor),
	}, nil
}

// UpdateVendor is the resolver for the updateVendor field.
func (r *mutationResolver) UpdateVendor(ctx context.Context, input types.UpdateVendorInput) (*types.Vendor, error) {
	vendor, err := r.proboSvc.UpdateVendor(ctx, probo.UpdateVendorRequest{
		ID:                   input.ID,
		ExpectedVersion:      input.ExpectedVersion,
		Name:                 input.Name,
		Description:          input.Description,
		ServiceStartAt:       input.ServiceStartAt,
		ServiceTerminationAt: input.ServiceTerminationAt,
		ServiceCriticality:   input.ServiceCriticality,
		RiskTier:             input.RiskTier,
		StatusPageURL:        input.StatusPageURL,
		TermsOfServiceURL:    input.TermsOfServiceURL,
		PrivacyPolicyURL:     input.PrivacyPolicyURL,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update vendor: %w", err)
	}

	return types.NewVendor(vendor), nil
}

// DeleteVendor is the resolver for the deleteVendor field.
func (r *mutationResolver) DeleteVendor(ctx context.Context, input types.DeleteVendorInput) (*types.DeleteVendorPayload, error) {
	err := r.proboSvc.DeleteVendor(ctx, input.VendorID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete vendor: %w", err)
	}

	return &types.DeleteVendorPayload{
		DeletedVendorID: input.VendorID,
	}, nil
}

// CreatePeople is the resolver for the createPeople field.
func (r *mutationResolver) CreatePeople(ctx context.Context, input types.CreatePeopleInput) (*types.CreatePeoplePayload, error) {
	people, err := r.proboSvc.CreatePeople(ctx, probo.CreatePeopleRequest{
		OrganizationID:           input.OrganizationID,
		FullName:                 input.FullName,
		PrimaryEmailAddress:      input.PrimaryEmailAddress,
		AdditionalEmailAddresses: []string{},
		Kind:                     input.Kind,
	})

	if err != nil {
		return nil, fmt.Errorf("cannot create people: %w", err)
	}

	return &types.CreatePeoplePayload{
		PeopleEdge: types.NewPeopleEdge(people),
	}, nil
}

// UpdatePeople is the resolver for the updatePeople field.
func (r *mutationResolver) UpdatePeople(ctx context.Context, input types.UpdatePeopleInput) (*types.People, error) {
	people, err := r.proboSvc.UpdatePeople(ctx, probo.UpdatePeopleRequest{
		ID:                       input.ID,
		ExpectedVersion:          input.ExpectedVersion,
		FullName:                 input.FullName,
		PrimaryEmailAddress:      input.PrimaryEmailAddress,
		AdditionalEmailAddresses: &input.AdditionalEmailAddresses,
		Kind:                     input.Kind,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update people: %w", err)
	}

	return types.NewPeople(people), nil
}

// DeletePeople is the resolver for the deletePeople field.
func (r *mutationResolver) DeletePeople(ctx context.Context, input types.DeletePeopleInput) (*types.DeletePeoplePayload, error) {
	err := r.proboSvc.DeletePeople(ctx, input.PeopleID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete people: %w", err)
	}

	return &types.DeletePeoplePayload{
		DeletedPeopleID: input.PeopleID,
	}, nil
}

// CreateOrganization is the resolver for the createOrganization field.
func (r *mutationResolver) CreateOrganization(ctx context.Context, input types.CreateOrganizationInput) (*types.CreateOrganizationPayload, error) {
	organization, err := r.proboSvc.CreateOrganization(ctx, probo.CreateOrganizationRequest{
		Name: input.Name,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot create organization: %w", err)
	}

	err = r.usrmgrSvc.AddUserToOrganization(ctx, UserFromContext(ctx).ID, organization.ID)
	if err != nil {
		return nil, fmt.Errorf("cannot add user to organization: %w", err)
	}

	return &types.CreateOrganizationPayload{
		OrganizationEdge: types.NewOrganizationEdge(organization),
	}, nil
}

// DeleteOrganization is the resolver for the deleteOrganization field.
func (r *mutationResolver) DeleteOrganization(ctx context.Context, input types.DeleteOrganizationInput) (*types.DeleteOrganizationPayload, error) {
	panic(fmt.Errorf("not implemented: DeleteOrganization - deleteOrganization"))
}

// Frameworks is the resolver for the frameworks field.
func (r *organizationResolver) Frameworks(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.FrameworkConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListOrganizationFrameworks(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization frameworks: %w", err)
	}

	return types.NewFrameworkConnection(page), nil
}

// Vendors is the resolver for the vendors field.
func (r *organizationResolver) Vendors(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.VendorConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListOrganizationVendors(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization vendors: %w", err)
	}

	return types.NewVendorConnection(page), nil
}

// Peoples is the resolver for the peoples field.
func (r *organizationResolver) Peoples(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.PeopleConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListOrganizationPeoples(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization peoples: %w", err)
	}

	return types.NewPeopleConnection(page), nil
}

// Node is the resolver for the node field.
func (r *queryResolver) Node(ctx context.Context, id gid.GID) (types.Node, error) {
	switch id.EntityType() {
	case coredata.OrganizationEntityType:
		organization, err := r.proboSvc.GetOrganization(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewOrganization(organization), nil
	case coredata.PeopleEntityType:
		people, err := r.proboSvc.GetPeople(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewPeople(people), nil
	case coredata.VendorEntityType:
		vendor, err := r.proboSvc.GetVendor(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewVendor(vendor), nil
	case coredata.FrameworkEntityType:
		framework, err := r.proboSvc.GetFramework(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewFramework(framework), nil
	case coredata.ControlEntityType:
		control, err := r.proboSvc.GetControl(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewControl(control), nil
	case coredata.TaskEntityType:
		task, err := r.proboSvc.GetTask(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewTask(task), nil
	case coredata.EvidenceEntityType:
		evidence, err := r.proboSvc.GetEvidence(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewEvidence(evidence), nil
	default:
	}

	return nil, gqlerror.Errorf("node %q not found", id)
}

// Viewer is the resolver for the viewer field.
func (r *queryResolver) Viewer(ctx context.Context) (*types.User, error) {
	user := UserFromContext(ctx)
	return &types.User{
		ID:        user.ID,
		Email:     user.EmailAddress,
		FullName:  user.FullName,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}, nil
}

// StateTransisions is the resolver for the stateTransisions field.
func (r *taskResolver) StateTransisions(ctx context.Context, obj *types.Task, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.TaskStateTransitionConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListTaskStateTransitions(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list control tasks: %w", err)
	}

	return types.NewTaskStateTransitionConnection(page), nil
}

// Evidences is the resolver for the evidences field.
func (r *taskResolver) Evidences(ctx context.Context, obj *types.Task, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.EvidenceConnection, error) {
	cursor := types.NewCursor(first, after, last, before)

	page, err := r.proboSvc.ListTaskEvidences(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization frameworks: %w", err)
	}

	return types.NewEvidenceConnection(page), nil
}

// Organizations is the resolver for the organizations field.
func (r *userResolver) Organizations(ctx context.Context, obj *types.User, first *int, after *page.CursorKey, last *int, before *page.CursorKey) (*types.OrganizationConnection, error) {
	// Get the user's organization IDs
	organizationIDs, err := r.usrmgrSvc.GetUserOrganizations(ctx, obj.ID)
	if err != nil {
		return nil, fmt.Errorf("failed to get user organizations: %w", err)
	}

	// If the user doesn't have any organizations, return an empty connection
	if len(organizationIDs) == 0 {
		return &types.OrganizationConnection{
			Edges:    []*types.OrganizationEdge{},
			PageInfo: &types.PageInfo{},
		}, nil
	}

	// Get the organization details for each organization ID
	var edges []*types.OrganizationEdge
	for _, organizationID := range organizationIDs {
		organization, err := r.proboSvc.GetOrganization(ctx, organizationID)
		if err != nil {
			return nil, fmt.Errorf("failed to get organization details: %w", err)
		}
		edges = append(edges, types.NewOrganizationEdge(organization))
	}

	return &types.OrganizationConnection{
		Edges:    edges,
		PageInfo: &types.PageInfo{},
	}, nil
}

// Control returns schema.ControlResolver implementation.
func (r *Resolver) Control() schema.ControlResolver { return &controlResolver{r} }

// Evidence returns schema.EvidenceResolver implementation.
func (r *Resolver) Evidence() schema.EvidenceResolver { return &evidenceResolver{r} }

// Framework returns schema.FrameworkResolver implementation.
func (r *Resolver) Framework() schema.FrameworkResolver { return &frameworkResolver{r} }

// Mutation returns schema.MutationResolver implementation.
func (r *Resolver) Mutation() schema.MutationResolver { return &mutationResolver{r} }

// Organization returns schema.OrganizationResolver implementation.
func (r *Resolver) Organization() schema.OrganizationResolver { return &organizationResolver{r} }

// Query returns schema.QueryResolver implementation.
func (r *Resolver) Query() schema.QueryResolver { return &queryResolver{r} }

// Task returns schema.TaskResolver implementation.
func (r *Resolver) Task() schema.TaskResolver { return &taskResolver{r} }

// User returns schema.UserResolver implementation.
func (r *Resolver) User() schema.UserResolver { return &userResolver{r} }

type controlResolver struct{ *Resolver }
type evidenceResolver struct{ *Resolver }
type frameworkResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type organizationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type taskResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
