import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Box, Button, Divider, HStack, Stack, Text } from "@chakra-ui/react";
import ProfileForm from "./ProfileForm/ProfileForm";

function ProfileSettings() {
  const { user, profile } = useSelector((state) => state.session);

  return (
    <Box w={"100%"} px={{ base: 3, sm: 5, md: 10 }} py={{ base: 4, sm: 8 }}>
      <Stack>
        <HStack justify={"space-between"}>
          <Text children={"Edit profile"} fontWeight={"medium"} fontSize={"2xl"} opacity={0.9} />
          <NavLink to={`/${user.username}`}>
            <Button variant={"link"} size={"sm"} borderRadius={"full"}>
              <Text mt={"1px"} fontWeight={"extrabold"} opacity={0.9}>
                Go to your profile
              </Text>
            </Button>
          </NavLink>
        </HStack>
        <Divider bg={"gothicPurpleAlpha.50"} />
        <ProfileForm profile={profile} />
      </Stack>
    </Box>
  );
}

export default ProfileSettings;
