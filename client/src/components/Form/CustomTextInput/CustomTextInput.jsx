import { useThemeInfo } from "../../../hooks/Theme";
import { Input } from "@chakra-ui/react";

function CustomTextInput({ name, register, requirements = {}, variant = "filled", ...props }) {
  const { req = false, maxL = 0, minL = 0 } = requirements;
  const { isDark } = useThemeInfo();
  const c = "gothicPurpleAlpha";
  return (
    <Input
      {...register(name, {
        required: req && "This field is required.",
        maxLength: maxL && { value: maxL, message: `Maximum ${maxL} characters allowed.` },
        minLength: minL && { value: minL, message: `Minimum ${minL} characters allowed.` },
        ...requirements,
      })}
      variant={variant}
      fontWeight={"medium"}
      outline={variant == "outline" ? "1px solid" : "0px solid"}
      outlineColor={isDark ? `${c}.300` : `${c}.500`}
      color={isDark ? "whiteAlpha.800" : "blackAlpha.700"}
      bg={variant == "filled" ? (isDark ? `${c}.100` : `${c}.200`) : "transparent"}
      border={variant == "outline" ? "2px solid" : isDark ? "1px solid" : "2px solid"}
      borderColor={"transparent"}
      _hover={{ bg: variant == "filled" ? (isDark ? `${c}.100` : `${c}.200`) : "transparent" }}
      _focus={{ bg: "transparent" }}
      focusBorderColor={isDark ? `${c}.300` : `${c}.500`}
      _placeholder={{
        color: isDark ? "gothicPurple.100" : "gothicPurple.900",
        opacity: isDark ? 0.2 : 0.3,
      }}
      {...props}
    />
  );
}

export default CustomTextInput;
