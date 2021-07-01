/* */
import React from 'react'
import { Link, Route, Switch } from 'react-router-dom' // <-- New code
import GreenGeometry from './Containers/Geometries/Geometry'
import Geometry2 from './Containers/Geometries/Geometry2'
import Geometry3 from './Containers/Geometries/Geometry3'
import Sun from './Containers/Scenes/Sun'
import SunGui from './Containers/Scenes/SunGui'

const glContainers = [GreenGeometry, Geometry2, Geometry3, Sun, SunGui]

function containerToRoute(container) {
  const name = container.name
  return {
    path: `/app/${name}`,
    key: name,
    exact: true,
    component: container,
  }
}

const ROUTES = [
  { path: '/', key: 'root', exact: true, component: () => <h1>Log in</h1> },
  {
    path: '/app',
    key: 'app',
    // component: () => <h1>App</h1>,
    component: RenderRoutes,
    routes: [
      {
        path: '/app',
        key: 'index',
        exact: true,
        component: () => <h1>App Index</h1>,
      },
      ...glContainers.map(containerToRoute)
    ],
  },
]

export default ROUTES

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={ route.path }
      exact={ route.exact }
      render={ props => <route.component { ...props } routes={ route.routes }/> }
    />
  )
}

export function RenderRoutes({ routes }) {
  return (
    <Switch>
      { routes.map((route) => {
        return <RouteWithSubRoutes key={ route.key } { ...route } />
      }) }
      <Route component={ () => <h1>Not Found!</h1> }/>
    </Switch>
  )
}


export function displayRouteMenu(routes) {
  /**
   * Render a single route as a list item link to the config's pathname
   */
  function singleRoute(route) {
    return (
      <li key={route.key}>
        <Link to={route.path}>
          {route.key}
          {/*({route.path})*/}
        </Link>
      </li>
    )
  }

  // loop through the array of routes and generate an unordered list
  return (
    <ul>
      {routes.map(route => {
        // if this route has sub-routes, then show the ROOT as a list item and recursively render a nested list of route links
        if (route.routes) {
          return (
            <React.Fragment key={route.key}>
              {singleRoute(route)}
              {displayRouteMenu(route.routes)}
            </React.Fragment>
          )
        }

        // no nested routes, so just render a single route
        return singleRoute(route)
      })}
    </ul>
  )
}
