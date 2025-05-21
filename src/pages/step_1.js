import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import { Button } from "@mui/material";
import CustomButton from "../components/CustomButton.jsx";

const FieldRow = () => {
  const [masterWorkType, setMasterWorkType] = useState([]);
  const [deliveryWorkTypes, setDeliveryWorkTypes] = useState([]);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [selectedMasterName, setSelectedMasterName] = useState(null);
  const [masterData, setMasterData] = useState([]);

  const handleSave = () => {
    // Save the currently selected master’s data if needed
    let updatedData = [...masterData];
    if (selectedMasterName) {
      // Remove existing entry for selected master
      updatedData = updatedData.filter(
        (entry) => entry.masterWorkType !== selectedMasterName
      );
      // Add the latest data
      updatedData.push({
        masterWorkType: selectedMasterName,
        deliveryWorkTypes,
        uiType,
        sequence,
      });
    }

    // You now have complete data per master
    console.log("🚀 Final Data to send:", updatedData);
  };

  const handleMasterSelect = (newMasterName) => {
    // Save current delivery work types under the previous master
    if (selectedMasterName) {
      setMasterData((prev) => {
        const updated = prev.filter(
          (entry) => entry.masterWorkType !== selectedMasterName
        );
        return [
          ...updated,
          {
            masterWorkType: selectedMasterName,
            deliveryWorkTypes,
            uiType,
            sequence,
          },
        ];
      });
    }

    // Load delivery work types for newly selected master (if any)
    const existing = masterData.find(
      (entry) => entry.masterWorkType === newMasterName
    );
    setDeliveryWorkTypes(existing ? existing.deliveryWorkTypes : []);
    setSelectedMasterName(newMasterName);
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "30px",
            display: "flex",
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <DropdownWithTextBox
            allNames={masterWorkType}
            setAllNames={setMasterWorkType}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={handleMasterSelect}
            label={"Create Master Work Types: "}
          />

          <br />

          <DropdownWithTextBox
            allNames={deliveryWorkTypes}
            setAllNames={setDeliveryWorkTypes}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={() => {}}
            label={"Create Delivery Work Types: "}
            disabled={!selectedMasterName}
          />
        </div>
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "30px",
            marginTop: "20px",
          }}
        >
          <div>
            <label
              htmlFor="uiTypeSelect"
              style={{
                fontWeight: "bold",
                display: "block",
                marginBottom: "8px",
              }}
            >
              UI Type For Master Work Types
            </label>
            <select
              id="uiTypeSelect"
              style={{
                width: "100%",
                padding: "8px 60px 8px 8px",
                boxSizing: "border-box",
              }}
              onChange={(e) => {
                const newUiType = e.target.value;
                setUiType(newUiType);

                // Update UI type for every master entry
                setMasterData((prev) =>
                  prev.map((entry) => ({
                    ...entry,
                    uiType: newUiType,
                  }))
                );
              }}
              defaultValue=""
            >
              <option value="" disabled>
                Select a GUI Type
              </option>
              <option value="check_box">Check Box</option>
              <option value="radio_button">Radio Button</option>
              <option value="button">Button</option>
            </select>
          </div>
        </div>
        <CustomButton
          handleClick={handleSave}
          innerContent="Save"
          disabled={!uiType}
        />
      </div>
    </>
  );
};

export default FieldRow;
