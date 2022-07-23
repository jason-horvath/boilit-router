import Route from './Route';
import RouteEntry from './RouteEntry';
export default class RouteCollection {

  /**
   * Not Found Uri
   * 
   * @var notFoundUri
   */
  private notFoundUri: string = '/404';

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
   * @param path The uri returned from the browser, not a route path.
   * @returns RouteEntry that is part of this.routeMap
   */
  get(path: string): RouteEntry {
    const matchedPath = this.matchRoutePath(path);
    return new RouteEntry(matchedPath, this.routeMap.get(matchedPath));
  }

  /**
   * Match what is entered in then window.location.pathname to an entry in the RouteCollecton
   * 
   * For dynamic URLs the return is early if there was a matchign dynamic path, the static routes, are checked to make sure they match exactly
   * so that something like `/about` does not come back as a match for  `/aboutExtrachars`. Mis matched dynamic route will ultimate fail at the point of regex checks
   * 
   * @param path The uri that is from the browser, not a route path
   * @returns The matched route path/key that may be found in the this.routeMap
   * 
   */
  matchRoutePath(path: string): String {
    const matches = [...this.routeMap.keys()].filter((item: String) => {
      const regex = new RegExp(this.uriMatchPattern(item));

      return regex.test(path) && (path.split('/').length === item.split('/').length);
    });

    const match = matches.pop() ?? '';

    if(match.indexOf(':') !== -1) {
      return match;
    }
    
    return match === path ? match : '';
  }

  /**
   * Uri Match Pattern
   * 
   * @return string Return the route path with regex in it
   */
   uriMatchPattern(source: String): string {
    return source.replace(/:[a-zA-Z0-9]+/g, '[a-zA-Z0-9]+');
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

  /**
   * Get the no found Uri for external use.
   * 
   * @returns this.notDoundUri
   */
  getNotFoundUri(): string {
    return this.notFoundUri;
  }
}
