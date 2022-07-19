import Route from './Route';
import RouteEntry from './RouteEntry';
export default class RouteCollection {

  /**
   * This should be where all routes are stored.
   * 
   * @var routeMap A RouteCollection of all Route from the configured routes
   */
  private routeMap: Map<String, Route>;

  /**
   * Constructor
   * 
   * Sets up an empty route map to be added to.
   */
  constructor() {
    this.routeMap = new Map<String, Route>();
  }

  /**
   * Add a route to the collection
   * 
   * @param routePath The path that is used ot match the route
   * @param route Must be a Route object with the paramters in the Route
   */
  add(routePath: string, route: Route) {
    this.routeMap.set(routePath, route);
  }

  /**
   * Get a RouteEntry from the collection.
   * 
   * @param uri The uri returned from the browser, not a route path.
   * @returns RouteEntry that is part of this.routeMap
   */
  get(uri: string): RouteEntry {
    const matchedPath = this.matchRoutePath(uri);
    return new RouteEntry(matchedPath, this.routeMap.get(matchedPath));
  }

  /**
   * Match what is entered in then window.location.pathname to an entry in the RouteCollecton
   * 
   * @param uri The uri that is from the browser, not a route path
   * @returns The matched route path/key that may be found in the this.routeMap
   * 
   */
  matchRoutePath(uri: string): String {
    const matches = [...this.routeMap.keys()].filter((item: String) => {
      const uriPattern = item.replace(/:[a-zA-Z0-9]+/g, '[a-zA-Z0-9]+');
      const regex = new RegExp(uriPattern);

      return regex.test(uri) && (uri.split('/').length === item.split('/').length);
    });

    const match = matches.includes(uri) ? uri : matches.pop() ?? '/404';
    return match;
  }

  /**
   * Set a routeMap in bulk.
   * 
   * @param routeMap 
   */
  setRouteMap(routeMap: Map<string, Route>) {
    this.routeMap = routeMap;
  }

  /**
   * Get the route map from the RouteCollection
   * 
   * @returns Map<String, Route>
   */
  getRouteMap(): Map<String, Route> {
    return this.routeMap;
  }
}
