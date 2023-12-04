import { HStack, MenuItem, Text } from "@chakra-ui/react";

function SearchMenuItem({ children, icon, value, setSearchType }) {
  return (
    <MenuItem onClick={() => setSearchType(value)} px={4}>
      <HStack spacing={3} opacity={0.7}>
        <Text children={icon} />
        <Text children={children} mt={"3px"} fontWeight={"semibold"} />
      </HStack>
    </MenuItem>
  );
}

export default SearchMenuItem;
