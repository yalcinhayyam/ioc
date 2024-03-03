export interface IUseCase<Type, Args> {
  handle(args: Args): Promise<Type>;
}

export interface IUseCasePipeline<Type, Args> {
  handle(args: Args, next: () => Promise<Type>): Promise<Type>;
}

type Constructor<T> = new (container: T) => T;
export type Callable<Type, Args> = (args: Args) => Promise<Type>;

export type InjectionToken<T = any> = string; //| Constructor<T>;

export interface IInjectorCollection<TContainer> {
  get container(): TContainer;
  register<T>(token: InjectionToken<T>, value: T): void;
  resolve<T>(token: InjectionToken<T>): T;
  Inject(token: InjectionToken): Function;
  Injectable(): Function;
}

export interface IInjector {
  service<T>(token: InjectionToken<T>): T;
  useCase<Type, Args>(token: InjectionToken<Type>): Callable<Type, Args>;
}
