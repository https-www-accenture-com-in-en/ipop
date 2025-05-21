import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import ProjectManagerMUI from "../components/Dropdownv2.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { Box } from "@mui/material";

const FieldRow = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [sequence, setSequence] = useState("");
  const [allNames, setAllNames] = useState([]);

  const handleNext = async () => {
    console.log("data saved");
  };

  return (
    <div className="page-wrapper">
      <DropdownWithTextBox
        allNames={allNames}
        setAllNames={setAllNames}
        setUiType={setUiType}
        setSequence={setSequence}
        setSelectedName={setSelectedName}
        label={"Create Project Clusters: "}
      />
      <Box sx={{ marginTop: "20px" }}>
        <DropdownWithTextBox
          allNames={allNames}
          setAllNames={setAllNames}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Create Values for Cluster: "}
        />
      </Box>
      <CustomButton handleClick={handleNext} innerContent={"Save"} />
      <div>{/* <ProjectManagerMUI /> */}</div>
    </div>
  );
};

export default FieldRow;
