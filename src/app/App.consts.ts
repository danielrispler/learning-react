export const USER_TYPES = {
  none: 0,
  client: 1,
  admin: 2
} as const;

export type UserType = typeof USER_TYPES[keyof typeof USER_TYPES];

export const Url = {
  server_base_path: "http://localhost:8080"
} as const;