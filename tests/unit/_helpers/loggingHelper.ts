import { SinonStub, stub } from "sinon";

let debugStub: SinonStub<[any?, ...any[]], void>;
let logStub: SinonStub<[any?, ...any[]], void>;
let infoStub: SinonStub<[any?, ...any[]], void>;
let warnStub: SinonStub<[any?, ...any[]], void>;
let errorStub: SinonStub<[any?, ...any[]], void>;

// Disable logging before each test, and re-enable afterwards.
// This allows individual tests to enable logging without needing
// to worry about side-effects.
beforeEach(DisableLogging);
afterEach(EnableLogging);

export function DisableLogging()
{
    debugStub = stub(console, "debug");
    logStub = stub(console, "log");
    infoStub = stub(console, "info");
    warnStub = stub(console, "warn");
    errorStub = stub(console, "error");
}

export function EnableLogging()
{
    debugStub.restore();
    logStub.restore();
    infoStub.restore();
    warnStub.restore();
    errorStub.restore();
}