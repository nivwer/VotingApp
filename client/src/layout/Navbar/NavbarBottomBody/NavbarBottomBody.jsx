import { Grid, GridItem } from "@chakra-ui/react";
import CustomIconButton from "../../../components/Buttons/CustomIconButton/CustomIconButton";
import { FaHouse, FaMagnifyingGlass, FaPlus, FaIcons } from "react-icons/fa6";
import { NavLink } from "react-router-dom";

function NavbarBottomBody() {
  return (
    <Grid templateColumns={"repeat(3, 1fr)"} templateRows={"repeat(1, 50px)"}>
      <GridItem>
        <NavLink to={"/categories"}>
          <CustomIconButton
            variant={"ghost"}
            icon={<FaIcons />}
            borderRadius={0}
            w={"100%"}
            h={"100%"}
          />
        </NavLink>
      </GridItem>
      <GridItem>
        <NavLink to={"/home"}>
          <CustomIconButton
            variant={"ghost"}
            icon={<FaHouse />}
            borderRadius={0}
            w={"100%"}
            h={"100%"}
          />
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
    </Grid>
  );
}

export default NavbarBottomBody;
