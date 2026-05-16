
type ColorUser = {
  color?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};

type ColorOutputType = "tailwind" | "css" | "style" | "border" | "raw";

const getAppointColorBasedOnUserName = (
  user: ColorUser | null | undefined,
  type: ColorOutputType = "raw"
): string | { backgroundColor: string } | { borderColor: string } => {
  if (user?.color) {
    switch (type) {
      case "style": return { backgroundColor: user.color };
      case "border": return { borderColor: user.color };
      default: return user.color;
    }
  }

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.toLowerCase();

  let hash = 0;
  for (let i = 0; i < fullName.length; i++) {
    hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
  }

  const tailwindColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-[#22AF6A]",
    "bg-[#FDB602]",
    "bg-[#FDB602]",
  ];

  const rawColors = [
    "#ef4444",
    "#3b82f6",
    "#22AF6A",
    "#FDB602",
    "#FDB602",
  ];

  const paletteIndex = Math.abs(hash) % rawColors.length;

  switch (type) {
    case "tailwind":
    case "css": return tailwindColors[paletteIndex];
    case "style": return { backgroundColor: rawColors[paletteIndex] };
    case "border": return { borderColor: rawColors[paletteIndex] };
    default: return rawColors[paletteIndex];
  }
};

export type { ColorUser };
export { getAppointColorBasedOnUserName };
