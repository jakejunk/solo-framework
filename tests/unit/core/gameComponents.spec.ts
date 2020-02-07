import { CreatedWithDefaults } from "../_generators/core/gameParams.gen";
import { expect } from "chai";
import { GameComponents } from "../../../src/core/gameComponents";
import { stub } from "sinon";
import "mocha";

describe("GameComponents", () =>
{
    describe("Create()", () =>
    {
        it("throws if a graphics context can't be created", () =>
        {
            stub(HTMLCanvasElement.prototype, "getContext").returns(null);

            expect(_ => GameComponents.Create(CreatedWithDefaults)).to.throw();
        });

        it("throws if a content loader can't be created", () =>
        {
            window.fetch = undefined;

            expect(_ => GameComponents.Create(CreatedWithDefaults)).to.throw();
        });
    });
});