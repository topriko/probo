/**
 * @generated SignedSource<<f1cdd20d14ca9fefe868019e5aa43741>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvidenceState = "EXPIRED" | "INVALID" | "VALID";
export type UploadEvidenceInput = {
  file: any;
  name: string;
  taskId: string;
};
export type ControlOverviewPageUploadEvidenceMutation$variables = {
  connections: ReadonlyArray<string>;
  input: UploadEvidenceInput;
};
export type ControlOverviewPageUploadEvidenceMutation$data = {
  readonly uploadEvidence: {
    readonly evidenceEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly fileUrl: string;
        readonly id: string;
        readonly mimeType: string;
        readonly size: number;
        readonly state: EvidenceState;
      };
    };
  };
};
export type ControlOverviewPageUploadEvidenceMutation = {
  response: ControlOverviewPageUploadEvidenceMutation$data;
  variables: ControlOverviewPageUploadEvidenceMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "EvidenceEdge",
  "kind": "LinkedField",
  "name": "evidenceEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Evidence",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
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
          "name": "fileUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "mimeType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
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
          "name": "createdAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadEvidence",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "UploadEvidencePayload",
        "kind": "LinkedField",
        "name": "uploadEvidence",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "evidenceEdge",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "76c2ba38a9ba243840027c997b01b51b",
    "id": null,
    "metadata": {},
    "name": "ControlOverviewPageUploadEvidenceMutation",
    "operationKind": "mutation",
    "text": "mutation ControlOverviewPageUploadEvidenceMutation(\n  $input: UploadEvidenceInput!\n) {\n  uploadEvidence(input: $input) {\n    evidenceEdge {\n      node {\n        id\n        fileUrl\n        mimeType\n        size\n        state\n        createdAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b43bb6fc3d2a70fd8f81ccfb2532f067";

export default node;
