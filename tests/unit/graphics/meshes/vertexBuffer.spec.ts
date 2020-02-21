import { AttributeType } from "../../../../src/graphics/constants/attributeType";
import { expect } from "chai";
import { ShaderProgram } from "../../../../src/graphics/shaders/shaderProgram";
import { ShaderProgramParamsWithAttributes } from "../../_generators/graphics/shaders/shaderProgramParams.gen";
import { VertexAttribute } from "../../../../src/graphics/meshes/vertexAttribute";
import { VertexBuffer } from "../../../../src/graphics/meshes/vertexBuffer";
import { VertexBufferParamsWithAttributes, VertexBufferParamsWithHandle, VertexBufferParamsWithVerts } from "../../_generators/graphics/meshes/vertexBufferParams.gen";

describe("VertexBuffer", () =>
{
    it("is correct length based on vertex size and number of vertices", () =>
    {
        const numVerts = 5;
        const vertexSize = 7;
        const expectedBufferSize = Math.ceil(numVerts * vertexSize / Float32Array.BYTES_PER_ELEMENT);
        const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithVerts(numVerts, vertexSize));

        expect(vertexBuffer.length).to.equal(expectedBufferSize);
    });

    describe("attributes", () =>
    {
        it("returns correct value after construction", () =>
        {
            const attributes = [
                new VertexAttribute("1", 1, AttributeType.BYTE, true),
                new VertexAttribute("2", 2, AttributeType.FLOAT, false)
            ];
            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithAttributes(attributes));

            expect(vertexBuffer.attributes).to.equal(attributes);
        });
    });

    describe("numVerts", () =>
    {
        it("returns correct value after construction", () =>
        {
            const numVerts = 17;
            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithVerts(numVerts, 1));

            expect(vertexBuffer.numVerts).to.equal(numVerts);
        });
    });

    describe("vertexSize", () =>
    {
        it("returns correct value after construction", () =>
        {
            const vertexSize = 7;
            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithVerts(1, vertexSize));

            expect(vertexBuffer.vertexSize).to.equal(vertexSize);
        });
    });

    describe("getHandle()", () =>
    {
        it("returns correct value after construction", () =>
        {
            const handle = 345;
            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithHandle(handle));

            expect(vertexBuffer.getHandle()).to.equal(handle);
        });
    });

    describe("updateAttributeLocations()", () =>
    {
        it("returns true if all attributes are found", () =>
        {
            const programAttributes: [string, number][] = [
                ["attr1", 1],
                ["attr2", 2]
            ];

            const program = new ShaderProgram(undefined, ShaderProgramParamsWithAttributes(programAttributes));

            const attributes: VertexAttribute[] = [];
            for (const attr of programAttributes)
            {
                attributes.push(new VertexAttribute(attr[0], 1, AttributeType.BYTE, true));
            }

            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithAttributes(attributes));

            expect(vertexBuffer.updateAttributeLocations(program)).to.be.true;
        });

        it("returns false if an attribute is not found in the shader program", () =>
        {
            const programAttributes: [string, number][] = [
                ["attr1", 1],
                ["attr2", 2]
            ];

            const program = new ShaderProgram(undefined, ShaderProgramParamsWithAttributes(programAttributes));

            const attributes: VertexAttribute[] = [];
            for (const attr of programAttributes)
            {
                attributes.push(new VertexAttribute(attr[0], 1, AttributeType.BYTE, true));
            }

            attributes.push(new VertexAttribute("extra attribute", 1, AttributeType.BYTE, true));

            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithAttributes(attributes));

            expect(vertexBuffer.updateAttributeLocations(program)).to.be.false;
        });

        it("returns false if an attribute is not found in the buffer", () =>
        {
            const programAttributes: [string, number][] = [
                ["attr1", 1],
                ["attr2", 2],
                ["attr3", 3]
            ];

            const program = new ShaderProgram(undefined, ShaderProgramParamsWithAttributes(programAttributes));

            const attributes: VertexAttribute[] = [];
            for (const attr of programAttributes)
            {
                attributes.push(new VertexAttribute(attr[0], 1, AttributeType.BYTE, true));
            }

            attributes.pop();

            const vertexBuffer = new VertexBuffer(undefined, VertexBufferParamsWithAttributes(attributes));

            expect(vertexBuffer.updateAttributeLocations(program)).to.be.false;
        });
    });
});