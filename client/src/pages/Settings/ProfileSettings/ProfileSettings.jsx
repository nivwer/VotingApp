// Hooks.
import { useSelector } from "react-redux";
// Components.
import ProfileForm from "./ProfileForm";
import { Box, Divider, Heading, Stack } from "@chakra-ui/react";

// Page.
function ProfileSettings() {
  const session = useSelector((state) => state.session);

  return (
    <Box opacity={"0.9"} w={"100%"} p={"10"}>
      <Stack spacing={7}>
        <Heading textAlign={"center"} size={"lg"}>
          Profile
        </Heading>
        <Divider />
        {/* Profile form. */}
        <ProfileForm profile={session.profile} />
        <Divider />
      </Stack>
    </Box>
  );
}

export default ProfileSettings;
