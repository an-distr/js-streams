/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * dist/JsonDeserializer/JsonDeserializerNative/sanitize_json
 * @param value `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function sanitize_json(value: string): string;
/**
 * dist/JsonDeserializer/JsonDeserializerNative/sanitize_jsonl
 * @param value `~lib/string/String`
 * @returns `~lib/string/String`
 */
export declare function sanitize_jsonl(value: string): string;
/**
 * dist/JsonDeserializer/JsonDeserializerNative/indexOfLastSeparator_json
 * @param value `~lib/typedarray/Uint8Array`
 * @returns `i32`
 */
export declare function indexOfLastSeparator_json(value: Uint8Array): number;
