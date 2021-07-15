const { useTheme, useMediaQuery } = require("@material-ui/core");

const ScreenSize = () => {
    const theme = useTheme();

    const extraSmallScreen = useMediaQuery(theme.breakpoints.down("xs"));
    const smallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const mediumScreen = useMediaQuery(theme.breakpoints.down("md"));
    const largeScreen = useMediaQuery(theme.breakpoints.down("lg"));

    return { extraSmallScreen, smallScreen, mediumScreen, largeScreen };;
};

export default ScreenSize;