import { Box, Button } from "@chakra-ui/react"
import PollModal from "../Modals/PollModal"

function SideBar() {
  return (
    <Box w={"295px"} >
        <Box bg={"gray"} h={"calc(100vh - 100px)"}>
            <PollModal/>

        </Box>

    </Box>
  )
}

export default SideBar