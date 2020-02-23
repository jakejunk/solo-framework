import { ShaderProgram } from "../shaders/shaderProgram";
import { VertexDefinition } from "./vertexDefinition";

/**
 * Contains the values necessary to construct a new `Mesh`.
 */
export interface MeshParams
{
    /**
     * Defines the layout of a vertex for in this mesh.
     */
    readonly vertexDefinition: VertexDefinition;

    /**
     * The number of vertices needed for this mesh.
     */
    readonly numVertices: number;

    /**
     * The shader program to use for rendering.
     */
    readonly shaderProgram: ShaderProgram;

    /**
     * The values for the created index buffer.
     */
    readonly indices: Uint16Array;
}