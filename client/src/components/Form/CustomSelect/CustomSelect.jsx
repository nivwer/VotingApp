import { useThemeInfo } from "../../../hooks/Theme";
import { Select } from "@chakra-ui/react";

function CustomSelect({ name, register, requirements = {}, ...props }) {
  const { req = false } = requirements;
  const { isDark } = useThemeInfo();
  const c = "gothicPurpleAlpha";
  return (
    <Select
      {...register(name, { required: req && "This field is required.", ...requirements })}
      variant={"filled"}
      fontWeight={"medium"}
      color={isDark ? "whiteAlpha.800" : "blackAlpha.700"}
      bg={isDark ? `${c}.100` : `${c}.200`}
      _hover={{ bg: isDark ? `${c}.100` : `${c}.200` }}
      boxShadow={"base"}
      {...props}
    />
  );
}

export default CustomSelect;
