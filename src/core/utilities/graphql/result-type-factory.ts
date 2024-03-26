import { ClassType, Field, ObjectType } from "type-graphql";

export function Result<TItem extends object>(TItemClass: ClassType<TItem>) {
  @ObjectType()
  abstract class ResultResponseClass {
    @Field((type) => [TItemClass], { nullable: true })
    data?: TItem;
    @Field({ nullable: true })
    error?: string;
  }
  return ResultResponseClass;
}



// @ObjectType()
// export class CreateBookPayload {
//   @Field()
//   id!: string;
//   @Field()
//   authorId!: string;
//   @Field()
//   title!: string;
// }


// @ObjectType()
// export class CreateBookPayloadResult extends Result(CreateBookPayload) {}
