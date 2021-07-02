import React, { useEffect } from 'react'
import * as THREE from 'three'
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export default function Texture1() {
  async function onContextCreate() {
    var container = document.getElementById('glscene')
    var w = container.offsetWidth
    var h = container.offsetHeight
    var scene = new THREE.Scene()
    var camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000)
    var renderer = new THREE.WebGLRenderer()
    renderer.setSize(w, h)
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)

    const cubes = [];
    var loader = new THREE.TextureLoader()
    loader.load('/images/wall.jpeg', (texture) => {
        const material = new THREE.MeshBasicMaterial({
          map: texture,
        })
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        cubes.push(cube)  // 添加到我们要旋转的立方体数组中
      },
      () => {
        console.log('progressing')
      }
      ,
      (xhr) => {
        console.log('error', xhr)
      }
    )

    camera.position.z = 5

    function render (time) {
      cubes.forEach((cube, ndx) => {
        const speed = .2 + ndx * .1;
        const rot = time * speed * 0.005;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
  }

  useEffect(onContextCreate, [])
  return <div id='glscene' style={{ width: '100%', height: '100%' }}/>
}
