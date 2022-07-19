import {html, css, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import RouteCollection from '../core/RouteCollection';
import Route from '../core/Route';
import routeElement from '../directives/RouteElementDirective';
import RouteEntry from '../core/RouteEntry';
import RenderProps from '../core/RenderProps';

@customElement('router-outlet')
export default class RouterOutlet extends LitElement {
  static override styles = css`p { color: blue }`;

  /**
   * This is the location that is redirected to when there is no matching route.
   * 
   * @var string notFoundUir
   */
  @property()
  notFoundUri: string = '/404';

  /**
   * The collection of routes that are used to match with
   * 
   * @var RouteCollection routes This should be configured in your own routes file
   */
  @property()
  routes: RouteCollection = new RouteCollection();


  /**
   * The custom element tag for the router component.
   * 
   * @var String routeTag This should match whatever is in the @customElement decorator
   */
  @property({type: String})
  routeTag = ``;

  /**
   * The parameters that were found in the route
   * 
   * @var Map<String, String> routeParams used to match up with the actual values that were entered in the url.
   */
  @property()
  routeParams: Map<String, String> = new Map<String, String>();
  
  
  @property()
  routeEntry: RouteEntry = new RouteEntry('', undefined);

  override async connectedCallback() {
    super.connectedCallback();
    this.navigateToPathname(window.location.pathname);
    this.routeNavigateListener();
  }

  navigateToPathname(path: string) {
    this.routeEntry = this.routes.get(path);
    const route = this.routeEntry.getRoute();
    this.setRouteParams(this.routeEntry);

    if(route instanceof Route) {
      window.history.pushState({}, '', path);
      this.routeTag = route.customElementName;
    } else {
      this.redirectNotFound()
    }
  }

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

  routeNavigateListener() {
    window.addEventListener('route-navigate', (e: any) => {
      try {
        this.navigateToPathname(e.detail.uri);
      } catch (e) {
        console.error(e);
      }
    })
  }

  getRouteElement(elementName: string) {
    return elementName;
  }

  getRenderProps(): RenderProps {
    
    const rederProps = {
      title: this.routeEntry.getRoute()?.meta.title ?? '',
      description: this.routeEntry.getRoute()?.meta.title ?? '',
      params: this.routeParams ?? new Map(),
      vars: this.routeEntry.getRoute()?.meta?.vars ?? new Map()
    }

    return new RenderProps(rederProps);
  }

  throwError(message: string) {
    throw new Error(`Router Outlet Error: ${message}`);
  }
  override render() {
    return html`<span>${routeElement(this.routeTag, this.getRenderProps())}</span>`;
  }
}
