import { GridItem, Text } from "@chakra-ui/react";

import { useThemeInfo } from "../../../hooks/Theme";
import CustomButton from "../../Buttons/CustomButton/CustomButton";

function TabButtonItem({ value = "default", tab = "default", children, setValue, ...props }) {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <GridItem>
      <CustomButton
        variant={"ghost"}
        w={"100%"}
        h={"auto"}
        p={"8px"}
        pt={"13px"}
        opacity={0.8}
        fontWeight={!value ? (!tab ? "black" : "semibold") : tab === value ? "black" : "semibold"}
        borderRadius={0}
        borderBottom={"3px solid"}
        borderColor={
          tab === value ? (isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`) : "transparent"
        }
        onClick={() => setValue(value)}
        {...props}
      >
        <Text fontSize={"md"} opacity={!value ? (!tab ? 1 : 0.6) : tab === value ? 1 : 0.6}>
          {children}
        </Text>
      </CustomButton>
    </GridItem>
  );
}

export default TabButtonItem;
