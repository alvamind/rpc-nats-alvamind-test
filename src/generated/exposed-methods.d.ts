

export interface ExposedMethods {
  MathService: {
    add: <T extends any>(data: any) => Promise<T>;
    subtract: <T extends any>(data: any) => Promise<T>;
  };
}
