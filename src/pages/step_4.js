import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DropdownWithTextBox from "./DropDown.js";
import CustomButton from "../components/CustomButton.jsx";

// Hardcoded list of Ticket Types
const hardcodedTicketTypes = [
  "Assistance",
  "Correction",
  "PMON",
  "Habilitation",
  "Evolution",
  "RITM",
];

const workTypeCategoryMap = {
  "Application Maintainance": [
    "Correction",
    "Assistance",
    "PMON",
    "RITM",
    "Habilitation",
    "Incidents",
    "Scoping",
    "Study",
    "Prototyping",
  ],
  "Application Development": [
    "Category-1",
    "Category-2",
    "Category-3",
    "Category-4",
    "Category-5",
    "Category-6",
  ],
};

const deliveryWorkTypes = Object.keys(workTypeCategoryMap);

export default function Step_4() {
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [selectedName, setSelectedName] = useState(null);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");

  const [allNames, setAllNames] = useState([
    "Ticket Number",
    "Ticket description",
    "Ticket Priority",
  ]);
  const [implicitAttr, setImplicitAttr] = useState([
    "Estimated Effort",
    "Burnt Effort",
    "Remaining Effort",
    "Effort To Be Clocked",
    "Additional Effort To Be Clocked",
  ]);
<<<<<<< Updated upstream
=======

  const fetchTicketMetadata = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/v1/api/admin/ticket-metadata"
      );
      const data = await response.json();
      const allObject = data.find(
        (item) => item.ticketType === selectedTicketType
      );
      if (allObject !== undefined) {
        setAllNames(allObject.explicitAttributes.map((attr) => attr.name));
        setImplicitAttr(allObject.implicitAttributes.map((attr) => attr.name));
      } else {
        if (selectedTicketType !== "") {
          setAllNames([
            "Ticket Number",
            "Ticket description",
            "Ticket Priority",
          ]);
          setImplicitAttr([
            "Estimated Effort",
            "Burnt Effort",
            "Remaining Effort",
            "Effort To Be Clocked",
            "Additional Effort To Be Clocked",
          ]);
        }
      }
    } catch (err) {
      console.error("Error fetching ticket metadata:", err);
    }
  };

  useEffect(() => {
    fetchTicketMetadata();
  }, [selectedTicketType]);

>>>>>>> Stashed changes
  const [mappings, setMappings] = useState([]);

  const handleAddMapping = () => {
    if (
      selectedTicketType &&
      ticketNumber &&
      selectedDelivery &&
      selectedCategory
    ) {
      setMappings([
        ...mappings,
        {
          ticketType: selectedTicketType,
          ticketNumber,
          deliveryWorkType: selectedDelivery,
          workTypeCategory: selectedCategory,
        },
      ]);
      setTicketNumber("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...mappings];
    updated.splice(index, 1);
    setMappings(updated);
  };

  const handleSave = async () => {
    const ticketData = {
      ticketType: selectedTicketType,
      explicitAttributes: allNames.map((name) => ({ name })),
      implicitAttributes: implicitAttr.map((name) => ({ name })),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/v1/api/admin/ticket-metadata",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ticketData),
        }
      );

      if (response.ok) {
        alert("Ticket metadata saved successfully!");
      } else {
        console.error("Error saving metadata");
      }
    } catch (err) {
      console.error("Request failed:", err);
    }
  };

  return (
    <div className="page-wrapper">
      {/* <Typography
        variant="h5"
        gutterBottom
        sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflowWrap: "break-word",
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        Define Meta Data (Ticket Attributes)
      </Typography> */}

      <Box my={2}>
        <label
          htmlFor="nameInput"
          style={{ display: "block", fontWeight: "bold", marginBottom: 8 }}
        >
          Ticket Type
        </label>
        <FormControl fullWidth size="small">
          <InputLabel>Select Ticket Type</InputLabel>
          <Select
            value={selectedTicketType}
            onChange={(e) => setSelectedTicketType(e.target.value)}
            label="Select Ticket Type"
          >
            {hardcodedTicketTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box>
        <DropdownWithTextBox
          allNames={allNames}
          setAllNames={setAllNames}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={setSelectedName}
          label={"Define Explicit Attributes"}
        />
      </Box>
      <Box my={2}>
        <DropdownWithTextBox
          allNames={implicitAttr}
          setAllNames={setImplicitAttr}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={() => {}}
          label={"Define Implicit Attributes"}
          disabled={!setSelectedName}
        />
      </Box>

      <CustomButton handleClick={handleSave} innerContent={"Save"} />
    </div>
  );
}
