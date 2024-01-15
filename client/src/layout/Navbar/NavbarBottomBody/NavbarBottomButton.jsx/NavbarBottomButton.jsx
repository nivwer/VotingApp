import { NavLink } from "react-router-dom";

import CustomIconButton from "../../../../components/Buttons/CustomIconButton/CustomIconButton";

function NavbarBottomButton({ icon, to }) {
  return (
    <NavLink to={to}>
      <CustomIconButton variant={"ghost"} icon={icon} borderRadius={0} w={"100%"} h={"100%"} />
    </NavLink>
  );
}

export default NavbarBottomButton;
