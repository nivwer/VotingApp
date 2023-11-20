// Hooks.
import { useThemeInfo } from "../../hooks/Theme";
// Components.
import Navbar from "../Navigation/Navbar/Navbar";
import SideBar from "../Navigation/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import {
  useBreakpointValue,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

// Layout.
function GridLayout({ layout = "simple", section = "main" }) {
  const { isDark } = useThemeInfo();
  const [isLayoutReady, setLayoutReady] = useState(false);

  const isSimple = layout === "simple";
  const isDouble = layout === "double";

  // BreakPoints.
  const layoutBreakPoint = useBreakpointValue({
    base: "simple",
    lg: isSimple ? "simple" : "double",
    xl: isSimple ? "simple" : isDouble ? "double" : "triple",
  });

  // Layouts
  const layouts = {
    triple: {
      area: `"header header header header header"
               "l-none left main right r-none"`,
      rows: "64px 1fr",
      columns: "1fr 295px 664px 295px 1fr",
    },
    double: {
      area: `"header header header header" 
              "l-none left main r-none"`,
      rows: "64px 1fr",
      columns: "1fr 295px 664px 1fr",
    },
    simple: {
      area: `"header header header"
             "l-none main r-none"`,
      rows: "64px 1fr",
      columns: "1fr 664px 1fr",
    },
  };

  // Display the layout when ready.
  useEffect(() => {
    setLayoutReady(true);
  }, [layoutBreakPoint]);

  if (!isLayoutReady) {
    return null;
  }

  return (
    <Grid
      templateAreas={layouts[layoutBreakPoint].area}
      gridTemplateRows={layouts[layoutBreakPoint].rows}
      gridTemplateColumns={layouts[layoutBreakPoint].columns}
    >
      {/* Header */}
      <GridItem zIndex={1000} area={"header"}>
        <Navbar />
      </GridItem>

      {/* Right Side */}
      {!isSimple && !isDouble && (
        <GridItem
          area={"right"}
          display={{ base: "none", lg: "none", xl: "grid" }}
        ></GridItem>
      )}

      {/* Main */}
      <GridItem area={"main"}>
        <Container
          minH={"calc(100vh - 64px)"}
          p={0}
          maxW={"664px"}
          borderX={layout === "simple" ? "0px solid" : "1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        >
          <Outlet />
        </Container>
      </GridItem>

      {/* Left Side */}
      {!isSimple && (
        <GridItem
          area={"left"}
          display={{ base: "none", lg: "grid", xl: "grid" }}
        >
          <SideBar section={section} />
        </GridItem>
      )}
    </Grid>
  );
}

export default GridLayout;
