import { TextureMagFilter } from "../../../../../src/graphics/constants/textureMagFilter";
import { TextureMinFilter } from "../../../../../src/graphics/constants/textureMinFilter";
import { TextureParams } from "../../../../../src/graphics/textures/textureParams";
import { TextureWrap } from "../../../../../src/graphics/constants/textureWrap";
import { Writeable } from "../../../_helpers/writeable";

export function TextureParamsAllDefault(): TextureParams
{
    return {
        handle: 0,
        width: 0,
        height: 0,
        minFilter: TextureMinFilter.LINEAR,
        magFilter: TextureMagFilter.LINEAR,
        wrapS: TextureWrap.CLAMP_TO_EDGE,
        wrapT: TextureWrap.CLAMP_TO_EDGE
    };
}

export function TextureParamsWithHandle(handle: number): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.handle = handle;

    return params;
}

export function TextureParamsWithUri(uri: string): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.uri = uri;

    return params;
}

export function TextureParamsWithWidth(width: number): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.width = width;

    return params;
}

export function TextureParamsWithHeight(height: number): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.height = height;

    return params;
}

export function TextureParamsWithMinFilter(minFilter: TextureMinFilter): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.minFilter = minFilter;

    return params;
}

export function TextureParamsWithMagFilter(magFilter: TextureMagFilter): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.magFilter = magFilter;

    return params;
}

export function TextureParamsWithWrapS(wrapS: TextureWrap): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.wrapS = wrapS;

    return params;
}

export function TextureParamsWithWrapT(wrapT: TextureWrap): TextureParams
{
    const params: Writeable<TextureParams> = TextureParamsAllDefault();
    params.wrapT = wrapT;

    return params;
}