import { ClassType, Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { PageInfo } from "./page-info";
import { Cursor } from "./scalars/cursor-scalar";
import { IConnection, ICursor, IEdge, INode, IPageInfo } from "../../types";


export function GenerateEdgeType<T extends INode<T>>(TClass: ClassType<T>) {
  @ObjectType()
  abstract class Edge implements IEdge<T> {
    @Field((of) => Cursor)
    cursor!: ICursor;
    @Field((of) => TClass)
    node!: T;
  }

  return Edge;
}


export function Paginate<T>(TEdge: ClassType<IEdge<T>>) {
  @ObjectType()
  abstract class Connection implements IConnection<T> {
    @Field((type) => [TEdge])
    edges!: IEdge<T>[];
    @Field((of) => PageInfo)
    pageInfo!: IPageInfo;
  }
  return Connection;
}



export enum Roles {
  ADMIN = 1,
  USER = 2,
}

registerEnumType(Roles, {
  name: "Roles", // this one is mandatory
  description: "Role Id Management", // this one is optional
});

// @InputType()
// export class CreateBookInput {
//   @Field()
//   // @Length(3, 255)
//   author!: string;
//   @Field()
//   // @Length(3, 255)
//   title!: string;
// }

// @ObjectType()
// export class Author {
//   @Field()
//   id!: string;
//   @Field()
//   name?: string;
// }

// @ObjectType()
// export class Role {
//   @Field()
//   id!: number;
//   @Field()
//   code!: string;
//   @Field()
//   title!: string;
// }






// @ObjectType()
// export class BookNode implements INode<BookNode> {
//   @Field()
//   id!: string;
//   @Field()
//   title?: string;
//   @Field((of) => Author)
//   author!: Author;
// }

// @ObjectType()
// export class BookEdge extends GenerateEdgeType(BookNode) {}
// @ObjectType()
// export class BookConnection extends Paginate(BookEdge) {}
