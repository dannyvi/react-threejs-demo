import React from 'react'
import GLView from 'GL/View'
import * as THREE from 'three'
import { setupEnv } from 'GL/threeActions'

export default function Geometry3() {
  const onContextCreate = canvas => {
    const [renderer, scene, camera, light] = setupEnv(canvas)

    const boxWidth = 1
    const boxHeight = 1
    const boxDepth = 1
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({ color })

      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)

      cube.position.x = x

      return cube
    }

    const cubes = [
      makeInstance(geometry, 0x44aa88, 0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844, 2),
    ]

    function resizeRendererToDisplaySizeHdi(renderer) {
      const canvas = renderer.domElement
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
