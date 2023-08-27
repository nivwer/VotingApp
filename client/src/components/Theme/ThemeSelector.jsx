// Hooks.
import { useSelector, useDispatch } from "react-redux";
// Actions.
import { changeColor } from "../../features/theme/themeSlice";
// Components.
import { Box, Button } from "@chakra-ui/react";

function ThemeSelector() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);

  const handleColorChange = (color) => {
    dispatch(
      changeColor({
        theme_color: color,
      })
    );
  };

  return (
    <>
      <Box>
        {theme.available_theme_colors.map((color, index) => (
          <Button
            key={index}
            colorScheme={color}
            size={"sm"}
            variant={"outline"}
            onClick={() => handleColorChange(color)}
          >
            {color}
          </Button>
        ))}
      </Box>
    </>
  );
}

export default ThemeSelector;
