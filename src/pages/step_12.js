import { useEffect, useState } from "react";
import CrudDropdown from "../components/Dropdown";
import { apiGet } from "../utils/api";
import CustomButton from "../components/CustomButton";
import { useSnackbar } from "../components/CustomSnackbar"; 

export default function Step_12() {
  const [categories, setCategories] = useState([]);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiGet("/timeoff");
        setCategories(data || []);
      } catch (err) {
        console.error("Error loading categories:", err);
        showSnackbar("Failed to load time-off categories.", "error");
      }
    };
    loadCategories();
  }, [showSnackbar]);

  const handleCategoriesChange = (updatedCategories) => {
    setCategories(updatedCategories);
    console.log("Categories (and their order) updated in parent:", updatedCategories);
  };


  const handleSaveAll = () => {
    console.log("Save All Changes clicked. Current categories state:", categories);
  };

  return (
    <div
      style={{
        marginTop: 20,
        border: "1px solid #7500c0",
        borderRadius: 10,
        padding: "20px",
        maxWidth: 400,
        margin: "20px auto"
      }}
    >
      <CrudDropdown
        items={categories}
        onItemsChange={handleCategoriesChange}
        label="Manage Time-Off Category"
        endpoint="/timeoff"
        displayField="name" // Field from category objects to display (e.g., 'name', 'categoryName')
        valueField="_id"    // Field for unique ID
        placeholder="Type or select a category"
      />
      <div style={{ display: "flex", marginTop: "20px", justifyContent: "flex-end" }}>
        <CustomButton 
          handleClick={handleSaveAll} 
          innerContent={"Save All Changes"} // e.g., to save order
        />
      </div>
    </div>
  );
}