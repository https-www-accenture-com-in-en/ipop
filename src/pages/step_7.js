import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import CustomButton from "../components/CustomButton.jsx";
import { Box } from "@mui/material";

const FieldRow = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [clusters, setClusters] = useState([]);
  const [clusterValues, setClusterValues] = useState([]);

  const handleNext = async () => {
    console.log("data saved");
  };

  return (
    <div className="page-wrapper">
      <Box>
        <DropdownWithTextBox
          allNames={clusters}
          setAllNames={setClusters}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Create Project Clusters: "}
        />
      </Box>
      <Box my={2}>
        <DropdownWithTextBox
          allNames={clusterValues}
          setAllNames={setClusterValues}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Create Values for Cluster: "}
        />
      </Box>
      <CustomButton handleClick={handleNext} innerContent={"Save"} />
    </div>
  );
};

export default FieldRow;
