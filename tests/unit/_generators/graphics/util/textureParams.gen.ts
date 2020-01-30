import { TextureParams } from "../../../../../src/graphics/util/textureParams";
import { Gl } from "../../../../../src/graphics/util/gl";

export const TextureParamsNoHandle: TextureParams = {
    handle: 0,
    width: 32,
    height: 32,
    minFilter: Gl.LINEAR,
    magFilter: Gl.LINEAR,
    wrapS: Gl.REPEAT,
    wrapT: Gl.REPEAT
}