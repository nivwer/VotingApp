import { useRadio } from "@chakra-ui/react";
import { useThemeInfo } from "../../../../../../hooks/Theme";
import { Box } from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa6";

function RadioColorCard(props) {
  const { isDark } = useThemeInfo();
  const { getInputProps, getRadioProps } = useRadio(props);
  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        bg={isDark ? `${props.value}.200` : `${props.value}.500`}
        color={isDark ? `${props.value}.200` : `${props.value}.500`}
        cursor="pointer"
        borderWidth="2px"
        fontSize={"2xl"}
        borderRadius="full"
        _checked={{ color: isDark ? "black" : "white", borderColor: isDark ? "black" : "white" }}
        p={2}
        children={<FaCheck />}
      />
    </Box>
  );
}

export default RadioColorCard;
