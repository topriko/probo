/**
 * @generated SignedSource<<f5de62a6351fe2691ad8aff671be4aad>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RiskTreatment = "ACCEPTED" | "AVOIDED" | "MITIGATED" | "TRANSFERRED";
export type CreateRiskInput = {
  description: string;
  inherentImpact: number;
  inherentLikelihood: number;
  name: string;
  organizationId: string;
  ownerId?: string | null | undefined;
  residualImpact?: number | null | undefined;
  residualLikelihood?: number | null | undefined;
  treatment: RiskTreatment;
};
export type NewRiskViewCreateRiskMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateRiskInput;
};
export type NewRiskViewCreateRiskMutation$data = {
  readonly createRisk: {
    readonly riskEdge: {
      readonly node: {
        readonly createdAt: string;
        readonly description: string;
        readonly id: string;
        readonly inherentImpact: number;
        readonly inherentLikelihood: number;
        readonly name: string;
        readonly residualImpact: number;
        readonly residualLikelihood: number;
        readonly treatment: RiskTreatment;
        readonly updatedAt: string;
      };
    };
  };
};
export type NewRiskViewCreateRiskMutation = {
  response: NewRiskViewCreateRiskMutation$data;
  variables: NewRiskViewCreateRiskMutation$variables;
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
  "concreteType": "RiskEdge",
  "kind": "LinkedField",
  "name": "riskEdge",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Risk",
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
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "description",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inherentLikelihood",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inherentImpact",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "residualLikelihood",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "residualImpact",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "treatment",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "createdAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "updatedAt",
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
    "name": "NewRiskViewCreateRiskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateRiskPayload",
        "kind": "LinkedField",
        "name": "createRisk",
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
    "name": "NewRiskViewCreateRiskMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateRiskPayload",
        "kind": "LinkedField",
        "name": "createRisk",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "riskEdge",
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
    "cacheID": "9f296661d12f36362aeecd2a1fd4aa63",
    "id": null,
    "metadata": {},
    "name": "NewRiskViewCreateRiskMutation",
    "operationKind": "mutation",
    "text": "mutation NewRiskViewCreateRiskMutation(\n  $input: CreateRiskInput!\n) {\n  createRisk(input: $input) {\n    riskEdge {\n      node {\n        id\n        name\n        description\n        inherentLikelihood\n        inherentImpact\n        residualLikelihood\n        residualImpact\n        treatment\n        createdAt\n        updatedAt\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7f70a20771d9f05f62e952a59c5484e3";

export default node;
