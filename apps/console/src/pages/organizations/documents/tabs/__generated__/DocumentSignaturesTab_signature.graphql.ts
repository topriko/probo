/**
 * @generated SignedSource<<e3ddbde4beb849447cb819f8991245a7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type DocumentVersionSignatureState = "REQUESTED" | "SIGNED";
import { FragmentRefs } from "relay-runtime";
export type DocumentSignaturesTab_signature$data = {
  readonly id: string;
  readonly requestedAt: any;
  readonly signedAt: any | null | undefined;
  readonly signedBy: {
    readonly fullName: string;
    readonly primaryEmailAddress: string;
  };
  readonly state: DocumentVersionSignatureState;
  readonly " $fragmentType": "DocumentSignaturesTab_signature";
};
export type DocumentSignaturesTab_signature$key = {
  readonly " $data"?: DocumentSignaturesTab_signature$data;
  readonly " $fragmentSpreads": FragmentRefs<"DocumentSignaturesTab_signature">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DocumentSignaturesTab_signature",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "state",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "signedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "requestedAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "People",
      "kind": "LinkedField",
      "name": "signedBy",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fullName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "primaryEmailAddress",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "DocumentVersionSignature",
  "abstractKey": null
};

(node as any).hash = "b07437b34548744fef4ed78d4f1f0a62";

export default node;
