import Container, { Service, Inject } from "typedi";
import { IInjectorCollection, InjectionToken } from "../types";

export class TypediInjectorCollection
  implements IInjectorCollection<typeof Container>
{
  constructor(private readonly _container: typeof Container) {}
  Injectable(): Function {
    return Service();
  }

  Inject(token: InjectionToken): Function {
    return Inject(token);
  }

  get container(): typeof Container {
    return this._container;
  }
  resolve<T>(token: InjectionToken<T>): T {
    return this._container.get(token);
  }
  register<T>(token: InjectionToken<T>, value: T): void {
    this._container.set(token, value);
  }
}
