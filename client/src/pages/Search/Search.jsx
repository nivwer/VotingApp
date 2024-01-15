import { useState } from "react";
import { useSearchParams} from "react-router-dom";
import { Box } from "@chakra-ui/react";

import SearchInput from "../../components/Form/SearchInput/SearchInput";
import TabButtonsGroup from "../../components/TabButtonsGroup/TabButtonsGroup";
import TabButtonItem from "../../components/TabButtonsGroup/TabButtonItem/TabButtonItem";
import Explore from "../Explore/Explore";

function Search({ children }) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "polls";
  const [tab, setTab] = useState(type);

  return (
    <>
      <Box zIndex={1200} pos={"sticky"} top={{ base: "60px", md: "80px" }}>
        <SearchInput searchType={tab} setSearchType={setTab} />

        {/* Search Tabs. */}
        <TabButtonsGroup columns={2}>
          <TabButtonItem children={"Polls"} tab={tab} value={"polls"} setValue={setTab} />
          <TabButtonItem children={"Users"} tab={tab} value={"users"} setValue={setTab} />
        </TabButtonsGroup>
      </Box>

      {children ? children : <Explore type={tab} />}
    </>
  );
}

export default Search;
