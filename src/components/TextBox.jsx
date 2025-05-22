import { Box, TextField } from "@mui/material";

const TextBox = ({
  inputValue,
  setInputValue,
  InputLabel,
  InputInnerLabel,
}) => {
  return (
    <Box my={2}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: 8 }}>
        {InputLabel}
      </label>
      <TextField
        label={InputInnerLabel}
        variant="outlined"
        size="small"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        fullWidth
        style={{
          fontWeight: "bold",
          display: "block",
        }}
      />
    </Box>
  );
};

export default TextBox;
