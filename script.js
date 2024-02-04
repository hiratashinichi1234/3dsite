import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from "./controls/OrbitControls.js";
import { FontLoader } from "./loaders/FontLoader.js";
import { TextGeometry } from "./geometries/TextGeometry.js";




let vertexShaderCode, fragmentShaderCode;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(17, window.innerWidth / window.innerHeight, 0.1, 400);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, 400); // 正しい引数を指定

const headerContainer = document.getElementById('header');
headerContainer.appendChild(renderer.domElement);

// 画像の読み込み
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./image/image1.jpg', (texture) => {
// シェーダーコードの取得
fetch('vertexShader.vert').then(response => response.text()).then((data) => {
    vertexShaderCode = data;

    fetch('fragmentShader.frag').then(response => response.text()).then((data) => {
      fragmentShaderCode = data;
  init(texture);
});
});
});

// 3Dテキストの追加
const fontLoader = new FontLoader();
fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Welcome My Page!", {
    font: font,
    size: 0.07,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  textGeometry.center();

  textGeometry.translate(-0.7, -0.1, 0);


  const textMaterial = new THREE.MeshNormalMaterial();
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);
});

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Animate
const animate = () => {
  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
};



function init(texture) {
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTexture: { value: texture }
    },
    vertexShader: vertexShaderCode,
    fragmentShader: fragmentShaderCode,
    transparent: true
  });

  const geometry = new THREE.PlaneGeometry(2, 2);
  const mesh = new THREE.Mesh(geometry, shaderMaterial);
  scene.add(mesh);

  // 雨のパーティクル
  const rainGeometry = new THREE.BufferGeometry();
  const rainMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.08,
    transparent: true
  });

  const rainVertices = [];
  for (let i = 0; i < 3000; i++) {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const z = (Math.random() - 0.5) * 10;
    rainVertices.push(x, y, z);
  }

  rainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rainVertices, 3));

  const rain = new THREE.Points(rainGeometry, rainMaterial);
  scene.add(rain);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);

    shaderMaterial.uniforms.uTime.value += 0.01;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  animate();
}
