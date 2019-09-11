import * as GameParamsGenerator from "../../generators/gameParams.gen";
import { GameCanvas } from "../../../src/core/gameCanvas";
import { expect } from "chai";
import "mocha";
import "../../helpers/loggingHelper";

describe("GameCanvas", () =>
{
    describe("Create()", () =>
    {
        it("creates new canvas element if one doesn't exist", () =>
        {
            const params = GameParamsGenerator.CreatedWithDefaults;
            const existingCanvas = document.getElementById(params.canvasId);
            
            const canvas = GameCanvas.Create(params.canvasId, params.defaultCanvasColor);

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
            const canvas = GameCanvas.Create(params.canvasId, params.defaultCanvasColor);

            expect(existingCanvas.id).to.equal(canvas.id);
        });
    });
});
