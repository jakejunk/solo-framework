import { ShaderProgramParams } from "../../../../../src/graphics/shaders/shaderProgramParams";
import { UniformLocation } from "../../../../../src/graphics/shaders/shaderManager";
import { Writeable } from "../../../_helpers/writeable";

export function ShaderProgramParamsAllDefault(): ShaderProgramParams
{
    return {
        handle: 0,
        attributeMap: new Map(),
        uniformMap: new Map()
    };
}

export function ShaderProgramParamsWithHandle(handle: number): ShaderProgramParams
{
    const params: Writeable<ShaderProgramParams> = ShaderProgramParamsAllDefault();
    params.handle = handle;

    return params;
}

export function ShaderProgramParamsWithAttribute(name: string, value: number): ShaderProgramParams
{
    const map = new Map<string, number>();
    map.set(name, value);

    const params: Writeable<ShaderProgramParams> = ShaderProgramParamsAllDefault();
    params.attributeMap = map;

    return params;
}

export function ShaderProgramParamsWithAttributes(attributesAndLocations: [string, number][]): ShaderProgramParams
{
    const map = new Map<string, number>();

    for (const attr of attributesAndLocations)
    {
        map.set(attr[0], attr[1]);
    }

    const params: Writeable<ShaderProgramParams> = ShaderProgramParamsAllDefault();
    params.attributeMap = map;

    return params;
}

export function ShaderProgramParamsWithUniform(name: string, value: UniformLocation): ShaderProgramParams
{
    const map = new Map<string, UniformLocation>();
    map.set(name, value);

    const params: Writeable<ShaderProgramParams> = ShaderProgramParamsAllDefault();
    params.uniformMap = map;

    return params;
}

export function ShaderProgramParamsWithUniforms(uniformsAndLocations: [string, UniformLocation][]): ShaderProgramParams
{
    const map = new Map<string, UniformLocation>();

    for (const uniform of uniformsAndLocations)
    {
        map.set(uniform[0], uniform[1]);
    }

    const params: Writeable<ShaderProgramParams> = ShaderProgramParamsAllDefault();
    params.uniformMap = map;

    return params;
}