import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import ProjectManager from "../components/Dropdownv1.jsx";
import CustomButton from "../components/CustomButton.jsx";

const FieldRow = () => {
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [workTypes, setWorkTypes] = useState("");
  const [sequence, setSequence] = useState("");
  const [allNames, setAllNames] = useState([]);

  const names = allNames.map((name, index) => ({
    name,
    sequence: index + 1,
  }));

  const handleNext = async () => {
    console.log("data saved");
  };

  return (
    <>
      <div
        style={{
          marginTop: "20px",
          border: "1px solid #7500c0",
          borderRadius: "10px",
          paddingTop: "20px",
          paddingLeft: "60px",
          paddingRight: "60px",
          paddingBottom: "20px",
        }}
      >
        <DropdownWithTextBox
          allNames={allNames}
          setAllNames={setAllNames}
          setUiType={setUiType}
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
    </>
  );
};

export default FieldRow;
