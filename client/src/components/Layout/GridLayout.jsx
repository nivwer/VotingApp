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
import Navbar from "../Navigation/Navbar";

// Component.
function GridLayout({ isSimple = true }) {
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
      rows: "100px 1fr",
      columns: "1fr 295px 690px 295px 1fr",
    },
    double: {
      area: `"header header header header" 
              "l-none left main r-none"`,
      rows: "100px 1fr",
      columns: "1fr 295px 690px 1fr",
    },
    simple: {
      area: `"header"
             "main"`,
      rows: "100px 1fr",
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
      <GridItem bg="orange.300" area={"header"}>
        <Navbar />
      </GridItem>

      {/* Right Side */}
      {!isSimple && (
        <GridItem
          display={{ base: "none", lg: "none", xl: "grid" }}
          bg="pink.300"
          area={"right"}
        ></GridItem>
      )}

      {/* Main */}
      <GridItem bg="green.300" area={"main"}>
        <Container p={0} maxW={"700px"}>
          <Outlet />
        </Container>
      </GridItem>

      {/* Left Side */}
      {!isSimple && (
        <GridItem
          display={{ base: "none", lg: "grid", xl: "grid" }}
          bg="blue.300"
          area={"left"}
        >
          <SideBar />
        </GridItem>
      )}
    </Grid>
  );
}

export default GridLayout;
