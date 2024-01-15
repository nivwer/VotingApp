import { Box, Grid } from "@chakra-ui/react";
import { useThemeInfo } from "../../hooks/Theme";

function TabButtonsGroup({ children, columns = 3, ...props }) {
  const { isDark } = useThemeInfo();

  return (
    <Box
      w={"100%"}
      bg={isDark ? "black" : "white"}
      borderBottom={"3px solid"}
      borderRadius={"3px"}
      borderColor={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      pt={{ base: 0, lg: 6 }}
      mb={4}
      {...props}
    >
      <Grid
        templateColumns={`repeat(${columns}, 1fr)`}
        color={isDark ? "whiteAlpha.900" : "blackAlpha.900"}
        children={children}
      />
    </Box>
  );
}

export default TabButtonsGroup;
