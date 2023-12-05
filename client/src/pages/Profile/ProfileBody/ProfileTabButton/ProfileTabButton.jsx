import { useThemeInfo } from "../../../../hooks/Theme";
import { NavLink } from "react-router-dom";
import { GridItem, Text } from "@chakra-ui/react";
import CustomButton from "../../../../components/Buttons/CustomButton/CustomButton";

function ProfileTabButton({ value, username, tab, children }) {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <GridItem>
      <NavLink to={value ? `/${username}?tab=${value}` : `/${username}`}>
        <CustomButton
          borderRadius={0}
          w={"100%"}
          h={"auto"}
          p={"8px"}
          pt={"13px"}
          opacity={0.8}
          fontWeight={!value ? (!tab ? "black" : "semibold") : tab === value ? "black" : "semibold"}
          variant={"ghost"}
          borderBottom={"3px solid"}
          borderColor={
            !value
              ? !tab
                ? isDark
                  ? `${ThemeColor}.200`
                  : `${ThemeColor}.500`
                : "transparent"
              : tab === value
              ? isDark
                ? `${ThemeColor}.200`
                : `${ThemeColor}.500
              `
              : "transparent"
          }
        >
          <Text fontSize={"md"} opacity={!value ? (!tab ? 1 : 0.6) : tab === value ? 1 : 0.6}>
            {children}
          </Text>
        </CustomButton>
      </NavLink>
    </GridItem>
  );
}

export default ProfileTabButton;
