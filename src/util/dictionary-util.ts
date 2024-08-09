/**
 * Extracts all placeholders from a text string.
 * @example ExtractPlaceholders<'Hello {name}, welcome to {city}!'> // 'name' | 'city'
 */
type ExtractPlaceholders<T extends string> = T extends `${infer _Start}{${infer Key}}${infer Rest}`
  ? Key | ExtractPlaceholders<Rest>
  : never

/**
 * Formats a text string by replacing placeholders with corresponding values from a dictionary.
 * Placeholders are defined by curly braces, e.g. {key}.
 *
 * @param text - The text containing placeholders in the format {key}.
 * @param values - An optional dictionary of key-value pairs to replace placeholders.
 * @returns The formatted text with placeholders replaced by corresponding values.
 * @example formatString('Hello {name}, welcome to {city}!', { name: 'Alice', city: 'Wonderland' })
 */
export function formatString<T extends string>(
  template: T,
  values?: Record<ExtractPlaceholders<T> & string, string>
): string {
  if (!values) return template

  return template.replace(/{(\w+)}/g, (match, key) => {
    // Assert key to be of type ExtractPlaceholders<T>
    return key in values ? values[key as ExtractPlaceholders<T>] : match
  })
}
