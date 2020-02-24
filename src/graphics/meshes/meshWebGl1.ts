import { Gl } from "../constants/gl";
import { Mesh } from "./mesh";
import { MeshParams } from "./meshParams";
import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexDefinition } from "./vertexDefinition";

/**
 * @internal
 * Respresents a mesh in WebGL1 without the use of the `OES_vertex_array_object` extension.
 */
export class MeshWebGl1 implements Mesh
{
    private static _BoundIndexBuffer?: WebGLBuffer;
    private static _BoundVertexBuffer?: WebGLBuffer;

    public readonly vertexDefinition: VertexDefinition;
    public readonly vertices: Float32Array;
    public readonly indices: Uint16Array;

    private _gl: WebGLRenderingContext;
    private _numVertices: number;
    private _indexHandle: WebGLBuffer;
    private _vertexHandle: WebGLBuffer;
    private _shaderProgram!: ShaderProgram;

    public constructor(gl: WebGLRenderingContext, params: MeshParams)
    {
        const vertexDefinition = params.vertexDefinition;
        const numVertices = params.numVertices;

        const indexHandle = gl.createBuffer()!;
        gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, indexHandle);
        gl.bufferData(Gl.ELEMENT_ARRAY_BUFFER, params.indices, Gl.STATIC_DRAW);

        const vertexHandle = gl.createBuffer()!;
        gl.bindBuffer(Gl.ARRAY_BUFFER, vertexHandle);
        gl.bufferData(Gl.ARRAY_BUFFER, numVertices * vertexDefinition.getTotalSize(), Gl.STREAM_DRAW);

        this.vertexDefinition = vertexDefinition;
        this.vertices = new Float32Array(numVertices * vertexDefinition.getSizeInFloats());
        this.indices = params.indices;
        this._gl = gl;
        this._numVertices = numVertices;
        this._indexHandle = indexHandle;
        this._vertexHandle = vertexHandle;

        this.setShader(params.shaderProgram);

        MeshWebGl1._BoundIndexBuffer = undefined;
        MeshWebGl1._BoundVertexBuffer = undefined;
    }

    public getNumVertices(): number
    {
        return this._numVertices;
    }

    public getShader(): ShaderProgram
    {
        return this._shaderProgram;
    }

    public setShader(program: ShaderProgram)
    {
        // TODO: Dispose current shader

        this._shaderProgram = program;

        if (!this.vertexDefinition.updateAttributeLocations(program))
        {
            throw new Error("TODO");
        }
    }

    public flushIndices()
    {
        if (this._indexHandle !== MeshWebGl1._BoundIndexBuffer)
        {
            this._bindIndexBuffer();
        }

        this._gl.bufferSubData(Gl.ELEMENT_ARRAY_BUFFER, 0, this.indices);
    }

    private _bindIndexBuffer()
    {
        this._gl.bindBuffer(Gl.ELEMENT_ARRAY_BUFFER, this._indexHandle);

        MeshWebGl1._BoundIndexBuffer = this._indexHandle;
    }

    public flushVertices(offset = 0, count = this.vertices.length)
    {
        if (this._vertexHandle !== MeshWebGl1._BoundVertexBuffer)
        {
            this._bindVertexBuffer();
        }

        const byteOffset = offset * this.vertexDefinition.getTotalSize();
        const bufferView = this.vertices.subarray(offset, offset + count);
        
        this._gl.bufferSubData(Gl.ARRAY_BUFFER, byteOffset, bufferView);
    }

    private _bindVertexBuffer()
    {
        this._shaderProgram.bind();

        const gl = this._gl;
        const attributes = this.vertexDefinition.attributes;
        const numAttributes = attributes.length;
        const stride = this.vertexDefinition.getTotalSize();

        gl.bindBuffer(Gl.ARRAY_BUFFER, this._vertexHandle);

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

        MeshWebGl1._BoundVertexBuffer = this._vertexHandle;
    }

    public render(offset = 0, count = this.indices.length): void
    {
        if (this._indexHandle !== MeshWebGl1._BoundIndexBuffer)
        {
            this._bindIndexBuffer();
        }

        if (this._vertexHandle !== MeshWebGl1._BoundVertexBuffer)
        {
            this._bindVertexBuffer();
        }

        this._gl.drawElements(Gl.TRIANGLES, count, Gl.UNSIGNED_SHORT, offset);
    }
}