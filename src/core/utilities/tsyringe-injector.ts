import { container, inject, injectable } from "tsyringe";
import { IInjectorCollection, InjectionToken } from "../types";

export class TsyringeInjectorCollection
  implements IInjectorCollection<typeof container>
{
  constructor(private readonly _container: typeof container) {}
  Injectable(): Function {
    return injectable();
  }
  Inject(token: InjectionToken): Function {
    return inject(token);
  }
  get container(): typeof container {
    return this._container;
  }
  resolve<T>(token: InjectionToken<T>): T {
    return this._container.resolve(token);
  }

  register<T>(token: InjectionToken<T>, value: T): void {
    this._container.registerInstance(token, value);
  }
}