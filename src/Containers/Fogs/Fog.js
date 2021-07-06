import React from 'react'
import GLView from 'GL/View'
import * as THREE from 'three'
import { setupEnv } from 'GL/threeActions'

export default function Fog1() {
  const onContextCreate = canvas => {
    const [renderer, scene, camera, light] = setupEnv(canvas)

    scene.background = new THREE.Color('white');
    scene.fog = new THREE.FogExp2(0xFFFFFF, 0.3);
    camera.position.z = 4

    const geometry = new THREE.BoxGeometry(1, 1, 2)

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({ color })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      cube.position.x = x
      return cube
    }

    const cubes = [
      makeInstance(geometry, 0x00ffaa, -2),
      makeInstance(geometry, 0x00ff44, 2),
    ]

    function resizeRendererToDisplaySizeHdi(renderer) {
      const pixelRatio = window.devicePixelRatio
      const width = canvas.clientWidth * pixelRatio | 0
      const height = canvas.clientHeight * pixelRatio | 0
      const needResize = canvas.width !== width || canvas.height !== height
      if (needResize) {
        renderer.setSize(width, height, false)
      }
      return needResize
    }

    function render(time) {
      time *= 0.001  // convert time to seconds

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1
        const rot = time * speed
        cube.rotation.x = rot
        cube.rotation.y = rot
      })

      const resize = resizeRendererToDisplaySizeHdi

      if (resize(renderer)) {
        const canvas = renderer.domElement
        // 调整纵横比例
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }
      renderer.render(scene, camera)
      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
  }

  return <GLView onContextCreate={onContextCreate}/>
}
