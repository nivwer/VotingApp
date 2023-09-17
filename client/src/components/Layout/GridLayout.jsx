// Components.
import SideBar from "../Navigation/SideBar/SideBar";
import { Outlet } from "react-router-dom";
import {
  useBreakpointValue,
  Grid,
  GridItem,
  Container,
} from "@chakra-ui/react";
import Navbar from "../Navigation/NavBar/Navbar";
import { useThemeInfo } from "../../hooks/Theme";

// Component.
function GridLayout({ layout = "simple", section = "main" }) {
  const { isDark } = useThemeInfo();

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
      area: `"header"
             "main"`,
      rows: "64px 1fr",
      columns: "1fr",
    },
  };

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
          display={{ base: "none", lg: "none", xl: "grid" }}
          area={"right"}
          borderLeft={isDark ? "1px solid" : "1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        ></GridItem>
      )}

      {/* Main */}
      <GridItem area={"main"}>
        <Container p={0} maxW={"664px"}>
          <Outlet />
        </Container>
      </GridItem>

      {/* Left Side */}
      {!isSimple && (
        <GridItem
          display={{ base: "none", lg: "grid", xl: "grid" }}
          area={"left"}
          borderRight={isDark ? "1px solid" : "1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        >
          <SideBar section={section} />
        </GridItem>
      )}
    </Grid>
  );
}

export default GridLayout;
