import React from 'react';
import { Route, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Bus = () => <h3>Bus</h3>;
const Cart = () => <h3>Cart</h3>;

const Sandwiches = () => <h2>Sandwiches</h2>;

const Tacos = ({ routes }) => (
  <div>
    <h2>Tacos</h2>
    <ul>
      <li>
        <Link href="/tacos/bus" to="/tacos/bus">Bus</Link>
      </li>
      <li>
        <Link href="/tacos/cart" to="/tacos/cart">Cart</Link>
      </li>
    </ul>
    {routes.map(route => <RouteWithSubRoutes key={route.path} {...route} />)}
  </div>
);

Tacos.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const routes = [
  {
    path: '/tacos',
    component: Tacos,
    routes: [
      {
        path: '/tacos/bus',
        component: Bus,
      },
      {
        path: '/tacos/cart',
        component: Cart,
      },
    ],
  },
  {
    path: '/',
    exact: true,
    component: Sandwiches,
  },
];
const RouteWithSubRoutes = route => (
  <Route
    exact={route.exact}
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);
const RouteConfigExample = () => (
  <div>
    <ul>
      <li>
        <Link href="/tacos" to="/tacos">Tacos</Link>
      </li>
      <li>
        <Link href="/" to="/">Sandwiches</Link>
      </li>
    </ul>

    {routes.map(route => <RouteWithSubRoutes key={route.path} {...route} />)}
  </div>
);
export default RouteConfigExample;
