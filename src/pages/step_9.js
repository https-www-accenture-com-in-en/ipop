import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import ProjectManager from "../components/Dropdownv1.jsx";
import CustomButton from "../components/CustomButton.jsx";
import { Box } from "@mui/material";

const FieldRow = () => {
  const [selectedCluster, setSelectedCluster] = useState(null);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [masterprojects, setMasterProjects] = useState([]);
  const [subprojects, setSubProjects] = useState([]);

  const handleNext = async () => {
    console.log("data saved");
  };

  return (
    <div className="page-wrapper">
      <DropdownWithTextBox
        allNames={masterprojects}
        setAllNames={setMasterProjects}
        setUiType={null}
        setSequence={setSequence}
        setSelectedName={setSelectedCluster}
        label={"Create Master Project: "}
      />

      {selectedCluster && (
        <>
          <Box my={2}>
            <DropdownWithTextBox
              allNames={subprojects}
              setAllNames={setSubProjects}
              setUiType={setUiType}
              setSequence={setSequence}
              setSelectedName={null}
              label={"Create Sub-Project: "}
            />
          </Box>
          <CustomButton handleClick={handleNext} innerContent={"Save"} />
        </>
      )}
    </div>
  );
};

export default FieldRow;
