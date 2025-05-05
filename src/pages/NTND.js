import React, { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
 
const initialForm = {
  workItem: "",
  category: "",
  hours: 0,
  minutes: 0,
  comments: "",
};
 
const NTNDPage = () => {
  const [forms, setForms] = useState([
    { ...initialForm },
    { ...initialForm },
    { ...initialForm },
  ]);
 
  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      [name]: type === "checkbox" ? checked : value,
    };
    setForms(updatedForms);
  };
 
  const handleAddForm = () => {
    setForms([...forms, { ...initialForm }]);
  };
 
  const handleDeleteForm = (index) => {
    if (forms.length <= 3) return; // prevent deleting if only 3 or fewer
    const updatedForms = forms.filter((_, i) => i !== index);
    setForms(updatedForms);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", forms);
  };
 
  return (
    <Container maxWidth="xl">
      <Box mt={4}>
        {/* <Typography variant="h5" align="center" gutterBottom>
          NTND
        </Typography> */}
 
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              overflowX: "auto",
              gap: 2,
              py: 2,
              px: 1,
              mb: 2,
            }}
          >
            {forms.map((formData, index) => (
              <Box
                key={index}
                minWidth={260}
                maxWidth={300}
                flexShrink={0}
                p={1.5}
                sx={{
                  background: "#f9f9f9",
                  borderRadius: 2,
                  boxShadow: 1,
                  position: "relative",
                }}
              >
                <Tooltip
                  title={
                    forms.length <= 3
                      ? "Minimum of 3 entries required"
                      : "Delete Entry"
                  }
                >
                  <span>
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 4, right: 4 }}
                      onClick={() => handleDeleteForm(index)}
                      disabled={forms.length <= 3}
                    >
                      {/* <DeleteIcon fontSize="small" /> */}
                    </IconButton>
                  </span>
                </Tooltip>
 
                {/* <Typography variant="subtitle1" mb={1}>
                  NTND -{index + 1}
                </Typography> */}
 
                <TextField
                  label="Work Item"
                  name="workItem"
                  fullWidth
                  margin="dense"
                  size="small"
                  select
                  value={formData.workItem}
                  onChange={(e) => handleChange(index, e)}
                >
                   
                  <MenuItem value="Non Ticket Non Delivery -Others - SME Trainer">
                    Non Ticket Non Delivery -Others - SME Trainer
                  </MenuItem>
                  <MenuItem value="Non Ticket Non Delivery -Others - KT Giver">
                    Non Ticket Non Delivery -Others - KT Giver
                  </MenuItem>
                  <MenuItem value="Non Ticket Non Delivery -Others - KT Recipient">
                    Non Ticket Non Delivery -Others - KT Recipient
                  </MenuItem>
                  <MenuItem value="Non Ticket Non Delivery -Idle - No access available">
                    Non Ticket Non Delivery -Idle - No access available
                  </MenuItem>
                  <MenuItem value="Non Ticket Non Delivery -Idle - Lack of work">
                    Non Ticket Non Delivery -Idle - Lack of work
                  </MenuItem>
                  <MenuItem value="Non Ticket Non Delivery -Idle - Connectivity issues">
                    Non Ticket Non Delivery -Idle - Connectivity issues
                  </MenuItem>
                </TextField>
 
                {formData.workItem && (
                  <>
                    <Grid container spacing={1} mt={0.5}>
                      <Grid item xs={6}>
                        <TextField
                          label="Hours"
                          name="hours"
                          type="number"
                          size="small"
                          margin="dense"
                          fullWidth
                          value={formData.hours}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          label="Minutes"
                          name="minutes"
                          type="number"
                          size="small"
                          margin="dense"
                          fullWidth
                          value={formData.minutes}
                          onChange={(e) => handleChange(index, e)}
                        />
                      </Grid>
                    </Grid>
 
                    <TextField
                      label="Comments"
                      name="comments"
                      fullWidth
                      multiline
                      rows={2}
                      margin="dense"
                      size="small"
                      value={formData.comments}
                      onChange={(e) => handleChange(index, e)}
                    />
                  </>
                )}
              </Box>
            ))}
          </Box>
 
          <Box mt={1}>
            <Button variant="outlined" onClick={handleAddForm} sx={{ mr: 1 }}>
              + Add Entry
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};
 
export default  NTNDPage;
 
 