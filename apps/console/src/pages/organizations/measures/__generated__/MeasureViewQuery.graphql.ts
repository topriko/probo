/**
 * @generated SignedSource<<a6d5ebf3d09595b1da2cd16746fa1163>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type EvidenceState = "FULFILLED" | "REQUESTED";
export type EvidenceType = "FILE" | "LINK";
export type MeasureState = "IMPLEMENTED" | "IN_PROGRESS" | "NOT_APPLICABLE" | "NOT_STARTED";
export type TaskState = "DONE" | "TODO";
export type MeasureViewQuery$variables = {
  measureId: string;
};
export type MeasureViewQuery$data = {
  readonly measure: {
    readonly category?: string;
    readonly description?: string;
    readonly evidences?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly createdAt: string;
          readonly description: string;
          readonly filename: string;
          readonly id: string;
          readonly mimeType: string;
          readonly size: number;
          readonly state: EvidenceState;
          readonly type: EvidenceType;
          readonly url: string | null | undefined;
        };
      }>;
    };
    readonly id: string;
    readonly name?: string;
    readonly state?: MeasureState;
    readonly tasks?: {
      readonly __id: string;
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly assignedTo: {
            readonly fullName: string;
            readonly id: string;
            readonly primaryEmailAddress: string;
          } | null | undefined;
          readonly deadline: string | null | undefined;
          readonly description: string;
          readonly evidences: {
            readonly __id: string;
            readonly edges: ReadonlyArray<{
              readonly node: {
                readonly createdAt: string;
                readonly description: string;
                readonly filename: string;
                readonly id: string;
                readonly mimeType: string;
                readonly size: number;
                readonly state: EvidenceState;
                readonly type: EvidenceType;
                readonly url: string | null | undefined;
              };
            }>;
          };
          readonly id: string;
          readonly name: string;
          readonly state: TaskState;
          readonly timeEstimate: any | null | undefined;
        };
      }>;
    };
  };
};
export type MeasureViewQuery = {
  response: MeasureViewQuery$data;
  variables: MeasureViewQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "measureId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "measureId"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "state",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v9 = {
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
},
v10 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v11 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EvidenceEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Evidence",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
            "name": "filename",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "size",
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "type",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "url",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          (v4/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      (v8/*: any*/)
    ],
    "storageKey": null
  },
  (v9/*: any*/),
  (v10/*: any*/)
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timeEstimate",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deadline",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "People",
  "kind": "LinkedField",
  "name": "assignedTo",
  "plural": false,
  "selections": [
    (v2/*: any*/),
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
},
v15 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  }
],
v16 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MeasureViewQuery",
    "selections": [
      {
        "alias": "measure",
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
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": "evidences",
                "args": null,
                "concreteType": "EvidenceConnection",
                "kind": "LinkedField",
                "name": "__MeasureView_evidences_connection",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": null
              },
              {
                "alias": "tasks",
                "args": null,
                "concreteType": "TaskConnection",
                "kind": "LinkedField",
                "name": "__MeasureView_tasks_connection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TaskEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Task",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          {
                            "alias": "evidences",
                            "args": null,
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "__MeasureView_task_evidences_connection",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "Measure",
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
    "name": "MeasureViewQuery",
    "selections": [
      {
        "alias": "measure",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              {
                "alias": null,
                "args": (v15/*: any*/),
                "concreteType": "EvidenceConnection",
                "kind": "LinkedField",
                "name": "evidences",
                "plural": false,
                "selections": (v11/*: any*/),
                "storageKey": "evidences(first:100)"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "MeasureView_evidences",
                "kind": "LinkedHandle",
                "name": "evidences"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "concreteType": "TaskConnection",
                "kind": "LinkedField",
                "name": "tasks",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TaskEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Task",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v12/*: any*/),
                          (v13/*: any*/),
                          (v14/*: any*/),
                          {
                            "alias": null,
                            "args": (v16/*: any*/),
                            "concreteType": "EvidenceConnection",
                            "kind": "LinkedField",
                            "name": "evidences",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": "evidences(first:50)"
                          },
                          {
                            "alias": null,
                            "args": (v16/*: any*/),
                            "filters": null,
                            "handle": "connection",
                            "key": "MeasureView_task_evidences",
                            "kind": "LinkedHandle",
                            "name": "evidences"
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": "tasks(first:100)"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "MeasureView_tasks",
                "kind": "LinkedHandle",
                "name": "tasks"
              }
            ],
            "type": "Measure",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2693fa3e0141f58235566f539194fcd6",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "measure",
            "evidences"
          ]
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": null
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "measure",
            "tasks"
          ]
        }
      ]
    },
    "name": "MeasureViewQuery",
    "operationKind": "query",
    "text": "query MeasureViewQuery(\n  $measureId: ID!\n) {\n  measure: node(id: $measureId) {\n    __typename\n    id\n    ... on Measure {\n      name\n      description\n      state\n      category\n      evidences(first: 100) {\n        edges {\n          node {\n            id\n            mimeType\n            filename\n            size\n            state\n            type\n            url\n            createdAt\n            description\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      tasks(first: 100) {\n        edges {\n          node {\n            id\n            name\n            description\n            state\n            timeEstimate\n            deadline\n            assignedTo {\n              id\n              fullName\n              primaryEmailAddress\n            }\n            evidences(first: 50) {\n              edges {\n                node {\n                  id\n                  mimeType\n                  filename\n                  size\n                  state\n                  type\n                  url\n                  createdAt\n                  description\n                  __typename\n                }\n                cursor\n              }\n              pageInfo {\n                endCursor\n                hasNextPage\n              }\n            }\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4e211c36d94ebd914b6de254dfbdf946";

export default node;
