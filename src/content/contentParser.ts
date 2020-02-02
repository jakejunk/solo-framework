import { Result } from "../util/result";

export interface ContentParser<T>
{
    /**
     * Constructs a new `T` from a fetch response.
     */
    fromFetchResponse(response: Response): Promise<Result<T, Error>>
}