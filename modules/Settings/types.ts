// Domain types owned by the Settings module.

export interface UserSettings {
  twoFactorEnabled: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  currency: string;
  language: string;
}
