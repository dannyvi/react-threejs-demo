import React from 'react'
import GLView from 'GL/View'
import * as THREE from 'three'
import { setupEnv } from 'GL/threeActions'

export default function onContextCreate ( canvas, event, render) {
    const [renderer, scene, camera, light] = setupEnv(canvas)

    const eventCb = event(renderer, scene, camera, light)

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

    function _render(time) {
      time *= 0.001  // convert time to seconds

      render(time)

      const resize = resizeRendererToDisplaySizeHdi

      if (resize(renderer)) {
        const canvas = renderer.domElement
        // 调整纵横比例
        camera.aspect = canvas.clientWidth / canvas.clientHeight
        camera.updateProjectionMatrix()
      }

      renderer.render(scene, camera)

      requestAnimationFrame(_render)
    }

    requestAnimationFrame(_render)
  }
