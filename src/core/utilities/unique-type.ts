import { Guid } from "./guid";

export abstract class UniqueType<HashCode> {
  constructor(private readonly hashCode: HashCode) {}
  compare(other: UniqueType<HashCode>) {
    return this.hashCode == other.hashCode;
  }
}

export function UniqueTypeGenerator() {
  const hashCode = Guid.generate();
  return class extends UniqueType<Guid> {
    constructor() {
      super(hashCode);
    }
  };
}
