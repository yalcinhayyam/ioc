import { Field, ObjectType } from "type-graphql";
import { Cursor } from "./scalars";
import { ICursor } from "../../types";

interface IPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: ICursor;
  endCursor?: ICursor;
}

@ObjectType()
export class PageInfo implements IPageInfo {
  @Field()
  hasNextPage!: boolean;
  @Field()
  hasPreviousPage!: boolean;
  @Field()
  startCursor?: Cursor;
  @Field()
  endCursor?: Cursor;
}
