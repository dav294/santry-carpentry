import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (!canvas) throw new Error('hero-canvas not found');

const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setClearColor(0x000000, 0); // transparent — hero bg image shows through

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.z = 28;

// ── Particle texture (soft amber circle) ──
const texCanvas = document.createElement('canvas');
texCanvas.width = 32; texCanvas.height = 32;
const tctx = texCanvas.getContext('2d');
const grad = tctx.createRadialGradient(16, 16, 0, 16, 16, 16);
grad.addColorStop(0,   'rgba(200,150,62,1)');
grad.addColorStop(0.45,'rgba(200,150,62,0.4)');
grad.addColorStop(1,   'rgba(200,150,62,0)');
tctx.fillStyle = grad;
tctx.fillRect(0, 0, 32, 32);
const tex = new THREE.CanvasTexture(texCanvas);

// ── Build particle geometry ──
const COUNT = 240;
const geo = new THREE.BufferGeometry();
const pos  = new Float32Array(COUNT * 3);
const vel  = new Float32Array(COUNT * 3); // drift per frame

for (let i = 0; i < COUNT; i++) {
  const i3 = i * 3;
  pos[i3]     = (Math.random() - 0.5) * 90;
  pos[i3 + 1] = (Math.random() - 0.5) * 55;
  pos[i3 + 2] = (Math.random() - 0.5) * 22;

  vel[i3]     = (Math.random() - 0.5) * 0.008;   // gentle horizontal sway
  vel[i3 + 1] = 0.004 + Math.random() * 0.012;    // upward drift (sawdust rising)
  vel[i3 + 2] = (Math.random() - 0.5) * 0.004;
}

geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
  size: 0.55,
  map: tex,
  color: 0xC8963E,
  transparent: true,
  opacity: 0.28,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  sizeAttenuation: true,
});

const points = new THREE.Points(geo, mat);
scene.add(points);


// ── Resize ──
function onResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
onResize();
window.addEventListener('resize', onResize);

// ── Animate ──
let t = 0;
const posAttr = geo.attributes.position;

(function tick() {
  requestAnimationFrame(tick);
  t += 0.0006;

  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    posAttr.array[i3]     += vel[i3];
    posAttr.array[i3 + 1] += vel[i3 + 1];
    posAttr.array[i3 + 2] += vel[i3 + 2];

    // wrap: reset when particle exits top
    if (posAttr.array[i3 + 1] > 28) {
      posAttr.array[i3 + 1] = -28;
      posAttr.array[i3]     = (Math.random() - 0.5) * 90;
    }
  }
  posAttr.needsUpdate = true;

  // Gentle camera drift
  camera.position.x = Math.sin(t) * 1.6;
  camera.position.y = Math.cos(t * 0.65) * 0.9;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
})();
