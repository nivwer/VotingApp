// Hooks.
import { useEffect, useState } from "react";
// Components.
import SideBar from "../Navigation/SideBar";
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
function GridLayout({ isSimple = true }) {
  const { ThemeColor, isDark } = useThemeInfo();
  // BreakPoints.
  const layoutType = useBreakpointValue({
    base: "simple",
    lg: "double",
    xl: "triple",
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

  // Selected.
  const layout = layouts[layoutType];
  const simple = layouts["simple"];

  return (
    <Grid
      templateAreas={isSimple ? simple.area : layout.area}
      gridTemplateRows={isSimple ? simple.rows : layout.rows}
      gridTemplateColumns={isSimple ? simple.columns : layout.columns}
    >
      {/* Header */}
      <GridItem zIndex={1000} area={"header"}>
        <Navbar />
      </GridItem>

      {/* Right Side */}
      {!isSimple && (
        <GridItem
          display={{ base: "none", lg: "none", xl: "grid" }}
          area={"right"}
          borderLeft={isDark ? "1px solid" : "1px solid"}
          borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"}
        ></GridItem>
      )}

      {/* Main */}
      <GridItem area={"main"}>
        <Container p={0} maxW={"700px"}>
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
          <SideBar />
        </GridItem>
      )}
    </Grid>
  );
}

export default GridLayout;
