import Route from './Route';

export default class RouteEntry {
  
  /**
   * @var path The route path
   */
  private path: String;

  /**
   * @var route The Route object, or can be undefined for initialization purposes.
   */
  private route: Route | undefined;

  constructor(path: String, route: Route | undefined) {
    this.path = path;
    this.route = route;
  }

  /**
   * Get the route path
   * 
   * @returns The route path
   */
  getPath(): String {
    return this.path;
  }

  /**
   * Get the Route object
   * 
   * @returns The Route object when defined
   */
  getRoute(): Route | undefined  {
    return this.route;
  }

  /**
   * Get Params returns route parameters when set, and maps them to the index they are in the 
   * array.
   * 
   * Example pathname: /products/:productId/option/:size
   * would have a map of two entries ':productId' => 2 and ':size' => 4 (the leading slash is and elememt in the original array)
   * 
   * @returns A Map of the paramters, mapped to the index they are in the pathname
   */
  getParams(): Map<String , number> {
    let params: Map<String, number> = new Map();
    
    this.path.split('/').map((param, key) => {
      if (param.startsWith(':')) {
        params.set(param, key);
      }
    })

    return params;
  }

  /**
   * Good for checking of the route has any parameters that can be taken.
   * 
   * @returns boolean true of there are parameters in the path, false if not
   */
  hasParams(): boolean {
    return [...this.getParams().keys()].length > 0;
  }
}
