// Components.
import UsernameForm from "./UsernameForm";
import PasswordForm from "./PasswordForm";
import { Box, Divider, Heading, Stack } from "@chakra-ui/react";

// Page.
function AccountSettings() {
  return (
    <Box w={"100%"} p={"10"}>
      <Stack spacing={7}>
        <Heading textAlign={"center"} size={"lg"}>
          Account
        </Heading>
        <Divider />
        {/* Username. */}
        <UsernameForm />
        <Divider />
        {/* Password. */}
        <PasswordForm />
        <Divider />
      </Stack>
    </Box>
  );
}

export default AccountSettings;
