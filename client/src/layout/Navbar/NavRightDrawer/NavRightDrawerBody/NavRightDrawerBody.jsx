import { useSelector } from "react-redux";
import { Divider, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import NavRightDrawerButton from "./NavRightDrawerButton/NavRightDrawerButton";
import { FaUser, FaGear } from "react-icons/fa6";

function NavRightDrawerBody({ handleLogout, onClose }) {
  const { user } = useSelector((state) => state.session);

  return (
    <Stack spacing={3}>
      <Divider borderColor={"gothicPurpleAlpha.300"} />
      <Stack spacing={1}>
        {/* Profile Page. */}
        <NavLink to={`/${user.username}`}>
          <NavRightDrawerButton children={"Profile"} icon={<FaUser />} onClick={onClose} />
        </NavLink>

        {/* Settings Pages. */}
        <NavLink to={"/settings"}>
          <NavRightDrawerButton children={"Settings"} icon={<FaGear />} onClick={onClose} />
        </NavLink>
      </Stack>
      <Divider borderColor={"gothicPurpleAlpha.300"} />
      {/* Sign Out. */}
      <NavRightDrawerButton children={"Sign Out"} onClick={handleLogout} />
    </Stack>
  );
}

export default NavRightDrawerBody;
