import { TextureBindingCache } from "../../../../src/graphics/util/textureBindingCache";
import { TextureNoHandle } from "../../_generators/graphics/texture2d.gen";
import { Texture2D } from "../../../../src/graphics/texture2d";
import { expect } from "chai";
import "mocha";

describe("TextureBindingCache", () =>
{
    describe("constructor()", () =>
    {
        it("throws if number of binding locations is < 1", () =>
        {
            expect(() => new TextureBindingCache(0)).to.throw;
        });
    });

    describe("getNumBindLocations()", () =>
    {
        it("returns value the cache was constructed with", () =>
        {
            const count = 32;
            const cache = new TextureBindingCache(count);

            expect(cache.getNumBindLocations()).to.equal(32);
        });
    });

    describe("getBindLocation()", () =>
    {
        it("roundtrips with bindAtLocation()", () =>
        {
            const count = 2;
            const cache = new TextureBindingCache(count);
            const texture = TextureNoHandle;
            const location = 0;

            cache.bindAtLocation(texture, location);

            expect(cache.getBindLocation(texture)).to.equal(location);
        });

        it("returns undefined for any unbound texture", () =>
        {
            const count = 2;
            const cache = new TextureBindingCache(count);
            const texture = TextureNoHandle;

            expect(cache.getBindLocation(texture)).to.be.undefined;
        });
    });

    describe("bindAnywhere()", () =>
    {
        it("works for a cache with only 1 bind location", () =>
        {
            const count = 1;
            const cache = new TextureBindingCache(count);
            const texture = TextureNoHandle;

            cache.bindAnywhere(texture);

            expect(cache.getBindLocation(texture)).to.equal(0);
        });
    });

    describe("bindAtLocation()", () =>
    {
        it("throws if the provided location is negative", () =>
        {
            const cache = new TextureBindingCache(69);

            expect(() => cache.bindAtLocation(TextureNoHandle, -1)).to.throw;
        });

        it("throws if the provided location exceeds cache size", () =>
        {
            const count = 1;
            const cache = new TextureBindingCache(count);

            expect(() => cache.bindAtLocation(TextureNoHandle, count)).to.throw;
        });

        it("returns true if texture is already bound to the provided location", () =>
        {
            const cache = new TextureBindingCache(32);
            const texture = TextureNoHandle;
            const location = 8;

            cache.bindAtLocation(texture, location);

            expect(cache.bindAtLocation(texture, location)).to.be.true;
        });

        it("returns false if texture is not already bound to the provided location", () =>
        {
            const cache = new TextureBindingCache(32);
            const texture = TextureNoHandle;
            const location = 8;

            expect(cache.bindAtLocation(texture, location)).to.be.false;
        });
    });

    describe("markDirty()", () =>
    {
        it("throws if the provided location is negative", () =>
        {
            const cache = new TextureBindingCache(69);

            expect(() => cache.markDirty(-1)).to.throw;
        });

        it("throws if the provided location exceeds cache size", () =>
        {
            const count = 1;
            const cache = new TextureBindingCache(count);

            expect(() => cache.markDirty(count)).to.throw;
        });

        it("marks a previously bound texture as unbound", () =>
        {
            const cache = new TextureBindingCache(32);
            const texture = TextureNoHandle;
            const location = 8;

            cache.bindAtLocation(texture, location);

            expect(cache.getBindLocation(texture)).to.equal(location);

            cache.markDirty(location);

            expect(cache.getBindLocation(texture)).to.be.undefined;
        });
    });

    describe("markAllDirty()", () =>
    {
        // Pretty hacky test...
        it("removes all textures from the cache", () =>
        {
            const size = 5;
            const cache = new TextureBindingCache(size);
            const textures: Texture2D[] = [];

            for (let i = 0; i < size; i += 1)
            {
                const newTexture = JSON.parse(JSON.stringify(TextureNoHandle)) as Texture2D;

                textures[i] = newTexture;
                cache.bindAtLocation(newTexture, i);
            }

            cache.markAllDirty();

            for (let i = 0; i < size; i += 1)
            {
                const texture = textures[i];

                expect(cache.getBindLocation(texture)).to.be.undefined;
            }
        });
    });
});