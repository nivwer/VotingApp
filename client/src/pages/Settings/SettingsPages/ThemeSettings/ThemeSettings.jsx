import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import ThemeColorRadioGroup from "./ThemeColorRadioGroup/ThemeColorRadioGroup";
import ThemeBackgroundRadioGroup from "./ThemeBackgroundRadioGroup/ThemeBackgroundRadioGroup";

function ThemeSettings() {
  return (
    <Box w={"100%"} px={{ base: 3, sm: 5, md: 10 }} py={{ base: 4, sm: 8 }}>
      <Stack spacing={10}>
        {/* Background mode. */}
        <Stack>
          <Text children={"Background mode"} fontWeight={"medium"} fontSize={"2xl"} />
          <Divider bg={"gothicPurpleAlpha.50"} />
          <ThemeBackgroundRadioGroup />
        </Stack>
        {/* Color. */}
        <Stack>
          <Text children={"Color"} fontWeight={"medium"} fontSize={"2xl"} />
          <Divider bg={"gothicPurpleAlpha.50"} />
          <ThemeColorRadioGroup />
        </Stack>
      </Stack>
    </Box>
  );
}

export default ThemeSettings;
