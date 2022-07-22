/**
 * Class used to detmine the uri location as the source of truth for the routing. 
 * 
 * Navigation has to be funneled through here and not used the window, or something like query strings
 * will be uninetntionally carried over to a route-link that does not have those parameters.
 */
export default class UriLocation {
  private uri: string;
  constructor(uri: string) {
    this.uri = uri;
  }

  /**
   * Get The Path
   * 
   * @returns string synonymouse with `window.location.pathname`
   */
  getPath(): string {
    const path = this.uri.split('?')[0];

    return path === '' ? '/' : path;
  }

  /**
   * Set the URI
   *  
   * This will be used to calculate other return values within the class.
   * 
   * @param uri The full uri, Should contain the window.location `pathname` and `search` 
   */
  setUri(uri: string): void {
    this.uri = uri;
  }

  /**
   * Get Final URI
   * 
   * @returns string The full URI to be used after the `origin`
   */
  getFinalUri(): string {
    const path = this.getPath();
    const query = this.getQueryParams().toString();
    const finalQuery = query === '' ? '' : `?${query}`;
    
    return `${path}${finalQuery}`;
  }

  /**
   * Get Query Params
   * 
   * Take all of the query params and put them into a URLSearchParams Object
   * 
   * @returns URLSearchParams
   */
  getQueryParams(): URLSearchParams {
    const query = this.uri.split('?')[1] ?? '';
    
    return new URLSearchParams(query);
  }
}
