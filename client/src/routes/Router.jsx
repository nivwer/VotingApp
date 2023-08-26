// React Router Components.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Hooks.
import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";
// Pages.
import Home from "../pages/Home";
import About from "../pages/About";
import SignUp from "../pages/Auth/SignUp";
import SignIn from "../pages/Auth/SignIn";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/user/Profile";
import ViewPoll from "../pages/polls/ViewPoll";
import NewPoll from "../pages/polls/NewPoll";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navigation/Navbar";
import { Container } from "@chakra-ui/react";
import Theme from "../pages/config/Theme";

// Router.
function Router() {
  // Theme color.
  const theme = useSelector((state) => state.theme);
  const color = theme.theme_color;
  // Theme mode.
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const data = useSelector((state) => state.session);

  return (
    <BrowserRouter>
      <Navbar />
      <Container
        p={"0"}
        w="100vw"
        maxW="100vw"
        minH="calc(100vh - 100px)"
        mt={"100px"}
        bg={isDark ? "black" : `${color}.bg-l-p`}
        color={isDark ? `${color}.100` : `${color}.900`}
      >
        <Routes>
          {/* ### PUBLIC ROUTES ### */}
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          {/* Profile page. */}
          <Route path="/:username" element={<Profile />} />
          {/* Poll page. */}
          <Route path="/:username/:id" element={<ViewPoll />} />
          {/* Authentication Pages. */}
          <Route element={<ProtectedRoute isAllowed={!data.token} />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
          </Route>
          {/* ### PUBLIC ROUTES. ### */}

          {/* ### PRIVATE ROUTES. ### */}
          {/* Poll pages. */}
          <Route element={<ProtectedRoute isAllowed={!!data.token} />}>
            <Route path="/:username/new" element={<NewPoll />} />
          </Route>
          {/* Config pages. */}
          <Route element={<ProtectedRoute isAllowed={!!data.token} />}>
            {/*  <Route path="/config" element={<Config />} /> */}
            <Route path="/config/theme" element={<Theme />} />
          </Route>
          {/* ### PRIVATE ROUTES. ### */}

          {/* Page 404. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default Router;
