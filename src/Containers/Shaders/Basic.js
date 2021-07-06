import React from 'react'
import GLView from 'GL/View'
import onContextCreate from './gradiantRefactor'

export default function BasicShader() {
  return <GLView onContextCreate={onContextCreate}/>
}
