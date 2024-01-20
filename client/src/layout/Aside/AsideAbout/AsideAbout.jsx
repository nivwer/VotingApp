import { NavLink } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";

import { useThemeInfo } from "../../../hooks/Theme";
import CustomButton from "../../../components/Buttons/CustomButton/CustomButton";
import { FaGithub } from "react-icons/fa6";

function AsideAbout() {
  const { isDark } = useThemeInfo();
  const repositoryURL = "https://github.com/nivwer/VotingApp.git";
  return (
    <Box
      bg={isDark ? "gothicPurpleAlpha.100" : "gothicPurpleAlpha.200"}
      borderRadius={"3xl"}
      w={"100%"}
      py={6}
      boxShadow={"base"}
    >
      <Box px={8} py={1}>
        <NavLink to={repositoryURL} target="_blank">
          <Text children="About" fontWeight="black" fontSize="md" opacity={0.9} />
        </NavLink>
      </Box>
      <Box px={8} py={1}>
        <Text opacity={0.7} fontSize={"md"} fontWeight={"medium"}>
          This project is a prototype app for creating interactive polls.
        </Text>
      </Box>
      <Box px={8} py={1}>
        <NavLink to={repositoryURL} target="_blank">
          <CustomButton children={"Repository"} rightIcon={<FaGithub />} size={"sm"} p={4} />
        </NavLink>
      </Box>
    </Box>
  );
}

export default AsideAbout;
