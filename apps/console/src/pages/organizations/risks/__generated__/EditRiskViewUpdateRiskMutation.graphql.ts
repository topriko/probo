/**
 * @generated SignedSource<<c9530c22837ce495259b6d3ac404da87>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateRiskInput = {
  description?: string | null | undefined;
  id: string;
  inherentImpact?: number | null | undefined;
  inherentLikelihood?: number | null | undefined;
  name?: string | null | undefined;
  residualImpact?: number | null | undefined;
  residualLikelihood?: number | null | undefined;
};
export type EditRiskViewUpdateRiskMutation$variables = {
  input: UpdateRiskInput;
};
export type EditRiskViewUpdateRiskMutation$data = {
  readonly updateRisk: {
    readonly risk: {
      readonly description: string;
      readonly id: string;
      readonly inherentImpact: number;
      readonly inherentLikelihood: number;
      readonly name: string;
      readonly residualImpact: number;
      readonly residualLikelihood: number;
      readonly updatedAt: string;
    };
  };
};
export type EditRiskViewUpdateRiskMutation = {
  response: EditRiskViewUpdateRiskMutation$data;
  variables: EditRiskViewUpdateRiskMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateRiskPayload",
    "kind": "LinkedField",
    "name": "updateRisk",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Risk",
        "kind": "LinkedField",
        "name": "risk",
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
            "name": "updatedAt",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EditRiskViewUpdateRiskMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditRiskViewUpdateRiskMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1fb9a7f1a9a6dc2fd8b1c3235336324b",
    "id": null,
    "metadata": {},
    "name": "EditRiskViewUpdateRiskMutation",
    "operationKind": "mutation",
    "text": "mutation EditRiskViewUpdateRiskMutation(\n  $input: UpdateRiskInput!\n) {\n  updateRisk(input: $input) {\n    risk {\n      id\n      name\n      description\n      inherentLikelihood\n      inherentImpact\n      residualLikelihood\n      residualImpact\n      updatedAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "75f21269b0c81f77ce4e3547010059ee";

export default node;
