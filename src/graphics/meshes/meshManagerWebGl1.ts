import { Gl } from "../constants/gl";
import { IndexBuffer } from "./indexBuffer";
import { MeshManagerInternal } from "./meshManager";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBuffer } from "./vertexBuffer";

/**
 * @internal
 */
export class MeshManagerWebGl1 implements MeshManagerInternal
{
    private readonly _gl: WebGLRenderingContext;
    private _boundVertexBuffer?: VertexBuffer;
    private _boundIndexBuffer?: IndexBuffer;

    public constructor(gl: WebGLRenderingContext)
    {
        this._gl = gl;
    }

    public createVertexBuffer(numVerts: number, ...attributes: VertexAttribute[]): VertexBuffer
    {
        const gl = this._gl;
        const vertexSize = attributes
            .map(attr => attr.totalSize)
            .reduce((totalSize, currentSize) => totalSize + currentSize);

        const handle = gl.createBuffer()!;
        
        gl.bindBuffer(Gl.ARRAY_BUFFER, handle);
        gl.bufferData(Gl.ARRAY_BUFFER, numVerts * vertexSize, Gl.STATIC_DRAW);

        this._boundVertexBuffer = undefined;

        return new VertexBuffer(this, {
            handle: handle,
            numVerts,
            vertexSize,
            attributes
        });
    }

    public createIndexBuffer(indices: Uint16Array): IndexBuffer
    {
        const gl = this._gl;
        const handle = gl.createBuffer()!;

        gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, handle);
        gl.bufferData(Gl.ELEMENT_ARRAY_BUFFER, indices, Gl.STATIC_DRAW);

        this._boundIndexBuffer = undefined;

        return new IndexBuffer(this, {
            handle: handle,
            indices: indices
        });
    }
    
    public bindVertexBuffer(vertexBuffer: VertexBuffer)
    {
        if (vertexBuffer === this._boundVertexBuffer)
        {
            return;
        }

        const gl = this._gl;
        const attributes = vertexBuffer.attributes;
        const numAttributes = attributes.length;
        const stride = vertexBuffer.vertexSize;

        gl.bindBuffer(Gl.ARRAY_BUFFER, vertexBuffer.getHandle());

        this._boundVertexBuffer = vertexBuffer;

        for (let i = 0, offset = 0; i < numAttributes; ++i)
        {
            const attr = attributes[i];
            const location = attr.getLocation();

            if (location !== -1)
            {
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, attr.numComponents, attr.type, attr.normalized, stride, offset);
            }

            offset += attr.totalSize;
        }
    }
    
    public bindIndexBuffer(indexBuffer: IndexBuffer)
    {
        if (indexBuffer === this._boundIndexBuffer)
        {
            return;
        }

        this._gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, indexBuffer.getHandle());

        this._boundIndexBuffer = indexBuffer;
    }

    public flushVertexBuffer(vertexBuffer: VertexBuffer, offset = 0, count = vertexBuffer.length)
    {
        this.bindVertexBuffer(vertexBuffer);

        const byteOffset = offset * vertexBuffer.vertexSize;
        const bufferView = vertexBuffer.subarray(offset, offset + count);
        
        this._gl.bufferSubData(Gl.ARRAY_BUFFER, byteOffset, bufferView);
    }

    public flushIndexBuffer(indexBuffer: IndexBuffer)
    {
        this.bindIndexBuffer(indexBuffer);

        this._gl.bufferSubData(Gl.ELEMENT_ARRAY_BUFFER, 0, indexBuffer);
    }
}