import { ContentLoader } from "../../../src/content/contentLoader";
import { ContentParser } from "../../../src/content/contentParser";
import { DummyTextureManager } from "../_generators/graphics/textures/textureManager.gen";
import { Err } from "../../../src/util/result";
import { expect } from "chai";
import "mocha";

const throwingFetch: () => Promise<Response> = () => {
    throw new Error();
}

const fetchNothing: () => Promise<Response> = () => {
    return new Promise(resolve => {
        resolve(new Response(""));
    });
}

const badParser: ContentParser<string> = {
    fromFetchResponse: () => {
        return new Promise(resolve => {
            resolve(new Err(new Error()))
        });
    }
}

describe("ContentLoader", () =>
{
    describe("constructor()", () =>
    {
        it("appends trailing '/' to root directory", () =>
        {
            const root = "test";
            const expected = "test/";

            const loader = new ContentLoader(window.fetch, new DummyTextureManager(), root);

            expect(loader.getRootDirectory()).to.equal(expected);
        });
    });

    describe("setRootDirectory()", () =>
    {
        it("appends trailing '/' to root directory", () =>
        {
            const root = "test";
            const expected = "test/";

            const loader = new ContentLoader(window.fetch, new DummyTextureManager(), "");
            loader.setRootDirectory(root);

            expect(loader.getRootDirectory()).to.equal(expected);
        });

        it("roundtrips with getRootDirectory() if path with a trailing '/' is provided", () =>
        {
            const root = "test/";

            const loader = new ContentLoader(window.fetch, new DummyTextureManager(), "");
            loader.setRootDirectory(root);

            expect(loader.getRootDirectory()).to.equal(root);
        });
    });

    describe("tryLoad()", () =>
    {
        it("returns an error if fetch throws", async () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");

            const loadResult = await loader.tryLoad(undefined, "");

            expect(loadResult.isErr()).to.be.true;
        });

        it("returns an error if parser encounters error", async () =>
        {
            const loader = new ContentLoader(fetchNothing, new DummyTextureManager(), "");

            const loadResult = await loader.tryLoad(badParser, "");

            expect(loadResult.isErr()).to.be.true;
        });
    });

    describe("load()", () =>
    {
        it("throws if fetch throws", () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");

            expect(async _ => await loader.load(undefined, "")).to.throw;
        });
        
        it("throws if parser encounters error", () =>
        {
            const loader = new ContentLoader(fetchNothing, new DummyTextureManager(), "");

            expect(async _ => await loader.load(badParser, "")).to.throw;
        });
    });

    describe("tryLoadText()", () =>
    {
        it("return an error if fetch throws", async () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");
            
            const textureLoadResult = await loader.tryLoadText("");

            expect(textureLoadResult.isErr()).to.be.true;
        });
    });

    describe("loadText()", () =>
    {
        it("throws if fetch throws", () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");

            expect(async _ => await loader.loadText("")).to.throw;
        });
    });

    describe("tryLoadTexture2D()", () =>
    {
        it("return an error if fetch throws", async () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");
            
            const textureLoadResult = await loader.tryLoadTexture2D("");

            expect(textureLoadResult.isErr()).to.be.true;
        });
    });

    describe("loadTexture2D()", () =>
    {
        it("throws if fetch throws", () =>
        {
            const loader = new ContentLoader(throwingFetch, new DummyTextureManager(), "");

            expect(async _ => await loader.tryLoadTexture2D("")).to.throw;
        });
    });
});