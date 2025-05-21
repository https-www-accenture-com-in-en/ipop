import { Box, Button } from "@mui/material";
import EstimationTable from "./EstimationTable";
import TextBox from "./TextBox";
import { useState } from "react";
import CustomButton from "./CustomButton";

const VModelTable = () => {
  const [estimation, setEstimation] = useState("");
  const [dataMigration, setDataMigration] = useState("");
  const [estimationRows, setEstimationRows] = useState([
    {
      projectTask: "Analysis and Design",
      distribution: 15,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Build and UnitTesting",
      distribution: 42,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Integration Testing",
      distribution: 10,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "User Acceptance Testing",
      distribution: 10,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Cut Over",
      distribution: 5,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Go Live Support",
      distribution: 5,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Transport Management",
      distribution: 5,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "NRT",
      distribution: 3,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "PMO Efforts",
      distribution: 5,
      estimatedEffort: 0,
      burntEffort: 0,
    },
  ]);
  const [dataMigrationRows, setDataMigrationRows] = useState([
    {
      projectTask: "Data Load",
      distribution: 35,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Data Extraction",
      distribution: 30,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Data Transformation",
      distribution: 15,
      estimatedEffort: 0,
      burntEffort: 0,
    },
    {
      projectTask: "Dry Run",
      distribution: 20,
      estimatedEffort: 0,
      burntEffort: 0,
    },
  ]);
  const handleEstimatePopulation = () => {
    const updatedRows = estimationRows.map((row) => ({
      ...row,
      estimatedEffort: (
        (parseFloat(row.distribution) / 100) *
        parseFloat(estimation)
      ).toFixed(1),
    }));
    setEstimationRows(updatedRows);
    const updatedDataMigrationRows = dataMigrationRows.map((row) => ({
      ...row,
      estimatedEffort: (
        (parseFloat(row.distribution) / 100) *
        parseFloat(dataMigration)
      ).toFixed(1),
    }));
    setDataMigrationRows(updatedDataMigrationRows);
  };

  return (
    <div>
      <div
        style={{
          border: "1px solid #7500c0",
          borderRadius: "10px",
          paddingTop: "20px",
          paddingLeft: "60px",
          paddingRight: "60px",
          paddingBottom: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <Box my={2} sx={{ width: 300 }}>
          <TextBox
            inputValue={estimation}
            setInputValue={setEstimation}
            InputLabel="Enter Estimation (Person Days)"
            InputInnerLabel="Enter Days"
          />
          <TextBox
            inputValue={dataMigration}
            setInputValue={setDataMigration}
            InputLabel="Data Migration (ETL) (Person Days)"
            InputInnerLabel="Enter Days"
          />
          <CustomButton
            handleClick={handleEstimatePopulation}
            innerContent={"Save"}
          />
        </Box>
      </div>

      <EstimationTable rows={estimationRows} setRows={setEstimationRows} />
      <Box mt={6} mb={2}>
        <EstimationTable
          rows={dataMigrationRows}
          setRows={setDataMigrationRows}
        />
      </Box>
    </div>
  );
};

export default VModelTable;
