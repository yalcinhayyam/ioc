import { Callable, IInjector, IInjectorCollection, IUseCase, InjectionToken } from "../types";


export class Injector<TContainer> implements IInjector {
  private constructor(
    private readonly _collection: IInjectorCollection<TContainer>
  ) {}
  static create<TContainer>(collection: IInjectorCollection<TContainer>) {
    return new Injector<TContainer>(collection);
  }
  service<T>(token: InjectionToken<T>): T {
    return this._collection.resolve(token);
  }
  useCase<Type, Args>(token: InjectionToken<Type>): Callable<Type, Args> {
    return (args: Args) =>
      this._collection.resolve<IUseCase<Type, Args>>(token).handle(args);
  }
}
