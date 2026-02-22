
type ColorOutputType = "tailwind" | "css" | "style";

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

    const tailwindClass =
        tailwindColors[Math.abs(hash) % tailwindColors.length];

    switch (type) {
        case "tailwind":
            return tailwindClass;

        case "style":
            return { backgroundColor: cssColor };

        case "css":
        default:
            return tailwindClass;
    }
};

export { getAppointColorBasedOnUserName };