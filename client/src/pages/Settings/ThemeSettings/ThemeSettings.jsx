// Components.
import ThemeColorRadioGroup from "./ThemeColorRadioGroup";
import ThemeBackgroundRadioGroup from "./ThemeBackgroundRadioGroup";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";

function ThemeSettings() {
  return (
    <Box opacity={"0.9"} w={"100%"} p={10}>
      <Stack spacing={10}>
        {/* Background mode. */}
        <Stack>
          <Text fontWeight={"medium"} fontSize={"2xl"}>
            Background mode
          </Text>
          <Divider />
          <ThemeBackgroundRadioGroup />
        </Stack>
        {/* Color. */}
        <Stack>
          <Text fontWeight={"medium"} fontSize={"2xl"}>
            Color
          </Text>
          <Divider />
          <ThemeColorRadioGroup />
        </Stack>
      </Stack>
    </Box>
  );
}

export default ThemeSettings;
