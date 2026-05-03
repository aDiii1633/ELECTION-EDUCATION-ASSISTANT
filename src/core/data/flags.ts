export const FEATURE_FLAGS = {
  ENABLE_AI_CHAT: true,
  ENABLE_BOOTH_FINDER: true,
  ENABLE_DOC_VALIDATION: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_DARK_MODE: false, // Future feature
};

export type FeatureFlag = keyof typeof FEATURE_FLAGS;
