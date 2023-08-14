import { ItFnArr, ItPlayAllSpecialAnimateFn } from "@/ts/interface/modelRender";
import * as THREE from "three"
 
export default class AnimateControls {
    constructor(){}
     /**
     * 执行模型中动画
     * @param mesh  执行的动画的mesh
     * @param animations 要执行的动画集合
     * @param setFramePlay  从第几帧开始播放
     * @param playAllSpecialAnimateFn  执行动画要带的参数，如要调整某个动画的时长等
     * @returns 
     */
     static playAllAnimate(mesh: THREE.Group, animations: THREE.AnimationClip[], setFramePlay: number = 1, playAllSpecialAnimateFn: ItPlayAllSpecialAnimateFn[] = []): THREE.AnimationMixer {
        let mixer: THREE.AnimationMixer = new THREE.AnimationMixer(mesh);
        animations.forEach(function (clip): void {
            mixer.setTime(setFramePlay);
            let findItem = playAllSpecialAnimateFn.find((item) => item.animationName == clip.name);
            if (findItem) {
                let mixerStorage = mixer.clipAction(clip);
                findItem.fnArr.map((item: ItFnArr) => {
                    mixerStorage = (mixerStorage as any)[item.fn](item.fnParams);
                });
                mixerStorage.play();
            } else {
                mixer.clipAction(clip).play();
            }
        });
        return mixer;
    };

}