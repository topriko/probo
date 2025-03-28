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
	Task struct {
		ID           gid.GID        `db:"id"`
		MitigationID gid.GID        `db:"mitigation_id"`
		Name         string         `db:"name"`
		Description  string         `db:"description"`
		State        TaskState      `db:"state"`
		TimeEstimate *time.Duration `db:"time_estimate"`
		AssignedToID *gid.GID       `db:"assigned_to"`
		CreatedAt    time.Time      `db:"created_at"`
		UpdatedAt    time.Time      `db:"updated_at"`
		Version      int            `db:"version"`
	}

	Tasks []*Task
)

func (c Task) CursorKey(orderBy TaskOrderField) page.CursorKey {
	switch orderBy {
	case TaskOrderFieldCreatedAt:
		return page.NewCursorKey(c.ID, c.CreatedAt)
	}

	panic(fmt.Sprintf("unsupported order by: %s", orderBy))
}

func (c *Task) LoadByID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	taskID gid.GID,
) error {
	q := `
SELECT
    id,
    mitigation_id,
    name,
    description,
    state,
    time_estimate,
    assigned_to,
    created_at,
    updated_at,
    version
FROM
    tasks
WHERE
    %s
    AND id = @task_id
LIMIT 1;
`

	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.StrictNamedArgs{"task_id": taskID}
	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query tasks: %w", err)
	}

	task, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Task])
	if err != nil {
		return fmt.Errorf("cannot collect tasks: %w", err)
	}

	*c = task

	return nil
}

func (c Task) Insert(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
INSERT INTO
    tasks (
        tenant_id,
        id,
        mitigation_id,
        name,
        description,
        state,
        time_estimate,
        assigned_to,
        created_at,
        updated_at,
        version
    )
VALUES (
    @tenant_id,
    @task_id,
    @mitigation_id,
    @name,
    @description,
    @state,
    @time_estimate,
    @assigned_to,
    @created_at,
    @updated_at,
    @version
);
`

	args := pgx.StrictNamedArgs{
		"tenant_id":     scope.GetTenantID(),
		"task_id":       c.ID,
		"mitigation_id": c.MitigationID,
		"name":          c.Name,
		"description":   c.Description,
		"state":         c.State,
		"time_estimate": c.TimeEstimate,
		"assigned_to":   c.AssignedToID,
		"created_at":    c.CreatedAt,
		"updated_at":    c.UpdatedAt,
		"version":       0,
	}
	_, err := conn.Exec(ctx, q, args)
	return err
}

func (c *Tasks) LoadByMitigationID(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	mitigationID gid.GID,
	cursor *page.Cursor[TaskOrderField],
) error {
	q := `
SELECT
    id,
    mitigation_id,
    name,
    description,
    state,
    time_estimate,
    assigned_to,
    created_at,
    updated_at,
    version
FROM
    tasks
WHERE
    %s
    AND mitigation_id = @mitigation_id
    AND %s
`
	q = fmt.Sprintf(q, scope.SQLFragment(), cursor.SQLFragment())

	args := pgx.StrictNamedArgs{"mitigation_id": mitigationID}
	maps.Copy(args, scope.SQLArguments())
	maps.Copy(args, cursor.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query tasks: %w", err)
	}

	tasks, err := pgx.CollectRows(rows, pgx.RowToAddrOfStructByName[Task])
	if err != nil {
		return fmt.Errorf("cannot collect tasks: %w", err)
	}

	*c = tasks

	return nil
}

func (c *Task) Update(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE tasks
SET
  name = @name,
  description = @description,
  state = @state,
  time_estimate = @time_estimate,
  updated_at = @updated_at
WHERE %s
    AND id = @task_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"task_id":       c.ID,
		"name":          c.Name,
		"description":   c.Description,
		"state":         c.State,
		"time_estimate": c.TimeEstimate,
		"updated_at":    c.UpdatedAt,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	return err
}

func (c *Task) AssignTo(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
	assignTo gid.GID,
) error {
	q := `
UPDATE tasks SET
    assigned_to = @assigned_to,
    updated_at = @updated_at,
    version = version + 1
WHERE %s
    AND id = @task_id
RETURNING 
    id,
    mitigation_id,
    name,
    description,
    state,
    time_estimate,
    assigned_to,
    created_at,
    updated_at,
    version
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"task_id":     c.ID,
		"assigned_to": assignTo,
		"updated_at":  time.Now(),
	}

	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query tasks: %w", err)
	}

	task, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Task])
	if err != nil {
		return fmt.Errorf("cannot collect tasks: %w", err)
	}

	*c = task

	return nil
}

func (c *Task) Unassign(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
UPDATE tasks SET
    assigned_to = NULL,
    updated_at = @updated_at,
    version = version + 1
WHERE %s
    AND id = @task_id
RETURNING 
    id,
    mitigation_id,
    name,
    description,
    state,
    time_estimate,
    assigned_to,
    created_at,
    updated_at,
    version
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"task_id":    c.ID,
		"updated_at": time.Now(),
	}

	maps.Copy(args, scope.SQLArguments())

	rows, err := conn.Query(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot query tasks: %w", err)
	}

	task, err := pgx.CollectExactlyOneRow(rows, pgx.RowToStructByName[Task])
	if err != nil {
		return fmt.Errorf("cannot collect tasks: %w", err)
	}

	*c = task

	return nil
}

func (c *Task) Delete(
	ctx context.Context,
	conn pg.Conn,
	scope Scoper,
) error {
	q := `
DELETE FROM tasks
WHERE %s
    AND id = @task_id
`
	q = fmt.Sprintf(q, scope.SQLFragment())

	args := pgx.NamedArgs{
		"task_id": c.ID,
	}

	maps.Copy(args, scope.SQLArguments())

	_, err := conn.Exec(ctx, q, args)
	if err != nil {
		return fmt.Errorf("cannot delete task: %w", err)
	}

	return nil
}
