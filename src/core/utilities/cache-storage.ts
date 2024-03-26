export class CacheStorage {
  private constructor() {}
  static create() {
    return new CacheStorage();
  }
  private readonly cache: Map<any, string> = new Map();

  set(key: string, value: any, ttlInSeconds?: number): void {
    if (ttlInSeconds) {
      const expirationTime = ttlInSeconds * 1000;
      setTimeout(() => {
        this.del(key);
      }, expirationTime);
    }
    this.cache.set(key, JSON.stringify(value));
  }

  get(key: string): string | undefined | null {
    return this.cache.get(key);
  }

  del(key: string): void {
    this.cache.delete(key);
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  flushall(): void {
    this.cache.clear();
  }
}
const cache = CacheStorage.create();
cache.set("test", { abc: "123" }, 2);

// console.log(cache.get("test"));
// console.log(cache.get("test"));
// console.log(cache.get("test"));
// setTimeout(() => {
//   console.log(cache.get("test"));
// }, 3000);
