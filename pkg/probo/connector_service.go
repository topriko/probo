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

	"github.com/getprobo/probo/pkg/connector"
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"go.gearno.de/kit/pg"
)

type (
	ConnectorService struct {
		svc *TenantService
	}

	CreateOrUpdateConnectorRequest struct {
		OrganizationID gid.GID
		Name           string
		Type           connector.ProtocolType
		Connection     connector.Connection
	}
)

func (s *ConnectorService) ListForOrganizationID(
	ctx context.Context,
	organizationID gid.GID,
	cursor *page.Cursor[coredata.ConnectorOrderField],
) (*page.Page[*coredata.Connector, coredata.ConnectorOrderField], error) {
	var connectors coredata.Connectors

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			return connectors.LoadWithoutDecryptedConnectionByOrganizationID(
				ctx,
				conn,
				s.svc.scope,
				organizationID,
				cursor,
				s.svc.encryptionKey,
			)
		},
	)

	if err != nil {
		return nil, fmt.Errorf("cannot list connectors: %w", err)
	}

	return page.NewPage(connectors, cursor), nil
}

func (s *ConnectorService) CreateOrUpdate(
	ctx context.Context,
	req CreateOrUpdateConnectorRequest,
) (*coredata.Connector, error) {
	if req.OrganizationID == gid.Nil {
		return nil, fmt.Errorf("organization ID is required")
	}

	if req.Name == "" {
		return nil, fmt.Errorf("connector name is required")
	}

	if req.Type == "" {
		return nil, fmt.Errorf("connector type is required")
	}

	if req.Connection == nil {
		return nil, fmt.Errorf("connection configuration is required")
	}

	connectorID := gid.New(s.svc.scope.GetTenantID(), coredata.ConnectorEntityType)
	now := time.Now()

	connector := &coredata.Connector{
		ID:             connectorID,
		OrganizationID: req.OrganizationID,
		Name:           req.Name,
		Type:           req.Type,
		Connection:     req.Connection,
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	err := s.svc.pg.WithConn(
		ctx,
		func(conn pg.Conn) error {
			if err := connector.Upsert(ctx, conn, s.svc.scope, s.svc.encryptionKey); err != nil {
				return fmt.Errorf("cannot upsert connector: %w", err)
			}

			return nil
		},
	)

	if err != nil {
		return nil, err
	}

	return connector, nil
}
