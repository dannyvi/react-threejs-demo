/* */
import React from 'react'
import { Link, Route, Switch } from 'react-router-dom' // <-- New code
import GreenGeometry from './Containers/Geometries/Geometry'
import Geometry2 from './Containers/Geometries/Geometry2'
import Geometry3 from './Containers/Geometries/Geometry3'
import Sun from './Containers/Scenes/Sun'
import SunGui from './Containers/Scenes/SunGui'
import Tank from './Containers/Scenes/Tank'
import Texture1 from './Containers/Textures/Texture1'
import TextureFlowers from 'Containers/Textures/TextureFlowers'
import AmbientLight from './Containers/Light/AmbientLight'
import PerspectiveCamera from './Containers/Cameras/PerspectiveCamera'
import TwoCamera from './Containers/Cameras/TwoCamera'

const glContainers = [
  GreenGeometry, Geometry2, Geometry3, Sun, SunGui, Tank, Texture1, TextureFlowers, AmbientLight, PerspectiveCamera,
  TwoCamera
]

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
      path={route.path}
      exact={route.exact}
      render={props => <route.component {...props} routes={route.routes}/>}
    />
  )
}

export function RenderRoutes({ routes }) {
  return (
    <Switch>
      {routes.map((route) => {
        return <RouteWithSubRoutes key={route.key} {...route} />
      })}
      <Route component={() => <h1>Not Found!</h1>}/>
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
