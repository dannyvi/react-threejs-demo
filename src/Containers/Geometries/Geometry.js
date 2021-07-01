import React, { useEffect } from 'react'
import * as THREE from 'three'

export default function GreenGeometry() {
  const onContextCreate = () => {
    var container = document.getElementById('glscene')
    var w = container.offsetWidth
    var h = container.offsetHeight
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(w, h)
    container.appendChild(renderer.domElement)
    // document.body.appendChild( renderer.domElement );
    var geometry = new THREE.BoxGeometry(1, 1, 1)
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    var cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5
    var animate = function () {
      requestAnimationFrame(animate)
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate()
  }

  useEffect(onContextCreate, [])
  return <div id='glscene' style={{ width: '100%', height: '100%' }}/>
}
