// Small pure helpers shared across the app.

export const formatCurrency = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);

export const getGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const formatDate = (
  iso: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  }
): string => new Intl.DateTimeFormat("en-US", options).format(new Date(iso));

export const formatCountdown = (totalSeconds: number): string => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const maskCardNumber = (last4: string): string =>
  `•••• •••• •••• ${last4}`;

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

export const classNames = (
  ...classes: Array<string | false | null | undefined>
): string => classes.filter(Boolean).join(" ");
