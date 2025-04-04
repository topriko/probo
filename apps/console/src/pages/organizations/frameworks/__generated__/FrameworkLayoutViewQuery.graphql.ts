/**
 * @generated SignedSource<<4f0c7f7d3fb0272b838162d615ba905b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type FrameworkLayoutViewQuery$variables = {
  frameworkId: string;
};
export type FrameworkLayoutViewQuery$data = {
  readonly node: {
    readonly description?: string;
    readonly firstControl?: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly name: string;
          readonly referenceId: string;
        };
      }>;
    };
    readonly id: string;
    readonly name?: string;
    readonly " $fragmentSpreads": FragmentRefs<"ControlList_List">;
  };
};
export type FrameworkLayoutViewQuery = {
  response: FrameworkLayoutViewQuery$data;
  variables: FrameworkLayoutViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "frameworkId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "frameworkId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "kind": "Literal",
  "name": "orderBy",
  "value": {
    "direction": "ASC",
    "field": "CREATED_AT"
  }
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ControlEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Control",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "referenceId",
            "storageKey": null
          },
          (v3/*: any*/),
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v8 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  (v5/*: any*/)
],
v9 = [
  "orderBy"
],
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  },
  (v5/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FrameworkLayoutViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ControlList_List"
              },
              {
                "alias": "firstControl",
                "args": [
                  (v5/*: any*/)
                ],
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "__FrameworkLayoutView_firstControl_connection",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": "__FrameworkLayoutView_firstControl_connection(orderBy:{\"direction\":\"ASC\",\"field\":\"CREATED_AT\"})"
              }
            ],
            "type": "Framework",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FrameworkLayoutViewQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": (v8/*: any*/),
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "controls",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": "controls(first:100,orderBy:{\"direction\":\"ASC\",\"field\":\"CREATED_AT\"})"
              },
              {
                "alias": null,
                "args": (v8/*: any*/),
                "filters": (v9/*: any*/),
                "handle": "connection",
                "key": "FrameworkView_controls",
                "kind": "LinkedHandle",
                "name": "controls"
              },
              {
                "alias": "firstControl",
                "args": (v10/*: any*/),
                "concreteType": "ControlConnection",
                "kind": "LinkedField",
                "name": "controls",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": "controls(first:1,orderBy:{\"direction\":\"ASC\",\"field\":\"CREATED_AT\"})"
              },
              {
                "alias": "firstControl",
                "args": (v10/*: any*/),
                "filters": (v9/*: any*/),
                "handle": "connection",
                "key": "FrameworkLayoutView_firstControl",
                "kind": "LinkedHandle",
                "name": "controls"
              }
            ],
            "type": "Framework",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "98ca0e0c503bb7c5e3e538e8831eeefa",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "firstControl"
          ]
        }
      ]
    },
    "name": "FrameworkLayoutViewQuery",
    "operationKind": "query",
    "text": "query FrameworkLayoutViewQuery(\n  $frameworkId: ID!\n) {\n  node(id: $frameworkId) {\n    __typename\n    id\n    ... on Framework {\n      name\n      description\n      ...ControlList_List\n      firstControl: controls(first: 1, orderBy: {field: CREATED_AT, direction: ASC}) {\n        edges {\n          node {\n            id\n            referenceId\n            name\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n\nfragment ControlList_List on Framework {\n  controls(first: 100, orderBy: {field: CREATED_AT, direction: ASC}) {\n    edges {\n      node {\n        id\n        referenceId\n        name\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1935177e374d21015e102745c4d51e94";

export default node;
