import { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import CustomButton from "../components/CustomButton.jsx";
import { Alert, MenuItem, Snackbar, TextField } from "@mui/material";
import axios from "axios";
import "../index.css";

const FieldRow = () => {
  const [masterWorkType, setMasterWorkType] = useState([]);
  const [deliveryWorkTypes, setDeliveryWorkTypes] = useState([]);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [selectedMasterName, setSelectedMasterName] = useState(null);
  const [masterData, setMasterData] = useState([]);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const uiTypes = ["checkbox", "radio", "button"]; // Match lowercase with backend if required

  const handleSave = async () => {
    let updatedData = [...masterData];

    if (selectedMasterName) {
      // Update masterData with current master info
      updatedData = updatedData.filter(
        (entry) => entry.masterWorkTypes !== selectedMasterName
      );
      updatedData.push({
        masterWorkTypes: selectedMasterName,
        deliveryWorkTypes,
        uiType,
        sequence: Number(sequence),
      });
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/v1/api/admin/master-and-delivery-work-types",
        updatedData
      );
      if (res.status === 201) {
        console.log("✅ Data saved successfully");
        setAlert({
          open: true,
          message: "Data saved successfully!",
          severity: "success",
        });
      } else {
        console.error("❌ Error saving data:", res.status);
      }
    } catch (err) {
      console.error("❌ API Error:", err);
    }
  };

  const handleMasterSelect = (newMasterName) => {
    if (selectedMasterName) {
      setMasterData((prev) => {
        const updated = prev.filter(
          (entry) => entry.masterWorkTypes !== selectedMasterName
        );
        return [
          ...updated,
          {
            masterWorkTypes: selectedMasterName,
            deliveryWorkTypes,
            uiType,
            sequence: Number(sequence),
          },
        ];
      });
    }

    const existing = masterData.find(
      (entry) => entry.masterWorkTypes === newMasterName
    );

    setDeliveryWorkTypes(existing ? existing.deliveryWorkTypes : []);
    setSequence(existing ? existing.sequence.toString() : "");
    setUiType(existing ? existing.uiType : "");
    setSelectedMasterName(newMasterName);
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="page-wrapper">
        <DropdownWithTextBox
          allNames={masterWorkType}
          setAllNames={setMasterWorkType}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={handleMasterSelect}
          label={"Create Master Work Types: "}
        />
        <div style={{ marginTop: "20px" }}>
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
      </div>
      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <div className="page-wrapper" style={{ marginTop: "20px" }}>
        <label
          htmlFor="uiTypeSelect"
          style={{ fontWeight: "bold", display: "block", marginBottom: 15 }}
        >
          UI Type For Master Work Types
        </label>
        <TextField
          id="uiTypeSelect"
          label="Select UI Type"
          variant="outlined"
          select
          value={uiType}
          onChange={(e) => {
            const newUiType = e.target.value;
            setUiType(newUiType);
            setMasterData((prev) =>
              prev.map((entry) => ({
                ...entry,
                uiType: newUiType,
              }))
            );
          }}
          style={{
            width: "100%",
            borderRadius: "4px",
            boxSizing: "border-box",
          }}
          size="small"
        >
          {uiTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <CustomButton
        handleClick={handleSave}
        innerContent="Save"
        disabled={!uiType}
      />
    </div>
  );
};

export default FieldRow;
