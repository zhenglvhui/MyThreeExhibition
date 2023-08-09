import {ON_CHARACTER_JUMP} from "@/ts/Constants";
import ThreeBase from "./ThreeBase";

type Keys = "KeyW" | "KeyS" | "KeyA" | "KeyD" | "KeyV" | "Space";

type KeySets = Keys[]

type KeyStatus = {
	[key in Keys]: boolean; 
};

export default class KeyControl {
	ketStatus: KeyStatus = {
		"KeyW": false,
		"KeyS": false,
		"KeyA": false,
		"KeyD": false,
		"KeyV": false,
		"Space": false
	};
	private key_sets: KeySets = ["KeyW", "KeyS", "KeyA", "KeyD", "KeyV", "Space"];
	private handleKeyDown: OmitThisParameter<(event: KeyboardEvent) => void>;
	private handleKeyUp: OmitThisParameter<(event: KeyboardEvent) => void>;
	private mainModel:ThreeBase

	constructor(mainModel: ThreeBase) {
		this.mainModel = mainModel;
		this.handleKeyDown = this.onKeyDown.bind(this);
		this.handleKeyUp = this.onKeyUp.bind(this);
		this._bindEvent();
	}

	private _bindEvent() {
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
	}

	onKeyDown(event: KeyboardEvent) {
		if (this.isAllowKey(event.code)) {
			this.ketStatus[event.code] = true;
			if (event.code === "Space") {
				this.mainModel.$emit(ON_CHARACTER_JUMP);
			}
		}
	}

	onKeyUp(event: KeyboardEvent) {
		if (this.isAllowKey(event.code)) {
			this.ketStatus[event.code] = false;
		}
	}

	// 判断是否为允许的键盘key
	isAllowKey(key: string): key is Keys {
		return this.key_sets.includes(key as Keys);
	}
}
