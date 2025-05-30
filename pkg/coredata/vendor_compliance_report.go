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
	"fmt"
	"maps"
	"time"

	"github.com/getprobo/probo/pkg/gid"
	"github.com/getprobo/probo/pkg/page"
	"github.com/jackc/pgx/v5"
	"go.gearno.de/kit/pg"
)

type (
	VendorComplianceReport struct {
		ID         gid.GID
		VendorID   gid.GID
		ReportDate time.Time
		ValidUntil *time.Time
		ReportName string
		FileKey    string
		FileSize   int
		CreatedAt  time.Time
		UpdatedAt  time.Time
	}

	VendorComplianceReports []*VendorComplianceReport
)

func (c VendorComplianceReport) CursorKey(orderBy VendorComplianceReportOrderField) page.CursorKey {
	switch orderBy {
	case VendorComplianceReportOrderFieldReportDate:
		return page.NewCursorKey(c.ID, c.ReportDate)
	case VendorComplianceReportOrderFieldCreatedAt:
		return page.NewCursorKey(c.ID, c.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (vcs *VendorComplianceReports) LoadForVendorID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorID gid.GID,
	cursor *page.Cursor[VendorComplianceReportOrderField],
) error {
	q := `
SELECT
	id,
	vendor_id,
	report_date,
	valid_until,
	report_name,
	file_key,
	file_size,
	created_at,
	updated_at
FROM
	vendor_compliance_reports
WHERE
	%s
	AND vendor_id = @vendor_id
	AND %s
`

	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.NamedArgs{"vendor_id": vendorID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor compliance reports: %w", err)
	}

	vendorComplianceReports, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[VendorComplianceReport])
	if err != nil {
		return fmt.Errorf("cannot collect vendor compliance reports: %w", err)
	}

	*vcs = vendorComplianceReports

	return nil
}

func (vcr *VendorComplianceReport) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	vendorComplianceReportID gid.GID,
) error {
	q := `
SELECT
	id,
	vendor_id,
	report_date,
	valid_until,
	report_name,
	file_key,
	file_size,
	created_at,
	updated_at
FROM
	vendor_compliance_reports
WHERE
	%s
	AND id = @id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{"id": vendorComplianceReportID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query vendor compliance report: %w", err)
	}

	vendorComplianceReport, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[VendorComplianceReport])
	if err != nil {
		return fmt.Errorf("cannot collect vendor compliance report: %w", err)
	}

	*vcr = vendorComplianceReport

	return nil
}

func (vcr *VendorComplianceReport) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
	vendor_compliance_reports (
		id,
		tenant_id,
		vendor_id,
		report_date,
		valid_until,
		report_name,
		file_key,
		file_size,
		created_at,
		updated_at
	)
VALUES (
	@id,
	@tenant_id,
	@vendor_id,
	@report_date,
	@valid_until,
	@report_name,
	@file_key,
	@file_size,
	@created_at,
	@updated_at
)
`
	args := pgx.NamedArgs{
		"id":          vcr.ID,
		"tenant_id":   scope.GetTenantID(),
		"vendor_id":   vcr.VendorID,
		"report_date": vcr.ReportDate,
		"valid_until": vcr.ValidUntil,
		"report_name": vcr.ReportName,
		"file_key":    vcr.FileKey,
		"file_size":   vcr.FileSize,
		"created_at":  vcr.CreatedAt,
		"updated_at":  vcr.UpdatedAt,
	}

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (vcr *VendorComplianceReport) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE
FROM
	vendor_compliance_reports
WHERE
	%s
	AND id = @id
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"id": vcr.ID}
	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}
