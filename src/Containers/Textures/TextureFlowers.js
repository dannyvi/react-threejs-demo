import React, { useEffect } from 'react'
import * as THREE from 'three'
import './TextureFlowers.css'


export default function TextureFlowers() {
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
    // var loader = new THREE.TextureLoader()
    const loadManager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(loadManager);

    const materials = [
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/1.jpeg')}),
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/2.jpeg')}),
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/3.jpeg')}),
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/4.jpeg')}),
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/5.jpeg')}),
      new THREE.MeshBasicMaterial({map: loader.load('/images/flowers/6.jpeg')}),
    ];

    const loadingElem = document.querySelector('#loading');
    const progressBarElem = loadingElem.querySelector('.progressbar');

    loadManager.onLoad = () => {
      loadingElem.style.display = 'none';
      const cube = new THREE.Mesh(geometry, materials);
      scene.add(cube);
      cubes.push(cube);  // 添加到我们要旋转的立方体数组中
    };
    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      progressBarElem.style.transform = `scaleX(${progress})`;
    };

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
  return <>
    <div id="loading">
      <div className="progress">
        <div className="progressbar"></div>
      </div>
    </div>
    <div id='glscene' style={{ width: '100%', height: '100%' }}/>
    </>
}
