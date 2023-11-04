// Hooks.
import { useThemeInfo } from "../../../../../hooks/Theme";
import { useSelector } from "react-redux";
// Components.
import { Divider, Stack } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
// SubComponents.
import NavDrawerButton from "./NavDrawerButton/NavDrawerButton";
// Icons.
import { FaUser, FaPaintbrush, FaGear, FaGripLines } from "react-icons/fa6";

// SubComponent ( NavDrawer ).
function NavDrawerBody({ handleLogout, onClose }) {
  const { isDark } = useThemeInfo();
  const { user } = useSelector((state) => state.session);

  return (
    <Stack spacing={3}>
      {/* Divider. */}
      <Divider borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"} />
      {/* Profile Page. */}
      <NavLink to={`/${user.username}`}>
        <NavDrawerButton icon={<FaUser />} onClick={onClose}>
          Profile
        </NavDrawerButton>
      </NavLink>

      {/* Divider. */}
      <Divider borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"} />

      {/* User Pages. */}
      <Stack spacing={0}>
        <NavLink to={`/${user.username}`}>
          <NavDrawerButton icon={<FaGripLines />} onClick={onClose}>
            Your Polls
          </NavDrawerButton>
        </NavLink>
        <NavLink to={`/${user.username}?tab=votes`}>
          <NavDrawerButton icon={<FaGripLines />} onClick={onClose}>
            Your Votes
          </NavDrawerButton>
        </NavLink>
        <NavLink to={`/${user.username}?tab=shares`}>
          <NavDrawerButton icon={<FaGripLines />} onClick={onClose}>
            Your Shares
          </NavDrawerButton>
        </NavLink>
        <NavLink to={`/${user.username}?tab=bookmarks`}>
          <NavDrawerButton icon={<FaGripLines />} onClick={onClose}>
            Your Bookmarks
          </NavDrawerButton>
        </NavLink>
      </Stack>

      {/* Divider. */}
      <Divider borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"} />

      {/* Settings Pages. */}
      <Stack spacing={0}>
        <NavLink to={"/settings"}>
          <NavDrawerButton icon={<FaGear />} onClick={onClose}>
            Settings
          </NavDrawerButton>
        </NavLink>
        <NavLink to={"/settings/theme"}>
          <NavDrawerButton icon={<FaPaintbrush />} onClick={onClose}>
            Theme
          </NavDrawerButton>
        </NavLink>
      </Stack>

      {/* Divider. */}
      <Divider borderColor={isDark ? "whiteAlpha.300" : "blackAlpha.200"} />

      {/* Sign Out. */}
      <NavDrawerButton onClick={handleLogout}>Sign Out</NavDrawerButton>
    </Stack>
  );
}

export default NavDrawerBody;
