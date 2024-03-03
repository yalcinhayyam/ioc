import { IProductRepository } from "../../application/repositories/product";
import { IProductService } from "../../application/services/product";



export class ProductService implements IProductService {
  constructor(private readonly productRepository: IProductRepository) {}
  list() {
    return this.productRepository.get();
  }
}
