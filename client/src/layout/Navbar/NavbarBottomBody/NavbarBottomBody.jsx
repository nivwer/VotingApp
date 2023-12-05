import { Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import CustomIconButton from "../../../components/Buttons/CustomIconButton/CustomIconButton";
import { FaHouse, FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import PollModal from "../../../components/Modals/PollModal/PollModal";
import { useThemeInfo } from "../../../hooks/Theme";
import { NavLink } from "react-router-dom";

function NavbarBottomBody() {
  const { isDark, ThemeColor } = useThemeInfo();
  const pollModalDisclosure = useDisclosure();
  return (
    <Grid templateColumns={"repeat(3, 1fr)"} templateRows={"repeat(1, 50px)"}>
      <GridItem>
        <CustomIconButton
          onClick={pollModalDisclosure.onOpen}
          variant={"ghost"}
          icon={<FaPlus />}
          color={isDark ? `${ThemeColor}.200` : `${ThemeColor}.500`}
          w={"100%"}
          h={"100%"}
          borderRadius={0}
        />
      </GridItem>

      <GridItem>
        <NavLink to={"/home"}>
          <CustomIconButton variant="ghost" icon={<FaHouse />} borderRadius={0} w="100%" h="100%" />
        </NavLink>
      </GridItem>
      <GridItem>
        <NavLink to={"/search"}>
          <CustomIconButton
            variant={"ghost"}
            icon={<FaMagnifyingGlass />}
            borderRadius={0}
            w={"100%"}
            h={"100%"}
          />
        </NavLink>
      </GridItem>

      <PollModal disclosure={pollModalDisclosure} />
    </Grid>
  );
}

export default NavbarBottomBody;
