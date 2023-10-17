// Hooks.
import { useEffect, useState } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useCheckSessionQuery } from "./api/authApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { useReadProfileQuery } from "./api/profileApiSlice";
// Actions.
import { login } from "./features/auth/sessionSlice";
// Components..
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import InitialSpinner from "./components/Spinners/InitialSpinner";
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
    isLoading: isCheckSessionLoading,
    isFetching: isCheckSessionFetching,
    isUninitialized: isCheckSessionUninitialized,
    status: statusSession,
  } = useCheckSessionQuery();

  // Get user profile data.
  const { data: dataProfile, isLoading: isReadProfileLoading } =
    useReadProfileQuery(data, {
      skip: data ? false : true,
    });

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

  // Update data to fetchs.
  useEffect(() => {
    if (!isCheckSessionUninitialized && !isCheckSessionLoading) {
      if (dataSession) {
        setData({ headers: { Authorization: `Token ${dataSession.token}` } });
        if (!isLoading && !dataProfile) {
          setIsLoading(true);
        }
      } else {
        if (isLoading) {
          setIsLoading(false);
        }
      }
    }
  }, [dataSession, statusSession]);

  useEffect(() => {
    if (isLoading) {
      if (session.isAuthenticated) {
        setIsLoading(false);
      }
    }
  }, [session]);

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
