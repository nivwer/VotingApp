// Hooks.
import { useSelector } from "react-redux";
// Components.
import ProfileForm from "./ProfileForm";
import { NavLink } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";

// Page.
function ProfileSettings() {
  const session = useSelector((state) => state.session);

  return (
    <Box opacity={"0.9"} w={"100%"} p={"10"}>
      <Stack spacing={10}>
        {/* Profile form. */}
        <Stack>
          <HStack justify={"space-between"}>
            <Text fontWeight={"medium"} fontSize={"2xl"}>
              Edit profile
            </Text>
            <NavLink to={`/${session.user.username}`}>
              <Button variant={"outline"} size={"xs"}>Go to your profile</Button>
            </NavLink>
          </HStack>
          <Divider />
          <ProfileForm profile={session.profile} />
        </Stack>
      </Stack>
    </Box>
  );
}

export default ProfileSettings;
