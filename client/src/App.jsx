// Hooks.
import { useSelector } from "react-redux";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import {  useColorMode, Container } from "@chakra-ui/react";

// App.
function App() {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <BrowserRouter>
      <Container
        p={"0"}
        maxW="100vw"
        minH="100vh"
        bg={isDark ? "black" : "white"}
        color={isDark ? `${color}.100` : `${color}.900`}
      >
        <Router />
      </Container>
    </BrowserRouter>
  );
}

export default App;
