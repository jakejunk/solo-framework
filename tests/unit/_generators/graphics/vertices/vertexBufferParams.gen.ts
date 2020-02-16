import { VertexAttribute } from "../../../../../src/graphics/vertices/vertexAttribute";
import { VertexBufferParams } from "../../../../../src/graphics/vertices/vertexBufferParams";
import { Writeable } from "../../../_helpers/writeable";

export function VertexBufferParamsAllDefault(): VertexBufferParams
{
    return {
        handle: 0,
        numVerts: 0,
        vertexSize: 0,
        attributes: []
    };
}

export function VertexBufferParamsWithAttributes(attributes: VertexAttribute[]): VertexBufferParams
{
    const params: Writeable<VertexBufferParams> = VertexBufferParamsAllDefault();
    params.attributes = attributes;

    return params;
}

export function VertexBufferParamsWithVerts(numVerts: number, vertexSize: number): VertexBufferParams
{
    const params: Writeable<VertexBufferParams> = VertexBufferParamsAllDefault();
    params.numVerts = numVerts;
    params.vertexSize = vertexSize;

    return params;
}

export function VertexBufferParamsWithHandle(handle: number): VertexBufferParams
{
    const params: Writeable<VertexBufferParams> = VertexBufferParamsAllDefault();
    params.handle = handle;

    return params;
}