const AVATAR_COLORS = [
  "#1565c0",
  "#c62828",
  "#6a1b9a",
  "#00695c",
  "#bf360c",
  "#33691e",
  "#0D1B3E",
  "#4527a0",
  "#00897b",
];

export const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const getInitials = (name: string): string =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
