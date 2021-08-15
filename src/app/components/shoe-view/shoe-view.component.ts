import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import CameraControls from 'camera-controls';

CameraControls.install( { THREE: THREE } );

@Component({
  selector: 'app-shoe-view',
  templateUrl: './shoe-view.component.html',
  styleUrls: ['./shoe-view.component.scss']
})
export class ShoeViewComponent implements OnInit {

  mesh: any;
  renderer: any;
  camera: any;
  scene: any;
  light: any;
  cube: any;
  orbitControls: any;
  clock = new THREE.Clock();
  loader = new GLTFLoader();
  canvasWidth: any;
  canvasHeight: any;

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.init();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.canvasWidth = event.target.innerWidth;
    this.canvasHeight = event.target.innerHeight;
    this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
    this.camera.aspect = event.target.innerWidth / event.target.innerHeight;
  }

  init() {
    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 3;
    this.camera.position.x = 1;
    this.camera.position.y = 2;
    this.scene.add(this.camera);

    const plight = new THREE.PointLight( 0xffffff, 10, 100 );
    plight.position.set( 0, 3, 0 );
    plight.castShadow = true;
    this.scene.add( plight );

    // this.light = new THREE.SpotLight(0xffa95c,4);
    // this.light.position.set(-50,50,50);
    // this.light.castShadow = true;
    // this.scene.add(this.light);

    // Directional Light
    // const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // directionalLight.position.set(2, 2, 5);
    // this.scene.add(directionalLight);

    // HemisphereLight Light
    const hemiLight = new THREE.HemisphereLight(0xffeeb1, 0x080820, 4);
    this.scene.add(hemiLight);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true,
      alpha: true
    });
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.orbitControls = new CameraControls(this.camera, this.renderer.domElement);
    this.orbitControls.dampingFactor = 0.01;
    this.orbitControls.draggingDampingFactor = 0.02;
    this.orbitControls.dollySpeed = 0.15;
    this.orbitControls.minDistance = 2;
    this.orbitControls.maxDistance = 6;

    // const ngeometry = new THREE.BoxGeometry(1, 1, 1);
    // const nmaterial = new THREE.MeshStandardMaterial({color: 0x00ff00});
    // this.cube = new THREE.Mesh(ngeometry, nmaterial);
    // this.cube.castShadow = true;
    // this.cube.position.set(2, 1, 0);
    // this.scene.add(this.cube);

    const geometry = new THREE.PlaneGeometry( 12, 12 );
    const material = new THREE.MeshStandardMaterial( {color: 0xffffff, side: THREE.BackSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.receiveShadow = true;
    plane.position.set(0, -0.2, 0);
    plane.rotation.x = Math.PI / 2;
    this.scene.add( plane );
  
    this.loader.load( '../../../assets/models/one/scene.gltf', ( gltf ) => {
      const model = gltf.scene.children[0];
      model.scale.set(10, 10, 10);
      model.traverse(n => { if ( (<THREE.Mesh> n).isMesh ) {
        n.castShadow = true; 
        n.receiveShadow = false;
        // if((<THREE.Mesh> n).material.map) (<THREE.Mesh> n).material.map.anisotropy = 1; 
      }});
      this.scene.add(model);
      // console.log(model);

      this.animate();
    }, (xhr) => {
      console.log((xhr.loaded/xhr.total * 100) + "% loaded");
    }, ( error ) => {
      console.error( error );
    } );

    this.scene.background = new THREE.Color( 0xf2f2f0 );
  }
  
  animate(): any {
    // snip
	const delta = this.clock.getDelta();
	const hasControlsUpdated = this.orbitControls.update( delta );

    this.renderer.render( this.scene, this.camera );
    // this.light.position.set( 
    //   this.camera.position.x + 10,
    //   this.camera.position.y + 10,
    //   this.camera.position.z + 10,
    // );
    requestAnimationFrame(this.animate.bind(this));
  }

}
