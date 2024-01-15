import { useEffect, useState } from "react";

import PollCard from "../Cards/PollCard/PollCard";
import Pagination from "../Pagination/Pagination";

function PollList({ useQuery, data }) {
  const [dataQuery, setDataQuery] = useState(false);
  const [resetValues, setResetValues] = useState(false);

  useEffect(() => {
    console.log("primer efect");
    setResetValues(true);
  }, [data]);

  useEffect(() => {
    console.log("segun efect");
    if (resetValues) {
      setDataQuery({ ...data, page_size: 4 });
      setResetValues(false);
    }
  }, [resetValues]);

  return (
    <Pagination
      Card={PollCard}
      usePageQuery={useQuery}
      dataQuery={dataQuery}
      reset={{ resetValues: resetValues, setResetValues: setResetValues }}
    />
  );
}

export default PollList;
