
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const stone = new THREE.MeshStandardMaterial({ color: 0xd9c4a3, roughness: 0.95 });
const darkStone = new THREE.MeshStandardMaterial({ color: 0xb5956d, roughness: 0.98 });
const roof = new THREE.MeshStandardMaterial({ color: 0x9c5a33, roughness: 1 });
const water = new THREE.MeshStandardMaterial({ color: 0x7db4d8, roughness: 0.25, metalness: 0.05 });
const grass = new THREE.MeshStandardMaterial({ color: 0x8ca96b, roughness: 1 });

function addGround(scene, kind="sand"){
  let material = stone;
  if(kind === "grass") material = grass;
  if(kind === "sand") material = new THREE.MeshStandardMaterial({ color: 0xc6a87d, roughness: 1 });
  const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(10, 12, 0.8, 40),
    material
  );
  ground.position.y = -0.4;
  scene.add(ground);
}

function addSun(scene){
  const hemi = new THREE.HemisphereLight(0xffffff, 0xb68656, 1.4);
  scene.add(hemi);
  const dir = new THREE.DirectionalLight(0xffffff, 1.6);
  dir.position.set(6, 12, 7);
  scene.add(dir);
}

function column(height=3, radius=0.18){
  const g = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius*1.1, height, 16), stone);
  shaft.position.y = height/2;
  g.add(shaft);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(radius*1.5, radius*1.5, 0.24, 16), darkStone);
  base.position.y = 0.12;
  g.add(base);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(radius*1.45, radius*1.7, 0.22, 16), darkStone);
  cap.position.y = height+0.11;
  g.add(cap);
  return g;
}

function arch(width=1.5, height=2.2, depth=0.45){
  const group = new THREE.Group();
  const pillarGeo = new THREE.BoxGeometry(0.3, height, depth);
  const left = new THREE.Mesh(pillarGeo, stone);
  const right = new THREE.Mesh(pillarGeo, stone);
  left.position.set(-width/2, height/2, 0);
  right.position.set(width/2, height/2, 0);
  group.add(left, right);
  const top = new THREE.Mesh(new THREE.BoxGeometry(width+0.3, 0.32, depth), darkStone);
  top.position.y = height + 0.15;
  group.add(top);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(width/2, 0.15, 10, 28, Math.PI), darkStone);
  arc.rotation.z = Math.PI;
  arc.position.y = height * 0.95;
  group.add(arc);
  return group;
}

function steps(width=4, depth=4, height=0.18, count=4){
  const g = new THREE.Group();
  for(let i=0;i<count;i++){
    const step = new THREE.Mesh(
      new THREE.BoxGeometry(width - i*0.35, height, depth - i*0.35),
      darkStone
    );
    step.position.y = (i * height) + height/2;
    g.add(step);
  }
  return g;
}

function createColosseum(scene){
  addGround(scene);
  const group = new THREE.Group();
  const ringGeo = new THREE.TorusGeometry(4.7, 1.25, 26, 80);
  const outer = new THREE.Mesh(ringGeo, stone);
  outer.rotation.x = Math.PI / 2;
  group.add(outer);

  const arena = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.25, 42), darkStone);
  arena.position.y = 0.1;
  group.add(arena);

  for(let row=0; row<2; row++){
    const y = 0.65 + row*1.05;
    for(let i=0;i<18;i++){
      const a = (i/18) * Math.PI*2;
      const arcade = arch(0.6, 0.9, 0.35);
      arcade.position.set(Math.cos(a)*4.65, y, Math.sin(a)*4.65);
      arcade.lookAt(0, y, 0);
      group.add(arcade);
    }
  }

  const upper = new THREE.Mesh(new THREE.TorusGeometry(4.7, 0.45, 20, 80), darkStone);
  upper.rotation.x = Math.PI / 2;
  upper.position.y = 2.8;
  group.add(upper);

  group.rotation.y = 0.3;
  scene.add(group);
}

function createCuriaJulia(scene){
  addGround(scene);
  const g = new THREE.Group();
  const stair = steps(5.8, 6.6, 0.17, 4);
  g.add(stair);

  const body = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.2, 5.2), stone);
  body.position.y = 2.55;
  g.add(body);

  const roofObj = new THREE.Mesh(new THREE.BoxGeometry(4.9, 0.35, 5.5), roof);
  roofObj.position.y = 4.85;
  g.add(roofObj);

  const door = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.3, 0.2), darkStone);
  door.position.set(0, 1.55, 2.62);
  g.add(door);

  for(const x of [-1.4, 0, 1.4]){
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.15), darkStone);
    w.position.set(x, 3.3, 2.61);
    g.add(w);
  }

  const cornice = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 5.6), darkStone);
  cornice.position.y = 4.32;
  g.add(cornice);

  scene.add(g);
}

function createForum(scene){
  addGround(scene);
  const plaza = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 7), stone);
  plaza.position.y = 0.12;
  scene.add(plaza);

  for(let i=-3;i<=3;i+=2){
    const col = column(3.1, 0.18);
    col.position.set(i, 0.12, -2.2);
    scene.add(col);
  }

  const entab = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.3, 0.5), darkStone);
  entab.position.set(0, 3.42, -2.2);
  scene.add(entab);

  const basilica = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 5.2), stone);
  basilica.position.set(2.7, 1.22, 0.2);
  scene.add(basilica);

  const shrine = new THREE.Group();
  const base = steps(2.7, 3, 0.12, 3);
  shrine.add(base);
  for(const x of [-0.8,0,0.8]){
    const c = column(1.8,0.12);
    c.position.set(x,0.36,1.2);
    shrine.add(c);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(2.2,0.2,0.35),darkStone);
  top.position.set(0,2.27,1.2);
  shrine.add(top);
  shrine.position.set(-2.8,0,0);
  scene.add(shrine);
}

function createTriumphalArch(scene){
  addGround(scene);
  const g = new THREE.Group();
  const base = steps(5.2, 3.2, 0.12, 3);
  g.add(base);

  const leftPier = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 1.1), stone);
  leftPier.position.set(-1.6, 1.45, 0);
  g.add(leftPier);
  const rightPier = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.9, 1.1), stone);
  rightPier.position.set(1.6, 1.45, 0);
  g.add(rightPier);

  const centerTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.5, 1.2), darkStone);
  centerTop.position.set(0, 3.15, 0);
  g.add(centerTop);

  const attic = new THREE.Mesh(new THREE.BoxGeometry(5.1, 1.1, 1.3), stone);
  attic.position.set(0, 4.0, 0);
  g.add(attic);

  const innerArc = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.18, 10, 28, Math.PI), darkStone);
  innerArc.rotation.z = Math.PI;
  innerArc.position.set(0, 2.3, 0);
  g.add(innerArc);

  const impostL = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 1.2), darkStone);
  impostL.position.set(-1.6, 2.95, 0);
  g.add(impostL);
  const impostR = impostL.clone();
  impostR.position.x = 1.6;
  g.add(impostR);

  scene.add(g);
}

function createInsula(scene){
  addGround(scene);
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.35, 4.8), darkStone);
  base.position.y = 0.18;
  g.add(base);

  const main = new THREE.Mesh(new THREE.BoxGeometry(4.8, 5.5, 4.0), stone);
  main.position.y = 2.95;
  g.add(main);

  for(let floor=0; floor<4; floor++){
    const y = 1.1 + floor*1.15;
    for(const x of [-1.4, -0.45, 0.45, 1.4]){
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.12), darkStone);
      win.position.set(x, y, 2.04);
      g.add(win);
    }
  }

  const door = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.6, 0.15), darkStone);
  door.position.set(0, 0.95, 2.06);
  g.add(door);

  const roofPlate = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.25, 4.4), roof);
  roofPlate.position.y = 5.88;
  g.add(roofPlate);

  scene.add(g);
}

function createAqueduct(scene){
  addGround(scene, "grass");
  const g = new THREE.Group();
  for(let i=0;i<6;i++){
    const section = arch(1.4, 2.6, 0.7);
    section.position.x = -4 + i*1.6;
    g.add(section);
  }
  const top = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.45, 0.9), darkStone);
  top.position.set(0, 2.95, 0);
  g.add(top);

  const waterChannel = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.08, 0.28), water);
  waterChannel.position.set(0, 3.16, 0);
  g.add(waterChannel);

  scene.add(g);
}

function createThermae(scene){
  addGround(scene);
  const g = new THREE.Group();
  const platform = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.3, 6.4), darkStone);
  platform.position.y = 0.15;
  g.add(platform);

  const centralHall = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.5, 3.2), stone);
  centralHall.position.set(0, 1.9, 0);
  g.add(centralHall);

  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.9, 24, 16, 0, Math.PI*2, 0, Math.PI/2), roof);
  dome.position.set(0, 3.6, 0);
  g.add(dome);

  const pool = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.25, 1.5), water);
  pool.position.set(0, 0.28, 2.0);
  g.add(pool);

  for(const x of [-2.8, 2.8]){
    const wing = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.2, 4.2), stone);
    wing.position.set(x, 1.25, 0);
    g.add(wing);
  }

  scene.add(g);
}

function createPalatine(scene){
  addGround(scene, "grass");
  const hill = new THREE.Mesh(
    new THREE.CylinderGeometry(5.3, 7.8, 2.2, 40),
    new THREE.MeshStandardMaterial({ color: 0x8b9c66, roughness: 1 })
  );
  hill.position.y = 0.8;
  scene.add(hill);

  const palace = new THREE.Group();
  const terrace = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.35, 4.8), darkStone);
  terrace.position.set(0, 2.0, 0);
  palace.add(terrace);

  const main = new THREE.Mesh(new THREE.BoxGeometry(4.3, 2.6, 3.2), stone);
  main.position.set(0, 3.45, 0);
  palace.add(main);

  const side1 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.9, 2.6), stone);
  side1.position.set(-2.5, 3.1, 0);
  palace.add(side1);
  const side2 = side1.clone();
  side2.position.x = 2.5;
  palace.add(side2);

  for(const x of [-1.5, -0.5, 0.5, 1.5]){
    const c = column(1.8, 0.12);
    c.position.set(x, 2.02, 1.8);
    palace.add(c);
  }
  const frontTop = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.2, 0.35), darkStone);
  frontTop.position.set(0, 4.02, 1.8);
  palace.add(frontTop);

  scene.add(palace);
}

function createCircus(scene){
  addGround(scene, "sand");
  const g = new THREE.Group();

  const track = new THREE.Mesh(
    new THREE.TorusGeometry(4.6, 1.7, 20, 80),
    new THREE.MeshStandardMaterial({ color: 0xcda876, roughness: 1 })
  );
  track.rotation.x = Math.PI/2;
  g.add(track);

  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(3.2, 3.2, 0.15, 40),
    grass
  );
  inner.position.y = 0.05;
  g.add(inner);

  const spina = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 6.2), darkStone);
  spina.position.set(0, 0.22, 0);
  g.add(spina);

  for(let i=0;i<5;i++){
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.9, 0.12), stone);
    post.position.set(0, 0.65, -2.4 + i*1.2);
    g.add(post);
  }

  const stand1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 8.2), stone);
  stand1.position.set(-6.2, 0.55, 0);
  g.add(stand1);
  const stand2 = stand1.clone();
  stand2.position.x = 6.2;
  g.add(stand2);

  scene.add(g);
}

const builders = {
  kolosseum: createColosseum,
  "curia-julia": createCuriaJulia,
  "forum-romanum": createForum,
  triumphbogen: createTriumphalArch,
  wohnhaus: createInsula,
  aquaedukt: createAqueduct,
  trajansthermen: createThermae,
  palatin: createPalatine,
  "circus-maximus": createCircus
};

export function initModel(containerId, modelName){
  const container = document.getElementById(containerId);
  if(!container) return;

  const scene = new THREE.Scene();
  addSun(scene);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(8, 6, 8);

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = false;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.target.set(0, 1.8, 0);
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI/2.05;

  const builder = builders[modelName];
  if(builder) builder(scene);

  function animate(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  };
  window.addEventListener('resize', onResize);
}
