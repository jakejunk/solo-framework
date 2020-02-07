import { TextureMagFilter } from "../../../../../src/graphics/constants/textureMagFilter";
import { TextureMinFilter } from "../../../../../src/graphics/constants/textureMinFilter";
import { TextureParams } from "../../../../../src/graphics/util/textureParams";
import { TextureWrap } from "../../../../../src/graphics/constants/textureWrap";

export const TextureParamsNoHandle: TextureParams = {
    handle: 0,
    width: 32,
    height: 32,
    minFilter: TextureMinFilter.LINEAR,
    magFilter: TextureMagFilter.LINEAR,
    wrapS: TextureWrap.REPEAT,
    wrapT: TextureWrap.REPEAT
}