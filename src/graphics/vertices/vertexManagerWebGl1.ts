import { Gl } from "../constants/gl";
import { IndexBuffer } from "./indexBuffer";
import { VertexAttribute } from "./vertexAttribute";
import { VertexBuffer } from "./vertexBuffer";
import { VertexManager } from "./vertexManager";

export class VertexManagerWebGl1 implements VertexManager
{
    private readonly _gl: WebGLRenderingContext;
    private _boundVertexBuffer?: VertexBuffer;

    public constructor(gl: WebGLRenderingContext)
    {
        this._gl = gl;
    }

    public createBufferFromAttributes(numVerts: number, ...attributes: VertexAttribute[]): VertexBuffer
    {
        const gl = this._gl;
        const vertexSize = attributes
            .map(attr => attr.totalSize)
            .reduce((totalSize, currentSize) => totalSize + currentSize);

        const handle = gl.createBuffer()!;
        
        gl.bindBuffer(Gl.ARRAY_BUFFER, handle);
        gl.bufferData(Gl.ARRAY_BUFFER, numVerts * vertexSize, Gl.STATIC_DRAW);

        this._boundVertexBuffer = undefined;

        const vertexBuffer = new VertexBuffer(this, {
            handle: handle,
            numVerts,
            vertexSize,
            attributes
        });

        return vertexBuffer;
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

        this._boundVertexBuffer = vertexBuffer;
    }
    
    public bindIndexBuffer(indexBuffer: IndexBuffer)
    {
        throw new Error("Method not implemented.");
    }

    public flushVertexBuffer(vertexBuffer: VertexBuffer, offset = 0, count = vertexBuffer.buffer.length)
    {
        this.bindVertexBuffer(vertexBuffer);

        const byteOffset = offset * vertexBuffer.vertexSize;
        const bufferView = vertexBuffer.buffer.subarray(offset, offset + count);
        
        this._gl.bufferSubData(Gl.ARRAY_BUFFER, byteOffset, bufferView);
    }
}