import React, { useState } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
 
// Time format validation (24-hour HH:MM)
const isValidTime = (time) => {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};
 
const initialForm = {
  workItem: "",
  category: "",
  subCategory: "",
  time: "",
  comments: "",
};
 
const workItemCategoryMap = {
  "Non Ticket Non Delivery -Others": [
    "Non Ticket Non Delivery-Others - SME Trainer",
    "Non Ticket Non Delivery-Others - KT Giver",
    "Non Ticket Non Delivery-Others - KT Recipient",
  ],
  "Non Ticket Non Delivery -Idle": [
    "Non Ticket Non Delivery-Idle - No access available",
    "Non Ticket Non Delivery-Idle - Lack of work",
    "Non Ticket Non Delivery-Idle - Connectivity issues",
  ],
};
 
const NTND = () => {
  const [forms, setForms] = useState([
    { ...initialForm },
    { ...initialForm },
    { ...initialForm },
  ]);
 
  const [subCategoryMap, setSubCategoryMap] = useState({});
 
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedForms = [...forms];
    updatedForms[index] = {
      ...updatedForms[index],
      [name]: value,
    };
 
    if (name === "workItem") {
      updatedForms[index].category = "";
      updatedForms[index].subCategory = "";
    }
 
    if (name === "category") {
      updatedForms[index].subCategory = "";
    }
 
    setForms(updatedForms);
  };
 
  const handleAddForm = () => {
    setForms([...forms, { ...initialForm }]);
  };
 
  const handleDeleteForm = (index) => {
    if (forms.length <= 3) {
      setSnackbar({
        open: true,
        message: "Minimum of 3 entries required.",
        severity: "warning",
      });
      return;
    }
    const updatedForms = forms.filter((_, i) => i !== index);
    setForms(updatedForms);
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
 
    const validForms = forms.filter(
      (form) =>
        form.workItem &&
        form.category &&
        form.time &&
        isValidTime(form.time)
    );
 
    if (validForms.length === 0) {
      setSnackbar({
        open: true,
        message: "Please fill at least one complete entry.",
        severity: "warning",
      });
      return;
    }
 
    const parsedForms = validForms.map((form, i) => {
      const [hours, minutes] = form.time.split(":").map(Number);
      return {
        entry: i + 1,
        workItem: form.workItem,
        category: form.category,
        subCategory: form.subCategory,
        time: form.time,
        comments: form.comments,
        hours,
        minutes,
      };
    });
    console.log("Submitted JSON Data:", JSON.stringify(parsedForms, null, 2));
 
    const formattedOutput = parsedForms
      .map(
        (entry) =>
          `Entry ${entry.entry}:\n  Work Item: ${entry.workItem}\n  Category: ${entry.category}\n  Sub-Category: ${entry.subCategory || "N/A"}\n  Time: ${entry.time} (H:${entry.hours}, M:${entry.minutes})\n  Comments: ${entry.comments}`
      )
      .join("\n\n");
 
    window.alert("Submitted Data:\n\n" + formattedOutput);
 
    setSnackbar({
      open: true,
      message: "Form submitted successfully!",
      severity: "success",
    });
  };
 
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
 
  return (
    <Container maxWidth="xl">
      <Box mt={4}>
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
                {forms.length > 3 && index >= 3 && (
                  <Tooltip title="Delete Entry">
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 4, right: 4 }}
                      onClick={() => handleDeleteForm(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
 
                <Typography variant="subtitle1" mb={1}>
                  AMS Non Ticket Non Delivery - {index + 1}
                </Typography>
 
                <TextField
                  label="Non Ticket Non Delivery Work Category"
                  name="workItem"
                  fullWidth
                  margin="dense"
                  size="small"
                  select
                  value={formData.workItem}
                  onChange={(e) => handleChange(index, e)}
                >
                  <MenuItem value="">
                    <em>Select</em>
                  </MenuItem>
                  {Object.keys(workItemCategoryMap).map((workItemKey) => (
                    <MenuItem key={workItemKey} value={workItemKey}>
                      {workItemKey}
                    </MenuItem>
                  ))}
                </TextField>
 
                {formData.workItem && (
                  <>
                   <TextField
                      label="Non Ticket Delivery Work Sub-Category"
                      name="subCategory"
                      fullWidth
                      margin="dense"
                      size="small"
                      select
                      value={formData.subCategory}
                      onChange={(e) => handleChange(index, e)}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {(subCategoryMap[formData.category] || []).map(
                        (subCatOption, i) => (
                          <MenuItem key={i} value={subCatOption}>
                            {subCatOption}
                          </MenuItem>
                        )
                      )}
                    </TextField>
 
                    <TextField
                      label="Non Ticket Non Delivery Work Item"
                      name="category"
                      fullWidth
                      margin="dense"
                      size="small"
                      select
                      value={formData.category}
                      onChange={(e) => handleChange(index, e)}
                    >
                      <MenuItem value="">
                        <em>Select</em>
                      </MenuItem>
                      {workItemCategoryMap[formData.workItem]?.map(
                        (categoryOption) => (
                          <MenuItem key={categoryOption} value={categoryOption}>
                            {categoryOption}
                          </MenuItem>
                        )
                      )}
                    </TextField>
 
                   
                    <TextField
                      label="Time (HH:MM)"
                      name="time"
                      type="text"
                      placeholder="00:00"
                      size="small"
                      margin="dense"
                      fullWidth
                      value={formData.time}
                      onChange={(e) => handleChange(index, e)}
                      error={
                        formData.time !== "" && !isValidTime(formData.time)
                      }
                      helperText={
                        formData.time !== "" && !isValidTime(formData.time)
                          ? "Please enter time in HH:MM 24-hour format"
                          : ""
                      }
                    />
 
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
              Add Entry
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
          </Box>
        </form>
 
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};
 
export default NTND;
 
 