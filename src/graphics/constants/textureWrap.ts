import { Gl } from "./gl";

export const enum TextureWrap
{
    REPEAT = Gl.REPEAT,

    CLAMP_TO_EDGE = Gl.CLAMP_TO_EDGE,

    MIRRORED_REPEAT = Gl.MIRRORED_REPEAT
}