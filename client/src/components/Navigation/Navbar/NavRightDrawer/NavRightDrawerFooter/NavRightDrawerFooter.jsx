// Components.
import { Button } from "@chakra-ui/react";

// SubComponent ( NavRightDrawer ).
function NavRightDrawerFooter({ onClose }) {
  return (
    <>
      <Button variant="outline" mr={3} onClick={onClose}>
        Cancel
      </Button>
      <Button colorScheme="blue">Save</Button>
    </>
  );
}

export default NavRightDrawerFooter;
