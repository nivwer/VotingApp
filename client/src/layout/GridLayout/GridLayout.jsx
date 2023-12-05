import { useEffect, useState } from "react";
import { useThemeInfo } from "../../hooks/Theme";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import Aside from "../Aside/Aside";
import { Outlet } from "react-router-dom";
import { useBreakpointValue, Grid, GridItem, Container, Box } from "@chakra-ui/react";

// Layout.
function GridLayout({ layout = "simple", section = "main" }) {
  const { isDark } = useThemeInfo();
  const [isLayoutReady, setLayoutReady] = useState(false);

  const isSimple = layout === "simple";
  const isDouble = layout === "double";

  // BreakPoints.
  const layoutBreakPoint = useBreakpointValue({
    base: "responsive",
    md: "simple",
    lg: isSimple ? "simple" : "double",
    xl: isSimple ? "simple" : isDouble ? "double" : "triple",
  });

  // Layouts
  const layouts = {
    triple: {
      area: `"header header header header header"
               "l-none left main right r-none"`,
      rows: "80px 1fr",
      columns: "1fr 295px 610px 343px 1fr",
    },
    double: {
      area: `"header header header header" 
              "l-none left main r-none"`,
      rows: "80px 1fr",
      columns: "1fr 295px 610px 1fr",
    },
    simple: {
      area: `"header header header"
             "l-none main r-none"`,
      rows: "80px 1fr",
      columns: "1fr 610px 1fr",
    },
    responsive: {
      area: `"header"
             "main"`,
      rows: "60px 1fr",
      columns: "1fr",
    },
  };

  // Display the layout when ready.
  useEffect(() => setLayoutReady(true), [layoutBreakPoint]);
  if (!isLayoutReady) return null;

  return (
    <Grid
      templateAreas={layouts[layoutBreakPoint].area}
      gridTemplateRows={layouts[layoutBreakPoint].rows}
      gridTemplateColumns={layouts[layoutBreakPoint].columns}
    >
      {/* Header */}
      <GridItem children={<Navbar />} area={"header"} />

      {/* Right Side */}
      {!isSimple && !isDouble && (
        <GridItem area={"right"} display={{ base: "none", lg: "none", xl: "grid" }}>
          <Aside />
        </GridItem>
      )}

      {/* Main */}
      <GridItem area={"main"} mx={{ base: 0, sm: 3, md: 0 }}>
        <Container
          minH={{ base: "calc(100vh - 60px)", md: "calc(100vh - 80px)" }}
          p={0}
          maxW={"608px"}
        >
          <Outlet />
        </Container>
      </GridItem>

      {/* Left Side */}
      {!isSimple && (
        <GridItem area={"left"} display={{ base: "none", lg: "grid", xl: "grid" }}>
          <Sidebar section={section} />
        </GridItem>
      )}

      {/* Background */}
      <Box bg={isDark ? "black" : "white"} pos={"fixed"} w={"100vw"} h={"100vh"} zIndex={-1} />
    </Grid>
  );
}

export default GridLayout;
