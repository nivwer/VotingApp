// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useDispatch, useSelector } from "react-redux";
import { useUserSessionCheckQuery } from "./api/authApiSlice";
import { useProfileMeQuery } from "./api/profileApiSlice";
// Actions.
import { login } from "./features/auth/sessionSlice";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import InitialSpinner from "./components/Spinners/InitialSpinner/InitialSpinner";
import { Container } from "@chakra-ui/react";

// App.
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { isDark } = useThemeInfo();
  const session = useSelector((state) => state.session);
  const [data, setData] = useState(false);

  // Check the user session.
  const {
    data: dataSession,
    status: statusSession,
    isLoading: isCheckSessionLoading,
    isUninitialized: isCheckSessionUninitialized,
  } = useUserSessionCheckQuery();

  // Get user profile data.
  const { data: dataProfile } = useProfileMeQuery(data, {
    skip: data ? false : true,
  });

  // Login.
  useEffect(() => {
    if (dataSession && dataProfile) {
      dispatch(
        login({
          isAuthenticated: true,
          token: dataSession.token,
          user: dataSession.user,
          profile: dataProfile.profile,
        })
      );
    }
  }, [dataSession, dataProfile]);

  useEffect(() => {
    if (!isCheckSessionUninitialized && !isCheckSessionLoading) {
      if (dataSession) {
        setData({ headers: { Authorization: `Token ${dataSession.token}` } });
        !isLoading && !dataProfile && setIsLoading(true);
      } else {
        isLoading && setIsLoading(false);
      }
    }
  }, [dataSession, statusSession]);

  // If is Authenticated.
  useEffect(() => {
    isLoading && session.isAuthenticated && setIsLoading(false);
  }, [session]);

  return (
    <BrowserRouter>
      <Container
        p={"0"}
        maxW="100vw"
        minH="100vh"
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
      >
        {isLoading ? <InitialSpinner /> : <Router />}
      </Container>
    </BrowserRouter>
  );
}

export default App;
