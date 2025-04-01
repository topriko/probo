// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package types

import (
	"fmt"
	"io"
	"strconv"
	"time"

	"github.com/99designs/gqlgen/graphql"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
)

type Node interface {
	IsNode()
	GetID() gid.GID
}

type AssignTaskInput struct {
	TaskID       gid.GID `json:"taskId"`
	AssignedToID gid.GID `json:"assignedToId"`
}

type AssignTaskPayload struct {
	Task *Task `json:"task"`
}

type ConfirmEmailInput struct {
	Token string `json:"token"`
}

type ConfirmEmailPayload struct {
	Success bool `json:"success"`
}

type Control struct {
	ID          gid.GID               `json:"id"`
	ReferenceID string                `json:"referenceId"`
	Name        string                `json:"name"`
	Description string                `json:"description"`
	Mitigations *MitigationConnection `json:"mitigations"`
	CreatedAt   time.Time             `json:"createdAt"`
	UpdatedAt   time.Time             `json:"updatedAt"`
}

func (Control) IsNode()             {}
func (this Control) GetID() gid.GID { return this.ID }

type ControlConnection struct {
	Edges    []*ControlEdge `json:"edges"`
	PageInfo *PageInfo      `json:"pageInfo"`
}

type ControlEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Control       `json:"node"`
}

type CreateControlMappingInput struct {
	ControlID    gid.GID `json:"controlId"`
	MitigationID gid.GID `json:"mitigationId"`
}

type CreateControlMappingPayload struct {
	Success bool `json:"success"`
}

type CreateFrameworkInput struct {
	OrganizationID gid.GID `json:"organizationId"`
	Name           string  `json:"name"`
	Description    string  `json:"description"`
}

type CreateFrameworkPayload struct {
	FrameworkEdge *FrameworkEdge `json:"frameworkEdge"`
}

type CreateMitigationInput struct {
	OrganizationID gid.GID                       `json:"organizationId"`
	Name           string                        `json:"name"`
	Description    string                        `json:"description"`
	Category       string                        `json:"category"`
	Importance     coredata.MitigationImportance `json:"importance"`
}

type CreateMitigationPayload struct {
	MitigationEdge *MitigationEdge `json:"mitigationEdge"`
}

type CreateOrganizationInput struct {
	Name string `json:"name"`
}

type CreateOrganizationPayload struct {
	OrganizationEdge *OrganizationEdge `json:"organizationEdge"`
}

type CreatePeopleInput struct {
	OrganizationID           gid.GID             `json:"organizationId"`
	FullName                 string              `json:"fullName"`
	PrimaryEmailAddress      string              `json:"primaryEmailAddress"`
	AdditionalEmailAddresses []string            `json:"additionalEmailAddresses,omitempty"`
	Kind                     coredata.PeopleKind `json:"kind"`
}

type CreatePeoplePayload struct {
	PeopleEdge *PeopleEdge `json:"peopleEdge"`
}

type CreatePolicyInput struct {
	OrganizationID gid.GID               `json:"organizationId"`
	Name           string                `json:"name"`
	Content        string                `json:"content"`
	Status         coredata.PolicyStatus `json:"status"`
	ReviewDate     *time.Time            `json:"reviewDate,omitempty"`
	OwnerID        gid.GID               `json:"ownerId"`
}

type CreatePolicyPayload struct {
	PolicyEdge *PolicyEdge `json:"policyEdge"`
}

type CreateRiskInput struct {
	OrganizationID gid.GID `json:"organizationId"`
	Name           string  `json:"name"`
	Description    string  `json:"description"`
	Probability    float64 `json:"probability"`
	Impact         float64 `json:"impact"`
}

type CreateRiskMappingInput struct {
	RiskID       gid.GID `json:"riskId"`
	MitigationID gid.GID `json:"mitigationId"`
	Probability  float64 `json:"probability"`
	Impact       float64 `json:"impact"`
}

type CreateRiskMappingPayload struct {
	Success bool `json:"success"`
}

type CreateRiskPayload struct {
	RiskEdge *RiskEdge `json:"riskEdge"`
}

type CreateTaskInput struct {
	MitigationID gid.GID        `json:"mitigationId"`
	Name         string         `json:"name"`
	Description  string         `json:"description"`
	TimeEstimate *time.Duration `json:"timeEstimate,omitempty"`
	AssignedToID *gid.GID       `json:"assignedToId,omitempty"`
}

type CreateTaskPayload struct {
	TaskEdge *TaskEdge `json:"taskEdge"`
}

type CreateVendorInput struct {
	OrganizationID       gid.GID                     `json:"organizationId"`
	Name                 string                      `json:"name"`
	Description          string                      `json:"description"`
	ServiceStartAt       time.Time                   `json:"serviceStartAt"`
	ServiceTerminationAt *time.Time                  `json:"serviceTerminationAt,omitempty"`
	ServiceCriticality   coredata.ServiceCriticality `json:"serviceCriticality"`
	RiskTier             coredata.RiskTier           `json:"riskTier"`
	StatusPageURL        *string                     `json:"statusPageUrl,omitempty"`
	TermsOfServiceURL    *string                     `json:"termsOfServiceUrl,omitempty"`
	PrivacyPolicyURL     *string                     `json:"privacyPolicyUrl,omitempty"`
}

type CreateVendorPayload struct {
	VendorEdge *VendorEdge `json:"vendorEdge"`
}

type DeleteControlMappingInput struct {
	ControlID    gid.GID `json:"controlId"`
	MitigationID gid.GID `json:"mitigationId"`
}

type DeleteControlMappingPayload struct {
	Success bool `json:"success"`
}

type DeleteEvidenceInput struct {
	EvidenceID gid.GID `json:"evidenceId"`
}

type DeleteEvidencePayload struct {
	DeletedEvidenceID gid.GID `json:"deletedEvidenceId"`
}

type DeleteFrameworkInput struct {
	FrameworkID gid.GID `json:"frameworkId"`
}

type DeleteFrameworkPayload struct {
	DeletedFrameworkID gid.GID `json:"deletedFrameworkId"`
}

type DeleteOrganizationInput struct {
	OrganizationID gid.GID `json:"organizationId"`
}

type DeleteOrganizationPayload struct {
	DeletedOrganizationID gid.GID `json:"deletedOrganizationId"`
}

type DeletePeopleInput struct {
	PeopleID gid.GID `json:"peopleId"`
}

type DeletePeoplePayload struct {
	DeletedPeopleID gid.GID `json:"deletedPeopleId"`
}

type DeletePolicyInput struct {
	PolicyID gid.GID `json:"policyId"`
}

type DeletePolicyPayload struct {
	DeletedPolicyID gid.GID `json:"deletedPolicyId"`
}

type DeleteRiskInput struct {
	RiskID gid.GID `json:"riskId"`
}

type DeleteRiskMappingInput struct {
	RiskID       gid.GID `json:"riskId"`
	MitigationID gid.GID `json:"mitigationId"`
}

type DeleteRiskMappingPayload struct {
	Success bool `json:"success"`
}

type DeleteRiskPayload struct {
	DeletedRiskID gid.GID `json:"deletedRiskId"`
}

type DeleteTaskInput struct {
	TaskID gid.GID `json:"taskId"`
}

type DeleteTaskPayload struct {
	DeletedTaskID gid.GID `json:"deletedTaskId"`
}

type DeleteVendorInput struct {
	VendorID gid.GID `json:"vendorId"`
}

type DeleteVendorPayload struct {
	DeletedVendorID gid.GID `json:"deletedVendorId"`
}

type Evidence struct {
	ID          gid.GID                `json:"id"`
	FileURL     *string                `json:"fileUrl,omitempty"`
	MimeType    string                 `json:"mimeType"`
	Size        int                    `json:"size"`
	State       coredata.EvidenceState `json:"state"`
	Type        coredata.EvidenceType  `json:"type"`
	Filename    string                 `json:"filename"`
	URL         *string                `json:"url,omitempty"`
	Description string                 `json:"description"`
	CreatedAt   time.Time              `json:"createdAt"`
	UpdatedAt   time.Time              `json:"updatedAt"`
}

func (Evidence) IsNode()             {}
func (this Evidence) GetID() gid.GID { return this.ID }

type EvidenceConnection struct {
	Edges    []*EvidenceEdge `json:"edges"`
	PageInfo *PageInfo       `json:"pageInfo"`
}

type EvidenceEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Evidence      `json:"node"`
}

type Framework struct {
	ID          gid.GID            `json:"id"`
	Name        string             `json:"name"`
	Description string             `json:"description"`
	Controls    *ControlConnection `json:"controls"`
	CreatedAt   time.Time          `json:"createdAt"`
	UpdatedAt   time.Time          `json:"updatedAt"`
}

func (Framework) IsNode()             {}
func (this Framework) GetID() gid.GID { return this.ID }

type FrameworkConnection struct {
	Edges    []*FrameworkEdge `json:"edges"`
	PageInfo *PageInfo        `json:"pageInfo"`
}

type FrameworkEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Framework     `json:"node"`
}

type ImportFrameworkInput struct {
	OrganizationID gid.GID        `json:"organizationId"`
	File           graphql.Upload `json:"file"`
}

type ImportFrameworkPayload struct {
	FrameworkEdge *FrameworkEdge `json:"frameworkEdge"`
}

type ImportMitigationInput struct {
	OrganizationID gid.GID        `json:"organizationId"`
	File           graphql.Upload `json:"file"`
}

type ImportMitigationPayload struct {
	MitigationEdges []*MitigationEdge `json:"mitigationEdges"`
}

type InviteUserInput struct {
	OrganizationID gid.GID `json:"organizationId"`
	Email          string  `json:"email"`
	FullName       string  `json:"fullName"`
}

type InviteUserPayload struct {
	Success bool `json:"success"`
}

type Mitigation struct {
	ID          gid.GID                       `json:"id"`
	Category    string                        `json:"category"`
	Name        string                        `json:"name"`
	Description string                        `json:"description"`
	State       coredata.MitigationState      `json:"state"`
	Importance  coredata.MitigationImportance `json:"importance"`
	Tasks       *TaskConnection               `json:"tasks"`
	Risks       *RiskConnection               `json:"risks"`
	Controls    *ControlConnection            `json:"controls"`
	CreatedAt   time.Time                     `json:"createdAt"`
	UpdatedAt   time.Time                     `json:"updatedAt"`
}

func (Mitigation) IsNode()             {}
func (this Mitigation) GetID() gid.GID { return this.ID }

type MitigationConnection struct {
	Edges    []*MitigationEdge `json:"edges"`
	PageInfo *PageInfo         `json:"pageInfo"`
}

type MitigationEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Mitigation    `json:"node"`
}

type Mutation struct {
}

type Organization struct {
	ID          gid.GID               `json:"id"`
	Name        string                `json:"name"`
	LogoURL     *string               `json:"logoUrl,omitempty"`
	Users       *UserConnection       `json:"users"`
	Frameworks  *FrameworkConnection  `json:"frameworks"`
	Vendors     *VendorConnection     `json:"vendors"`
	Peoples     *PeopleConnection     `json:"peoples"`
	Policies    *PolicyConnection     `json:"policies"`
	Mitigations *MitigationConnection `json:"mitigations"`
	Risks       *RiskConnection       `json:"risks"`
	CreatedAt   time.Time             `json:"createdAt"`
	UpdatedAt   time.Time             `json:"updatedAt"`
}

func (Organization) IsNode()             {}
func (this Organization) GetID() gid.GID { return this.ID }

type OrganizationConnection struct {
	Edges    []*OrganizationEdge `json:"edges"`
	PageInfo *PageInfo           `json:"pageInfo"`
}

type OrganizationEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Organization  `json:"node"`
}

type OrganizationOrder struct {
	Direction page.OrderDirection    `json:"direction"`
	Field     OrganizationOrderField `json:"field"`
}

type PageInfo struct {
	HasNextPage     bool            `json:"hasNextPage"`
	HasPreviousPage bool            `json:"hasPreviousPage"`
	StartCursor     *page.CursorKey `json:"startCursor,omitempty"`
	EndCursor       *page.CursorKey `json:"endCursor,omitempty"`
}

type People struct {
	ID                       gid.GID             `json:"id"`
	FullName                 string              `json:"fullName"`
	PrimaryEmailAddress      string              `json:"primaryEmailAddress"`
	AdditionalEmailAddresses []string            `json:"additionalEmailAddresses"`
	Kind                     coredata.PeopleKind `json:"kind"`
	CreatedAt                time.Time           `json:"createdAt"`
	UpdatedAt                time.Time           `json:"updatedAt"`
}

func (People) IsNode()             {}
func (this People) GetID() gid.GID { return this.ID }

type PeopleConnection struct {
	Edges    []*PeopleEdge `json:"edges"`
	PageInfo *PageInfo     `json:"pageInfo"`
}

type PeopleEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *People        `json:"node"`
}

type Policy struct {
	ID         gid.GID               `json:"id"`
	Name       string                `json:"name"`
	Status     coredata.PolicyStatus `json:"status"`
	Content    string                `json:"content"`
	ReviewDate *time.Time            `json:"reviewDate,omitempty"`
	Owner      *People               `json:"owner"`
	CreatedAt  time.Time             `json:"createdAt"`
	UpdatedAt  time.Time             `json:"updatedAt"`
}

func (Policy) IsNode()             {}
func (this Policy) GetID() gid.GID { return this.ID }

type PolicyConnection struct {
	Edges    []*PolicyEdge `json:"edges"`
	PageInfo *PageInfo     `json:"pageInfo"`
}

type PolicyEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Policy        `json:"node"`
}

type Query struct {
}

type RemoveUserInput struct {
	OrganizationID gid.GID `json:"organizationId"`
	UserID         gid.GID `json:"userId"`
}

type RemoveUserPayload struct {
	Success bool `json:"success"`
}

type Risk struct {
	ID          gid.GID               `json:"id"`
	Name        string                `json:"name"`
	Description string                `json:"description"`
	Probability float64               `json:"probability"`
	Impact      float64               `json:"impact"`
	Mitigations *MitigationConnection `json:"mitigations"`
	CreatedAt   time.Time             `json:"createdAt"`
	UpdatedAt   time.Time             `json:"updatedAt"`
}

func (Risk) IsNode()             {}
func (this Risk) GetID() gid.GID { return this.ID }

type RiskConnection struct {
	Edges    []*RiskEdge `json:"edges"`
	PageInfo *PageInfo   `json:"pageInfo"`
}

type RiskEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Risk          `json:"node"`
}

type Session struct {
	ID        gid.GID   `json:"id"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type Task struct {
	ID           gid.GID             `json:"id"`
	Name         string              `json:"name"`
	Description  string              `json:"description"`
	State        coredata.TaskState  `json:"state"`
	TimeEstimate *time.Duration      `json:"timeEstimate,omitempty"`
	AssignedTo   *People             `json:"assignedTo,omitempty"`
	Evidences    *EvidenceConnection `json:"evidences"`
	CreatedAt    time.Time           `json:"createdAt"`
	UpdatedAt    time.Time           `json:"updatedAt"`
}

func (Task) IsNode()             {}
func (this Task) GetID() gid.GID { return this.ID }

type TaskConnection struct {
	Edges    []*TaskEdge `json:"edges"`
	PageInfo *PageInfo   `json:"pageInfo"`
}

type TaskEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Task          `json:"node"`
}

type UnassignTaskInput struct {
	TaskID gid.GID `json:"taskId"`
}

type UnassignTaskPayload struct {
	Task *Task `json:"task"`
}

type UpdateFrameworkInput struct {
	ID          gid.GID `json:"id"`
	Name        *string `json:"name,omitempty"`
	Description *string `json:"description,omitempty"`
}

type UpdateFrameworkPayload struct {
	Framework *Framework `json:"framework"`
}

type UpdateMitigationInput struct {
	ID          gid.GID                        `json:"id"`
	Name        *string                        `json:"name,omitempty"`
	Description *string                        `json:"description,omitempty"`
	Category    *string                        `json:"category,omitempty"`
	State       *coredata.MitigationState      `json:"state,omitempty"`
	Importance  *coredata.MitigationImportance `json:"importance,omitempty"`
}

type UpdateMitigationPayload struct {
	Mitigation *Mitigation `json:"mitigation"`
}

type UpdateOrganizationInput struct {
	OrganizationID gid.GID         `json:"organizationId"`
	Name           *string         `json:"name,omitempty"`
	Logo           *graphql.Upload `json:"logo,omitempty"`
}

type UpdateOrganizationPayload struct {
	Organization *Organization `json:"organization"`
}

type UpdatePeopleInput struct {
	ID                       gid.GID              `json:"id"`
	FullName                 *string              `json:"fullName,omitempty"`
	PrimaryEmailAddress      *string              `json:"primaryEmailAddress,omitempty"`
	AdditionalEmailAddresses []string             `json:"additionalEmailAddresses,omitempty"`
	Kind                     *coredata.PeopleKind `json:"kind,omitempty"`
}

type UpdatePeoplePayload struct {
	People *People `json:"people"`
}

type UpdatePolicyInput struct {
	ID         gid.GID                `json:"id"`
	Name       *string                `json:"name,omitempty"`
	Content    *string                `json:"content,omitempty"`
	Status     *coredata.PolicyStatus `json:"status,omitempty"`
	ReviewDate *time.Time             `json:"reviewDate,omitempty"`
	OwnerID    *gid.GID               `json:"ownerId,omitempty"`
}

type UpdatePolicyPayload struct {
	Policy *Policy `json:"policy"`
}

type UpdateRiskInput struct {
	ID          gid.GID  `json:"id"`
	Name        *string  `json:"name,omitempty"`
	Description *string  `json:"description,omitempty"`
	Probability *float64 `json:"probability,omitempty"`
	Impact      *float64 `json:"impact,omitempty"`
}

type UpdateRiskPayload struct {
	Risk *Risk `json:"risk"`
}

type UpdateTaskInput struct {
	TaskID       gid.GID             `json:"taskId"`
	Name         *string             `json:"name,omitempty"`
	Description  *string             `json:"description,omitempty"`
	State        *coredata.TaskState `json:"state,omitempty"`
	TimeEstimate *time.Duration      `json:"timeEstimate,omitempty"`
}

type UpdateTaskPayload struct {
	Task *Task `json:"task"`
}

type UpdateVendorInput struct {
	ID                   gid.GID                      `json:"id"`
	Name                 *string                      `json:"name,omitempty"`
	Description          *string                      `json:"description,omitempty"`
	ServiceStartAt       *time.Time                   `json:"serviceStartAt,omitempty"`
	ServiceTerminationAt *time.Time                   `json:"serviceTerminationAt,omitempty"`
	ServiceCriticality   *coredata.ServiceCriticality `json:"serviceCriticality,omitempty"`
	RiskTier             *coredata.RiskTier           `json:"riskTier,omitempty"`
	StatusPageURL        *string                      `json:"statusPageUrl,omitempty"`
	TermsOfServiceURL    *string                      `json:"termsOfServiceUrl,omitempty"`
	PrivacyPolicyURL     *string                      `json:"privacyPolicyUrl,omitempty"`
}

type UpdateVendorPayload struct {
	Vendor *Vendor `json:"vendor"`
}

type UploadEvidenceInput struct {
	TaskID      gid.GID               `json:"taskId"`
	Name        string                `json:"name"`
	File        *graphql.Upload       `json:"file,omitempty"`
	Type        coredata.EvidenceType `json:"type"`
	URL         *string               `json:"url,omitempty"`
	Description string                `json:"description"`
}

type UploadEvidencePayload struct {
	EvidenceEdge *EvidenceEdge `json:"evidenceEdge"`
}

type User struct {
	ID        gid.GID   `json:"id"`
	FullName  string    `json:"fullName"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (User) IsNode()             {}
func (this User) GetID() gid.GID { return this.ID }

type UserConnection struct {
	Edges    []*UserEdge `json:"edges"`
	PageInfo *PageInfo   `json:"pageInfo"`
}

type UserEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *User          `json:"node"`
}

type Vendor struct {
	ID                   gid.GID                     `json:"id"`
	Name                 string                      `json:"name"`
	Description          string                      `json:"description"`
	ServiceStartAt       time.Time                   `json:"serviceStartAt"`
	ServiceTerminationAt *time.Time                  `json:"serviceTerminationAt,omitempty"`
	ServiceCriticality   coredata.ServiceCriticality `json:"serviceCriticality"`
	RiskTier             coredata.RiskTier           `json:"riskTier"`
	StatusPageURL        *string                     `json:"statusPageUrl,omitempty"`
	TermsOfServiceURL    *string                     `json:"termsOfServiceUrl,omitempty"`
	PrivacyPolicyURL     *string                     `json:"privacyPolicyUrl,omitempty"`
	CreatedAt            time.Time                   `json:"createdAt"`
	UpdatedAt            time.Time                   `json:"updatedAt"`
}

func (Vendor) IsNode()             {}
func (this Vendor) GetID() gid.GID { return this.ID }

type VendorConnection struct {
	Edges    []*VendorEdge `json:"edges"`
	PageInfo *PageInfo     `json:"pageInfo"`
}

type VendorEdge struct {
	Cursor page.CursorKey `json:"cursor"`
	Node   *Vendor        `json:"node"`
}

type Viewer struct {
	ID            gid.GID                 `json:"id"`
	User          *User                   `json:"user"`
	Organizations *OrganizationConnection `json:"organizations"`
}

type OrganizationOrderField string

const (
	OrganizationOrderFieldName      OrganizationOrderField = "NAME"
	OrganizationOrderFieldCreatedAt OrganizationOrderField = "CREATED_AT"
	OrganizationOrderFieldUpdatedAt OrganizationOrderField = "UPDATED_AT"
)

var AllOrganizationOrderField = []OrganizationOrderField{
	OrganizationOrderFieldName,
	OrganizationOrderFieldCreatedAt,
	OrganizationOrderFieldUpdatedAt,
}

func (e OrganizationOrderField) IsValid() bool {
	switch e {
	case OrganizationOrderFieldName, OrganizationOrderFieldCreatedAt, OrganizationOrderFieldUpdatedAt:
		return true
	}
	return false
}

func (e OrganizationOrderField) String() string {
	return string(e)
}

func (e *OrganizationOrderField) UnmarshalGQL(v any) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = OrganizationOrderField(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid OrganizationOrderField", str)
	}
	return nil
}

func (e OrganizationOrderField) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
