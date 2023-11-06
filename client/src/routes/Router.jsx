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
import Poll from "../pages/Poll/Poll";
import Categories from "../pages/Polls/Categories/Categories";
import CategoryPolls from "../pages/Polls/Categories/CategoryPolls";
import Settings from "../pages/Settings/Settings";
import AccountSettings from "../pages/Settings/AccountSettings/AccountSettings";
import ProfileSettings from "../pages/Settings/ProfileSettings/ProfileSettings";
import ThemeSettings from "../pages/Settings/ThemeSettings/ThemeSettings";
import Results from "../pages/Results/Results";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import GridLayout from "../components/Layout/GridLayout";

// Router.
function Router() {
  const { isAuthenticated } = useSelector((state) => state.session);

  return (
    <Routes>
      {/* ### MAIN SECTION ### */}

      {/* Simple Column Layout. */}
      <Route element={<GridLayout layout="simple" section="main" />}>
        {/* Authentication Pages. */}
        <Route element={<ProtectedRoute isAllowed={!isAuthenticated} />}>
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

        {/* Categories pages. */}
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:category" element={<CategoryPolls />} />

        {/* Results pages. */}
        <Route path="/results" element={<Results />} />
      </Route>

      {/* ### USER SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="user" />}>
        {/* Profile page. */}
        <Route path="/:username" element={<Profile />} />
        {/* Poll page. */}
        <Route path="/:username/:id" element={<Poll />} />
      </Route>

      {/* ### SETTINGS SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="settings" />}>
        {/* Settings pages. */}
        <Route element={<ProtectedRoute isAllowed={!!isAuthenticated} />}>
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/account" element={<AccountSettings />} />
          <Route path="/settings/profile" element={<ProfileSettings />} />
          <Route path="/settings/theme" element={<ThemeSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default Router;
