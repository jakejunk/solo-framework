import { AttributeType } from "../../../../src/graphics/constants/attributeType";
import { expect } from "chai";
import { VertexAttribute } from "../../../../src/graphics/meshes/vertexAttribute";

describe("VertexAttribute", () =>
{
    describe("name", () =>
    {
        it("returns correct value after construction", () =>
        {
            const name = "test";
            const attribute = new VertexAttribute(name, 0, AttributeType.BYTE, true);

            expect(attribute.name).to.equal(name);
        });
    });

    describe("numComponents", () =>
    {
        it("returns correct value after construction", () =>
        {
            const numComponents = 32;
            const attribute = new VertexAttribute("Who cares", numComponents, AttributeType.BYTE, true);

            expect(attribute.numComponents).to.equal(numComponents);
        });
    });

    describe("type", () =>
    {
        it("returns correct value after construction", () =>
        {
            const type = AttributeType.UNSIGNED_SHORT;
            const attribute = new VertexAttribute("Who cares 2", 4, type, true);

            expect(attribute.type).to.equal(type);
        });
    });

    describe("normalized", () =>
    {
        it("returns correct value after construction", () =>
        {
            const normalized = false;
            const attribute = new VertexAttribute("Who cares 3", 4, AttributeType.BYTE, normalized);

            expect(attribute.normalized).to.equal(normalized);
        });
    });

    describe("totalSize", () =>
    {
        const getSize = (type: AttributeType) => {
            switch (type)
            {
                case AttributeType.FLOAT:
                    return 4;
                case AttributeType.SHORT:
                case AttributeType.UNSIGNED_SHORT:
                    return 2;
                case AttributeType.BYTE:
                case AttributeType.UNSIGNED_BYTE:
                default:
                    return 1;
            }
        }

        it("is calculated correctly based on type and number of components", () =>
        {
            const numComponents = 4;
            const type = AttributeType.BYTE;
            const expectedSize = numComponents * getSize(type);

            const attribute = new VertexAttribute("Eh", numComponents, type, false);

            expect(attribute.totalSize).to.equal(expectedSize);
        });
    });
});