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
   * Default tag element in the event there is no matching route.
   * 
   * @var defaultTag This will be rendered if there is not matching route at all.
   */
  @property({type: String})
  defaultTag = 'div';

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
    this.directNavigateToUri(this.getFullUri());
    this.routeNavigateListener();
    this.routePopStateListener();
  }

  /**
   * Get Full Uri
   * 
   * @returns string The full uri after the `window.location.origin`
   */
  getFullUri(): string {
    const { pathname, hash, search } = window.location;
    return `${pathname}${hash}${search}`;
  }

  /**
   * This is used when the window is directly navivated to. Push state should be left out since it will cause a `null` entry
   * to be added to the history.
   * 
   * @param uri The uri contains a matching route, everything after the `window.location.origin`
   */
  directNavigateToUri(uri: string) {
    this.location.setUri(uri);
    const path = this.location.getPath();
    
    this.setupRoute(path);

    this.routeTag = this.route instanceof Route ? this.route.customElementName : this.defaultTag ;
  }

  /**
   * Listens for the 'route-navigate' event that is triggered by the 'route-link' or anywhere else
   */
  routeNavigateListener(): void {
    window.addEventListener('route-navigate', (e: any) => {
      this.navigateToUri(e.detail.uri);
    });
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
        { key: finalUri }, 
        '',
        finalUri
      );

      this.routeTag = this.route.customElementName;
    } else {
      this.routeTag = this.defaultTag;
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
   * Set up the route for navigation
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
   * Dynamically renders the tag of the matching route.
   * 
   * @returns html
   */
  override render() {
    return html`<span>${routeElement(this.routeTag, this.getRenderProps())}</span>`;
  }
}
