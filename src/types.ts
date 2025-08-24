import { z } from 'zod';

export const TriggerSchema = z.object({
  triggertype: z.string(),
  duration: z.coerce.number().optional().default(0),
  triggertext: z.string(),
});
export type Trigger = z.infer<typeof TriggerSchema>;

export const CooldownEntrySchema = z.object({
  name: z.string(),
  defaultcooldown: z.coerce.number().optional().default(0),
  cooldownbartype: z.string(),
  hue: z.coerce.number().optional().default(0),
  hidewheninactive: z.coerce.boolean().optional().default(false),
  trigger: z
    .union([TriggerSchema, z.array(TriggerSchema)])
    .optional()
    .transform((val) => (val ? (Array.isArray(val) ? val : [val]) : [])),
});
export type CooldownEntry = z.infer<typeof CooldownEntrySchema>;

export const CooldownsSchema = z.object({
  cooldowns: z.object({
    cooldownentry: z
      .union([CooldownEntrySchema, z.array(CooldownEntrySchema)])
      .transform((val) => (Array.isArray(val) ? val : [val])),
  }),
});
export type Cooldowns = z.infer<typeof CooldownsSchema>;
