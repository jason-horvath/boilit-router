import { LitElement } from 'lit';
import RouteMetaData from '../types/RouteMetaData';

/**
 * Route
 * 
 * Used for keepgin route information together and passed into a RouteCollection
 */
export default class Route {
  
  /**
   * The element tag name that matches the @customElement decorator
   * 
   * @var customElement Must be set when passing into a RouteCollection entry
   */
  customElementName: string;

  /**
   * The LitElement to be registered with the browser.
   * 
   * @var component The must be a LitElement and is used by -> require('@my/components/MyComponent')
   */
  component: LitElement;

  /**
   * Meta data that can be passed to the route before is rendered.
   * 
   * @var meta RouteMetaData stores whatever is wanted to be preloaded into the page.
   */
  meta: RouteMetaData;

  /**
   * A flag that can be used to check if the route should be public of private
   * 
   * @var isProtected
   */
  isProtected: boolean = false;

  /**
   * Constructor
   * 
   * Sets up what is needed for the Route, not which paramters are required and see above for property info.
   * 
   * @param customElementName 
   * @param component 
   * @param isProtected 
   * @param meta 
   */
  constructor(
    customElementName: string,
    component: LitElement,
    isProtected: boolean = false,
    meta: RouteMetaData = {}
  ) {
    this.customElementName = customElementName;
    this.component = component;
    this.isProtected = isProtected;
    this.meta = meta;
  }

  /**
   *  Good for changing the meta after the route was set.
   * 
   * @param meta 
   */
  setMeta(meta: RouteMetaData) {
    this.meta = meta;
  }


  /**
   * Get the meta
   * 
   * @returns RouteMetaData
   */
  getMeta(): RouteMetaData {
    return this.meta;
  }
}
    
