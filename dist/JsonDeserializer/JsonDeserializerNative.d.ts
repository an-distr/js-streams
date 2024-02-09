/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * dist/JsonDeserializer/JsonDeserializerNative/sanitize
 * @param value `~lib/string/String`
 * @param lineSeparated `bool`
 * @returns `~lib/string/String`
 */
export declare function sanitize(value: string, lineSeparated: boolean): string;
/**
 * dist/JsonDeserializer/JsonDeserializerNative/indexOfLastSeparator
 * @param value `~lib/string/String`
 * @param lineSeparated `bool`
 * @returns `i32`
 */
export declare function indexOfLastSeparator(value: string, lineSeparated: boolean): number;
