import { useState, useEffect } from "react";
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
    // Save current selection to masterData before switching
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

    // Load selected master's data
    const existing = masterData.find(
      (entry) => entry.masterWorkTypes === newMasterName
    );

    setDeliveryWorkTypes(existing?.deliveryWorkTypes || []);
    setSequence(existing?.sequence != null ? existing.sequence.toString() : "");
    setUiType(existing?.uiType || "");
    setSelectedMasterName(newMasterName);
  };

  const getMWTandDWT = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/v1/api/admin/master-work-types-with-delivery"
      );
      if (res.status === 200) {
        const data = res.data.map((item) => ({
          masterWorkTypes: item.masterWorkTypes,
          deliveryWorkTypes: item.deliveryWorkTypes.map(
            (dwt) => dwt.deliveryWorkType
          ),
          uiType: item.uiType || "",
          sequence: 0, // Assuming default sequence = 0 since it's missing
        }));

        setMasterData(data);
        setMasterWorkType(data.map((item) => item.masterWorkTypes));
      } else {
        console.error("❌ Error fetching data:", res.status);
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  useEffect(() => {
    getMWTandDWT();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <div className="page-wrapper">
        <DropdownWithTextBox
          allNames={masterWorkType}
          setAllNames={setMasterWorkType}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={handleMasterSelect}
          label={"Manage Master Work Types: "}
          onEditName={(oldName, newName) => {
            setMasterData((prev) =>
              prev.map((entry) =>
                entry.masterWorkTypes === oldName
                  ? { ...entry, masterWorkTypes: newName }
                  : entry
              )
            );

            if (selectedMasterName === oldName) {
              setSelectedMasterName(newName);
            }
          }}
        />
        <div style={{ marginTop: "20px" }}>
          <DropdownWithTextBox
            allNames={deliveryWorkTypes}
            setAllNames={setDeliveryWorkTypes}
            setUiType={setUiType}
            setSequence={setSequence}
            setSelectedName={() => {}}
            label={"Manage Delivery Work Types: "}
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
