import "./style.css";
// import threeJS library
import * as THREE from "three";
// import orbit controls so we can interact with 3d objects and models
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// * SETUP
// the scene is like a container that holds our objects, cameras and lights
const scene = new THREE.Scene();

// to see things inside the scene we need a camera  PerspectiveCamera( FOV in deg, aspect ratio, view frustum )
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// to render out the graphics to the scene
const renderer = new THREE.WebGL1Renderer({
  // choose the canvas we added to index.html
  canvas: document.querySelector("#bg"),
});

// ? pixel ratio?
renderer.setPixelRatio(window.devicePixelRatio);
// set the canvas size to full screen
renderer.setSize(window.innerWidth, window.innerHeight);
// position the camera along (x, y, z) axis
camera.position.set(50, 0, 150);

renderer.render(scene, camera);

// * add first object - to create an object:
// create a geometry - {x, y, z} points that make up a shape
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// add a material to our geometry
// a basic material does not react off of light
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// a standard material reacts off of light instead of a wireframe like the basic material
// const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// put the geometry and material together in a mesh
const torus = new THREE.Mesh(geometry, material);

// add our new object to the scene
scene.add(torus);

// * create our lights - use a point light to have light on a specific part of the scene
const pointLight = new THREE.PointLight(0xffffff);
// set our light's position
pointLight.position.set(5, 5, 5);
// * if we want a light that is present throughout the whole scene, use an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff);
// add our lights to the scene
scene.add(pointLight, ambientLight);

// use ThreeJS helpers
// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

// instantiate the orbit controls class
// pass the camera and renderer as arguments to the Orbit Controls class
// this will listen to DOM events on the mouse and update the camera object accordingly
// const controls = new OrbitControls(camera, renderer.domElement);

// randomly generate a large number of objects in the scene - in this case, stars
const addStar = () => {
  // create our "star" objects SphereGeometry(radius, width, height)
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  // create a standard material for the star object
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  // create our star mesh
  const star = new THREE.Mesh(geometry, material);

  // generate a random [x, y, z] value for each star
  const [x, y, z] = Array(3)
    .fill()
    // this threeJS method randomly generates a number between negative and positive of the argument
    .map(() => THREE.MathUtils.randFloatSpread(100));

  // set our stars position
  star.position.set(x, y, z);
  // add our stars to the scene
  scene.add(star);
};

// decide how many stars will exist in the scene
Array(200).fill().forEach(addStar);

// create a texture for our space background using the texture loader method
const spaceTexture = new THREE.TextureLoader().load("space.jpg");
scene.background = spaceTexture;

// ! TEXTURE MAPPING - taking 2d pixels and mapping them to a 3D geometry
// we will load a moon texture on a sphere object
const moonTexture = new THREE.TextureLoader().load("moon.jpg");
// "noise" map to add a rocky texture to the mesh
const normalTexture = new THREE.TextureLoader().load("normal.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({
    // load a texture as the map property, this will take the image and wrap it around the sphere
    map: moonTexture,
    // add custom texture
    normalMap: normalTexture,
  })
);

// position.set(x, y, z)
moon.position.set(-10, 0, 30);
scene.add(moon);

// create scroll animation
const moveCamera = () => {
  // find out the scroll "direction" with getBoundingClientRect()
  const scrollDirection = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  camera.position.z = scrollDirection * -0.01;
  camera.position.x = scrollDirection * -0.0002;
  camera.rotation.y = scrollDirection * -0.0002;
};

// assign moveCamera as the event handler for the on scroll event
// fire this function every time the user scrolls
document.body.onscroll = moveCamera;
moveCamera();

// set up recursive function that animates and re-renders our objects as we scroll
// basically an infinite function that creates a loop
// would be the same as a game loop in game development
const animate = () => {
  requestAnimationFrame(animate);

  // every object we create have their own properties such as rotation, etc
  // we need to set these properties inside the loop to animate our object
  // rotate in the x axis
  torus.rotation.x += 0.01;
  // rotate in the y axis
  torus.rotation.y += 0.005;
  // rotate in the z ais
  torus.rotation.z += 0.01;

  // controls.update();

  renderer.render(scene, camera);
};

animate();
