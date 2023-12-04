// Hooks.
import CustomButton from "../components/Buttons/CustomButton/CustomButton";
import CustomIconButton from "../components/Buttons/CustomIconButton/CustomIconButton";
import { useThemeInfo } from "../hooks/Theme";
// Components.
import { Box, Button, IconButton } from "@chakra-ui/react";
// Icons

function Home() {
  const { isDark, ThemeColor } = useThemeInfo();
  return (
    <Box m={3}>
      <CustomButton> Button</CustomButton>
      <CustomButton variant="outline"> Button</CustomButton>
      <CustomButton variant="ghost"> Button</CustomButton>
      <CustomButton> Button</CustomButton>
      <Button colorScheme={"purpleButton"} color={"whiteAlpha.800"}>
        Button
      </Button>
      <Button colorScheme={"purpleButton"} variant={"ghost"} color={"whiteAlpha.800"}>
        Button
      </Button>
      <Button colorScheme={"purpleButton"} variant={"outline"}color={"whiteAlpha.800"} >
        Button
      </Button>
    </Box>
  );
}

export default Home;
