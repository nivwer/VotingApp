import { useDispatch } from "react-redux";
import { Stack, useRadioGroup } from "@chakra-ui/react";
import { changeColor } from "../../../../../features/theme/themeSlice";
import { Box, HStack } from "@chakra-ui/react";
import RadioColorCard from "./RadioColorCard/RadioColorCard";

function ThemeColorRadioGroup() {
  const dispatch = useDispatch();
  const options = ["cyan", "blue", "purple", "pink", "red", "orange", "yellow", "green", "teal"];
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: "theme-color",
    defaultValue: localStorage.getItem("theme-color") || "default",
    onChange: (value) => {
      localStorage.setItem("theme-color", value);
      dispatch(changeColor({ theme_color: value }));
    },
  });
  const group = getRootProps();

  return (
    <Box w={"100%"} p={3}>
      <Stack spacing={3} align="stretch">
        <HStack {...group} justify={"space-between"}>
          {options.slice(0, Math.ceil(options.length / 2)).map((value) => {
            const radio = getRadioProps({ value });
            return <RadioColorCard key={value} value={value} {...radio} />;
          })}
        </HStack>
        <HStack {...group}  justify={"space-evenly"}>
          {options.slice(Math.ceil(options.length / 2)).map((value) => {
            const radio = getRadioProps({ value });
            return <RadioColorCard key={value} value={value} {...radio} />;
          })}
        </HStack>
      </Stack>
    </Box>
  );
}

export default ThemeColorRadioGroup;
