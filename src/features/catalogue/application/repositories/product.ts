import {  Product } from "../../domain/product";

export interface IProductRepository {
  get(): Promise<Product>;
}