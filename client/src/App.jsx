// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useCheckSessionQuery } from "./api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
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
  const session = useSelector((state) => state.session);

  // Check the user session.
  const { data, isLoading } = useCheckSessionQuery();

  useEffect(() => {
    data && dispatch(login(data));
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
        {session["is_loading"] ? <InitialSpinner /> : <Router />}
      </Container>
    </BrowserRouter>
  );
}

export default App;
