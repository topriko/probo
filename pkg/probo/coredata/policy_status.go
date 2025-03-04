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
	"database/sql/driver"
	"fmt"
)

type (
	PolicyStatus uint8
)

const (
	PolicyStatusDraft PolicyStatus = iota
	PolicyStatusActive
)

func (ps PolicyStatus) MarshalText() ([]byte, error) {
	return []byte(ps.String()), nil
}

func (ps *PolicyStatus) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case PolicyStatusDraft.String():
		*ps = PolicyStatusDraft
	case PolicyStatusActive.String():
		*ps = PolicyStatusActive
	default:
		return fmt.Errorf("invalid PolicyStatus value: %q", val)
	}

	return nil
}

func (ps PolicyStatus) String() string {
	var val string

	switch ps {
	case PolicyStatusDraft:
		val = "DRAFT"
	case PolicyStatusActive:
		val = "ACTIVE"
	}

	return val
}

func (ps *PolicyStatus) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for PolicyStatus, expected string got %T", value)
	}

	return ps.UnmarshalText([]byte(val))
}

func (ps PolicyStatus) Value() (driver.Value, error) {
	return ps.String(), nil
}
