// tslint:disable:no-unsafe-any
export class DomainError extends Error {
  /**
   * Represents a violation of business rules that was unexpected or not allowed.
   */
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
