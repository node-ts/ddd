// tslint:disable:no-any
/**
 * A class definition type
 */
export type ClassConstructor<TReturn> = new (...args: any[]) => TReturn
