import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
let instance: MyDRACOLoader | null = null;

// DRACOLoader 加载器设置成单例模式，否则实列过多会导致内存溢出
export default class MyDRACOLoader {
    private dracoLoader!: DRACOLoader;

    constructor() {
        if (instance) return instance;
        instance = this;
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath("/draco/");
    }

    getDRACOLoader(): DRACOLoader {
        return this.dracoLoader;
    }
}