package console_v1

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.66

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/probo"
	"github.com/getprobo/probo/pkg/server/api/console/v1/schema"
	"github.com/getprobo/probo/pkg/server/api/console/v1/types"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

// FileURL is the resolver for the fileUrl field.
func (r *evidenceResolver) FileURL(ctx context.Context, obj *types.Evidence) (*string, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	if obj.Type == coredata.EvidenceTypeLink {
		return obj.URL, nil
	}

	fileURL, err := svc.Evidences.GenerateFileURL(ctx, obj.ID, 15*time.Minute)
	if err != nil {
		return nil, fmt.Errorf("cannot generate file URL: %w", err)
	}

	result := *fileURL
	return &result, nil
}

// Controls is the resolver for the controls field.
func (r *frameworkResolver) Controls(ctx context.Context, obj *types.Framework, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.ControlOrderBy) (*types.ControlConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.ControlOrderField]{
		Field:     coredata.ControlOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.ControlOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Controls.ListForFrameworkID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list controls: %w", err)
	}

	return types.NewControlConnection(page), nil
}

// Tasks is the resolver for the tasks field.
func (r *mitigationResolver) Tasks(ctx context.Context, obj *types.Mitigation, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.TaskOrderBy) (*types.TaskConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.TaskOrderField]{
		Field:     coredata.TaskOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.TaskOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Tasks.ListForMitigationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list mitigation tasks: %w", err)
	}

	return types.NewTaskConnection(page), nil
}

// CreateOrganization is the resolver for the createOrganization field.
func (r *mutationResolver) CreateOrganization(ctx context.Context, input types.CreateOrganizationInput) (*types.CreateOrganizationPayload, error) {
	svc := r.proboSvc.WithTenant(gid.NewTenantID())

	organization, err := svc.Organizations.Create(ctx, probo.CreateOrganizationRequest{
		Name: input.Name,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot create organization: %w", err)
	}

	err = r.usrmgrSvc.EnrollUserInOrganization(ctx, UserFromContext(ctx).ID, organization.ID)
	if err != nil {
		return nil, fmt.Errorf("cannot add user to organization: %w", err)
	}

	tenantIDs, _ := ctx.Value(userTenantContextKey).(*[]gid.TenantID)
	*tenantIDs = append(*tenantIDs, organization.ID.TenantID())

	return &types.CreateOrganizationPayload{
		OrganizationEdge: types.NewOrganizationEdge(organization, coredata.OrganizationOrderFieldCreatedAt),
	}, nil
}

// UpdateOrganization is the resolver for the updateOrganization field.
func (r *mutationResolver) UpdateOrganization(ctx context.Context, input types.UpdateOrganizationInput) (*types.UpdateOrganizationPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	req := probo.UpdateOrganizationRequest{
		ID:   input.OrganizationID,
		Name: input.Name,
	}

	if input.Logo != nil {
		req.File = input.Logo.File
	}

	organization, err := svc.Organizations.Update(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("cannot update organization: %w", err)
	}

	return &types.UpdateOrganizationPayload{
		Organization: types.NewOrganization(organization),
	}, nil
}

// DeleteOrganization is the resolver for the deleteOrganization field.
func (r *mutationResolver) DeleteOrganization(ctx context.Context, input types.DeleteOrganizationInput) (*types.DeleteOrganizationPayload, error) {
	panic(fmt.Errorf("not implemented: DeleteOrganization - deleteOrganization"))
}

// ConfirmEmail is the resolver for the confirmEmail field.
func (r *mutationResolver) ConfirmEmail(ctx context.Context, input types.ConfirmEmailInput) (*types.ConfirmEmailPayload, error) {
	err := r.usrmgrSvc.ConfirmEmail(ctx, input.Token)

	if err != nil {
		return nil, err
	}

	return &types.ConfirmEmailPayload{Success: true}, nil
}

// InviteUser is the resolver for the inviteUser field.
func (r *mutationResolver) InviteUser(ctx context.Context, input types.InviteUserInput) (*types.InviteUserPayload, error) {
	user := UserFromContext(ctx)

	organizations, err := r.usrmgrSvc.ListOrganizationsForUserID(ctx, user.ID)
	if err != nil {
		panic(fmt.Errorf("failed to list organizations for user: %w", err))
	}

	for _, organization := range organizations {
		if organization.ID == input.OrganizationID {
			err := r.usrmgrSvc.InviteUser(ctx, input.OrganizationID, input.FullName, input.Email)
			if err != nil {
				return nil, err
			}

			return &types.InviteUserPayload{Success: true}, nil
		}
	}

	return nil, fmt.Errorf("organization not found")
}

// RemoveUser is the resolver for the removeUser field.
func (r *mutationResolver) RemoveUser(ctx context.Context, input types.RemoveUserInput) (*types.RemoveUserPayload, error) {
	user := UserFromContext(ctx)

	organizations, err := r.usrmgrSvc.ListOrganizationsForUserID(ctx, user.ID)
	if err != nil {
		panic(fmt.Errorf("failed to list organizations for user: %w", err))
	}

	for _, organization := range organizations {
		if organization.ID == input.OrganizationID {
			err := r.usrmgrSvc.RemoveUser(ctx, input.OrganizationID, input.UserID)
			if err != nil {
				return nil, err
			}

			return &types.RemoveUserPayload{Success: true}, nil
		}
	}

	return nil, fmt.Errorf("organization not found")
}

// CreatePeople is the resolver for the createPeople field.
func (r *mutationResolver) CreatePeople(ctx context.Context, input types.CreatePeopleInput) (*types.CreatePeoplePayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	people, err := svc.Peoples.Create(ctx, probo.CreatePeopleRequest{
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
		PeopleEdge: types.NewPeopleEdge(people, coredata.PeopleOrderFieldFullName),
	}, nil
}

// UpdatePeople is the resolver for the updatePeople field.
func (r *mutationResolver) UpdatePeople(ctx context.Context, input types.UpdatePeopleInput) (*types.UpdatePeoplePayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	people, err := svc.Peoples.Update(ctx, probo.UpdatePeopleRequest{
		ID:                       input.ID,
		FullName:                 input.FullName,
		PrimaryEmailAddress:      input.PrimaryEmailAddress,
		AdditionalEmailAddresses: &input.AdditionalEmailAddresses,
		Kind:                     input.Kind,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update people: %w", err)
	}

	return &types.UpdatePeoplePayload{
		People: types.NewPeople(people),
	}, nil
}

// DeletePeople is the resolver for the deletePeople field.
func (r *mutationResolver) DeletePeople(ctx context.Context, input types.DeletePeopleInput) (*types.DeletePeoplePayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.PeopleID.TenantID())

	err := svc.Peoples.Delete(ctx, input.PeopleID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete people: %w", err)
	}

	return &types.DeletePeoplePayload{
		DeletedPeopleID: input.PeopleID,
	}, nil
}

// CreateVendor is the resolver for the createVendor field.
func (r *mutationResolver) CreateVendor(ctx context.Context, input types.CreateVendorInput) (*types.CreateVendorPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	vendor, err := svc.Vendors.Create(ctx, probo.CreateVendorRequest{
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
		VendorEdge: types.NewVendorEdge(vendor, coredata.VendorOrderFieldName),
	}, nil
}

// UpdateVendor is the resolver for the updateVendor field.
func (r *mutationResolver) UpdateVendor(ctx context.Context, input types.UpdateVendorInput) (*types.UpdateVendorPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	vendor, err := svc.Vendors.Update(ctx, probo.UpdateVendorRequest{
		ID:                   input.ID,
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

	return &types.UpdateVendorPayload{
		Vendor: types.NewVendor(vendor),
	}, nil
}

// DeleteVendor is the resolver for the deleteVendor field.
func (r *mutationResolver) DeleteVendor(ctx context.Context, input types.DeleteVendorInput) (*types.DeleteVendorPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.VendorID.TenantID())

	err := svc.Vendors.Delete(ctx, input.VendorID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete vendor: %w", err)
	}

	return &types.DeleteVendorPayload{
		DeletedVendorID: input.VendorID,
	}, nil
}

// CreateFramework is the resolver for the createFramework field.
func (r *mutationResolver) CreateFramework(ctx context.Context, input types.CreateFrameworkInput) (*types.CreateFrameworkPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	framework, err := svc.Frameworks.Create(ctx, probo.CreateFrameworkRequest{
		OrganizationID: input.OrganizationID,
		Name:           input.Name,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot create framework: %w", err)
	}

	return &types.CreateFrameworkPayload{
		FrameworkEdge: types.NewFrameworkEdge(framework, coredata.FrameworkOrderFieldCreatedAt),
	}, nil
}

// UpdateFramework is the resolver for the updateFramework field.
func (r *mutationResolver) UpdateFramework(ctx context.Context, input types.UpdateFrameworkInput) (*types.UpdateFrameworkPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	framework, err := svc.Frameworks.Update(ctx, probo.UpdateFrameworkRequest{
		ID:          input.ID,
		Name:        input.Name,
		Description: input.Description,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update framework: %w", err)
	}

	return &types.UpdateFrameworkPayload{
		Framework: types.NewFramework(framework),
	}, nil
}

// ImportFramework is the resolver for the importFramework field.
func (r *mutationResolver) ImportFramework(ctx context.Context, input types.ImportFrameworkInput) (*types.ImportFrameworkPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	req := probo.ImportFrameworkRequest{}
	if err := json.NewDecoder(input.File.File).Decode(&req.Framework); err != nil {
		return nil, fmt.Errorf("cannot decode framework: %w", err)
	}

	framework, err := svc.Frameworks.Import(ctx, input.OrganizationID, req)
	if err != nil {
		return nil, fmt.Errorf("cannot import framework: %w", err)
	}

	return &types.ImportFrameworkPayload{
		FrameworkEdge: types.NewFrameworkEdge(framework, coredata.FrameworkOrderFieldCreatedAt),
	}, nil
}

// DeleteFramework is the resolver for the deleteFramework field.
func (r *mutationResolver) DeleteFramework(ctx context.Context, input types.DeleteFrameworkInput) (*types.DeleteFrameworkPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.FrameworkID.TenantID())

	err := svc.Frameworks.Delete(ctx, input.FrameworkID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete framework: %w", err)
	}

	return &types.DeleteFrameworkPayload{
		DeletedFrameworkID: input.FrameworkID,
	}, nil
}

// // CreateMitigation is the resolver for the createMitigation field.
func (r *mutationResolver) CreateMitigation(ctx context.Context, input types.CreateMitigationInput) (*types.CreateMitigationPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	mitigation, err := svc.Mitigations.Create(ctx, probo.CreateMitigationRequest{
		OrganizationID: input.OrganizationID,
		Name:           input.Name,
		Description:    input.Description,
		Category:       input.Category,
		Importance:     input.Importance,
	})
	if err != nil {
		panic(fmt.Errorf("cannot create mitigation: %w", err))
	}

	return &types.CreateMitigationPayload{
		MitigationEdge: types.NewMitigationEdge(mitigation, coredata.MitigationOrderFieldCreatedAt),
	}, nil
}

// UpdateMitigation is the resolver for the updateMitigation field.
func (r *mutationResolver) UpdateMitigation(ctx context.Context, input types.UpdateMitigationInput) (*types.UpdateMitigationPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	mitigation, err := svc.Mitigations.Update(ctx, probo.UpdateMitigationRequest{
		ID:          input.ID,
		Name:        input.Name,
		Description: input.Description,
		Category:    input.Category,
		Importance:  input.Importance,
		State:       input.State,
	})
	if err != nil {
		panic(fmt.Errorf("cannot update mitigation: %w", err))
	}

	return &types.UpdateMitigationPayload{
		Mitigation: types.NewMitigation(mitigation),
	}, nil
}

// ImportMitigation is the resolver for the importMitigation field.
func (r *mutationResolver) ImportMitigation(ctx context.Context, input types.ImportMitigationInput) (*types.ImportMitigationPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	var req probo.ImportMitigationRequest
	if err := json.NewDecoder(input.File.File).Decode(&req.Mitigations); err != nil {
		return nil, fmt.Errorf("cannot unmarshal mitigation: %w", err)
	}

	mitigations, err := svc.Mitigations.Import(ctx, input.OrganizationID, req)
	if err != nil {
		return nil, fmt.Errorf("cannot import mitigation: %w", err)
	}

	mitigationEdges := make([]*types.MitigationEdge, len(mitigations.Data))
	for i, mitigation := range mitigations.Data {
		mitigationEdges[i] = types.NewMitigationEdge(mitigation, coredata.MitigationOrderFieldCreatedAt)
	}

	return &types.ImportMitigationPayload{
		MitigationEdges: mitigationEdges,
	}, nil
}

// CreateTask is the resolver for the createTask field.
func (r *mutationResolver) CreateTask(ctx context.Context, input types.CreateTaskInput) (*types.CreateTaskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.MitigationID.TenantID())

	task, err := svc.Tasks.Create(ctx, probo.CreateTaskRequest{
		MitigationID: input.MitigationID,
		Name:         input.Name,
		Description:  input.Description,
		TimeEstimate: input.TimeEstimate,
	})
	if err != nil {
		panic(fmt.Errorf("cannot create task: %w", err))
	}

	return &types.CreateTaskPayload{
		TaskEdge: types.NewTaskEdge(task, coredata.TaskOrderFieldCreatedAt),
	}, nil
}

// UpdateTask is the resolver for the updateTask field.
func (r *mutationResolver) UpdateTask(ctx context.Context, input types.UpdateTaskInput) (*types.UpdateTaskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.TaskID.TenantID())

	task, err := svc.Tasks.Update(ctx, probo.UpdateTaskRequest{
		TaskID:       input.TaskID,
		Name:         input.Name,
		Description:  input.Description,
		State:        input.State,
		TimeEstimate: input.TimeEstimate,
	})
	if err != nil {
		panic(fmt.Errorf("cannot update task: %w", err))
	}

	return &types.UpdateTaskPayload{
		Task: types.NewTask(task),
	}, nil
}

// DeleteTask is the resolver for the deleteTask field.
func (r *mutationResolver) DeleteTask(ctx context.Context, input types.DeleteTaskInput) (*types.DeleteTaskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.TaskID.TenantID())

	err := svc.Tasks.Delete(ctx, input.TaskID)
	if err != nil {
		panic(fmt.Errorf("cannot delete task: %w", err))
	}

	return &types.DeleteTaskPayload{
		DeletedTaskID: input.TaskID,
	}, nil
}

// AssignTask is the resolver for the assignTask field.
func (r *mutationResolver) AssignTask(ctx context.Context, input types.AssignTaskInput) (*types.AssignTaskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.TaskID.TenantID())

	task, err := svc.Tasks.Assign(ctx, input.TaskID, input.AssignedToID)
	if err != nil {
		panic(fmt.Errorf("cannot assign task: %w", err))
	}

	return &types.AssignTaskPayload{
		Task: types.NewTask(task),
	}, nil
}

// UnassignTask is the resolver for the unassignTask field.
func (r *mutationResolver) UnassignTask(ctx context.Context, input types.UnassignTaskInput) (*types.UnassignTaskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.TaskID.TenantID())

	task, err := svc.Tasks.Unassign(ctx, input.TaskID)
	if err != nil {
		panic(fmt.Errorf("cannot unassign task: %w", err))
	}

	return &types.UnassignTaskPayload{
		Task: types.NewTask(task),
	}, nil
}

// CreateRisk is the resolver for the createRisk field.
func (r *mutationResolver) CreateRisk(ctx context.Context, input types.CreateRiskInput) (*types.CreateRiskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	risk, err := svc.Risks.Create(
		ctx,
		probo.CreateRiskRequest{
			OrganizationID: input.OrganizationID,
			Name:           input.Name,
			Description:    input.Description,
		},
	)
	if err != nil {
		panic(fmt.Errorf("cannot create risk: %w", err))
	}

	return &types.CreateRiskPayload{
		RiskEdge: types.NewRiskEdge(risk, coredata.RiskOrderFieldCreatedAt),
	}, nil
}

// UpdateRisk is the resolver for the updateRisk field.
func (r *mutationResolver) UpdateRisk(ctx context.Context, input types.UpdateRiskInput) (*types.UpdateRiskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	risk, err := svc.Risks.Update(
		ctx,
		probo.UpdateRiskRequest{
			ID:          input.ID,
			Name:        input.Name,
			Description: input.Description,
		},
	)
	if err != nil {
		panic(fmt.Errorf("cannot update risk: %w", err))
	}

	return &types.UpdateRiskPayload{
		Risk: types.NewRisk(risk),
	}, nil
}

// DeleteRisk is the resolver for the deleteRisk field.
func (r *mutationResolver) DeleteRisk(ctx context.Context, input types.DeleteRiskInput) (*types.DeleteRiskPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.RiskID.TenantID())

	err := svc.Risks.Delete(ctx, input.RiskID)
	if err != nil {
		panic(fmt.Errorf("cannot delete risk: %w", err))
	}

	return &types.DeleteRiskPayload{
		DeletedRiskID: input.RiskID,
	}, nil
}

// UploadEvidence is the resolver for the uploadEvidence field.
func (r *mutationResolver) UploadEvidence(ctx context.Context, input types.UploadEvidenceInput) (*types.UploadEvidencePayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.TaskID.TenantID())

	var url string
	if input.URL != nil {
		url = *input.URL
	}

	req := probo.CreateEvidenceRequest{
		TaskID:      input.TaskID,
		Name:        input.Name,
		Type:        input.Type,
		URL:         url,
		Description: input.Description,
	}

	if input.Type == coredata.EvidenceTypeFile {
		if input.File == nil {
			return nil, fmt.Errorf("file is required for FILE type evidence")
		}
		req.File = input.File.File
	} else if input.Type == coredata.EvidenceTypeLink {
		if input.URL == nil || *input.URL == "" {
			return nil, fmt.Errorf("URL is required for LINK type evidence")
		}
	}

	evidence, err := svc.Evidences.Create(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to create evidence: %w", err)
	}

	return &types.UploadEvidencePayload{
		EvidenceEdge: types.NewEvidenceEdge(evidence, coredata.EvidenceOrderFieldCreatedAt),
	}, nil
}

// DeleteEvidence is the resolver for the deleteEvidence field.
func (r *mutationResolver) DeleteEvidence(ctx context.Context, input types.DeleteEvidenceInput) (*types.DeleteEvidencePayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.EvidenceID.TenantID())

	err := svc.Evidences.Delete(ctx, input.EvidenceID)
	if err != nil {
		return nil, fmt.Errorf("failed to delete evidence: %w", err)
	}

	return &types.DeleteEvidencePayload{
		DeletedEvidenceID: input.EvidenceID,
	}, nil
}

// CreatePolicy is the resolver for the createPolicy field.
func (r *mutationResolver) CreatePolicy(ctx context.Context, input types.CreatePolicyInput) (*types.CreatePolicyPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.OrganizationID.TenantID())

	policy, err := svc.Policies.Create(ctx, probo.CreatePolicyRequest{
		OrganizationID: input.OrganizationID,
		Name:           input.Name,
		Content:        input.Content,
		Status:         input.Status,
		ReviewDate:     input.ReviewDate,
		OwnerID:        input.OwnerID,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot create policy: %w", err)
	}

	return &types.CreatePolicyPayload{
		PolicyEdge: types.NewPolicyEdge(policy, coredata.PolicyOrderFieldCreatedAt),
	}, nil
}

// UpdatePolicy is the resolver for the updatePolicy field.
func (r *mutationResolver) UpdatePolicy(ctx context.Context, input types.UpdatePolicyInput) (*types.UpdatePolicyPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.ID.TenantID())

	policy, err := svc.Policies.Update(ctx, probo.UpdatePolicyRequest{
		ID:         input.ID,
		Name:       input.Name,
		Content:    input.Content,
		Status:     input.Status,
		ReviewDate: input.ReviewDate,
		OwnerID:    input.OwnerID,
	})
	if err != nil {
		return nil, fmt.Errorf("cannot update policy: %w", err)
	}

	return &types.UpdatePolicyPayload{
		Policy: types.NewPolicy(policy),
	}, nil
}

// DeletePolicy is the resolver for the deletePolicy field.
func (r *mutationResolver) DeletePolicy(ctx context.Context, input types.DeletePolicyInput) (*types.DeletePolicyPayload, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, input.PolicyID.TenantID())

	err := svc.Policies.Delete(ctx, input.PolicyID)
	if err != nil {
		return nil, fmt.Errorf("cannot delete policy: %w", err)
	}

	return &types.DeletePolicyPayload{
		DeletedPolicyID: input.PolicyID,
	}, nil
}

// LogoURL is the resolver for the logoUrl field.
func (r *organizationResolver) LogoURL(ctx context.Context, obj *types.Organization) (*string, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	return svc.Organizations.GenerateLogoURL(ctx, obj.ID, 1*time.Hour)
}

// Users is the resolver for the users field.
func (r *organizationResolver) Users(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.UserOrderBy) (*types.UserConnection, error) {
	pageOrderBy := page.OrderBy[coredata.UserOrderField]{
		Field:     coredata.UserOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.UserOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := r.usrmgrSvc.ListUsersForTenant(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list users: %w", err)
	}

	return types.NewUserConnection(page), nil
}

// Frameworks is the resolver for the frameworks field.
func (r *organizationResolver) Frameworks(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.FrameworkOrderBy) (*types.FrameworkConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.FrameworkOrderField]{
		Field:     coredata.FrameworkOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.FrameworkOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Frameworks.ListForOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization frameworks: %w", err)
	}

	return types.NewFrameworkConnection(page), nil
}

// Vendors is the resolver for the vendors field.
func (r *organizationResolver) Vendors(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.VendorOrderBy) (*types.VendorConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.VendorOrderField]{
		Field:     coredata.VendorOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.VendorOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Vendors.ListForOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization vendors: %w", err)
	}

	return types.NewVendorConnection(page), nil
}

// Peoples is the resolver for the peoples field.
func (r *organizationResolver) Peoples(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.PeopleOrderBy) (*types.PeopleConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.PeopleOrderField]{
		Field:     coredata.PeopleOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.PeopleOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Peoples.ListForOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization peoples: %w", err)
	}

	return types.NewPeopleConnection(page), nil
}

// Policies is the resolver for the policies field.
func (r *organizationResolver) Policies(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.PolicyOrderBy) (*types.PolicyConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.PolicyOrderField]{
		Field:     coredata.PolicyOrderFieldName,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.PolicyOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Policies.ListByOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization policies: %w", err)
	}

	return types.NewPolicyConnection(page), nil
}

// Mitigations is the resolver for the mitigations field.
func (r *organizationResolver) Mitigations(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.MitigationOrderBy) (*types.MitigationConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.MitigationOrderField]{
		Field:     coredata.MitigationOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.MitigationOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Mitigations.ListForOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		return nil, fmt.Errorf("cannot list organization mitigations: %w", err)
	}

	return types.NewMitigationConnection(page), nil
}

// Risks is the resolver for the risks field.
func (r *organizationResolver) Risks(ctx context.Context, obj *types.Organization, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.RiskOrderBy) (*types.RiskConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.RiskOrderField]{
		Field:     coredata.RiskOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.RiskOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)

	page, err := svc.Risks.ListForOrganizationID(ctx, obj.ID, cursor)
	if err != nil {
		panic(fmt.Errorf("cannot list organization risks: %w", err))
	}

	return types.NewRiskConnection(page), nil
}

// Owner is the resolver for the owner field.
func (r *policyResolver) Owner(ctx context.Context, obj *types.Policy) (*types.People, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	policy, err := svc.Policies.Get(ctx, obj.ID)
	if err != nil {
		return nil, fmt.Errorf("cannot get policy: %w", err)
	}

	// Get the owner
	owner, err := svc.Peoples.Get(ctx, policy.OwnerID)
	if err != nil {
		return nil, fmt.Errorf("cannot get owner: %w", err)
	}

	return types.NewPeople(owner), nil
}

// Node is the resolver for the node field.
func (r *queryResolver) Node(ctx context.Context, id gid.GID) (types.Node, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, id.TenantID())

	switch id.EntityType() {
	case coredata.OrganizationEntityType:
		organization, err := svc.Organizations.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewOrganization(organization), nil
	case coredata.PeopleEntityType:
		people, err := svc.Peoples.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewPeople(people), nil
	case coredata.VendorEntityType:
		vendor, err := svc.Vendors.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewVendor(vendor), nil
	case coredata.FrameworkEntityType:
		framework, err := svc.Frameworks.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewFramework(framework), nil
	case coredata.MitigationEntityType:
		mitigation, err := svc.Mitigations.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewMitigation(mitigation), nil
	case coredata.TaskEntityType:
		task, err := svc.Tasks.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewTask(task), nil
	case coredata.EvidenceEntityType:
		evidence, err := svc.Evidences.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewEvidence(evidence), nil
	case coredata.PolicyEntityType:
		policy, err := svc.Policies.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		return types.NewPolicy(policy), nil
	case coredata.ControlEntityType:
		control, err := svc.Controls.Get(ctx, id)
		if err != nil {
			return nil, err
		}

		return types.NewControl(control), nil
	case coredata.RiskEntityType:
		risk, err := svc.Risks.Get(ctx, id)
		if err != nil {
			return nil, err
		}
		return types.NewRisk(risk), nil
	default:
	}

	return nil, gqlerror.Errorf("node %q not found", id)
}

// Viewer is the resolver for the viewer field.
func (r *queryResolver) Viewer(ctx context.Context) (*types.Viewer, error) {
	user := UserFromContext(ctx)
	session := SessionFromContext(ctx)

	return &types.Viewer{
		ID:   session.ID,
		User: types.NewUser(user),
	}, nil
}

// AssignedTo is the resolver for the assignedTo field.
func (r *taskResolver) AssignedTo(ctx context.Context, obj *types.Task) (*types.People, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	task, err := svc.Tasks.Get(ctx, obj.ID)
	if err != nil {
		return nil, fmt.Errorf("cannot get task: %w", err)
	}

	if task.AssignedToID == nil {
		return nil, nil
	}

	people, err := svc.Peoples.Get(ctx, *task.AssignedToID)
	if err != nil {
		return nil, fmt.Errorf("cannot get assigned to: %w", err)
	}

	return types.NewPeople(people), nil
}

// Evidences is the resolver for the evidences field.
func (r *taskResolver) Evidences(ctx context.Context, obj *types.Task, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.EvidenceOrderBy) (*types.EvidenceConnection, error) {
	svc := r.GetTenantServiceIfAuthorized(ctx, obj.ID.TenantID())

	pageOrderBy := page.OrderBy[coredata.EvidenceOrderField]{
		Field:     coredata.EvidenceOrderFieldCreatedAt,
		Direction: page.OrderDirectionDesc,
	}
	if orderBy != nil {
		pageOrderBy = page.OrderBy[coredata.EvidenceOrderField]{
			Field:     orderBy.Field,
			Direction: orderBy.Direction,
		}
	}

	cursor := types.NewCursor(first, after, last, before, pageOrderBy)
	page, err := svc.Evidences.ListForTaskID(ctx, obj.ID, cursor)
	if err != nil {
		panic(fmt.Errorf("failed to list task evidences: %w", err))
	}

	return types.NewEvidenceConnection(page), nil
}

// Organizations is the resolver for the organizations field.
func (r *viewerResolver) Organizations(ctx context.Context, obj *types.Viewer, first *int, after *page.CursorKey, last *int, before *page.CursorKey, orderBy *types.OrganizationOrder) (*types.OrganizationConnection, error) {
	user := UserFromContext(ctx)

	// For now, we're not using cursor pagination since we're loading all organizations
	organizations, err := r.usrmgrSvc.ListOrganizationsForUserID(ctx, user.ID)
	if err != nil {
		panic(fmt.Errorf("failed to list organizations for user: %w", err))
	}

	var edges []*types.OrganizationEdge
	for _, organization := range organizations {
		edges = append(edges, types.NewOrganizationEdge(organization, coredata.OrganizationOrderFieldCreatedAt))
	}

	// The simple implementation doesn't handle pagination yet
	return &types.OrganizationConnection{
		Edges: edges,
		PageInfo: &types.PageInfo{
			HasNextPage:     false,
			HasPreviousPage: false,
		},
	}, nil
}

// Evidence returns schema.EvidenceResolver implementation.
func (r *Resolver) Evidence() schema.EvidenceResolver { return &evidenceResolver{r} }

// Framework returns schema.FrameworkResolver implementation.
func (r *Resolver) Framework() schema.FrameworkResolver { return &frameworkResolver{r} }

// Mitigation returns schema.MitigationResolver implementation.
func (r *Resolver) Mitigation() schema.MitigationResolver { return &mitigationResolver{r} }

// Mutation returns schema.MutationResolver implementation.
func (r *Resolver) Mutation() schema.MutationResolver { return &mutationResolver{r} }

// Organization returns schema.OrganizationResolver implementation.
func (r *Resolver) Organization() schema.OrganizationResolver { return &organizationResolver{r} }

// Policy returns schema.PolicyResolver implementation.
func (r *Resolver) Policy() schema.PolicyResolver { return &policyResolver{r} }

// Query returns schema.QueryResolver implementation.
func (r *Resolver) Query() schema.QueryResolver { return &queryResolver{r} }

// Task returns schema.TaskResolver implementation.
func (r *Resolver) Task() schema.TaskResolver { return &taskResolver{r} }

// Viewer returns schema.ViewerResolver implementation.
func (r *Resolver) Viewer() schema.ViewerResolver { return &viewerResolver{r} }

type evidenceResolver struct{ *Resolver }
type frameworkResolver struct{ *Resolver }
type mitigationResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }
type organizationResolver struct{ *Resolver }
type policyResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type taskResolver struct{ *Resolver }
type viewerResolver struct{ *Resolver }
