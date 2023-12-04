// Hooks.
import { useThemeInfo } from "../../../hooks/Theme";
// Components.
import { IconButton } from "@chakra-ui/react";

// Component.
function CustomIconButton({ variant = "solid", ...props }) {
  const { isDark } = useThemeInfo();
  const c = "gothicPurpleAlpha";
  return (
    <IconButton
      variant={variant}
      borderRadius={"full"}
      color={isDark ? "white" : "black"}
      colorScheme={"gothicPurpleAlpha"}
      //   opacity={isDark ? 0.8 : 0.6}
      border={"0px  solid"}
      borderColor={isDark ? `${c}.200` : `${c}.300`}
      bg={
        variant == "solid" ? (isDark ? `${c}.200` : `${c}.300`) : "transparents"
      }
      outline={variant == "outline" ? "1px solid" : "0px solid"}
      outlineColor={isDark ? `${c}.300` : `${c}.400`}
      _hover={{
        bg:
          variant == "solid"
            ? isDark
              ? `${c}.300`
              : `${c}.400`
            : variant == "ghost"
            ? isDark
              ? `${c}.200`
              : `${c}.300`
            : isDark
            ? `${c}.100`
            : `${c}.200`,
      }}
      _active={{
        bg:
          variant == "solid"
            ? isDark
              ? `${c}.400`
              : `${c}.500`
            : variant == "ghost"
            ? isDark
              ? `${c}.300`
              : `${c}.400`
            : isDark
            ? `${c}.200`
            : `${c}.300`,
      }}
      {...props}
    />
  );
}

export default CustomIconButton;
