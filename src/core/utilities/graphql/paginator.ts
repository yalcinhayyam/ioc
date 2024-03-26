import { IConnection, IEdge } from "../../types";
import { Cursor } from "./scalars";

export const paginator = <T>(
  items: ({ [K in keyof T]?: T[K] } & { id?: string })[],
  [first, after]: [number, Cursor | null | undefined]
): IConnection<T> => {
  const hasNextPage = items.length > first;
  const edges = hasNextPage ? items.slice(0, first) : items;
  const endCursor = edges.length > 0 ? edges[edges.length - 1].id : undefined;
  const startCursor = edges.length > 0 ? edges[0].id : undefined;
  const hasPreviousPage = !!after;

  return {
    edges: edges.map<IEdge<T>>((item) => ({
      cursor: new Cursor(item.id!),
      node: item as any,
    })),
    pageInfo: {
      hasNextPage,
      hasPreviousPage,
      startCursor: after
        ? after
        : startCursor
        ? new Cursor(startCursor)
        : undefined,
      endCursor: endCursor ? new Cursor(endCursor) : undefined,
    },
  };
};
