import * as React from 'react'
import ROUTES, { RenderRoutes, displayRouteMenu } from './routes'
import './App.css'

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'stretch', flexDirection: 'horizontal' }}>
      <div style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        {displayRouteMenu(ROUTES)}
      </div>
      <div style={{ flex: 4, backgroundColor: '#ffff00' }}>
        <RenderRoutes routes={ROUTES}/>
      </div>
    </div>
  )
}
