import React, { useState } from "react";
import DropdownWithTextBox from "./DropDown.js";
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  TextField,
} from "@mui/material";
import TextBox from "../components/TextBox.jsx";

const FieldRow = () => {
  const [workCategories, setWorkCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  const [workItems, setWorkItems] = useState([]);

   const [workData, setWorkData] = useState([]);

  const [workTypeCategory, setWorkTypeCategory] = useState([
    "Non Ticket Delivery",
  ]);
  const [workCategory, setWorkCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [workItem, setWorkItem] = useState([]);
  const [uiType, setUiType] = useState("");
  const [sequence, setSequence] = useState("");
  const [subCategoryInputValue, setSubCategoryInputValue] = useState("");
  const [taskTypeData, setTaskTypeData] = useState({});
  const [selectedTaskType, setSelectedTaskType] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const handleTaskTypeChange = (newTaskType) => {
  // Save current state for previous task type
  if (selectedTaskType) {
    setTaskTypeData(prev => ({
      ...prev,
      [selectedTaskType]: {
        workData,
        workCategories,
        subCategories,
        selectedCategory,
        selectedSubCategory,
        workItems,
        subCategoryInputValue,
      }
    }));
  }

  setWorkData([]);
  setWorkCategories([]);
  setSubCategories([]);
  setSelectedCategory(null);
  setSelectedSubCategory(null);
  setWorkItems([]);
  setSubCategoryInputValue("");
  setCategoryInputValue("");

  // Load state for new task type, or defaults if not present
  const data = taskTypeData[newTaskType] || {};
  setWorkData(data.workData || []);
  setWorkCategories(data.workCategories || []);
  setSubCategories(data.subCategories || []);
  setSelectedCategory(data.selectedCategory || null);
  setSelectedSubCategory(data.selectedSubCategory || null);
  setWorkItems(data.workItems || []);
  setSubCategoryInputValue(data.subCategoryInputValue || "");
  setSelectedTaskType(newTaskType);
};

  const handleCategorySelect = (category) => {
    // Save current subCategories and workItems for the previous category
    if (selectedCategory) {
      setWorkData((prev) => {
        // Remove old entry for this category
        const filtered = prev.filter((entry) => entry.category !== selectedCategory);
        // Prepare subCategories for saving (including "__none__" if needed)
        let newSubCats = subCategories.map((sub) => {
          return {
            name: sub,
            workItems:
              workData.find(e => e.category === selectedCategory)?.subCategories?.find(s => s.name === sub)?.workItems || 
              (selectedSubCategory === sub ? workItems : [])
          };
        });
        // If no sub-category selected, save workItems under "__none__"
        if (!selectedSubCategory && workItems.length > 0) {
          // Remove any existing "__none__"
          newSubCats = newSubCats.filter(sc => sc.name !== "__none__");
          newSubCats.push({ name: "__none__", workItems });
        }
        return [
          ...filtered,
          {
            category: selectedCategory,
            subCategories: newSubCats
          }
        ];
      });
    }

    // Load subCategories for the new category if exists
    const found = workData.find((entry) => entry.category === category);
    let loadedSubCategories = found ? found.subCategories.map(s => s.name) : [];
    loadedSubCategories = loadedSubCategories.filter(name => name !== "__none__");
    setSubCategories(loadedSubCategories);

    setSelectedCategory(category);
    setSelectedSubCategory(null);

    // Restore work items for "__none__" if present
    const noneSub = found?.subCategories.find(s => s.name === "__none__");
    setWorkItems(noneSub ? noneSub.workItems : []);
    setSubCategoryInputValue("");
  };
   
    

  const handleSubCategorySelect = (subCategory) => {
    // Save current workItems for the previous subCategory (including "none")
    setWorkData((prev) =>
      prev.map((entry) =>
        entry.category === selectedCategory
          ? {
              ...entry,
              subCategories: (() => {
                // Save workItems for previous subCategory or "__none__"
                let updated = entry.subCategories.map((sub) =>
                  sub.name === (selectedSubCategory || "__none__")
                    ? { ...sub, workItems }
                    : sub
                );
                // If previous subCategory was "__none__" and doesn't exist, add it
                if (!selectedSubCategory && !entry.subCategories.find(s => s.name === "__none__") && workItems.length > 0) {
                  updated = [...updated, { name: "__none__", workItems }];
                }
                return updated;
              })(),
            }
          : entry
      )
    );

    // Load workItems for the new subCategory if exists
    const found = workData
      .find((entry) => entry.category === selectedCategory)
      ?.subCategories.find((s) => s.name === (subCategory || "__none__"));
    setWorkItems(found ? found.workItems : []);
    setSelectedSubCategory(subCategory);
  };


  const handleWorkItemsChange = (newWorkItems) => {
    setWorkItems(newWorkItems);
    if (selectedCategory) {
      setWorkData((prev) =>
        prev.map((entry) =>
          entry.category === selectedCategory
            ? {
                ...entry,
                subCategories: (() => {
                  // If no sub-category selected, use "__none__"
                  if (!selectedSubCategory) {
                    const exists = entry.subCategories.find((sub) => sub.name === "__none__");
                    if (exists) {
                      // Update workItems for "__none__"
                      return entry.subCategories.map((sub) =>
                        sub.name === "__none__" ? { ...sub, workItems: newWorkItems } : sub
                      );
                    } else {
                      // Add "__none__" sub-category
                      return [...entry.subCategories, { name: "__none__", workItems: newWorkItems }];
                    }
                  }
                  // Else, update as usual
                  return entry.subCategories.map((sub) =>
                    sub.name === selectedSubCategory
                      ? { ...sub, workItems: newWorkItems }
                      : sub
                  );
                })(),
              }
            : entry
        )
      );
    }
  };


  const handleWorkCategoriesChange = (newCategories) => {
  setWorkCategories(newCategories);
  setWorkData((prev) => {
    // Add new categories if not present
    const updated = [...prev];
    newCategories.forEach((cat) => {
      if (!updated.find((entry) => entry.category === cat)) {
        updated.push({ category: cat, subCategories: [] });
      }
    });
    // Remove categories that were deleted
    return updated.filter((entry) => newCategories.includes(entry.category));
  });
};

  // --- SUBCATEGORY LIST CHANGE ---
  const handleSubCategoriesChange = (newSubCategories) => {
  setSubCategories(newSubCategories);
  if (selectedCategory) {
    setWorkData((prev) =>
      prev.map((entry) =>
        entry.category === selectedCategory
          ? {
              ...entry,
              subCategories: newSubCategories.map((sub) => {
                // Keep existing workItems if sub-category already exists
                const existing = entry.subCategories.find((s) => s.name === sub);
                return existing || { name: sub, workItems: [] };
              }),
            }
          : entry
      )
    );
  }
};

  // For debugging: log workData on every change
  React.useEffect(() => {
    console.log("🚀 workData mapping:", workData);
  }, [workData]);


  const savedData = {
    workTypeCategory,
    selectedTaskType,
    workCategory,
    subCategory,
    workItem,
  };

  const taskTypeOptions = [
    "AM Non Ticket Delivery",
    "AD Non Ticket Delivery",
    "CM Non Ticket Delivery",
    "CBS Non Ticket Delivery",
  ];

  const handleNext = () => {
    console.log("UI Type:", savedData.uiType);
  };

  // const handleSave = () => {
  //   console.log("Data saved locally:");
  //   console.log(savedData);
  // };

  return (
    <div className="page-wrapper">
      {/* <TextBox
        inputValue={workTypeCategory}
        setInputValue={setWorkTypeCategory}
        InputLabel="WorkTypeCategory"
        InputInnerLabel="Enter WorkTypeCategory"
      /> */}
      <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
        WorkType Category
      </label>
      <TextField
                        name="workType category"
                        value="Non Ticket Delivery"
                        fullWidth
                        slotProps={{ input: { readOnly: true } }}
                        size="small"
                        
                      />

      <label style={{ display: "block", marginBottom: 8, fontWeight: "bold", marginTop: 16 }}>
        Task Type
      </label>
      <FormControl fullWidth size="small">
        <InputLabel>Select Task Type</InputLabel>
        <Select
          value={selectedTaskType}
          onChange={(e) => handleTaskTypeChange(e.target.value)}
          label="Select Task Type"
        >
          {taskTypeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box my={2}>
        <DropdownWithTextBox
          allNames={workCategories}
          setAllNames={handleWorkCategoriesChange}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={handleCategorySelect}
          label={"Create Non Ticket Delivery Work Category: "}
          inputValue={categoryInputValue}
          setInputValue={setCategoryInputValue}
          disabled={!selectedTaskType}
        />
      </Box>
      <DropdownWithTextBox
        allNames={subCategories}
        setAllNames={handleSubCategoriesChange}
        setUiType={setUiType}
        setSequence={setSequence}
        setSelectedName={handleSubCategorySelect}
        label={"Create Non Ticket Delivery Work Sub-Category: "}
        disabled={!selectedCategory}
        inputValue={subCategoryInputValue}
        setInputValue={setSubCategoryInputValue}
      />

      <Box my={2}>
        <DropdownWithTextBox
          allNames={workItems}
          setAllNames={handleWorkItemsChange}
          setUiType={setUiType}
          setSequence={setSequence}
          setSelectedName={() => {}}
          label={"Create Non Ticket Delivery Work Item: "}
          disabled={!selectedCategory}
        />
      </Box>
      <Button
        onClick={handleNext}
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
        Save
      </Button>
    </div>
  );
};

export default FieldRow;
