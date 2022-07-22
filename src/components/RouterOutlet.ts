import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import RouteCollection from '../core/RouteCollection';
import Route from '../core/Route';
import routeElement from '../directives/RouteElementDirective';
import RouteEntry from '../core/RouteEntry';
import RenderData from '../types/RenderData';
import RenderProps from '../core/RenderProps';
import UriLocation from '../core/UriLocation';

@customElement('router-outlet')
export default class RouterOutlet extends LitElement {

  /**
   * The source of truth for navigation.
   * 
   * @var location Used to properly process the full url after the `window.location.origin`
   */
  location: UriLocation = new UriLocation('');

  /**
   * This is the location that is redirected to when there is no matching route.
   * 
   * @var notFoundUir
   */
  @property()
  notFoundUri: string = '/404';

  /**
   * The current route to be used
   * 
   * @var currentRoute Should be an instance of route or undefined on init, or no matching entry.
   */
  @property()
  route: Route | undefined = undefined;
  /**
   * The collection of routes that are used to match with
   * 
   * @var routes This should be configured in your own routes file
   */
  @property()
  routes: RouteCollection = new RouteCollection();

  /**
   * The custom element tag for the router component.
   * 
   * @var routeTag This should match whatever is in the @customElement decorator
   */
  @property({type: String})
  routeTag = '';

  /**
   * The parameters that were found in the route
   * 
   * @var routeParams used to match up with the actual values that were entered in the url.
   */
  @property()
  routeParams: Map<String, String> = new Map<String, String>();
  
  /**
   * Used to separate the found route so that the Route and route path will stay packaged and make it to the view
   * 
   * @var routeEntry This is used just after a route is matched.
   */
  @property()
  routeEntry: RouteEntry = new RouteEntry('', undefined);

  /**
   * Navigate to the current window path and setup event listeners
   */
  override async connectedCallback() {
    super.connectedCallback();
    this.navigateToUri(this.getFullUri());
    this.routeNavigateListener();
    this.routePopStateListener();
  }

  /**
   * 
   */
  getFullUri(): string {
    return `${window.location.pathname}${window.location.search}`;
  }

  /**
   * Listens for the 'route-navigate' event that is triggered by the 'route-link' or anywhere else
   */
  routeNavigateListener() {
    window.addEventListener('route-navigate', (e: any) => {
      try {
        this.navigateToUri(e.detail.uri);
      } catch (e) {
        console.error(e);
      }
    })
  }

  /**
   * The will be triggered when matching routes.
   * 
   * @param uri The uri contains a matching route, everything after the `window.location.origin`
   */
  navigateToUri(uri: string) {
    this.location.setUri(uri);
    const path = this.location.getPath();
    const finalUri = this.location.getFinalUri();

    this.setupRoute(path);
 
    if(this.route instanceof Route) {
      window.history.pushState(
        { name: `${finalUri}`}, 
        '',
        `${finalUri}`
      );
      
      this.routeTag = this.route.customElementName;
    } else {
      this.redirectNotFound();
    }
  }

  /**
   * Listens to the popstate and does not push state to history to avoid, to allow back and forward navigation
   */
  routePopStateListener(): void {
    window.addEventListener('popstate', (e) => {
      const { pathname, search } = (e.target as Window).location
      this.location.setUri(`${pathname}${search}`);
      this.setupRoute(pathname);

      if(this.route instanceof Route) {
        this.routeTag = this.route.customElementName;
      } else {
        this.redirectNotFound()
      }
    });
  }

  /**
   * Takes the params found in the matching item from the RouteCollection, and sets the values from the window.location.pathname.
   * 
   * @param routeEntry The encapsulated matching route
   */
  setRouteParams(routeEntry: RouteEntry) {
    const entryParams = routeEntry.getParams();
    const pathParts = window.location.pathname.split('/');
    [...entryParams.keys()].map(name => {
      const pathKey = entryParams.get(name);
      if(typeof pathKey === 'number') {
        const value = pathParts[pathKey]
        this.routeParams.set(name, value);
      }
    })
  }

  /**
   * Redirect when not found
   */
  redirectNotFound() {
    this.routeEntry = this.routes.get(this.notFoundUri);
    const route = this.routeEntry.getRoute();
    if(route instanceof Route) {
      window.history.pushState({}, '', this.notFoundUri);
      this.routeTag = route.customElementName;
    } else {
      this.throwError(`Unable to find a matching route. Attempted to fallback to '/404', please add a '/404' route for proper behavior.`);
    }
  }

  /**
   * 
   * 
   * @param path The path matching the route.
   */
  setupRoute(path: string): void {
    this.routeEntry = this.routes.get(path);
    this.setRouteParams(this.routeEntry);
    this.route = this.routeEntry.getRoute();
  }

  /**
   * Assemble the render props to be passed to the current route component
   * 
   * @returns RenderProps The object used to interface with the component
   */
  getRenderProps(): RenderProps {
    const renderProps = {
      title: this.routeEntry.getRoute()?.meta.title ?? '',
      description: this.routeEntry.getRoute()?.meta.title ?? '',
      params: this.routeParams ?? new Map(),
      vars: this.routeEntry.getRoute()?.meta?.vars ?? new Map(),
      query: new URLSearchParams(window.location.search)
    } as RenderData

    return new RenderProps(renderProps);
  }

  /**
   * Throw an error with an input message.
   * 
   * @param message Error message to be used
   */
  throwError(message: string) {
    throw new Error(`Router Outlet Error: ${message}`);
  }

  /**
   * Dynamically renders the tag of the matching route.
   * 
   * @returns html
   */
  override render() {
    return html`<span>${routeElement(this.routeTag, this.getRenderProps())}</span>`;
  }
}
