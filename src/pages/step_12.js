import { useEffect, useState } from "react";
import ComboBox from "../components/Dropdown";
import { apiGet } from "../utils/api";
import CustomButton from "../components/CustomButton";

export default function Step_12() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await apiGet("/timeoff");
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    loadCategories();
  }, []);

  const handleSave =() => {
    console.log("saved!!!!")
  }

  return (
    <div
      style={{
        marginTop: 20,
        border: "1px solid #7500c0",
        borderRadius: 10,
        padding: "20px 60px",
        maxWidth: 400,
      }}
    >
      <ComboBox
        allNameObjs={categories}
        setAllNameObjs={setCategories}
        label="Create Time-Off Category"
        endpoint="/timeoff"
        disabled={false}
      />
      <div style={{ display: "flex", marginTop: "20px" }}>
        <CustomButton handleClick={handleSave} innerContent={"Save"} />
      </div>
    </div>
  );
}
