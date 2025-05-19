import { Box, Button } from "@mui/material";
import EstimationTable from "./EstimationTable";
import TextBox from "./TextBox";

const VModelTable = () => {
  const validate = () => {
    console.log("Validation logic goes here");
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
            InputLabel="Enter Estimation (Person Days)"
            InputInnerLabel="Enter Days"
          />
          <TextBox
            InputLabel="Data Migration (ETL) (Person Days)"
            InputInnerLabel="Enter Days"
          />
        </Box>
      </div>

      <EstimationTable
        initialRows={[
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
        ]}
      />
      <Box my={2}>
        <EstimationTable
          initialRows={[
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
          ]}
        />
      </Box>
      {/* <Button
        onClick={validate}
        variant="contained"
        sx={{
          mt: 2,
          px: 2,
          py: 1,
          fontSize: "14px",
          fontWeight: "bold",
          borderRadius: "6px",
          backgroundColor: "#eb7476",
          color: "white",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#f38b8d",
          },
        }}
      >
        Validate
      </Button> */}
    </div>
  );
};

export default VModelTable;
