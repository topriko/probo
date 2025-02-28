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

package awsconfig

import (
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/credentials/ec2rolecreds"
	"go.gearno.de/kit/httpclient"
	"go.gearno.de/kit/log"
)

type (
	Options struct {
		SessionName     string
		Endpoint        string
		Region          string
		AccessKeyID     string
		SecretAccessKey string
	}
)

const (
	DefaultRegion      = "us-east-2"
	DefaultSessionName = "github.com/getprobo/probo"
)

func NewConfig(logger *log.Logger, httpClient *http.Client, opts Options) aws.Config {
	if opts.Region == "" {
		opts.Region = DefaultRegion
	}

	if opts.SessionName == "" {
		opts.SessionName = ""
	}

	logger = logger.Named(
		"aws.client",
		log.WithAttributes(
			log.String("region", opts.Region),
			log.String("endpoint", opts.Endpoint),
			log.String("session_name", opts.SessionName),
		),
	)

	if httpClient == nil {
		httpClient = httpclient.DefaultPooledClient(httpclient.WithLogger(logger))
	}

	cfg := aws.NewConfig()
	cfg.HTTPClient = httpClient
	cfg.Region = opts.Region
	// cfg.Logger = logger TODO: add logger interface for aws

	if opts.AccessKeyID != "" && opts.SecretAccessKey != "" {
		cfg.Credentials = credentials.NewStaticCredentialsProvider(
			opts.AccessKeyID,
			opts.SecretAccessKey,
			opts.SessionName,
		)
	} else {
		cfg.Credentials = aws.NewCredentialsCache(
			ec2rolecreds.New(),
			func(o *aws.CredentialsCacheOptions) {
				o.ExpiryWindow = 10 * time.Minute
			},
		)
	}

	if opts.Endpoint != "" {
		cfg.BaseEndpoint = aws.String(opts.Endpoint)
	}

	return cfg.Copy()
}
