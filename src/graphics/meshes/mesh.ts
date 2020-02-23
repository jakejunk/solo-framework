import { GraphicsContext } from "../graphicsContext";
import { MeshParams } from "./meshParams";
import { MeshWebGl1 } from "./meshWebGl1";
import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexDefinition } from "./vertexDefinition";

/**
 * A simple, non-instanced mesh made up of vertices and indices.
 */
export interface Mesh
{
    /**
     * Defines the layout of each vertex in this array.
     */
    readonly vertexDefinition: VertexDefinition;

    readonly vertices: Float32Array;

    readonly indices: Uint16Array;

    /**
     * The number of vertices that this buffer can hold.
     */
    getNumVertices(): number;

    /**
     * Gets the current shader program associated with this mesh.
     */
    getShader(): ShaderProgram;

    /**
     * Sets a new shader to be used during rendering.
     */
    setShader(program: ShaderProgram): void;

    /**
     * Flushes index values to the graphics device.
     */
    flushIndices(): void;

    /**
     * Flushes vertex values to the graphics device.
     */
    flushVertices(offset?: number, count?: number): void;

    /**
     * Renders the vertices using the provided shader program.
     */
    render(offset?: number, count?: number): void;
}

export namespace Mesh
{
    export function Create(context: GraphicsContext, params: MeshParams): Mesh
    {
        // TODO: Implement mesh types for WebGL1 + extensions and WebGL2

        return new MeshWebGl1(context.gl, params);
    }
}