import { IndexBufferParams } from "../../../../../src/graphics/meshes/indexBufferParams";
import { Writeable } from "../../../_helpers/writeable";

export function IndexBufferParamsAllDefault(): IndexBufferParams
{
    return {
        handle: 0,
        indices: new Uint16Array(0)
    };
}

export function IndexBufferParamsWithHandle(handle: number): IndexBufferParams
{
    const params: Writeable<IndexBufferParams> = IndexBufferParamsAllDefault();
    params.handle = handle;

    return params;
}

export function IndexBufferParamsWithIndices(indices: Uint16Array): IndexBufferParams
{
    const params: Writeable<IndexBufferParams> = IndexBufferParamsAllDefault();
    params.indices = indices;

    return params;
}