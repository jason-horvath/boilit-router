import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import RouteLinkEvent from '../types/RouteLinkEvent';

@customElement('route-link')
export default class RouteLink extends LitElement {
  static override styles = css`
    route-link:hover {
      cursor: pointer;
    }

    a {
      text-decoration: none;
    }
  `;
  /**
   * @var uri The uri of where they router-link should go.
   */
  @property({type: String})
  uri = '';
  
  /**
   * Initialization of the events for router-link
   */
  override connectedCallback() {
    super.connectedCallback()
    this.addEventListener('onmousedown', (e) => this.navigate(e))
  }

  /**
   * Navigates based on the path name. 
   * 
   * @returns boolean | Event
   */
  navigate(e: Event) {
    e.preventDefault();
    if(this.uri === window.location.pathname) {
      return false;
    }

    return window.dispatchEvent(this.getNavigateEvent())
  }

  /**
   * Gets the navigate event needed by the router-outlet
   * 
   * @returns CustomEvent with a RouteLinkEvent as the options which is pick up by the router-outlet
   */
  getNavigateEvent() {
    const event = new CustomEvent('route-navigate', {
      bubbles: false,
      detail: {
        uri: this.uri,
      } as RouteLinkEvent
    })

    return event;
  }

  /**
   * Lit render override
   * 
   * @returns html
   */
  override render() {
    return html`<a href=${this.uri} @click=${(e: Event) => this.navigate(e)}><slot></slot></a>`;
  }
}
