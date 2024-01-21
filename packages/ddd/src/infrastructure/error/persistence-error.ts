export class PersistenceError extends Error {
  /**
   * An error occurred when interacting with the persistence technology
   */
  constructor(message?: string) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
