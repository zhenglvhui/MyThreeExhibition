import * as THREE from 'three' 
export default class CreateMesh {
    constructor(){ } 
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

}