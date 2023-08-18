import * as THREE from 'three'
import { XYZ } from '../interface/commonInterface';
import ThreeBase from './ThreeBase';

interface CreatAABBFromMeshParams {
    addMesh: THREE.Object3D, // 要添加包围盒长宽的元素
    boxGeometry?: {
        width?: number,
        height?: number,
        depth?: number,
    },
    name: string,
    position?: Partial<XYZ>
}
export default class CreateMesh {
    constructor() { }
    // 创建精灵mesh 
    static createSpriteMesh(name: string, color: number = 0xffff00, font: string = "Bold 60px Arial", lineWidth: number = 2): THREE.Sprite {
        //先用画布将文字画出
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = 400;
        canvas.height = 200;
        let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#fff";
            ctx.font = font;
            ctx.textAlign = "center";
            ctx.lineWidth = lineWidth;
            ctx.fillText(name, 200, 150);
        }
        let texture: THREE.Texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        //使用Sprite显示文字
        let material: THREE.SpriteMaterial = new THREE.SpriteMaterial({ map: texture, color });
        let sprite: THREE.Sprite = new THREE.Sprite(material);
        return sprite;
    };

    // 创建包围盒
    static creatAABBFromMesh(params: CreatAABBFromMeshParams, visible: boolean = true, opacity: number = 0): THREE.Mesh {
        const aabb = new THREE.Box3();
        aabb.setFromObject(params.addMesh);
        let geometry: THREE.BoxGeometry;
        let width = params.boxGeometry?.width ?? aabb.max.x - aabb.min.x;
        let height = params.boxGeometry?.height ?? aabb.max.y - aabb.min.y;
        let depth = params.boxGeometry?.depth ??  aabb.max.z - aabb.min.z;
        geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: opacity });
        const mesh = new THREE.Mesh(geometry, material);
        let x = params.position?.x ?? params.addMesh.position.x;
        let y = params.position?.y ?? params.addMesh.position.y;
        let z = params.position?.z ?? params.addMesh.position.z;
        mesh.position.set(x, y, z);
        mesh.name = params.name;
        mesh.visible = visible;
        return mesh;
    }

}