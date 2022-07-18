import Route from './Route';
import RouteEntry from './RouteEntry';
export default class RouteCollection {

  private routeMap: Map<String, Route>;

  constructor() {
    this.routeMap = new Map<String, Route>();
  }

  add(routePath: string, route: Route) {
    this.routeMap.set(routePath, route);
  }

  get(uri: string): RouteEntry {
    const matchedPath = this.matchRoutePath(uri);
    return new RouteEntry(matchedPath, this.routeMap.get(matchedPath));
  }

  matchRoutePath(uri: string): String {
    const matches = [...this.routeMap.keys()].filter((item: String) => {
      const uriPattern = item.replace(/:[a-zA-Z0-9]+/g, '[a-zA-Z0-9]+');
      const regex = new RegExp(uriPattern);

      return regex.test(uri) && (uri.split('/').length === item.split('/').length);
    });

    const match = matches.includes(uri) ? uri : matches.pop() ?? '/404';
    return match;
  }

  setRouteMap(routeMap: Map<string, Route>) {
    this.routeMap = routeMap;
  }
  getRouteMap(): Map<String, Route> {
    return this.routeMap;
  }
}
