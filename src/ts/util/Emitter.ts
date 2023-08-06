import mitt from "mitt";

export default class Emitter {
	private emitterInstance: ReturnType<typeof mitt>;

	constructor() {
		this.emitterInstance = mitt();
	}

	$on(name: string, handler: (...args: any[]) => void) {
		this.emitterInstance.on(name, handler);
	}

	$emit(name: string, ...args: any[]) {
		this.emitterInstance.emit(name, args);
	}

	$off(name: string, handler?: (...args: any[]) => void) {
		this.emitterInstance.off(name, handler);
	}
}
