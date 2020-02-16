import { expect } from "chai";
import { TextureMagFilter } from "../../../../src/graphics/constants/textureMagFilter";
import { TextureMinFilter } from "../../../../src/graphics/constants/textureMinFilter";
import { TextureNoHandle } from "../../_generators/graphics/textures/texture2d.gen";
import { TextureWrap } from "../../../../src/graphics/constants/textureWrap";

describe("ShaderProgram", () =>
{
    describe("setFilter()", () =>
    {
        it("roundtrips with getMinFilter()", () =>
        {
            const texture = TextureNoHandle;
            const filter = TextureMinFilter.LINEAR;

            texture.setFilter(filter, TextureMagFilter.NEAREST)

            expect(texture.getMinFilter()).to.equal(filter);
        });

        it("roundtrips with getMagFilter()", () =>
        {
            const texture = TextureNoHandle;
            const filter = TextureMagFilter.NEAREST;

            texture.setFilter(TextureMinFilter.LINEAR, filter)

            expect(texture.getMagFilter()).to.equal(filter);
        });
    });

    describe("setWrap()", () =>
    {
        it("roundtrips with getWrapS()", () =>
        {
            const texture = TextureNoHandle;
            const wrapS = TextureWrap.CLAMP_TO_EDGE;

            texture.setWrap(wrapS, TextureWrap.MIRRORED_REPEAT);

            expect(texture.getWrapS()).to.equal(wrapS);
        });

        it("roundtrips with getWrapT()", () =>
        {
            const texture = TextureNoHandle;
            const wrapT = TextureWrap.MIRRORED_REPEAT;

            texture.setWrap(TextureWrap.CLAMP_TO_EDGE, wrapT);

            expect(texture.getWrapT()).to.equal(wrapT);
        });
    });
});