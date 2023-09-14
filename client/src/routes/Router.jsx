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
import Profile from "../pages/User/Profile";
import Theme from "../pages/Settings/Theme";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import GridLayout from "../components/Layout/GridLayout";

// Router.
function Router() {
  const session = useSelector((state) => state.session);

  return (
    <Routes>
      {/* Simple Layout. */}
      <Route element={<GridLayout />}>
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
      <Route element={<GridLayout isSimple={false} />}>
        {/* Home page. */}
        <Route path="/home" element={<Home />} />
        {/* Profile page. */}
        <Route path="/:username" element={<Profile />} />
        {/* Poll page. */}
        {/* <Route path="/:username/:id" element={<ViewPoll />} /> */}

        {/* Config pages. */}
        <Route element={<ProtectedRoute isAllowed={!!session.token} />}>
          {/*  <Route path="/settings" element={<Settings />} /> */}
          <Route path="/settings/theme" element={<Theme />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
