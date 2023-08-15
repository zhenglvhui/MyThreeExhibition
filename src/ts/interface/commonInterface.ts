import { ENUM_MOUSE_KEY } from "../Enum";

interface XYZ {
    x: number,
    y: number,
    z: number  
}
 
interface pointXY {   
    x: number; 
    y: number;
}   
   
interface layerXY {
    layerX: number;
    layerY: number;
}

type KeyStatus = {
	[key in ENUM_MOUSE_KEY]: boolean;
};


export { 
    XYZ,
    pointXY,
    layerXY,
    KeyStatus
}