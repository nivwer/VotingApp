// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useCheckSessionQuery } from "./api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
// Actions.
import { login, updateProfileAction } from "./features/auth/sessionSlice";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import InitialSpinner from "./components/Spinners/InitialSpinner";
import { Container } from "@chakra-ui/react";
import { useReadProfileQuery } from "./api/profileApiSlice";

// App.
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);
  const [data, setData] = useState(false);

  // Check the user session.
  const { data: dataSession } = useCheckSessionQuery();
  // Get user data.
  const { data: dataProfile } = useReadProfileQuery(data, {
    skip: data ? false : true,
  });

  useEffect(() => {
    dataSession && dispatch(login(dataSession));
  }, [dataSession]);

  useEffect(() => {
    dataProfile && dispatch(updateProfileAction(dataProfile));
  }, [dataProfile]);

  // Update data to fetchs.
  useEffect(() => {
    session.token &&
      setData({ headers: { Authorization: `Token ${session.token}` } });
  }, [session.token]);

  useEffect(() => {
    dataProfile && dataSession && setIsLoading(false);
  }, [dataProfile, dataSession]);

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
