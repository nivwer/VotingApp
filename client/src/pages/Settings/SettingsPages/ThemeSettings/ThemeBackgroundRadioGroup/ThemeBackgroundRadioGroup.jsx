import { useColorMode, useRadioGroup } from "@chakra-ui/react";
import { Box, HStack } from "@chakra-ui/react";
import RadioBackgroundCard from "./RadioBackgroundCard/RadioBackgroundCard";

function ThemeBackgroundRadioGroup() {
  const { colorMode, setColorMode } = useColorMode();
  const options = ["dark", "light"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "theme-mode",
    defaultValue: colorMode,
    onChange: (value) => setColorMode(value),
  });
  const group = getRootProps();

  return (
    <Box w={"100%"} p={3}>
      <HStack justify={"start"} {...group} flexDir={{base: "column", sm: "row"}}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return <RadioBackgroundCard key={value} value={value} {...radio} />;
        })}
      </HStack>
    </Box>
  );
}

export default ThemeBackgroundRadioGroup;
