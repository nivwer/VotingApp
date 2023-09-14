// Hooks.
import { useEffect } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useCheckSessionQuery } from "./api/authApiSlice";
import { useDispatch } from "react-redux";
// Actions.
import { login } from "./features/auth/sessionSlice";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import InitialSpinner from "./components/Spinners/InitialSpinner";
import { Container } from "@chakra-ui/react";

// App.
function App() {
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();

  // Check the user session.
  const { data, isLoading } = useCheckSessionQuery();

  useEffect(() => {
    if (data) {
      dispatch(login(data));
    }
  }, [data]);

  return (
    <BrowserRouter>
      <Container
        p={"0"}
        maxW="100vw"
        minH="100vh"
        bg={isDark ? "black" : "white"}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      >
        {isLoading ? <InitialSpinner /> : <Router />}
      </Container>
    </BrowserRouter>
  );
}

export default App;
