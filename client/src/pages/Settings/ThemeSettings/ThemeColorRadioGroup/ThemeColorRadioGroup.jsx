// Hooks.
import { useDispatch } from "react-redux";
import { useRadioGroup } from "@chakra-ui/react";
// Actions.
import { changeColor } from "../../../../features/theme/themeSlice";
// Components.
import { Box, HStack } from "@chakra-ui/react";
// SubComponents.
import RadioColorCard from "./RadioColorCard/RadioColorCard";

// SubComponent ( ThemeSettings ).
function ThemeColorRadioGroup() {
  const dispatch = useDispatch();

  // Color options.
  const options = [
    "default",
    "red",
    "orange",
    "yellow",
    "green",
    "teal",
    "cyan",
    "blue",
    "purple",
    "pink",
  ];

  // Radio Group.
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
      <HStack justify={"space-between"} {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return <RadioColorCard key={value} value={value} {...radio} />;
        })}
      </HStack>
    </Box>
  );
}

export default ThemeColorRadioGroup;
