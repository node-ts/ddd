 /**
  * Value objects are comparable based on their attributes rather than a specific "id" property. For example
  * "A 5 dollar note" can be represented as a value object. In the large majority of cases it doesn't matter
  * which specific $5 bill you are dealing with as all of them represent the same monetary value.
  */
export abstract class ValueObject<ImplementingClassType> {
  /**
   * Compares this value object to another in terms of equality
   */
  abstract equals<TupeOther extends ImplementingClassType> (other: TupeOther): boolean

  /**
   * Clones the attributes of this object into a new instance of the value object
   */
  abstract clone (): ImplementingClassType
}
