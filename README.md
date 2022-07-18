# BoiLit Router

An easy to use dynamic routing package for [Lit](https://lit.dev/) 2.x. Note the context of this document will be based on the context of using [TypeScript](https://www.typescriptlang.org/)

## Installation

Run `yarn add @larzilla/boilit-router`

### After installation

Make sure that your server is setup to always load you `index` file or route, as this is crucial for you app to behave properly as a single page application.

## How To Use Routing

In some place in your application, create a `routes` file, somewhere like `src/config/routes.ts` is a good start. BoiLit Router comes with some base routes for fallback and example, which is an instance of `RouteCollection` class. You can opt to use the base routes by importing them directly, or just creating a new `RouteCollection` class of your own. Is is recommended to have a route mapped to `/404`, since the router will try to fallback on that.

### Adding Routes

Every route added is required to have a leading `/` for consistency, which uses the `RouteCollection.add(routePath: string, route: Route)` method.

The `Route` class has two required parameters, the first is the name of the registered tag via the `@customElement` decorator in your `LitComponent`, and the second is a `require()` call to the component matching that registered tag. This will make it possible to lazy load the components and register the necessary components with the dom.

Example of adding a route

```typescript
routes.add(
  "/my/new/route", // The path you want to match. Always lead with a forward slash!  "/"
  new Route("my-custom-tag", require("@myapp/the/path/to/MyComponent")) // Route object with custom tag name and matching component
);
```

Example `routes.ts`

```typescript
// Using base example routes
import { baseRoutes as routes } from "@larzilla/boilit-router";

const routes = new RouteCollection();

routes.add("/", new Route("home-view", require("@views/HomeView")));
routes.add("/about", new Route("about-view", require("@views/AboutView")));

export default routes;
```

Or if you do not want to use the base routes, which is the more likley scenario, then use

```typescript
// Use your own clean set of routes
import { Route, RouteCollection } from "@larzilla/boilit-router";

const routes = new RouteCollection();

routes.add("/", new Route("home-view", require("@views/HomeView")));
routes.add("/about", new Route("about-view", require("@views/AboutView")));

export default routes;
```

### Route Options

The `Route` class also has 2 additional constructor paramters.

#### `meta` paramater

This parameter can be used to pass in a meta `title`, `description`, and then `vars` which are `Map<String, any>` types to preload data into the routes, before they render. The fourth is an `isPrivate: boolean` which can be used as a flag to protect the route.

The following example is just to illustrate the idea of usage. Note that the meta parameter should follow the structure of the `RouteMetaData` type. While the `RouteMetaData` type is not strict to allow ease of use with static routes, it should be followed when actually passing in meta data.

```typescript

// say this is a file which retrieved some data or was just setup somewhere.

const myRouteVars = new Map();
myRouteVars.set('var1', [1, 2, 3]);
myRouteVars.set('var2', 'MyString');
myRouteVars.set('var3', new Map());
myRouteVars.set('var4', { heading: 'My title'});
myRouteVars.set('var5', 'My Other Title');

/// Follow the pattern of this type --> import RouteMetaData from "@larzilla/boilit-router"
const myRouteMeta = {
  title: 'Page Title',
  description: 'My page description',
  vars: myRouteVars
}
export myRouteMeta;

```

Then in your `routes.ts`

```typescript

import { Route, RouteCollection } from "@larzilla/boilit-router";
import { myRouteVars } from "wherever/myRoutevars";
const routes = new RouteCollection();

routes.add(
  "/myprivateroute", new Route("home-view", require("@views/HomeView"), myRouteVars, true);
);

```

That is pretty much all there is to using routes, you can go about preloading data how ever you want, and then pass it in as shown above. As you can see, what data is passed into the `vars` is very flexible to allow room for any needed data structure within.

## Using the `RouterOutlet` Compoent

Using the `RouterOutlet` in your app is fairly simple, it is as easy as using any other `LitElement` by including a `router-outlet` tag in any `render()` html you want. The `router-outlet` tag takes in the routes setup in your `routes.ts` and will render every matching route.

See an example of the an `AppRoot` component`

```javascript
import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import '@larzilla/boilit-router/outlet';
import routes from '@your/config/routes';

@customElement('layout-container')
export default class AppRoot extends LitElement {
  static override styles = css`
    .app-root-container {
      width: 80%;
      margin: 0 auto;
    }`;

  override render() {
    return html`
      <div class="app-root-container">
        <header></
        <div class="route-view">

        <!--- ROUTER OUTLET RENDER BEGIN -->

        <router-outlet .routes=${routes}></router-outlet>

        <!--- ROUTER OUTLET RENDER END -->

        </div>
      </div>
    `;
  }
}

```

That is pretty much all there is to it. For static routes, mostly everthing is taken care of if you do not care about page titles and description. For dynamic routes, any component attached to the route will just need couple of small changes, but still fairly easy, which we'll get into next.

## Dynamic Routes

Dynamic route follow a common pattern of leading the portion of the URL you want to be a parameter with a colon, such as.

```typescript
// Dynamic route

routes.add(
  "/dynamic/:firstValue/exmaple/:secondValue", // See the portions lead by a colon.
  new Route("dynamic-view", require("@views/DynamicView")) // And then as before, use your component that will process the route.
);
```

### Views that will parse data to render

When routes are run through the router, the `RouterOutlet` will take the `RouteMetaData` and combined it will any parmeters that were found in the dynamic route, into a `RenderProps` object. If the the route is static, it will still pass the `RenderProps` object with any data from the route.

### Using the `RenderProps`

Every component rendered through the get a `.props` attribute with the value of a compiled `RenderProps` object containing the `RouteMetaData` and the parameters from the url. Too access this data, see the following example.

```typescript
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import RenderProps from "../core/RenderProps";

@customElement("dynamic-example-view")
export class DynamicExampleView extends LitElement {
  static override styles = css`
    .dynamic-example-view {
      text-align: center;
    }
    h2 {
      font-size: 4em;
      font-weight: bold;
    }
    .dynamic-example-message {
      padding: 1em;
      margin: 1em;
      background-color: #eee;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
  `;

  @property()
  props: RenderProps = new RenderProps({});

  override render() {
    return html`
      <div class="dynamic-example-view">
        <h2>Dynamic Example</h2>
        <div class="dynamic-example-message">
          <p>
            This is an example of a dynamic routes in the boilit-router package.
          </p>
          <p>
            First Value (:firstValue) = ${this.props.getParam(":firstValue")}
          </p>
          <p>
            Second Value (:secondValue) = ${this.props.getParam(":secondValue")}
          </p>
        </div>
      </div>
    `;
  }
}
```

#### Accessing the Dynamic Paramters

Notice in the above example, the `getParam()` calls. To get the value you want, just pass the same exact value from the route into the `getParam()` method, including the colon for consistency.

Example of route and getting the value at render

```typescript
// ... in routes.ts
routes.add(
  "/my/product/:productId/option/:productOption",
  new Route("product-view", require("@views/ProductView"))
);

// Now...

// ... in the component render()
  // Make sure props is defined when mounting.
  @property()
  props: RenderProps = new RenderProps({});

  override render () {
    return html`
      <div class="dynamic-example-view">
        <h2>My Product Page</h2>
        <div class="dynamic-example-message">
          <p>Product ID: ${this.props.getParam(':productId')}</p>
          <p>Product Option: ${this.props.getParam(':productOption')}</p>
        </div>
      </div>
    `;
  }

```

That is all that is needed to get dynamic parameters.

### Getting the `title`, `description`, and `vars`.

It is very similar to getting params. Title and description do not need a parameters, but var will require the string value key as it was defined.

- Get the title: `this.getTitle()`
- Get the title: `this.getTitle()`
- Get a a value from `vars` title: `this.getVar('my-var-key')`

Of course lifecyle methods could be used as needed to have more concise calls in the `render()`, but that is subjective to each developer.
