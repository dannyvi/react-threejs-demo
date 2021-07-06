import React from 'react'
import GLView from 'GL/View'
import onContextCreate from './cube'

export default function BasicShader() {
  return <GLView onContextCreate={onContextCreate}/>
}
