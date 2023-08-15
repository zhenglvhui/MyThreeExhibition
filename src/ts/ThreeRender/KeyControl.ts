import { ON_CHARACTER_JUMP } from "@/ts/Constants";
import ThreeBase from "./ThreeBase";
import { ENUM_MOUSE_KEY } from "@/ts/Enum";
import { KeyStatus } from "@/ts/interface/commonInterface";


export default class KeyControl {
	private keyStatus: KeyStatus = {
		[ENUM_MOUSE_KEY.keyW]: false,
		[ENUM_MOUSE_KEY.keyS]: false,
		[ENUM_MOUSE_KEY.keyA]: false,
		[ENUM_MOUSE_KEY.keyD]: false,
		[ENUM_MOUSE_KEY.keyV]: false,
		[ENUM_MOUSE_KEY.space]: false
	};
	private keySets: ENUM_MOUSE_KEY[] = [ENUM_MOUSE_KEY.keyW, ENUM_MOUSE_KEY.keyS, ENUM_MOUSE_KEY.keyA, ENUM_MOUSE_KEY.keyD, ENUM_MOUSE_KEY.keyV, ENUM_MOUSE_KEY.space];
	private handleKeyDown: OmitThisParameter<(event: KeyboardEvent) => void>;
	private handleKeyUp: OmitThisParameter<(event: KeyboardEvent) => void>;
	private mainModel: ThreeBase

	constructor(mainModel: ThreeBase) {
		this.mainModel = mainModel;
		this.handleKeyDown = this.onKeyDown.bind(this);
		this.handleKeyUp = this.onKeyUp.bind(this);
		this.bindEvent();
	}

	private bindEvent() {
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
	}

	private onKeyDown(event: KeyboardEvent) {
		if (this.isAllowKey(event.code)) {
			this.keyStatus[event.code as ENUM_MOUSE_KEY] = true;
			if (event.code as ENUM_MOUSE_KEY === ENUM_MOUSE_KEY.space) {
				this.mainModel.$emit(ON_CHARACTER_JUMP);
			}
		}
	}

	private onKeyUp(event: KeyboardEvent) {
		if (this.isAllowKey(event.code)) {
			this.keyStatus[event.code as ENUM_MOUSE_KEY] = false;
		}
	}

	// 判断是否为允许的键盘key
	private isAllowKey(key: string): key is ENUM_MOUSE_KEY {
		return this.keySets.includes(key as ENUM_MOUSE_KEY);
	}

	public getKeyStatus():KeyStatus{
		return this.keyStatus;
	}

	public setKeyStatus(keyStatus:KeyStatus){
		this.keyStatus = keyStatus;
	}
}
