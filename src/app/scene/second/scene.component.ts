import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { SceneService } from '../main/scene.service';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-second-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class SecondSceneComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('canvas') private canvasRef: ElementRef;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: ArcballControls;
  private material: THREE.Material = new THREE.MeshStandardMaterial({
    color: "#929292",
    depthTest: true,
    depthWrite: true,
    metalness: 0.4,
    roughness: 0.8,
    opacity: 0.8,
    transparent: true
  });
  subscriptions: Subscription[] = []

  get canvas() {
    return this.canvasRef.nativeElement
  }

  constructor(private SceneService: SceneService,
              private TranslateService:TranslateService) {
  }
  ngOnInit(): void {
    this.SceneService.show_second_stl.subscribe((data) => {
      let filename = data.file.name;
    let reader = new FileReader();
    reader.addEventListener('load', (event: any) => {

      let contents = event.target.result;

      let geometry: any = new STLLoader().parse(contents);

      geometry.sourceType = "stl";

      geometry.sourceFile = data.file.name;

      

      let mesh = new THREE.Mesh(geometry, this.material);

      mesh.name = data.name;

      let meshGroups = this.scene.getObjectByName('meshs');
      if(meshGroups){
        meshGroups.clear()       
      }
      if(!meshGroups){ meshGroups = new THREE.Group() }
      meshGroups.name = 'meshs';
      meshGroups.add(mesh);
      this.scene.add(meshGroups);
      debugger;

    }, false);

    if (reader.readAsBinaryString !== undefined) {
      reader.readAsBinaryString(data.file);
    } else {
      reader.readAsArrayBuffer(data.file);
    }
    })

    this.subscriptions.push(this.SceneService.download_stl.subscribe((emited_data) => {
      debugger
      let data = null;
      if (emited_data.isAverage && emited_data.ref.includes('af')) {
        data = 'api/' + this.lang + '/stl/average/' + emited_data.ref + '/' + emited_data.direction;
      } else if (!emited_data.isAverage && emited_data.ref.includes('if')) {
        data = 'api/' + this.lang + '/stl/footid/' + emited_data.ref + '/' + emited_data.direction;
      }
      this.controls.reset()

      const loader = new STLLoader()
      const token = localStorage.getItem('token');
      loader.setRequestHeader({ Authorization: 'Bearer ' + token })
      if (data != null) {
        loader.load(environment.api_url + data + '.stl?' + new Date().getTime().toString(), (geometry) => {
          debugger;
          let count = geometry.getAttribute('position').count
          let colors = new Float32Array(count * 3);
          colors.fill(1);
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          const mesh = new THREE.Mesh(geometry, this.material)
          mesh.name = 'foot'
          let meshGroups = this.scene.getObjectByName('meshs');
          if(meshGroups){
            meshGroups.clear()       
          }
          if(!meshGroups){ meshGroups = new THREE.Group() }
          meshGroups.name = 'meshs';
          meshGroups.add(mesh);
          this.scene.add(meshGroups);
          debugger;
        },
          (xhr) => {
            // console.log(Math.round((xhr.loaded / xhr.total)* 100) + '% loaded')
          },
          (error: any) => {
          }
        )
      }
    }))
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe()
    }
  }

  ngAfterViewInit(): void {
    this.createScene();
    this.startRenderingLoop();
  }



  private createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfcfcfc)    
    let width = this.canvas.clientWidth
    let height = this.canvas.clientHeight
    let near = 0.1;
    let far = 3000;
    
    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      near,
      far);

    this.camera.position.set(1, -500, 50);
    this.camera.zoom = 1;
    this.camera.updateProjectionMatrix();

    this.addLights();
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    this.controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
    this.controls.setGizmosVisible(false);
    this.controls.activateGizmos(false);

    this.controls.addEventListener( 'change', () => {
      this.renderer.render(this.scene, this.camera);
    });


    let component: SecondSceneComponent = this;
    (function render() {
      requestAnimationFrame(render);
      component.renderer.render(component.scene, component.camera);
      component.controls.update();
    })();

  }

  addLights() {
    const lightGroup: THREE.Group = new THREE.Group();
    lightGroup.name = 'lightGroup';

    const AmbientLight = new THREE.AmbientLight(0x888888); // soft white light
    lightGroup.add(AmbientLight);

    const light1: THREE.SpotLight = new THREE.SpotLight(0x888888, 3);
    light1.position.set(0, 500, 0);
    light1.castShadow = true;
    light1.shadow.bias = -0.000222;
    light1.shadow.mapSize.width = 1024;
    light1.shadow.mapSize.height = 1024;
    // light1.shadow.camera = this.camera;
    lightGroup.add(light1);

    const light2: THREE.SpotLight = light1.clone();
    light2.position.set(0, -500, 0);
    lightGroup.add(light2);

    const light3: THREE.SpotLight = light1.clone();
    light3.position.set(0, 0, 500);
    lightGroup.add(light3);

    const light4: THREE.SpotLight = light1.clone();
    light4.position.set(0, 0, -500);
    lightGroup.add(light4);

    const light5: THREE.SpotLight = light1.clone();
    light5.position.set(500, 0, 0);
    lightGroup.add(light5);

    const light6: THREE.SpotLight = light1.clone();
    light6.position.set(-500, 0, 0);
    lightGroup.add(light6);

    this.scene.add(lightGroup)
    debugger;
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  get lang() {
    return this.TranslateService.getDefaultLang()
  }
}
