// React Router Components.
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Pages.
import Home from "../pages/Home";
import About from "../pages/About";
import SingUp from "../pages/SingUp";
import SingIn from "../pages/SingIn";
import NotFoundPage from "../pages/NotFoundPage";
// Components.

// Router.
function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HomePage. */}
        <Route path="/home" element={<Home />} />

        {/* About Page. */}
        <Route path="/about" element={<About />} />

        {/* Authentication Page. */}
        <Route path="/singup" element={<SingUp />} />
        <Route path="/singin" element={<SingIn />} />

        {/* Page 404. */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
