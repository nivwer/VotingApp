// React Router Components.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Hooks.
import { useSelector } from "react-redux";
import { useColorMode } from "@chakra-ui/react";
// Pages.
import Home from "../pages/Home";
import About from "../pages/About";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/user/Profile";
import ViewPoll from "../pages/polls/ViewPoll";
import NewPoll from "../pages/polls/NewPoll";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "../components/Navigation/Navbar";
import { Container } from "@chakra-ui/react";

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
        w="100vw"
        maxW="100vw"
        minH="100vh"
        bg={isDark ? "black" : `${color}.10`}
        color={isDark ? `${color}.50` : `${color}.900`}
      >
        <Routes>
          {/* HomePage. */}
          <Route path="/home" element={<Home />} />

          {/* About Page. */}
          <Route path="/about" element={<About />} />

          {/* Authentication Page. */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />

          {/* Profile page. */}
          <Route path="/:username" element={<Profile />} />

          {/* Public Poll page. */}
          <Route path="/:username/:id" element={<ViewPoll />} />
          {/* Private Poll pages. */}
          <Route element={<ProtectedRoute isAllowed={!!data.token} />}>
            <Route path="/:username/new" element={<NewPoll />} />
          </Route>

          {/* Page 404. */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default Router;
