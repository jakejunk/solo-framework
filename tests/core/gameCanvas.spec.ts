import * as GameParamsGenerator from "../generators/gameParams.gen";
import { GameCanvas } from "../../src/core/gameCanvas";
import { expect } from "chai";
import { stub } from "sinon";
import "mocha";

describe("GameCanvas", () =>
{
    describe("Create()", () =>
    {
        // Disable logging before tests
        before(() => {
            stub(console, "debug");
            stub(console, "log");
            stub(console, "info");
            stub(console, "warn");
            stub(console, "error");
        })

        it("creates new canvas element if one doesn't exist", () =>
        {
            const params = GameParamsGenerator.CreatedWithDefaults;
            const existingCanvas = document.getElementById(params.canvasId);
            
            const canvas = GameCanvas.Create(params);

            expect(existingCanvas).to.equal(null);
            expect(canvas).to.not.equal(null);
        });

        it("uses existing canvas element if one exists", () =>
        {
            const id = "test-canvas" + ((Math.random() * 1000) | 0);
            const existingCanvas = document.createElement("canvas");
            existingCanvas.id = id;

            document.body.appendChild(existingCanvas);

            const params = GameParamsGenerator.CreateWithId(id);
            const canvas = GameCanvas.Create(params);

            expect(existingCanvas.id).to.equal(canvas.id);
        });
    });
});
