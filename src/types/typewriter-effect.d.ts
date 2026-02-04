declare module 'typewriter-effect/dist/core' {
  interface TypewriterOptions {
    loop?: boolean;
    delay?: number;
    deleteSpeed?: number;
    cursor?: string;
  }

  export default class Typewriter {
    constructor(element: HTMLElement | string, options?: TypewriterOptions);

    typeString(text: string): this;
    pauseFor(ms: number): this;
    deleteAll(speed?: number): this;
    start(): this;
  }
}
