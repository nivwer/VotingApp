// Hooks.
import { useSelector } from "react-redux";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import { useColorMode, Container } from "@chakra-ui/react";
import { useThemeInfo } from "./hooks/Theme";

// App.
function App() {
  const { isDark } = useThemeInfo();
  return (
    <BrowserRouter>
      <Container
        p={"0"}
        maxW="100vw"
        minH="100vh"
        bg={isDark ? "black" : "white"}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      >
        <Router />
      </Container>
    </BrowserRouter>
  );
}

export default App;
