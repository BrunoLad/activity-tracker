export abstract class Builder<T> {
  protected package: T = new Object() as T;

  constructor() {
    this.package = new (this.package as any).constructor
  }

  public build(): T {
    const result = this.package;

    this.reset();

    return result;
  }

  private reset(): void {
    this.package = new (this.package as any).constructor;
  }
}
