import { Grid, GridItem } from "@chakra-ui/react";
import { FaHouse, FaMagnifyingGlass, FaIcons } from "react-icons/fa6";

import NavbarBottomButton from "./NavbarBottomButton.jsx/NavbarBottomButton";

function NavbarBottomBody() {
  return (
    <Grid templateColumns={"repeat(3, 1fr)"} templateRows={"repeat(1, 50px)"}>
      <GridItem children={<NavbarBottomButton icon={<FaHouse />} to={"/home"} />} />
      <GridItem children={<NavbarBottomButton icon={<FaMagnifyingGlass />} to={"/search"} />} />
      <GridItem children={<NavbarBottomButton icon={<FaIcons />} to={"/categories"} />} />
    </Grid>
  );
}

export default NavbarBottomBody;
