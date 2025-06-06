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
	EvidenceState uint8
)

const (
	EvidenceStateRequested EvidenceState = iota
	EvidenceStateFulfilled
)

func (es EvidenceState) MarshalText() ([]byte, error) {
	return []byte(es.String()), nil
}

func (es *EvidenceState) UnmarshalText(data []byte) error {
	val := string(data)

	switch val {
	case EvidenceStateRequested.String():
		*es = EvidenceStateRequested
	case EvidenceStateFulfilled.String():
		*es = EvidenceStateFulfilled
	default:
		return fmt.Errorf("invalid EvidenceState value: %q", val)
	}

	return nil
}

func (es EvidenceState) String() string {
	var val string

	switch es {
	case EvidenceStateRequested:
		val = "REQUESTED"
	case EvidenceStateFulfilled:
		val = "FULFILLED"
	}

	return val
}

func (es *EvidenceState) Scan(value any) error {
	val, ok := value.(string)
	if !ok {
		return fmt.Errorf("invalid scan source for EvidenceState, expected string got %T", value)
	}

	return es.UnmarshalText([]byte(val))
}

func (es EvidenceState) Value() (driver.Value, error) {
	return es.String(), nil
}
