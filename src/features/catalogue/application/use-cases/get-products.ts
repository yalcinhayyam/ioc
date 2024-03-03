import { IUseCase } from "../../../../core/types";
import { IProductRepository } from "../repositories/product";


export class GetProductItems implements IUseCase<any[], void> {
  constructor(private readonly productRepository: IProductRepository) {}
  handle(args: void): Promise<any[]> {
    return Promise.resolve(this.productRepository.get());
  }
}


