// Components.
import { Button } from "@chakra-ui/react";

// SubComponent ( NavDrawer ).
function NavDrawerFooter({ onClose }) {
  return (
    <>
      <Button variant="outline" mr={3} onClick={onClose}>
        Cancel
      </Button>
      <Button colorScheme="blue">Save</Button>
    </>
  );
}

export default NavDrawerFooter;
