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
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Tb from "./tb";

// L1 -> L2 mapping
const workTypeCategoryMap = {
  "Application Maintainance": [
    "Correction", "Assistance", "PMON", "RITM", "Habilitation",
    "Incidents", "Scoping", "Study", "Prototyping"
  ],
  "Application Development": [
    "Category-1", "Category-2", "Category-3",
    "Category-4", "Category-5", "Category-6"
  ]
};

const deliveryWorkTypes = Object.keys(workTypeCategoryMap);

export default function Step_4() {
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [mappings, setMappings] = useState([]);

  const handleAddMapping = () => {
    if (ticketType && selectedDelivery && selectedCategory) {
      setMappings([
        ...mappings,
        {
          ticketType,
          deliveryWorkType: selectedDelivery,
          workTypeCategory: selectedCategory
        }
      ]);
      setTicketType("");
    }
  };

  const handleDelete = (index) => {
    const updated = [...mappings];
    updated.splice(index, 1);
    setMappings(updated);
  };

  const handleSave = () => {
    console.log("Final Mappings", mappings);
  };

  const handleDeliveryChange = (e) => {
    const value = e.target.value;
    setSelectedDelivery(value);
    setSelectedCategory(""); // Reset category when delivery changes
  };

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>
        Ticket Type Mapping
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Delivery Work Type</InputLabel>
        <Select
          value={selectedDelivery}
          onChange={handleDeliveryChange}
          label="Delivery Work Type"
        >
          {deliveryWorkTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal" disabled={!selectedDelivery}>
        <InputLabel>Work Type Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          label="Work Type Category"
        >
          {(workTypeCategoryMap[selectedDelivery] || []).map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Tb />

      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <TextField
          label="Create Ticket Preference Number"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddMapping}>
          Map
        </Button>
      </Box>

      <List sx={{ mt: 3 }}>
        {mappings.map((map, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(index)}>
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={map.ticketType}
              secondary={`Category: ${map.workTypeCategory}, Delivery: ${map.deliveryWorkType}`}
            />
          </ListItem>
        ))}
      </List>

      <Button variant="contained" color="success" sx={{ mt: 3 }} onClick={handleSave}>
        Save
      </Button>
    </Box>
  );
}
