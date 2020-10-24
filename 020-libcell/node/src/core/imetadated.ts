/**
 *
 * An interface to describe metadated objects with at least a name, a title, and
 * a description.
 *
 */
export interface IMetadated {

  /**
   *
   * The name of the item. As little as possible.
   *
   */
  name: string;

  /**
   *
   * The title of the item, a single sentence.
   *
   */
  title: string;

  /**
   *
   * The description, as long as needed.
   *
   */
  description: string;

}
