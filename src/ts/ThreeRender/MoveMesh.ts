import { MoveMeshOptions } from "@/ts/interface/modelRender";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import ThreeBase from "@/ts/ThreeRender/ThreeBase";
import * as THREE from 'three'

// 移动物体 
export default class MoveMesh {
    private mainModel: ThreeBase;
    private options: MoveMeshOptions;
    private character!: THREE.Mesh<RoundedBoxGeometry, THREE.MeshBasicMaterial>; // 胶囊体
    private velocity:THREE.Vector3 = new THREE.Vector3(); // 速率

    constructor(mainModel: ThreeBase, options: MoveMeshOptions = {
        resetPosition: new THREE.Vector3(0, 5, 0), // 重生点
        resetY: -25, // 掉落高度
        speed: 6, // 速度
        jumpHeight: 20, // 跳起高度
        gravity: -50 // 重力
    }) {
        this.mainModel = mainModel;
        this.options = options;
        this.createMoveModel();
    }

    private createMoveModel(){
        this.character = new THREE.Mesh(
			new RoundedBoxGeometry(0.5, 2.5, 0.5, 10, 1),
			new THREE.MeshBasicMaterial({ color: 0x0000ff })
		);
		this.character.geometry.translate(0, -0.25, 0); 
		this.character.position.copy(this.options.resetPosition);
		this.character.visible = true ;
		// this.mainModel.getScene().add(this.character);
    }
}