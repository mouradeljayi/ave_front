import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { SceneService } from './scene.service';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { environment } from 'src/environments/environment';
import { SpinnerService } from 'src/app/shared/spinner/spinner.service';
import { MessagesService } from 'src/app/shared/messages/messages.service';
import { Subscription } from 'rxjs';
import { FileService } from 'src/app/services/file.service';
import { LocalService } from 'src/app/services/local.service';

import { Line2 } from 'three/examples/jsm/lines/Line2';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial';
import { CurvesService } from 'src/app/services/curves.service';
import { TranslateService } from '@ngx-translate/core';
import { ToolboxService } from 'src/app/services/toolbox.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-main-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss']
})
export class MainSceneComponent implements OnInit, AfterViewInit, OnDestroy {

  subscriptions: Subscription[] = []

  @ViewChild('canvascontainer') private canvasContainerRef: ElementRef;
  private camera!: THREE.OrthographicCamera;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private controls!: ArcballControls;
  private meshGroup!: THREE.Group;
  private lastGroup!: THREE.Group;
  private mesuresGroup!: THREE.Group;
  private mesuresLastGroup!: THREE.Group;
  private transformControls!: TransformControls;

  @Input() zoom: number = 1
  private material: THREE.Material = new THREE.MeshStandardMaterial({
    color: "#929292",
    depthTest: true,
    depthWrite: true,
    metalness: 0.35,
    roughness: 0.85,
    opacity: 0.85,
    transparent: true,
    flatShading: false,
    emissive: '#000000',
    vertexColors: true
  });
  private last_material: THREE.Material = new THREE.MeshStandardMaterial({
    color: "#0f90f6",
    depthTest: true,
    depthWrite: true,
    metalness: 0.35,
    roughness: 0.85,
    opacity: 0.85,
    transparent: true,
    flatShading: false,
    emissive: '#000000',
    vertexColors: true
  });


  get canvasContainer() {
    return this.canvasContainerRef.nativeElement
  }

  constructor(private SceneService: SceneService,
    private MessagesService: MessagesService,
    private StlService: FileService,
    private TranslateService: TranslateService,
    private UserService: UserService,
    private CurvesService: CurvesService,
    private toolboxService: ToolboxService,
    private LocalService: LocalService,
    private SpinnerService: SpinnerService) {

  }
  ngOnInit(): void {
    // Translate objects
    this.subscriptions.push(this.toolboxService.translate.subscribe((moveArgs) => {
      const translateGroup = (group: THREE.Group, axis: string) => {
        switch (axis) {
          case 'X':
            group.translateX(moveArgs.distance);
            break;
          case 'Y':
            group.translateY(moveArgs.distance);
            break;
          case 'Z':
            group.translateZ(moveArgs.distance);
            break;
          case 'R':
            group.position.set(0, 0, 0);
            this.controls.reset();
            break;
        }
      };
      if (moveArgs.object === 'foot' || moveArgs.object === 'last') {
        if(moveArgs.object === 'foot'){
          translateGroup(this.meshGroup, moveArgs.axis);
          translateGroup(this.mesuresGroup, moveArgs.axis);
        }else if(moveArgs.object === 'last'){
          translateGroup(this.lastGroup, moveArgs.axis);
          translateGroup(this.mesuresLastGroup, moveArgs.axis);
        }
      }
    }));
    // Rotate objects
    this.subscriptions.push(this.toolboxService.rotate.subscribe((moveArgs) => {
      const rotateGroup = (group: THREE.Group, axis: string) => {
        switch (axis) {
          case 'X':
            group.rotateX(THREE.MathUtils.degToRad(moveArgs.angle));
            break;
          case 'Y':
            group.rotateY(THREE.MathUtils.degToRad(moveArgs.angle));
            break;
          case 'Z':
            group.rotateZ(THREE.MathUtils.degToRad(moveArgs.angle));
            break;
          case 'R':
            group.rotation.set(0, 0, 0)
            this.controls.reset()
            break;
          case 'T':
            this.controls.reset();
            this.camera.position.set(0, 0, 500);
            break;
          case 'S':
            this.controls.reset();
            this.camera.position.set(0, -500, 0);
            break;
        }
      };
      if (moveArgs.object === 'foot' || moveArgs.object === 'last') {
        if(moveArgs.object === 'foot'){
          rotateGroup(this.meshGroup, moveArgs.axis);
          rotateGroup(this.mesuresGroup, moveArgs.axis);
        }else if(moveArgs.object === 'last'){
          rotateGroup(this.lastGroup, moveArgs.axis);
          rotateGroup(this.mesuresLastGroup, moveArgs.axis);
        }
      }
    }));

    
    this.subscriptions.push(this.LocalService.clear_last.subscribe(() => {
      this.lastGroup.clear()
      this.mesuresLastGroup.clear()
    }))
    this.subscriptions.push(this.CurvesService.toggleMesure.subscribe((data) => {
      this.toggle(data);
    }))
  
    this.subscriptions.push(this.SceneService.clear_scene.subscribe(() => {
      this.meshGroup.clear();
      this.mesuresGroup.clear();
    }))
    this.subscriptions.push(this.SceneService.download_stl.subscribe((emited_data) => {
      debugger
      let data = null;
      if (emited_data.isAverage && emited_data.ref.includes('af')) {
        data = 'api/' + this.lang + '/stl/average/' + emited_data.ref + '/' + emited_data.direction;
      } else if (!emited_data.isAverage && emited_data.ref.includes('if')) {
        data = 'api/' + this.lang + '/stl/footid/' + emited_data.ref + '/' + emited_data.direction;
      }
      this.meshGroup.clear();
      this.mesuresGroup.clear();
      this.controls.reset()

      const loader = new STLLoader()
      const token = localStorage.getItem('token');
      loader.setRequestHeader({ Authorization: 'Bearer ' + token })
      if (data != null) {
        loader.load(environment.api_url + data + '.stl?' + new Date().getTime().toString(), (geometry) => {
          let count = geometry.getAttribute('position').count
          let colors = new Float32Array(count * 3);
          colors.fill(1);
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          const mesh = new THREE.Mesh(geometry, this.material)
          mesh.name = 'foot'
          this.meshGroup.clear();
          this.mesuresGroup.clear();
          this.meshGroup.add(mesh);
          if(emited_data.isEdit){
            this.camera.position.set(1, -500, 50);
            this.camera.zoom = 1;
            this.camera.updateProjectionMatrix();
            this.SpinnerService.hide(1);
          }else{
            this.subscriptions.push(this.StlService.getStlMesures(emited_data.ref, emited_data.direction, emited_data.isAverage).subscribe({
              next: (value: any) => {
                this.create_curves(value.mesures);
                this.LocalService.addData(value)
                this.CurvesService.image = this.takeLastImage(geometry)
                this.SpinnerService.hide(1);
              },
              error: (error) => {
                this.SpinnerService.hide(1);
              },
            }))

          }
        },
          (xhr) => {
            // console.log(Math.round((xhr.loaded / xhr.total)* 100) + '% loaded')
          },
          (error: any) => {
            this.SpinnerService.hide(1);
          }
        )
      }
    }))
    this.subscriptions.push(this.SceneService.download_last_stl.subscribe((emited_data) => {
      this.SpinnerService.show(1)
      this.controls.reset()
      const loader = new STLLoader()
      const link = this.UserService.user.linked_platform + '/footengineers/last/' + emited_data.ref
      if (link != null) {
        loader.load( link + '.stl?' + new Date().getTime().toString(), (geometry) => {
          debugger;
          let count = geometry.getAttribute('position').count
          let colors = new Float32Array(count * 3);
          colors.fill(1);
          geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
          const mesh = new THREE.Mesh(geometry, this.last_material)
          mesh.name = 'last'
          this.lastGroup.clear();
          this.mesuresLastGroup.clear();
          this.lastGroup.add(mesh);
          this.subscriptions.push(this.StlService.getLastMesures(emited_data.ref).subscribe({
            next: (value: any) => {
              this.LocalService.addLastData(value);
              this.create_last_curves(value);
              this.LocalService.addLastData(value)
              this.SpinnerService.hide(1);
            },
            error: (error) => {
              this.SpinnerService.hide(1);
            },
          }))

        },
          (xhr) => {
          },
          (error: any) => {
            this.SpinnerService.hide(1);
          }
        )
      }
    }))

    this.subscriptions.push(this.SceneService.show_stl.subscribe((data) => {
      let reader = new FileReader();
      reader.addEventListener('load', (event: any) => {

        let contents = event.target.result;

        let geometry: any = new STLLoader().parse(contents);

        geometry.sourceType = "stl";

        geometry.sourceFile = data.file.name;

        let count = geometry.getAttribute('position').count
        let colors = new Float32Array(count * 3);
        colors.fill(1);
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        let mesh = new THREE.Mesh(geometry, this.material);

        mesh.name = 'foot';

        this.meshGroup.clear();
        this.lastGroup.clear();
        this.mesuresGroup.clear();
        this.mesuresLastGroup.clear();
        this.meshGroup.add(mesh);
      }, false);
      if (reader.readAsBinaryString !== undefined) {
        reader.readAsBinaryString(data.file);
      } else {
        reader.readAsArrayBuffer(data.file);
      }
    }))

    this.subscriptions.push(this.SceneService.resize.subscribe(() => {
      this.resize();
    }))
    this.subscriptions.push(this.SceneService.capture.subscribe(() => {
      this.capture();
    }))

    this.subscriptions.push(this.toolboxService.movePlane.subscribe((data) => {
      this.move_plane(data)
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
    let width = this.canvasContainer.clientWidth
    let height = this.canvasContainer.clientHeight

    let near = 0.1;
    let far = 3000;

    this.camera = new THREE.OrthographicCamera(
      width / -2,
      width / 2,
      height / 2,
      height / -2,
      near,
      far);

    this.camera.position.set(0, -500, 200);
    this.camera.zoom = this.zoom;
    this.camera.updateProjectionMatrix();
    this.addLights();
    this.meshGroup = new THREE.Group();
    this.meshGroup.name = 'meshs';
    this.lastGroup = new THREE.Group();
    this.lastGroup.name = 'last';

    this.mesuresGroup = new THREE.Group();    
    this.mesuresGroup.name = 'mesures';

    this.mesuresLastGroup = new THREE.Group();    
    this.mesuresLastGroup.name = 'last_mesures';

    this.scene.add(this.lastGroup);
    this.scene.add(this.meshGroup);
    this.scene.add(this.mesuresGroup);
    this.scene.add(this.mesuresLastGroup);

  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.canvasContainer.clientWidth, this.canvasContainer.clientHeight);
    this.canvasContainer.appendChild(this.renderer.domElement);
    this.controls = new ArcballControls(this.camera, this.renderer.domElement, this.scene);
    this.controls.setGizmosVisible(false);
    this.controls.activateGizmos(false);
    this.controls.addEventListener('change', () => {
      this.renderer.render(this.scene, this.camera);
    });
    // Transform Objects ( Translation & Rotation )
    this.transformControls = new TransformControls(this.camera, this.renderer.domElement);

    this.transformControls.addEventListener('change', () => {
      const plane = this.scene.getObjectByName('plane');
      if (plane && plane.visible) {
        this.toolboxService.plane_position.next(plane.position);
        this.toolboxService.plane_rotation.next(
          {
            x: THREE.MathUtils.radToDeg(plane.rotation.x),
            y: THREE.MathUtils.radToDeg(plane.rotation.y),
            z: THREE.MathUtils.radToDeg(plane.rotation.z)
          }
        );
        this.renderer.render(this.scene, this.camera);
      }
    })

    this.transformControls.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event['value'];
    });

    this.subscriptions.push(this.SceneService.transform.subscribe((type: "translate" | "rotate" | null) => {
      const plane = this.scene.getObjectByName('plane');
      if (plane && plane.visible && type) {
        this.transformControls.attach(plane)
        this.transformControls.mode = type;
        this.scene.add(this.transformControls)
      } else {
        this.transformControls.detach()
      }
    }))

    let component: MainSceneComponent = this;
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

  create_curves(mesures_list: any) {
    this.mesuresGroup.clear();
    mesures_list.forEach((mesure: any) => {
      let color = mesure.color
      let geometry: any;
      let material: any;
      let mesh: any;
      let positions = [];
      if (mesure.mesure != null && mesure.type != "") {
        if (mesure.type == "Point") {
          geometry = new THREE.SphereGeometry(1.5, 9, 9);
          material = new THREE.MeshBasicMaterial({ color: color });
          let group: any = new THREE.Group();
          if (mesure.mesure.length > 3) {
            group.name = mesure.slug;
            group.visible = true;
          }

          for (let i = 0; i < mesure.mesure.length / 3; i++) {
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(mesure.mesure[i * 3], mesure.mesure[i * 3 + 1], mesure.mesure[i * 3 + 2])
            if (mesure.mesure.length > 3) {
              group.add(mesh);
            } else {
              mesh.name = mesure.slug;
              mesh.visible = mesure.show;
              this.mesuresGroup.add(mesh);
            }
          }
          if (mesure.mesure.length > 3) {
            group.visible = mesure.show
            this.mesuresGroup.add(group);
          }
        } else if (mesure.type == "Line" || mesure.type == "Angle") {
          for (let i = 0; i < mesure.mesure.length; i++) {
            positions.push(parseFloat(mesure.mesure[i][0]), parseFloat(mesure.mesure[i][1]), parseFloat(mesure.mesure[i][2]));
          }
          geometry = new LineGeometry();
          geometry.setPositions(positions);
          material = new LineMaterial({
            color: color,
            linewidth: 1,
            vertexColors: false,
            dashed: false,
            alphaToCoverage: false,
            worldUnits: true
          });
          mesh = new Line2(geometry, material);
          mesh.name = mesure.slug;
          mesh.visible = mesure.show
          this.mesuresGroup.add(mesh);

        } else if (mesure.type == "Curve") {
          for (let i = 0; i < mesure.mesure.length; i++) {
            positions.push(parseFloat(mesure.mesure[i][0]), parseFloat(mesure.mesure[i][1]), parseFloat(mesure.mesure[i][2]));
          }
          geometry = new LineGeometry();
          geometry.setPositions(positions);
          material = new LineMaterial({
            color: color,
            linewidth: 1,
            vertexColors: false,
            dashed: false,
            alphaToCoverage: false,
            worldUnits: true
          });
          mesh = new Line2(geometry, material);
          mesh.name = mesure.slug;
          mesh.visible = mesure.show
          this.mesuresGroup.add(mesh);
        } else if (mesure.type == "vertexGroup") {
          // const vertices = new Float32Array( mesure.mesure );
          // let bufferAttribute = new THREE.BufferAttribute( vertices, 3 )

          // let foot: any = this.scene.getObjectByName('foot');
          // let colorsBuffer = foot.geometry.getAttribute('color') as THREE.BufferAttribute
          // let positionBuffer = foot.geometry.getAttribute('position') as THREE.BufferAttribute

          // const pointsColor = new THREE.Color( color );
          // if(foot){
          //   for (let i = 0; i < bufferAttribute.count; i++) {
          //     for (let j = 0; j < positionBuffer.count; j++) {
          //       if(bufferAttribute.getX(i) == positionBuffer.getX(j) &&
          //       bufferAttribute.getY(i) == positionBuffer.getY(j) &&
          //       bufferAttribute.getZ(i) == positionBuffer.getZ(j)){
          //         colorsBuffer.setXYZ(j,pointsColor.r, pointsColor.g, pointsColor.b)
          //       }
          //     }              
          //   }
          // }          
          // colorsBuffer.needsUpdate = true
          // foot.geometry.setAttribute('color', colorsBuffer);    

          const vertices = new Float32Array(mesure.mesure);
          let bufferAttribute = new THREE.BufferAttribute(vertices, 3)
          geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', bufferAttribute);
          material = new THREE.PointsMaterial({ color: color, size: 3 });
          mesh = new THREE.Points(geometry, material);
          mesh.name = mesure.slug;
          mesh.visible = mesure.show;
          this.mesuresGroup.add(mesh);
        } else if (mesure.type == "ground") {
          this.create_ground(mesure.mesure, mesure.show)
          if (this.zoom == 2 && !this.scene.getObjectByName('plane')) {
            this.create_plane(mesure.mesure)
          }
        }
      }
    });
  }

  create_last_curves(mesures_list: any) {
    this.mesuresLastGroup.clear();
    mesures_list.forEach((mesure: any) => {
      let color = mesure.color
      let geometry: any;
      let material: any;
      let mesh: any;
      let positions = [];
      if (mesure.mesure != null && mesure.type != "") {
        if (mesure.type == "Point") {
          geometry = new THREE.SphereGeometry(1.5, 9, 9);
          material = new THREE.MeshBasicMaterial({ color: color });
          mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(Array.prototype.concat.apply([], mesure.mesure))         
          mesh.name = 'last_' + mesure.slug;
          mesh.visible = mesure.show;
          this.mesuresLastGroup.add(mesh);

        } else if (mesure.type == "Line") {
          positions = Array.prototype.concat.apply([], mesure.mesure);
          geometry = new LineGeometry();
          geometry.setPositions(positions);
          material = new LineMaterial({
            color: color,
            linewidth: 1,
            vertexColors: false,
            dashed: false,
            alphaToCoverage: false,
            worldUnits: true
          });
          mesh = new Line2(geometry, material);
          mesh.name = 'last_' + mesure.slug;
          mesh.visible = mesure.show
          this.mesuresLastGroup.add(mesh);
        }
      }
    });
  }
  toggle( data: { slug: string, type: string}) {
    debugger
    let object = this.mesuresLastGroup.getObjectByName('last_' + data.slug);
    if(data.type == "foot"){
      object = this.mesuresGroup.getObjectByName(data.slug);
    }
    if (object) {
      object.visible = !object.visible
      this.CurvesService.curve_status.next({ type: data.type, slug: data.slug, status: object.visible })
    }
  }
  resize(width: number = 0, height: number = 0) {
    if (width == 0) {
      width = this.canvasContainer.clientWidth
    }
    if (height == 0) {
      height = this.canvasContainer.clientHeight
    }
    this.renderer.setSize(width, height);
    this.camera.left = width / -2
    this.camera.right = width / 2
    this.camera.top = height / 2
    this.camera.bottom = height / -2;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }
  capture(width: number = 0, height: number = 0, zoom: number = 1) {

    this.camera.zoom = zoom
    this.resize(width, height);
    this.renderer.render(this.scene, this.camera);
    let dataURL = this.renderer.domElement.toDataURL();
    this.camera.zoom = this.zoom
    this.resize();
    return dataURL;

  }
  takeLastImage(geometry: THREE.BufferGeometry) {
    geometry.computeBoundingBox();
    let box = geometry.boundingBox
    if (box != null) {
      let widthObject = (box.max.x - box.min.x) + 30;
      let heightObject = (box.max.z - box.min.z) + 30;
      let facteur = window.innerWidth / widthObject;
      const width = widthObject * facteur
      const height = heightObject * facteur
      return this.capture(width, height, facteur)
    }
    return null;
  }

  create_ground(ground: { length: number, width: number, depth: number }, visible:boolean = false) {
    const geometryGround = new THREE.BoxGeometry(ground.length, ground.width, 1);
    const materialGround = new THREE.MeshBasicMaterial(
      {
        color: '#79CBFD',
        opacity: 0.3,
        transparent: true
      });
    const groundMesh = new THREE.Mesh(geometryGround, materialGround);
    groundMesh.name = 'ground';
    groundMesh.visible = visible;
    groundMesh.position.z = ground.depth;
    this.mesuresGroup.add(groundMesh);
  }

  // Create plane Geometry
  create_plane(plane: { length: number, width: number }) {
    const planeGeometry = new THREE.PlaneGeometry(plane.length, plane.width);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: '#79CBFD', side: THREE.DoubleSide });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.rotation.y = Math.PI / 2;
    planeMesh.name = 'plane';
    planeMesh.visible = true
    this.scene.add(planeMesh)
    // Watch plane display
    this.subscriptions.push(this.toolboxService.plane_toggle.subscribe((value) => {
      if(value) {
        this.scene.add(planeMesh);
      } else {
        this.scene.remove(planeMesh);
        this.SceneService.transform.next(null)
      }
    }))
  }
  // Move plane Geometry
  move_plane(action: { type: string, x: number, y: number, z: number }) {
    const plane = this.scene.getObjectByName('plane');
    if (plane) {
      if (action.type === "rotate") {
        plane.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(action.x))
        plane.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(action.y))
        plane.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(action.z))
      } else if (action.type === "translate") {
        plane.translateX(action.x)
        plane.translateY(action.y)
        plane.translateZ(action.z)
      } else if (action.type === "horizontal" || action.type === "vertical") {
        plane.rotation.set(action.x, action.y, action.z)
        plane.position.set(0, 0, 0)
      } else {
        plane.position.set(0, 0, 0)
        plane.rotation.set(0, Math.PI / 2, 0)
      }
    }
  }

  get lang() {
    return this.TranslateService.getDefaultLang()
  }
}
