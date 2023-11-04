// Hooks.
import { Flex, Text, useRadio } from "@chakra-ui/react";
import { useThemeInfo } from "../../../../../hooks/Theme";
// Components.
import { Box } from "@chakra-ui/react";

// SubComponent ( ThemeBackgroundRadioGroup ).
function RadioBackgroundCard(props) {
  const { isDark, ThemeColor } = useThemeInfo();
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        bg={props.value == "dark" ? "black" : "white"}
        color={props.value == "dark" ? "white" : "black"}
        cursor="pointer"
        borderWidth="3px"
        fontSize={"xl"}
        borderRadius="md"
        _checked={{
          color: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
          borderColor: isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`,
        }}
        w={40}
        h={20}
      >
        <Flex w={"100%"} h={"100%"} justify={"space-evenly"} align={"center"}>
          <Text fontWeight={"bold"}>
            {props.value == "dark" ? "Dark" : "Light"}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
}

export default RadioBackgroundCard;
