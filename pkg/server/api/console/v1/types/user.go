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

package types

import (
	"github.com/getprobo/probo/pkg/coredata"
	"github.com/getprobo/probo/pkg/page"
)

type (
	UserOrderBy OrderBy[coredata.UserOrderField]
)

func NewUserConnection(p *page.Page[*coredata.User, coredata.UserOrderField]) *UserConnection {
	var edges = make([]*UserEdge, len(p.Data))

	for i := range edges {
		edges[i] = NewUserEdge(p.Data[i], p.Cursor.OrderBy.Field)
	}

	return &UserConnection{
		Edges:    edges,
		PageInfo: NewPageInfo(p),
	}
}

func NewUserEdge(user *coredata.User, orderBy coredata.UserOrderField) *UserEdge {
	return &UserEdge{
		Cursor: user.CursorKey(orderBy),
		Node:   NewUser(user),
	}
}

func NewUser(u *coredata.User) *User {
	return &User{
		ID:        u.ID,
		Email:     u.EmailAddress,
		FullName:  u.FullName,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
