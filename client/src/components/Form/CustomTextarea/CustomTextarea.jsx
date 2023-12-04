import { useThemeInfo } from "../../../hooks/Theme";
import { Textarea } from "@chakra-ui/react";

function CustomTextarea({ name, register, requirements = {}, ...props }) {
  const { req = false, maxL = 0, minL = 0 } = requirements;
  const { isDark } = useThemeInfo();
  const c = "gothicPurpleAlpha";
  return (
    <Textarea
      {...register(name, {
        required: req && "This field is required.",
        maxLength: maxL && { value: maxL, message: `Maximum ${maxL} characters allowed.` },
        minLength: minL && { value: minL, message: `Minimum ${minL} characters allowed.` },
        ...requirements,
      })}
      variant={"filled"}
      fontWeight={"medium"}
      color={isDark ? "whiteAlpha.800" : "blackAlpha.700"}
      bg={isDark ? `${c}.100` : `${c}.200`}
      border={isDark ? "1px solid" : "2px solid"}
      borderColor={"transparent"}
      _hover={{ bg: isDark ? `${c}.100` : `${c}.200` }}
      _focus={{ bg: isDark ? "black" : "white" }}
      focusBorderColor={isDark ? `${c}.300` : `${c}.500`}
      _placeholder={{
        color: isDark ? "gothicPurple.100" : "gothicPurple.900",
        opacity: isDark ? 0.2 : 0.3,
      }}
      resize={"none"}
      {...props}
    />
  );
}

export default CustomTextarea;
