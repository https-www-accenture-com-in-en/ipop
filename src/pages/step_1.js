import React, { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import CustomButton from "../components/CustomButton.jsx";

const FieldRow = () => {
  const [masterWorkType, setMasterWorkType] = useState([]);
  const [deliveryWorkTypes, setDeliveryWorkTypes] = useState([]);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [selectedMasterName, setSelectedMasterName] = useState(null);

  const savedData = {
    selectedMasterName,
    uiType,
    deliveryWorkTypes,
  };

  const handleNext = () => {
    console.log("UI Type:", savedData.uiType);
  };

  const handleSave = () => {
    console.log("Data saved locally:");
    console.log(savedData);
    // flush the data to the server or local storage
    setDeliveryWorkTypes([]);
    setMasterWorkType([]);
  };

  return (
    <>
      <div style={{ marginTop: "20px" }}>
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "20px",
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
            setSelectedName={setSelectedMasterName}
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
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              mt: 1,
              px: 0.5,
              py: 0.5,
              fontSize: "10px",
              fontWeight: "bold",
              borderRadius: "6px",
              backgroundColor: "#7500c0",
              color: "white",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#7500c0",
                transform: "scale(1.05)",
              },
            }}
          >
            Assign Delivery Work Types
          </Button>
        </div>
        <div
          style={{
            border: "1px solid #7500c0",
            borderRadius: "10px",
            padding: "20px",
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
              onChange={(e) => setUiType(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>
                Select a GUI Type…
              </option>
              <option value="check_box">Check Box</option>
              <option value="radio_button">Radio Button</option>
              <option value="button">Button</option>
            </select>
          </div>
        </div>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{
            mt: 0.5,
            px: 0.5,
            py: 0.5,
            fontSize: "10px",
            fontWeight: "bold",
            borderRadius: "6px",
            backgroundColor: "#7500c0",
            color: "white",
            width: "100%",
            marginTop: "10px",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#7500c0",
              transform: "scale(1.05)",
            },
          }}
        >
          Assign Delivery Work Types
        </Button>
      </div>
    </>
  );
};

export default FieldRow;
