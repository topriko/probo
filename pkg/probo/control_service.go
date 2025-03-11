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
	ControlService struct {
		svc *TenantService
	}

	CreateControlRequest struct {
		FrameworkID gid.GID
		Name        string
		Description string
		ContentRef  string
		Category    string
	}

	UpdateControlRequest struct {
		ID              gid.GID
		ExpectedVersion int
		Name            *string
		Description     *string
		Category        *string
		State           *coredata.ControlState
	}
)

func (s ControlService) Get(
	ctx context.Context,
	controlID gid.GID,
) (*coredata.Control, error) {
	control := &coredata.Control{}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return control.LoadByID(ctx, conn, s.svc.scope, controlID)
		},
	)

	if err != nil {
		return nil, err
	}

	return control, nil
}

func (s ControlService) Update(
	ctx context.Context,
	req UpdateControlRequest,
) (*coredata.Control, error) {
	params := coredata.UpdateControlParams{
		ExpectedVersion: req.ExpectedVersion,
		Name:            req.Name,
		Description:     req.Description,
		Category:        req.Category,
		State:           req.State,
	}

	control := &coredata.Control{ID: req.ID}

	err := s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			return control.Update(ctx, conn, s.svc.scope, params)
		})
	if err != nil {
		return nil, err
	}

	return control, nil
}

func (s ControlService) ListForFrameworkID(
	ctx context.Context,
	frameworkID gid.GID,
	cursor *page.Cursor,
) (*page.Page[*coredata.Control], error) {
	var controls coredata.Controls

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return controls.LoadByFrameworkID(
				ctx,
				conn,
				s.svc.scope,
				frameworkID,
				cursor,
			)
		},
	)

	if err != nil {
		return nil, err
	}

	return page.NewPage(controls, cursor), nil
}

func (s ControlService) Create(
	ctx context.Context,
	req CreateControlRequest,
) (*coredata.Control, error) {
	now := time.Now()
	controlID, err := gid.NewGID(s.svc.scope.GetTenantID(), coredata.ControlEntityType)
	if err != nil {
		return nil, fmt.Errorf("cannot create control global id: %w", err)
	}

	framework := &coredata.Framework{}
	control := &coredata.Control{
		ID:          controlID,
		FrameworkID: req.FrameworkID,
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		State:       coredata.ControlStateNotStarted,
		ContentRef:  req.ContentRef,
		CreatedAt:   now,
		UpdatedAt:   now,
	}

	err = s.svc.pg.WithTx(
		ctx,
		func(conn pg.Conn) error {
			if err := framework.LoadByID(ctx, conn, s.svc.scope, req.FrameworkID); err != nil {
				return fmt.Errorf("cannot load framework %q: %w", req.FrameworkID, err)
			}

			if err := control.Insert(ctx, conn, s.svc.scope); err != nil {
				return fmt.Errorf("cannot insert control: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return control, nil
}
