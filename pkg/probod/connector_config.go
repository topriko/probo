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

package probod

import (
	"encoding/json"
	"fmt"

	"github.com/getprobo/probo/pkg/connector"
)

type (
	connectorConfig struct {
		Name   string                 `json:"name"`
		Type   connector.ProtocolType `json:"type"`
		Config connector.Connector    `json:"-"`
	}

	connectorConfigOAuth2 struct {
		ClientID     string   `json:"client-id"`
		ClientSecret string   `json:"client-secret"`
		RedirectURI  string   `json:"redirect-uri"`
		AuthURL      string   `json:"auth-url"`
		TokenURL     string   `json:"token-url"`
		Scopes       []string `json:"scopes"`
	}
)

func (c *connectorConfig) UnmarshalJSON(data []byte) error {
	var tmp struct {
		Name      string                 `json:"name"`
		Type      connector.ProtocolType `json:"type"`
		RawConfig json.RawMessage        `json:"config"`
	}

	if err := json.Unmarshal(data, &tmp); err != nil {
		return fmt.Errorf("cannot unmarshal connector config: %w", err)
	}

	c.Name = tmp.Name
	c.Type = tmp.Type

	switch tmp.Type {
	case connector.ProtocolOAuth2:
		var config connectorConfigOAuth2
		if err := json.Unmarshal(tmp.RawConfig, &config); err != nil {
			return fmt.Errorf("cannot unmarshal oauth2 connector config: %w", err)
		}

		oauth2Connector := connector.OAuth2Connector{
			ClientID:     config.ClientID,
			ClientSecret: config.ClientSecret,
			RedirectURI:  config.RedirectURI,
			AuthURL:      config.AuthURL,
			TokenURL:     config.TokenURL,
			Scopes:       config.Scopes,
		}

		c.Config = &oauth2Connector
	default:
		return fmt.Errorf("unknown connector type: %q", tmp.Type)
	}

	return nil
}
