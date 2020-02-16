import { expect } from "chai";
import { Texture2D } from "../../../../src/graphics/textures/texture2d";
import { TextureMagFilter } from "../../../../src/graphics/constants/textureMagFilter";
import { TextureMinFilter } from "../../../../src/graphics/constants/textureMinFilter";
import { TextureNoHandle } from "../../_generators/graphics/textures/texture2d.gen";
import {
    TextureParamsWithHeight,
    TextureParamsWithMagFilter,
    TextureParamsWithMinFilter,
    TextureParamsWithUri,
    TextureParamsWithWidth,
    TextureParamsWithWrapS,
    TextureParamsWithWrapT
    } from "../../_generators/graphics/textures/textureParams.gen";
import { TextureWrap } from "../../../../src/graphics/constants/textureWrap";

describe("Texture2D", () =>
{
    describe("getUri()", () =>
    {
        it("returns correct value", () =>
        {
            const uri = "/home/";
            const texture = new Texture2D(undefined, TextureParamsWithUri(uri));

            expect(texture.getUri()).to.equal(uri);
        });
    });

    describe("getWidth()", () =>
    {
        it("returns correct value", () =>
        {
            const width = 200;
            const texture = new Texture2D(undefined, TextureParamsWithWidth(width));

            expect(texture.getWidth()).to.equal(width);
        });
    });

    describe("getHeight()", () =>
    {
        it("returns correct value", () =>
        {
            const height = 400;
            const texture = new Texture2D(undefined, TextureParamsWithHeight(height));

            expect(texture.getHeight()).to.equal(height);
        });
    });

    describe("getMinFilter()", () =>
    {
        it("returns correct value", () =>
        {
            const minFilter = TextureMinFilter.LINEAR_MIPMAP_NEAREST;
            const texture = new Texture2D(undefined, TextureParamsWithMinFilter(minFilter));

            expect(texture.getMinFilter()).to.equal(minFilter);
        });
    });

    describe("getMagFilter()", () =>
    {
        it("returns correct value", () =>
        {
            const magFilter = TextureMagFilter.NEAREST;
            const texture = new Texture2D(undefined, TextureParamsWithMagFilter(magFilter));

            expect(texture.getMagFilter()).to.equal(magFilter);
        });
    });

    describe("getWrapS()", () =>
    {
        it("returns correct value", () =>
        {
            const wrapS = TextureWrap.REPEAT;
            const texture = new Texture2D(undefined, TextureParamsWithWrapS(wrapS));

            expect(texture.getWrapS()).to.equal(wrapS);
        });
    });

    describe("getWrapT()", () =>
    {
        it("returns correct value", () =>
        {
            const wrapT = TextureWrap.REPEAT;
            const texture = new Texture2D(undefined, TextureParamsWithWrapT(wrapT));

            expect(texture.getWrapT()).to.equal(wrapT);
        });
    });

    describe("setFilter()", () =>
    {
        it("roundtrips with getMinFilter()", () =>
        {
            const texture = TextureNoHandle;
            const filter = TextureMinFilter.LINEAR;

            texture.setFilter(filter, TextureMagFilter.NEAREST);

            expect(texture.getMinFilter()).to.equal(filter);
        });

        it("roundtrips with getMagFilter()", () =>
        {
            const texture = TextureNoHandle;
            const filter = TextureMagFilter.NEAREST;

            texture.setFilter(TextureMinFilter.LINEAR, filter);

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