// React Router Components.
import { Routes, Route } from "react-router-dom";
// Hooks.
import { useSelector } from "react-redux";
// Pages.
import Home from "../pages/Home";
import About from "../pages/About";
import SignUp from "../pages/Auth/SignUp";
import SignIn from "../pages/Auth/SignIn";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/Profile/Profile";
import Theme from "../pages/Settings/Theme";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import GridLayout from "../components/Layout/GridLayout";
import ProfileUserPolls from "../pages/Profile/ProfileUserPolls";
import ProfileVotedPolls from "../pages/Profile/ProfileVotedPolls";

// Router.
function Router() {
  const session = useSelector((state) => state.session);

  return (
    <Routes>
      {/* ### MAIN SECTION ### */}

      {/* Simple Column Layout. */}
      <Route element={<GridLayout layout="simple" section="main" />}>
        {/* Authentication Pages. */}
        <Route element={<ProtectedRoute isAllowed={!session.token} />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>

        {/* About page. */}
        <Route path="/about" element={<About />} />

        {/* Page 404. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="main" />}>
        {/* Home page. */}
        <Route path="/home" element={<Home />} />
      </Route>

      {/* ### USER SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="user" />}>
        {/* Profile page. */}
        <Route element={<Profile />}>
          <Route path="/:username" element={<ProfileUserPolls />} />

          <Route path="/:username/votes" element={<ProfileVotedPolls />} />
        </Route>
        {/* Poll page. */}
        {/* <Route path="/:username/:id" element={<ViewPoll />} /> */}
      </Route>

      {/* ### SETTINGS SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="settings" />}>
        {/* Settings pages. */}
        <Route element={<ProtectedRoute isAllowed={!!session.token} />}>
          {/*  <Route path="/settings" element={<Settings />} /> */}
          <Route path="/settings/theme" element={<Theme />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
