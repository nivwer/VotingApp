import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <NavLink to={'/home'}>home </NavLink>
        <NavLink to={'/about'}>about </NavLink>
        <NavLink to={'/singin'}>singin </NavLink>
        <NavLink to={'/singup'}>singup </NavLink>
        <NavLink to={'/user/polls'}>mypolls </NavLink>
      </div>
    </>
  );
}

export default Navbar;
