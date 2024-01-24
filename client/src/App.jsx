import { useEffect, useState } from "react";
import { useThemeInfo } from "./hooks/Theme";
import { useDispatch, useSelector } from "react-redux";
import { useUserQuery, useUserProfileQuery, useCheckSessionQuery } from "./api/accountsAPISlice";
import { login } from "./features/auth/sessionSlice";
import Router from "./routes/Router";
import { BrowserRouter } from "react-router-dom";
import InitialSpinner from "./components/Spinners/InitialSpinner/InitialSpinner";
import { Container } from "@chakra-ui/react";

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL;

function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(true);
  const session = useSelector((state) => state.session);
  const { isDark } = useThemeInfo();

  const healthCheckURL = `${backendUrl}/server/api/v1/health-check`;

  const [serverStatus, setServerStatus] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  useEffect(() => {
    const checkServerStatus = async () => {
      if (!initialCheckDone) {
        try {
          const response = await fetch(healthCheckURL);
          if (response.status === 200) {
            setServerStatus(200);
            setInitialCheckDone(true);
          }
        } catch (error) {
          console.error("Error checking server status:", error);
        }
      }
    };

    const checkInterval = setInterval(checkServerStatus, 5000);

    return () => clearInterval(checkInterval);
  }, [initialCheckDone]);

  const {
    data: dataSession,
    status: statusSession,
    isLoading: isCheckSessionLoading,
    isUninitialized: isCheckSessionUninitialized,
  } = useCheckSessionQuery({}, { skip: serverStatus === 200 ? false : true });

  const { data: dataUser } = useUserQuery({}, { skip });
  const { data: dataProfile } = useUserProfileQuery({}, { skip });

  // Login.
  useEffect(() => {
    if (dataSession && dataUser && dataProfile) {
      dispatch(
        login({
          isAuthenticated: true,
          user: dataUser.user,
          profile: dataProfile.profile,
        })
      );
    }
  }, [dataSession, dataUser, dataProfile]);

  useEffect(() => {
    if (!isCheckSessionUninitialized && !isCheckSessionLoading) {
      if (dataSession) {
        setSkip(false);
        if (!isLoading && !dataUser && !dataProfile) setIsLoading(true);
      } else {
        if (isLoading) setIsLoading(false);
      }
    }
  }, [dataSession, statusSession]);

  // If is Authenticated.
  useEffect(() => {
    if (isLoading && session.isAuthenticated) setIsLoading(false);
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
