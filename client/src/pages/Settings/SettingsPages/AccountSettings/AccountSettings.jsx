import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import UsernameForm from "./UsernameForm/UsernameForm";
import PasswordForm from "./PasswordForm/PasswordForm";

function AccountSettings() {
  return (
    <Box w={"100%"} px={{ base: 3, sm: 5, md: 10 }} py={{ base: 4, sm: 8 }}>
      <Stack spacing={10}>
        {/* Username. */}
        <Stack>
          <Text children={"Change username"} fontWeight={"medium"} fontSize={"2xl"} />
          <Divider borderColor={"gothicPurpleAlpha.300"} />
          <UsernameForm />
        </Stack>
        {/* Password. */}
        <Stack>
          <Text children={"Change password"} fontWeight={"medium"} fontSize={"2xl"} />
          <Divider borderColor={"gothicPurpleAlpha.300"} />
          <PasswordForm />
        </Stack>
      </Stack>
    </Box>
  );
}

export default AccountSettings;
