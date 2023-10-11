// Hooks.
import { useColorMode, useRadioGroup } from "@chakra-ui/react";
// Components.
import RadioBackgroundCard from "./Components/RadioBackgroundCard";
import { Box, HStack } from "@chakra-ui/react";

function ThemeBackgroundRadioGroup() {
  // Theme background mode.
  const { colorMode, setColorMode } = useColorMode();

  // Mode options.
  const options = ["dark", "light"];

  // Radio Group.
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "theme-mode",
    defaultValue: colorMode,
    onChange: (value) => {
      setColorMode(value);
    },
  });

  const group = getRootProps();

  return (
    <Box w={"100%"} p={3}>
      <HStack justify={"start"} {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return <RadioBackgroundCard key={value} value={value} {...radio} />;
        })}
      </HStack>
    </Box>
  );
}

export default ThemeBackgroundRadioGroup;
