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

package probo

import (
	"context"
	"fmt"
	"time"

	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type (
	VendorService struct {
		svc *TenantService
	}

	CreateVendorRequest struct {
		OrganizationID       gid.GID
		Name                 string
		Description          string
		ServiceStartAt       time.Time
		ServiceTerminationAt *time.Time
		ServiceCriticality   coredata.ServiceCriticality
		RiskTier             coredata.RiskTier
		StatusPageURL        *string
		TermsOfServiceURL    *string
		PrivacyPolicyURL     *string
	}

	UpdateVendorRequest struct {
		ID                   gid.GID
		ExpectedVersion      int
		Name                 *string
		Description          *string
		ServiceStartAt       *time.Time
		ServiceTerminationAt *time.Time
		ServiceCriticality   *coredata.ServiceCriticality
		RiskTier             *coredata.RiskTier
		StatusPageURL        *string
		TermsOfServiceURL    *string
		PrivacyPolicyURL     *string
	}
)

func (s VendorService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.VendorOrderField],
) (*page.Page[*coredata.Vendor, coredata.VendorOrderField], error) {
	var vendors coredata.Vendors

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return vendors.LoadByOrganizationID(
				ctx,
				conn,
				s.svc.scope,
				organizationID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(vendors, cursor), nil
}

func (s VendorService) Update(
	ctx context.Context,
	req UpdateVendorRequest,
) (*coredata.Vendor, error) {
	vendor := &coredata.Vendor{}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := vendor.LoadByID(ctx, conn, s.svc.scope, req.ID); err != nil {
				return fmt.Errorf("cannot load vendor %q: %w", req.ID, err)
			}

			if req.Name != nil {
				vendor.Name = *req.Name
			}

			if req.Description != nil {
				vendor.Description = *req.Description
			}

			if req.ServiceStartAt != nil {
				vendor.ServiceStartAt = *req.ServiceStartAt
			}

			if req.ServiceTerminationAt != nil {
				vendor.ServiceTerminationAt = req.ServiceTerminationAt
			}

			if req.ServiceCriticality != nil {
				vendor.ServiceCriticality = *req.ServiceCriticality
			}

			if req.RiskTier != nil {
				vendor.RiskTier = *req.RiskTier
			}

			if req.StatusPageURL != nil {
				vendor.StatusPageURL = req.StatusPageURL
			}

			if req.TermsOfServiceURL != nil {
				vendor.TermsOfServiceURL = req.TermsOfServiceURL
			}

			if req.PrivacyPolicyURL != nil {
				vendor.PrivacyPolicyURL = req.PrivacyPolicyURL
			}

			if err := vendor.Update(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot update vendor: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return vendor, nil
}

func (s VendorService) Get(
	ctx context.Context,
	vendorID gid.GID,
) (*coredata.Vendor, error) {
	vendor := &coredata.Vendor{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return vendor.LoadByID(ctx, conn, s.svc.scope, vendorID)
		},
	)

	if err != nil {
		return nil, err
	}

	return vendor, nil
}

func (s VendorService) Delete(
	ctx context.Context,
	vendorID gid.GID,
) error {
	vendor := coredata.Vendor{ID: vendorID}
	return s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return vendor.Delete(ctx, conn, s.svc.scope)
		},
	)
}

func (s VendorService) Create(
	ctx context.Context,
	req CreateVendorRequest,
) (*coredata.Vendor, error) {
	now := time.Now()
	vendorID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.VendorEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create vendor global id: %w", err)
	}

	organization := &coredata.Organization{}
	vendor := &coredata.Vendor{
		ID:                   vendorID,
		OrganizationID:       req.OrganizationID,
		Name:                 req.Name,
		CreatedAt:            now,
		UpdatedAt:            now,
		Description:          req.Description,
		ServiceStartAt:       req.ServiceStartAt,
		ServiceTerminationAt: req.ServiceTerminationAt,
		ServiceCriticality:   req.ServiceCriticality,
		RiskTier:             req.RiskTier,
		StatusPageURL:        req.StatusPageURL,
		TermsOfServiceURL:    req.TermsOfServiceURL,
		PrivacyPolicyURL:     req.PrivacyPolicyURL,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := organization.LoadByID(ctx, conn, s.svc.scope, req.OrganizationID); err != nil {
				return fmt.Errorf("cannot load organization %q: %w", req.OrganizationID, err)
			}

			if err := vendor.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert vendor: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return vendor, nil
}
