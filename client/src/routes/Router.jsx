import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "../pages/Home";
import About from "../pages/About";
import SignUp from "../pages/Auth/SignUp";
import SignIn from "../pages/Auth/SignIn";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/Profile/Profile";
import Poll from "../pages/Poll/Poll";
import Settings from "../pages/Settings/Settings";
import Search from "../pages/Search/Search";
import Results from "../pages/Results/Results";
import Categories from "../pages/Categories/Categories";
import CategoryPolls from "../pages/Categories/CategoriesPages/CategoryPolls/CategoryPolls";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import GridLayout from "../layout/GridLayout/GridLayout";
import ThemeSettings from "../pages/Settings/SettingsPages/ThemeSettings/ThemeSettings";
import AccountSettings from "../pages/Settings/SettingsPages/AccountSettings/AccountSettings";
import ProfileSettings from "../pages/Settings/SettingsPages/ProfileSettings/ProfileSettings";

// Router.
function Router() {
  const { isAuthenticated } = useSelector((state) => state.session);

  return (
    <Routes>
      {/* ### MAIN SECTION ### */}

      {/* Simple Column Layout. */}
      <Route element={<GridLayout layout="simple" section="main" />}>
        <Route element={<ProtectedRoute isAllowed={!isAuthenticated} />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route path="/about" element={<About />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="main" />}>
        <Route path="/home" element={<Home />} />

        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:category" element={<CategoryPolls />} />

        <Route path="/search" element={<Search />} />
        <Route path="/results" element={<Results />} />
      </Route>

      {/* ### USER SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="user" />}>
        <Route path="/:username" element={<Profile />} />
        <Route path="/:username/:id" element={<Poll />} />
      </Route>

      {/* ### SETTINGS SECTION ### */}

      {/* Triple Columns Layout. */}
      <Route element={<GridLayout layout="triple" section="settings" />}>
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
