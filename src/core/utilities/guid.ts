import { v4 } from 'uuid';

export class Guid {
    static generate() {
      return new Guid(v4());
    }
    static hydrate(guid: Guid) {
      return new Guid(guid.token);
    }
    compare(other: Guid) {
      return this.token == other.token;
    }
    expose() {
      return this.token;
    }
    private constructor(private readonly token: string) {}
  }
  