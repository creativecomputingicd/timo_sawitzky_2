//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//-------------------------------------------------------------------------------------



//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;



//-- GUI PAREMETERS
////////////////////////
var gui;
const parameters = {
  iterations: 1,
  size : 1.9,
  length : 100,
  x_offset_value: 2,
  y_offset_value: -1.6,
  z_offset_value: 1.8,
  x_offset_rotation: 0,
  y_offset_rotation: 0,
  z_offset_rotation: 0,
  size_change: 0.08,
  length_change : 4.4

}








//-- SCENE VARIABLES

var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;






//-- GEOMETRY PARAMETERS
//Create an empty array for storing all the cube

 let scene_wireframe_cubes = [];
 
 let _iterations = parameters.iterations;
 let _size = parameters.size;
 let _length = parameters.length;

 let _x_offset_value = parameters.x_offset_value;
 let _y_offset_value = parameters.y_offset_value;
 let _z_offset_value = parameters.z_offset_value;

 let _x_offset_rotation = parameters.x_offset_rotation * (Math.PI / 180);
 let _y_offset_rotation = parameters.y_offset_rotation * (Math.PI / 180);
 let _z_offset_rotation = parameters.z_offset_rotation * (Math.PI / 180);

 let _size_change = parameters.size_change;
 let _length_change = parameters.length_change; 

 let starting_position = new THREE.Vector3(5,5,5);
 let starting_rotation_x = 0;
 let starting_rotation_y = 0;
 let starting_rotation_z = 0;



 function main(){
  ///////////
  //GUI
    gui = new GUI;
    
    gui.add(parameters, 'iterations', 1, 30 , 1);
    gui.add(parameters, 'size', 1, 10 , 0.1);
    gui.add(parameters, 'length', 10, 150 , 1);
    gui.add(parameters, 'x_offset_value', -4, 4 , 0.1);
    gui.add(parameters, 'y_offset_value', -4, 4 , 0.1);
    gui.add(parameters, 'z_offset_value', -4, 4 , 0.1);
    gui.add(parameters, 'size_change', -2, 2 , 0.01);
    gui.add(parameters, 'length_change', -10, 10 , 0.1); 
    gui.add(parameters, 'x_offset_rotation', -180, 180 , 1);
    gui.add(parameters, 'y_offset_rotation', -180, 180 , 1);
    gui.add(parameters, 'z_offset_rotation', -180, 180 , 1);


  //CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 10, width / height, 0.01, 5000);
  camera.position.set(500, 500, 1000)

  //LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight( 0xffffff, 3);
  directionalLight.position.set(2,5,5);
  directionalLight.target.position.set(-1,-1,0);
  scene.add( directionalLight );
  scene.add(directionalLight.target);

  //GEOMETRY INITIATION
  create_wireframe_cube(_size, _length, starting_position, starting_rotation_x, starting_rotation_y, starting_rotation_z);


  //RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);
 
  //CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');                             //????????????????
  container.append(renderer.domElement);
  
  //CREATE MOUSE CONTROL
  control = new OrbitControls( camera, renderer.domElement );

  //EXECUTE THE UPDATE
  animate();
}
 








//-----------------------------------------------------------------------------------
//HELPER FUNCTIONS
//-----------------------------------------------------------------------------------







function create_wireframe_cube (i_size, i_length, i_position, i_rotation_x, i_rotation_y, i_rotation_z){



  let size = i_size;
  let length = i_length;
  let position = i_position;

  const x_res = size, y_res = size;


  

  const shape = new THREE.Shape();
  shape.moveTo( 0,0 );
  shape.lineTo( 0, y_res );
  shape.lineTo( x_res, y_res );
  shape.lineTo( x_res, 0 );
  shape.lineTo( 0, 0 );
  
  const extrudeSettings = {
    steps: 2,
    depth: length,
    bevelEnabled: true,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 0
  };



  // creating the rod geometry and material
  const rod_geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
  const rod_material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );




  // --------------------- TOP HORIZONTAL RODS ----------------------


  //------------ OG rod mesh ------------
  const rod_mesh = new THREE.Mesh( rod_geometry, rod_material ) ;


  
  //------------ rod mesh 2 -------------
  const rod_mesh_2 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_2.position.set(size + length,0,0)

  //------------ rod mesh 3 -------------
  const rod_mesh_3 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_3.position.x += size;
  rod_mesh_3.rotation.set(0, 0, 0);
  rod_mesh_3.rotation.y = Math.PI/2;

  //------------ rod mesh 4 -------------
  const rod_mesh_4 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_4.position.z += size + length;
  rod_mesh_4.position.x +=  size;
  rod_mesh_4.rotation.set(0, 0, 0);
  rod_mesh_4.rotation.y = Math.PI/2;








  // ----------------------- VERTICAL RODS ----------------------


  //------------ rod mesh 5 -------------
  const rod_mesh_5 = new THREE.Mesh( rod_geometry, rod_material ) ;
  //rod_mesh_4.position.z += 61;
  rod_mesh_5.position.z -= size;
  rod_mesh_5.rotation.set(0, 0, 0);
  rod_mesh_5.rotation.x = Math.PI/2;

  //------------ rod mesh 6 -------------
  const rod_mesh_6 = new THREE.Mesh( rod_geometry, rod_material ) ;
  //rod_mesh_4.position.z += 61;
  rod_mesh_6.position.z -= size ;
  rod_mesh_6.position.x += size + length;
  rod_mesh_6.rotation.set(0, 0, 0);
  rod_mesh_6.rotation.x = Math.PI/2;

  //------------ rod mesh 7 -------------
  const rod_mesh_7 = new THREE.Mesh( rod_geometry, rod_material ) ;
  //rod_mesh_4.position.z += 61;
  rod_mesh_7.position.z -= size ;
  rod_mesh_7.position.z += size + length;
  rod_mesh_7.rotation.set(0, 0, 0);
  rod_mesh_7.rotation.x = Math.PI/2;

  //------------ rod mesh 8 -------------
  const rod_mesh_8 = new THREE.Mesh( rod_geometry, rod_material ) ;
  //rod_mesh_4.position.z += 61;
  rod_mesh_8.position.z -= size;
  rod_mesh_8.position.z += size + length;
  rod_mesh_8.position.x += size + length;
  rod_mesh_8.rotation.set(0, 0, 0);
  rod_mesh_8.rotation.x = Math.PI/2;








  // --------------------- BOTTOM HORIZONTAL RODS ----------------------


  //------------ rod mesh 9 -------------
  const rod_mesh_9 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_9.position.y -= size + length;

  //------------ rod mesh 10 -------------
  const rod_mesh_10 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_10.position.set(size + length,0,0);
  rod_mesh_10.position.y -= size + length;

  //------------ rod mesh 11 -------------
  const rod_mesh_11 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_11.position.x += size;
  rod_mesh_11.rotation.set(0, 0, 0);
  rod_mesh_11.rotation.y = Math.PI/2;
  rod_mesh_11.position.y -= size + length;

  //------------ rod mesh 4 -------------
  const rod_mesh_12 = new THREE.Mesh( rod_geometry, rod_material ) ;
  rod_mesh_12.position.z += size + length;
  rod_mesh_12.position.x += size;
  rod_mesh_12.rotation.set(0, 0, 0);
  rod_mesh_12.rotation.y = Math.PI/2;
  //rod_mesh_12.rotation.y = Math.PI/5;
  rod_mesh_12.position.y -= size + length;



  // den cube an gewünschte position bringen
  rod_mesh.position.x += position.x; rod_mesh.position.y += position.y; rod_mesh.position.z += position.z;  
  rod_mesh_2.position.x += position.x; rod_mesh_2.position.y += position.y; rod_mesh_2.position.z += position.z; 
  rod_mesh_3.position.x += position.x; rod_mesh_3.position.y += position.y; rod_mesh_3.position.z += position.z; 
  rod_mesh_4.position.x += position.x; rod_mesh_4.position.y += position.y; rod_mesh_4.position.z += position.z; 
  rod_mesh_5.position.x += position.x; rod_mesh_5.position.y += position.y; rod_mesh_5.position.z += position.z; 
  rod_mesh_6.position.x += position.x; rod_mesh_6.position.y += position.y; rod_mesh_6.position.z += position.z; 
  rod_mesh_7.position.x += position.x; rod_mesh_7.position.y += position.y; rod_mesh_7.position.z += position.z; 
  rod_mesh_8.position.x += position.x; rod_mesh_8.position.y += position.y; rod_mesh_8.position.z += position.z; 
  rod_mesh_9.position.x += position.x; rod_mesh_9.position.y += position.y; rod_mesh_9.position.z += position.z; 
  rod_mesh_10.position.x += position.x; rod_mesh_10.position.y += position.y; rod_mesh_10.position.z += position.z; 
  rod_mesh_11.position.x += position.x; rod_mesh_11.position.y += position.y; rod_mesh_11.position.z += position.z; 
  rod_mesh_12.position.x += position.x; rod_mesh_12.position.y += position.y; rod_mesh_12.position.z += position.z; 
  

  // den cube in die gewünschte rotation bringen

  let this_rotation_x = i_rotation_x * (Math.PI / 180) ;
  let this_rotation_y = i_rotation_y * (Math.PI / 180);
  let this_rotation_z = i_rotation_z * (Math.PI / 180);
  //console.log(this_rotation_x);

  let rot_x = 10;



  //console.log(_length);

  let rotation_point = new THREE.Vector3(_length/2, _length/2, _length/2);
  let rotation_axis_x = new THREE.Vector3(1,0,0);
  let rotation_axis_y = new THREE.Vector3(0,1,0);
  let rotation_axis_z = new THREE.Vector3(0,0,1);

  // rotate around x axis
  rotateAroundPoint(rod_mesh, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_2, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_3, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_4, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_5, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_6, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_7, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_8, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_9, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_10, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_11, rotation_point, rotation_axis_x, this_rotation_x);
  rotateAroundPoint(rod_mesh_12, rotation_point, rotation_axis_x, this_rotation_x);

  
  // rotate around y axis
  rotateAroundPoint(rod_mesh, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_2, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_3, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_4, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_5, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_6, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_7, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_8, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_9, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_10, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_11, rotation_point, rotation_axis_y, this_rotation_y);
  rotateAroundPoint(rod_mesh_12, rotation_point, rotation_axis_y, this_rotation_y);



  // rotate around z axis
  rotateAroundPoint(rod_mesh, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_2, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_3, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_4, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_5, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_6, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_7, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_8, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_9, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_10, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_11, rotation_point, rotation_axis_z, this_rotation_z);
  rotateAroundPoint(rod_mesh_12, rotation_point, rotation_axis_z, this_rotation_z);

  

  
  

  // setting the names of the meshes so they can be removed later
  
  rod_mesh.name = "mesh";
  rod_mesh_2.name = "mesh";
  rod_mesh_3.name = "mesh";
  rod_mesh_4.name = "mesh";
  rod_mesh_5.name = "mesh";
  rod_mesh_6.name = "mesh";
  rod_mesh_7.name = "mesh";
  rod_mesh_8.name = "mesh";
  rod_mesh_9.name = "mesh";
  rod_mesh_10.name = "mesh";
  rod_mesh_11.name = "mesh";
  rod_mesh_12.name = "mesh";


  //line.name = "line";

  

  // appending all meshes to the scene
  scene.add( rod_mesh );
  scene.add( rod_mesh_2 );
  scene.add( rod_mesh_3 );
  scene.add( rod_mesh_4 );
  scene.add( rod_mesh_5 );
  scene.add( rod_mesh_6 );
  scene.add( rod_mesh_7 );
  scene.add( rod_mesh_8 );
  scene.add( rod_mesh_9 );
  scene.add( rod_mesh_10 );
  scene.add( rod_mesh_11 );
  scene.add( rod_mesh_12 );



  // appending all the meshes to the list
  scene_wireframe_cubes.push(rod_mesh);
  scene_wireframe_cubes.push(rod_mesh_2);
  scene_wireframe_cubes.push(rod_mesh_3);
  scene_wireframe_cubes.push(rod_mesh_4);
  scene_wireframe_cubes.push(rod_mesh_5);
  scene_wireframe_cubes.push(rod_mesh_6);
  scene_wireframe_cubes.push(rod_mesh_7);
  scene_wireframe_cubes.push(rod_mesh_8);
  scene_wireframe_cubes.push(rod_mesh_9);
  scene_wireframe_cubes.push(rod_mesh_10);
  scene_wireframe_cubes.push(rod_mesh_11);
  scene_wireframe_cubes.push(rod_mesh_12);




}






function rotateAroundPoint(object, point, axis, angle) {
  const radians = angle * (Math.PI / 180); // radians into angle

  // move mesh to rotation point
  object.position.sub(point);

  // rotate mesh
  object.position.applyAxisAngle(axis, radians);
  object.rotateOnWorldAxis(axis, radians); // Zum Rotieren um eine Weltachse

  // bring mesh back to initaial position
  object.position.add(point);
}











function remove_wireframe_cube (){



  scene_wireframe_cubes.forEach(mesh => {
    scene.remove(mesh); // removing mesh from scene
    removeObject(mesh); // clean the object
  });

  // emptying the array that holds the meshes
  scene_wireframe_cubes = [];

  //console.log("Meshes entfernt");



}




function recursive_cubes(i_iterations, i_currentIteration = 0, i_this_size = _size, i_this_length = _length , i_offset_vector = new THREE.Vector3(0,0,0), i_offset_rotation_x = 0, i_offset_rotation_y = 0, i_offset_rotation_z = 0) {

  if (i_currentIteration >= i_iterations) {
    return; // Basisfall: Stoppe die Rekursion, wenn die Anzahl der Iterationen erreicht ist
    console.log("EXIT");
  }


  // reinitializing all the input parameters
  let this_iterations = i_iterations;

  let this_currentIteration = i_currentIteration;

  let this_size = i_this_size;
  let this_length = i_this_length;

  let this_offset_vector = i_offset_vector;

  let this_offset_rotation_x = i_offset_rotation_x;
  let this_offset_rotation_y = i_offset_rotation_y;
  let this_offset_rotation_z = i_offset_rotation_z;
  

 // function gets cancelled if cubes get too small
  if (this_size <= 0 || this_length <= 0 ) {
    return; 
  }
  create_wireframe_cube( this_size, this_length, this_offset_vector, this_offset_rotation_x, this_offset_rotation_y, this_offset_rotation_z);


  // changing the position
  let new_this_offset_vector = new THREE.Vector3(0,0,0);
  new_this_offset_vector.x +=  this_offset_vector.x;
  new_this_offset_vector.y +=  this_offset_vector.y;
  new_this_offset_vector.z +=  this_offset_vector.z;

  new_this_offset_vector.x +=  _x_offset_value;
  new_this_offset_vector.y +=  _y_offset_value;
  new_this_offset_vector.z +=  _z_offset_value;


  // changing the rotation

  let new_this_offset_rotation_x  = 0;
  let new_this_offset_rotation_y  = 0;
  let new_this_offset_rotation_z  = 0;

  new_this_offset_rotation_x +=  this_offset_rotation_x;
  new_this_offset_rotation_y +=  this_offset_rotation_y;
  new_this_offset_rotation_z +=  this_offset_rotation_z;

  new_this_offset_rotation_x +=  _x_offset_rotation;
  new_this_offset_rotation_y +=  _y_offset_rotation;
  new_this_offset_rotation_z +=  _z_offset_rotation;


  

  // recursive call of the function with changed iteration counter, size, length, offset vector and offset rotation
  recursive_cubes(this_iterations, this_currentIteration + 1, this_size -= _size_change , this_length -= _length_change, new_this_offset_vector, new_this_offset_rotation_x, new_this_offset_rotation_y, new_this_offset_rotation_z );

  
}










// GEOMETRY FUNTIONS










//  REMOVE OBJECTS AND CLEAN THE CACHES
function removeObject(sceneObject){
  if (!(sceneObject instanceof THREE.Object3D)) return;


  //Remove geometries to free GPU resources
  if (sceneObject.geometry) sceneObject.geometry.dispose();


  //Remove materials to free GPU resources
  if (sceneObject.material) {
      if (sceneObject.material instanceof Array) {
          sceneObject.material.forEach(material => material.dispose());
      } else {
          sceneObject.material.dispose();
      }
  }


  //Remove object from scene
  sceneObject.removeFromParent()
};









//RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}














//ANIMATE AND RENDER
function animate() {
  requestAnimationFrame( animate );




  control.update();
//////////////////
  if(_iterations != parameters.iterations || _size != parameters.size || _length != parameters.length || _x_offset_value != parameters.x_offset_value || _y_offset_value != parameters.y_offset_value || _z_offset_value != parameters.z_offset_value ||   _x_offset_rotation != parameters.x_offset_rotation || _y_offset_rotation != parameters.y_offset_rotation || _z_offset_rotation != parameters.z_offset_rotation || _size_change != parameters.size_change || _length_change != parameters.length_change ){
   
    // resetting the parameters so the function doesnt get called infinitely
    _iterations = parameters.iterations;
    _size = parameters.size;
    _length = parameters.length
    _x_offset_value = parameters.x_offset_value;
    _y_offset_value = parameters.y_offset_value;
    _z_offset_value = parameters.z_offset_value;
    _x_offset_rotation = parameters.x_offset_rotation;
    _y_offset_rotation = parameters.y_offset_rotation;
    _z_offset_rotation = parameters.z_offset_rotation;
    _size_change = parameters.size_change;
    _length_change = parameters.length_change;


    // first removing all meshes from the scene
    remove_wireframe_cube();

    // recreating the cubes
    recursive_cubes(_iterations);

    //console.log("iterations changed")
  }


 
  renderer.render( scene, camera );
}








//-----------------------------------------------------------------------------------
// EXECUTE MAIN 
//-----------------------------------------------------------------------------------

main();

