import { GraphQLResolveInfo } from "graphql";
import * as graphqlFields from "graphql-fields";

import { Callable, ICursor, IInjector } from "../../types";

export type Projection<T> = {
  select: {
    [key in keyof T]: T[key] extends Array<infer U>
      ? U extends object
        ? Projection<U>
        : boolean
      : T[key] extends object
      ? Projection<T[key]>
      : boolean;
  };
};

export type QueryParams<T> = {
  first: number;
  after?: ICursor;
  orderBy?: "asc" | "desc";
  fields?: Projection<T>;
};

export type QueryResult = {
  skip: number;
  take: number;
  cursor?: { id: string };
  orderBy: { id: "asc" | "desc" };
};

export type CreateQuery<T> = Callable<QueryResult, QueryParams<T>>;

export function createQuery<T>(injector: IInjector): CreateQuery<T> {
  return async ({ first, after, orderBy, fields }: QueryParams<T>) => ({
    skip: 0,
    take: first,
    cursor: after ? { id: after.value } : undefined,
    orderBy: { id: orderBy ? orderBy : "asc" },
    ...(fields ? fields : {}),
  });
}

export const fieldSelector = <T>(
  info: GraphQLResolveInfo,
  // ignore: { [K in keyof T]?: T[K] | true }
): Projection<T> => {
  const traverse = (infoObj: any): any => {
    const keys = Object.keys(infoObj);

    if (keys.length === 0) {
      return true;
    }

    let result: Record<string, any> = {};

    if (isConnectionType(infoObj)) {
      return traverse(infoObj.edges.node);
    }

    filterTypeName(keys).forEach((key) => {
      result[key] = traverse(infoObj[key]);
    });
    // console.log(JSON.stringify(result))

    return { select: result };
  };
  return traverse(graphqlFields(info));
};

function filterTypeName(keys: string[]) {
  const TYPE_NAME = "__typename";
  return keys.filter((key) => key !== TYPE_NAME);
}

function isConnectionType<T>(value: any): value is { edges: { node: T } } {
  if (typeof value !== "object") return false;

  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return "edges" in value && "node" in value.edges;
}

function isConnectionNodeType<T>(value: any): value is { node: T } {
  if (typeof value !== "object") return false;
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return "node" in value;
}

function isConnectionEdgeType<T>(value: any): value is { edges: {} } {
  if (typeof value !== "object") return false;
  const keys = Object.keys(value);
  if (keys.length === 0) {
    return false;
  }

  return "edges" in value;
}
