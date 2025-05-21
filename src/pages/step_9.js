import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import ProjectManager from "../components/Dropdownv1.jsx";
import CustomButton from "../components/CustomButton.jsx";

const FieldRow = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
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
        setUiType={null}
        setSequence={setSequence}
        setSelectedName={setSelectedName}
        label={"Create Master Project: "}
      />
      <br />
      <div style={{ marginTop: "0px" }}>
        <DropdownWithTextBox
          allNames={allNames}
          setAllNames={setAllNames}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Create Sub-Project: "}
        />
      </div>
      <CustomButton handleClick={handleNext} innerContent={"Save"} />
      {/* <ProjectManager /> */}
    </div>
  );
};

export default FieldRow;
