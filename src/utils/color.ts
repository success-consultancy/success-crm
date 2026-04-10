
type ColorOutputType = "tailwind" | "css" | "style" | "border" | "raw";

const getAppointColorBasedOnUserName = (
    firstName: string,
    lastName: string,
    type: ColorOutputType = "css"
) => {
    const fullName = `${firstName} ${lastName}`.toLowerCase();

    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
        hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    const cssColor = `hsl(${hue}, 65%, 55%)`;

    // Tailwind-safe fixed palette
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

    const paletteIndex = Math.abs(hash) % tailwindColors.length;
    const tailwindClass = tailwindColors[paletteIndex];
    const rawColor = rawColors[paletteIndex];

    switch (type) {
        case "tailwind":
            return tailwindClass;

        case "style":
            return { backgroundColor: rawColor };

        case "border":
            return { borderColor: rawColor };

        case "raw":
            return rawColor;

        case "css":
        default:
            return tailwindClass;
    }
};

export { getAppointColorBasedOnUserName };