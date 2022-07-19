import RenderData from "../types/RenderData";

/**
 * RenderProps
 * 
 * This class is used to keep everything in packaged interface to be passed into components, but allows the flexibility
 * to structure your own data within.
 */
export default class RenderProps {
  
  /**
   * @var data Where all of the RenderData is stored
   */
  private data: RenderData;

  /**
   * Constructor
   * 
   * @param data Takes the RenderData to be passed to the render() method
   */
  constructor(data: RenderData) {
    this.data = data;
  }

  /**
   * Get the page from the data
   * 
   * @returns string
   */
  getTitle() {
    return this.data?.title ?? '';
  }

  /**
   * Get the description from the data
   * 
   * @returns string
   */
  getDescription() {
    return this.data?.description ?? '';
  }

  /**
   * Get a paramters that was passed into the route
   * 
   * @param key This is the same value as whatever matches with route. Example - ':productId'
   * @returns string
   */
  getParam(key: String) {
    return this?.data?.params?.get(key) ?? '';
  }

  /**
   * Get the var by its set key, can return any since any is allowed in the map value -> Map<String, any>
   * 
   * @param key The string value of the 
   * @returns any
   */
  getVar(key: String) {
    return this?.data?.vars?.get(key) ?? '';
  }

  /**
   * Good for when is is desired to get the data and spread it for easier implementation
   * 
   * @returns RenderData
   */
  getData(): RenderData {
    return this.data;
  }
}
