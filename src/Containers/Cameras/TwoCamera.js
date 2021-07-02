import React, { useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import './TwoCamera.css'

function GLView({ onContextCreate }) {
  const _onContextCreate = () => {
    const canvas = document.querySelector('#glscene')
    return onContextCreate(canvas)
  }
  useEffect(_onContextCreate, [])
  return <div style={{ width: '100%', height: '100%', position: 'relative'}}>
    <canvas id='glscene'  style={{zIndex:1, width: '100%', height: '100%', display: 'block' }}/>

    <div className='split'>
      <div id='view1' tabIndex='1'><span>Hello</span></div>
      <div id='view2' tabIndex='2'/>
    </div>
  </div>
}

export default function TwoCamera() {
  const onContextCreate = canvas => {
    const ratio = window.devicePixelRatio
    const view1Elem = document.querySelector('#view1')
    const view2Elem = document.querySelector('#view2')

    const renderer = new THREE.WebGLRenderer({ canvas })

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('yellow')

    const [ fov, aspect, near, far ] = [ 45, 2, 0.1, 100 ]
    // camera.position.z = 2
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, 10, 20)
    const cameraHelper = new THREE.CameraHelper(camera)
    scene.add(cameraHelper)

    class MinMaxGUIHelper {
      constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj
        this.minProp = minProp
        this.maxProp = maxProp
        this.minDif = minDif
      }

      get min() {
        return this.obj[this.minProp]
      }

      set min(v) {
        this.obj[this.minProp] = v
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
      }

      get max() {
        return this.obj[this.maxProp]
      }

      set max(v) {
        this.obj[this.maxProp] = v
        this.min = this.min  // 这将调用min的setter
      }
    }

    const gui = new GUI()
    gui.add(camera, 'fov', 1, 180)
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
    gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
    gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')


    const controls = new OrbitControls(camera, view1Elem)
    controls.target.set(0, 5, 0)
    controls.update()

    const camera2 = new THREE.PerspectiveCamera(
      60,  // fov
      2,   // aspect
      0.1, // near
      500, // far
    )
    camera2.position.set(40, 10, 30)
    camera2.lookAt(0, 5, 0)

    const controls2 = new OrbitControls(camera2, view2Elem)
    controls2.target.set(0, 5, 0)
    controls2.update()

    function setScissorForElement(elem) {
      const canvasRect = canvas.getBoundingClientRect();
      const elemRect = elem.getBoundingClientRect();

      // 计算canvas的尺寸
      const right = ratio * (Math.min(elemRect.right, canvasRect.right) - canvasRect.left);
      const left = ratio * (Math.max(0, elemRect.left - canvasRect.left));
      const bottom = ratio * (Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top);
      const top = ratio * (Math.max(0, elemRect.top - canvasRect.top));

      const width = Math.min(ratio * canvasRect.width, right - left);
      const height = Math.min(ratio * canvasRect.height, bottom - top);

      // 设置剪函数以仅渲染一部分场景
      const positiveYUpBottom = ratio * canvasRect.height - bottom;
      renderer.setScissor(left, positiveYUpBottom, width, height);
      renderer.setViewport(left, positiveYUpBottom, width, height);

      // 返回aspect
      return width / height;
    }

    const planeSize = 40

    const loader = new THREE.TextureLoader()
    const texture = loader.load('/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -.5
    scene.add(mesh)

    {
      const cubeSize = 4
      const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
      const mesh = new THREE.Mesh(cubeGeo, cubeMat)
      mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
      scene.add(mesh)
    }
    {
      const sphereRadius = 3
      const sphereWidthDivisions = 32
      const sphereHeightDivisions = 16
      const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
      const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0)
      scene.add(mesh)
    }


    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    scene.add(light)

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

      const resize = resizeRendererToDisplaySizeHdi

      resize(renderer)

      renderer.setScissorTest(true)
      {
        const aspect = setScissorForElement(view1Elem);

        // 用计算出的aspect修改摄像机参数
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        cameraHelper.update();

        // 来原视野中不要绘制cameraHelper
        cameraHelper.visible = false;

        scene.background.set(0x000000);

        // 渲染
        renderer.render(scene, camera);
      }
      {
        const aspect2 = setScissorForElement(view2Elem);

        // 调整aspect
        camera2.aspect = aspect2;
        camera2.updateProjectionMatrix();

        // 在第二台摄像机中绘制cameraHelper
        cameraHelper.visible = true;

        scene.background.set(0x000080);

        renderer.render(scene, camera2);
      }

      // renderer.render(scene, camera)

      requestAnimationFrame(render)
    }

    requestAnimationFrame(render)

    return () => {
      gui.destroy()
      renderer.dispose()
    }
  }

  return <GLView onContextCreate={onContextCreate}/>
}
