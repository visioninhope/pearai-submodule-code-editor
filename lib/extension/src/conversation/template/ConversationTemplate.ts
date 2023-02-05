import zod from "zod";

const sectionsSchema = zod.array(
  zod.discriminatedUnion("type", [
    zod.object({
      type: zod.literal("lines"),
      title: zod.string(),
      lines: zod.array(zod.string()),
    }),
    zod.object({
      type: zod.literal("optional-selected-code"),
      title: zod.string(),
    }),
    zod.object({
      type: zod.literal("conversation"),
      excludeFirstMessage: zod.boolean().optional(),
      roles: zod.object({
        bot: zod.string(),
        user: zod.string(),
      }),
    }),
  ])
);

export type Sections = zod.infer<typeof sectionsSchema>;

const promptSchema = zod.object({
  template: zod.string(),
  maxTokens: zod.number(),
  stop: zod.array(zod.string()).optional(),
  temperature: zod.number().optional(),
});

export type Prompt = zod.infer<typeof promptSchema>;

const responseSchema = zod.object({
  placeholder: zod.string().optional(),
  prompt: promptSchema,
});

const baseTemplateSchema = zod.object({
  id: zod.string(),
  engineVersion: zod.literal(0),
  label: zod.string(),
  description: zod.string(),
  icon: zod.object({
    type: zod.literal("codicon"),
    value: zod.string(),
  }),
  isEnabled: zod.boolean().optional(), // default: true
  initVariableRequirements: zod
    .array(
      zod.object({
        type: zod.literal("non-empty-text"),
        variable: zod.string(),
      })
    )
    .optional(),
});

export const conversationTemplateSchema = zod.discriminatedUnion("type", [
  baseTemplateSchema.extend({
    type: zod.literal("basic-chat"),
    chat: responseSchema,
  }),
  baseTemplateSchema.extend({
    type: zod.literal("selected-code-analysis-chat"),
    chatTitle: zod.string(),
    analysis: responseSchema,
    chat: responseSchema,
  }),
]);

export type ConversationTemplate = zod.infer<typeof conversationTemplateSchema>;
