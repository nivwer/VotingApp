// React Router Components.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Hooks.
import { useSelector } from "react-redux";
// Pages.
import Home from "../pages/Home";
import About from "../pages/About";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/Profile"
import ViewPolls from "../pages/polls/ViewPolls";
import ViewPoll from "../pages/polls/ViewPoll";
import NewPoll from "../pages/polls/NewPoll";
// Components.
import ProtectedRoute from "./ProtectedRoute";
import Navbar from '../components/Navigation/Navbar'

// Router.
function Router() {
  const data = useSelector((state) => state.session);

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {/* HomePage. */}
        <Route path="/home" element={<Home />} />

        {/* About Page. */}
        <Route path="/about" element={<About />} />

        {/* Authentication Page. */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* User pages. */}
        <Route element={<ProtectedRoute isAllowed={!!data.token} />}>
          <Route path="/user" element={<Profile />} />
          <Route path="/user/polls" element={<ViewPolls />} />
          <Route path="/user/:id" element={<ViewPoll />} />
          <Route path="/user/new" element={<NewPoll />} />
        </Route>

        {/* Page 404. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
