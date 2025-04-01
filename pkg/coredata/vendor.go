// Copyright (c) 2025 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package coredata

import (
	"context"
	"errors"
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

var ErrConcurrentModification = errors.New("concurrent modification")

type (
	Vendor struct {
		ID                   gid.GID            `db:"id"`
		OrganizationID       gid.GID            `db:"organization_id"`
		Name                 string             `db:"name"`
		Description          string             `db:"description"`
		ServiceStartAt       time.Time          `db:"service_start_at"`
		ServiceTerminationAt *time.Time         `db:"service_termination_at"`
		ServiceCriticality   ServiceCriticality `db:"service_criticality"`
		RiskTier             RiskTier           `db:"risk_tier"`
		StatusPageURL        *string            `db:"status_page_url"`
		TermsOfServiceURL    *string            `db:"terms_of_service_url"`
		PrivacyPolicyURL     *string            `db:"privacy_policy_url"`
		CreatedAt            time.Time          `db:"created_at"`
		UpdatedAt            time.Time          `db:"updated_at"`
	}

	Vendors []*Vendor
)

func (v Vendor) CursorKey(orderBy VendorOrderField) page.CursorKey {
	switch orderBy {
	case VendorOrderFieldCreatedAt:
		return page.NewCursorKey(v.ID, v.CreatedAt)
	case VendorOrderFieldName:
		return page.NewCursorKey(v.ID, v.Name)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (v *Vendor) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    description,
    service_start_at,
    service_termination_at,
    service_criticality,
    risk_tier,
    status_page_url,
    terms_of_service_url,
    privacy_policy_url,
    created_at,
    updated_at
FROM
    vendors
WHERE
    %s
    AND id = @vendor_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor: %w", err)
	}
	defer rows.Close()

	vendor, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Vendor])
	if err != nil {
		return fmt.Errorf("cannot collect vendor: %w", err)
	}

	*v = vendor

	return nil
}

func (v Vendor) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    vendors (
        tenant_id,
        id,
        organization_id,
        name,
        description,
        service_start_at,
        service_termination_at,
        service_criticality,
        risk_tier,
        status_page_url,
        terms_of_service_url,
        privacy_policy_url,
        created_at,
        updated_at
    )
VALUES (
    @tenant_id,
    @vendor_id,
    @organization_id,
    @name,
    @description,
    @service_start_at,
    @service_termination_at,
    @service_criticality,
    @risk_tier,
    @status_page_url,
    @terms_of_service_url,
    @privacy_policy_url,
    @created_at,
    @updated_at
)
`

	args := pgx.StrictNamedArgs{
		"tenant_id":              scope.GetTenantID(),
		"vendor_id":              v.ID,
		"organization_id":        v.OrganizationID,
		"name":                   v.Name,
		"description":            v.Description,
		"service_start_at":       v.ServiceStartAt,
		"service_termination_at": v.ServiceTerminationAt,
		"service_criticality":    v.ServiceCriticality,
		"risk_tier":              v.RiskTier,
		"status_page_url":        v.StatusPageURL,
		"terms_of_service_url":   v.TermsOfServiceURL,
		"privacy_policy_url":     v.PrivacyPolicyURL,
		"created_at":             v.CreatedAt,
		"updated_at":             v.UpdatedAt,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (v Vendor) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM vendors WHERE %s AND id = @vendor_id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"vendor_id": v.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (v *Vendors) LoadByOrganizationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	organizationID gid.GID,
	cursor *page.Cursor[VendorOrderField],
) error {
	q := `
SELECT
    id,
    organization_id,
    name,
    description,
    service_start_at,
    service_termination_at,
    service_criticality,
    risk_tier,
    status_page_url,
    terms_of_service_url,
    privacy_policy_url,
    created_at,
    updated_at
FROM
    vendors
WHERE
    %s
    AND organization_id = @organization_id
    AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"organization_id": organizationID}
	maps.Copy(args, cursor.SQLArguments())
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendors: %w", err)
	}

	vendors, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Vendor])
	if err != nil {
		return fmt.Errorf("cannot collect vendors: %w", err)
	}

	*v = vendors

	return nil
}

func (v *Vendor) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE vendors
SET
	name = @name,
	description = @description,
	service_start_at = @service_start_at,
	service_termination_at = @service_termination_at,
	service_criticality = @service_criticality,
	risk_tier = @risk_tier,
	status_page_url = @status_page_url,
	terms_of_service_url = @terms_of_service_url,
	privacy_policy_url = @privacy_policy_url,
	updated_at = @updated_at
WHERE %s
    AND id = @vendor_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{
		"vendor_id":              v.ID,
		"updated_at":             time.Now(),
		"name":                   v.Name,
		"description":            v.Description,
		"service_start_at":       v.ServiceStartAt,
		"service_termination_at": v.ServiceTerminationAt,
		"service_criticality":    v.ServiceCriticality,
		"risk_tier":              v.RiskTier,
		"status_page_url":        v.StatusPageURL,
		"terms_of_service_url":   v.TermsOfServiceURL,
		"privacy_policy_url":     v.PrivacyPolicyURL,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
