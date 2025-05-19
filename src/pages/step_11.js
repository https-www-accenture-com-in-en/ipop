import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import ProjectManager from "../components/Dropdownv1.jsx";

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
        <button
          onClick={handleNext}
          style={{
            padding: "8px 14px",
            fontSize: "12px",
            cursor: "pointer",
            border: "none",
            color: "white",
            fontWeight: "bold",
            borderRadius: "4px",
            marginTop: "20px",
            backgroundColor: "#eb7476",
          }}
        >
          Save
        </button>
        <ProjectManager />
      </div>
    </>
  );
};

export default FieldRow;
