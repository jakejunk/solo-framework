import { expect } from "chai";
import { IndexBuffer } from "../../../../src/graphics/vertices/indexBuffer";
import { IndexBufferParamsWithHandle, IndexBufferParamsWithIndices } from "../../_generators/graphics/vertices/indexBufferParams.gen";

describe("IndexBuffer", () =>
{
    describe("indices", () =>
    {
        it("returns correct value after construction", () =>
        {
            const indices = new Uint16Array([8, 6, 7, 5, 3, 0, 9]);
            const indexBuffer = new IndexBuffer(undefined, IndexBufferParamsWithIndices(indices));

            expect(indexBuffer.indices).to.equal(indices);
        });
    });

    describe("getHandle()", () =>
    {
        it("returns correct value after construction", () =>
        {
            const handle = 12;
            const indexBuffer = new IndexBuffer(undefined, IndexBufferParamsWithHandle(handle));

            expect(indexBuffer.getHandle()).to.equal(handle);
        });
    });
});