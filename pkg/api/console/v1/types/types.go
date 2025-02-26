// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package types

import (
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/getprobo/probo/pkg/probo/coredata"
)

type Node interface {
	IsNode()
	GetID() gid.GID
}

type Control struct {
	ID               gid.GID                           `json:"id"`
	Category         string                            `json:"category"`
	Name             string                            `json:"name"`
	Description      string                            `json:"description"`
	State            coredata.ControlState             `json:"state"`
	StateTransisions *ControlStateTransitionConnection `json:"stateTransisions"`
	Tasks            *TaskConnection                   `json:"tasks"`
	CreatedAt        time.Time                         `json:"createdAt"`
	UpdatedAt        time.Time                         `json:"updatedAt"`
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

type ControlStateTransition struct {
	ID        gid.GID                `json:"id"`
	FromState *coredata.ControlState `json:"fromState,omitempty"`
	ToState   coredata.ControlState  `json:"toState"`
	Reason    *string                `json:"reason,omitempty"`
	CreatedAt time.Time              `json:"createdAt"`
	UpdatedAt time.Time              `json:"updatedAt"`
}

type ControlStateTransitionConnection struct {
	Edges    []*ControlStateTransitionEdge `json:"edges"`
	PageInfo *PageInfo                     `json:"pageInfo"`
}

type ControlStateTransitionEdge struct {
	Cursor page.CursorKey          `json:"cursor"`
	Node   *ControlStateTransition `json:"node"`
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

type CreateTaskInput struct {
	ControlID   gid.GID `json:"controlId"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
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
	ID               gid.GID                            `json:"id"`
	FileURL          string                             `json:"fileUrl"`
	MimeType         string                             `json:"mimeType"`
	Size             int                                `json:"size"`
	State            coredata.EvidenceState             `json:"state"`
	StateTransisions *EvidenceStateTransitionConnection `json:"stateTransisions"`
	CreatedAt        time.Time                          `json:"createdAt"`
	UpdatedAt        time.Time                          `json:"updatedAt"`
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

type EvidenceStateTransition struct {
	ID        gid.GID                 `json:"id"`
	FromState *coredata.EvidenceState `json:"fromState,omitempty"`
	ToState   coredata.EvidenceState  `json:"toState"`
	Reason    *string                 `json:"reason,omitempty"`
	CreatedAt time.Time               `json:"createdAt"`
	UpdatedAt time.Time               `json:"updatedAt"`
}

type EvidenceStateTransitionConnection struct {
	Edges    []*EvidenceStateTransitionEdge `json:"edges"`
	PageInfo *PageInfo                      `json:"pageInfo"`
}

type EvidenceStateTransitionEdge struct {
	Cursor page.CursorKey           `json:"cursor"`
	Node   *EvidenceStateTransition `json:"node"`
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

type Mutation struct {
}

type Organization struct {
	ID         gid.GID              `json:"id"`
	Name       string               `json:"name"`
	LogoURL    string               `json:"logoUrl"`
	Frameworks *FrameworkConnection `json:"frameworks"`
	Vendors    *VendorConnection    `json:"vendors"`
	Peoples    *PeopleConnection    `json:"peoples"`
	CreatedAt  time.Time            `json:"createdAt"`
	UpdatedAt  time.Time            `json:"updatedAt"`
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
	Version                  int                 `json:"version"`
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

type Query struct {
}

type Session struct {
	ID        gid.GID   `json:"id"`
	ExpiresAt time.Time `json:"expiresAt"`
}

type Task struct {
	ID               gid.GID                        `json:"id"`
	Name             string                         `json:"name"`
	Description      string                         `json:"description"`
	State            coredata.TaskState             `json:"state"`
	StateTransisions *TaskStateTransitionConnection `json:"stateTransisions"`
	Evidences        *EvidenceConnection            `json:"evidences"`
	CreatedAt        time.Time                      `json:"createdAt"`
	UpdatedAt        time.Time                      `json:"updatedAt"`
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

type TaskStateTransition struct {
	ID        gid.GID             `json:"id"`
	FromState *coredata.TaskState `json:"fromState,omitempty"`
	ToState   coredata.TaskState  `json:"toState"`
	Reason    *string             `json:"reason,omitempty"`
	CreatedAt time.Time           `json:"createdAt"`
	UpdatedAt time.Time           `json:"updatedAt"`
}

type TaskStateTransitionConnection struct {
	Edges    []*TaskStateTransitionEdge `json:"edges"`
	PageInfo *PageInfo                  `json:"pageInfo"`
}

type TaskStateTransitionEdge struct {
	Cursor page.CursorKey       `json:"cursor"`
	Node   *TaskStateTransition `json:"node"`
}

type UpdatePeopleInput struct {
	ID                       gid.GID              `json:"id"`
	ExpectedVersion          int                  `json:"expectedVersion"`
	FullName                 *string              `json:"fullName,omitempty"`
	PrimaryEmailAddress      *string              `json:"primaryEmailAddress,omitempty"`
	AdditionalEmailAddresses []string             `json:"additionalEmailAddresses,omitempty"`
	Kind                     *coredata.PeopleKind `json:"kind,omitempty"`
}

type UpdateTaskStateInput struct {
	TaskID gid.GID            `json:"taskId"`
	State  coredata.TaskState `json:"state"`
}

type UpdateTaskStatePayload struct {
	Task *Task `json:"task"`
}

type UpdateVendorInput struct {
	ID                   gid.GID                      `json:"id"`
	ExpectedVersion      int                          `json:"expectedVersion"`
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

type User struct {
	ID            gid.GID                 `json:"id"`
	FullName      string                  `json:"fullName"`
	Email         string                  `json:"email"`
	Organizations *OrganizationConnection `json:"organizations"`
	CreatedAt     time.Time               `json:"createdAt"`
	UpdatedAt     time.Time               `json:"updatedAt"`
}

func (User) IsNode()             {}
func (this User) GetID() gid.GID { return this.ID }

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
	Version              int                         `json:"version"`
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
