import { XMLBuilder, XMLParser } from "fast-xml-parser";
import { Cooldowns, CooldownsSchema } from "./types";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
});

const builder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  format: true,
});

export function parseCooldowns(xml: string): Cooldowns {
  const parsed = parser.parse(xml);
  return CooldownsSchema.parse(parsed);
}

export function buildCooldowns(data: Cooldowns): string {
  return builder.build(data);
}
