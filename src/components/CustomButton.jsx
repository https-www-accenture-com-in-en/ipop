const CustomButton = ({ handleClick, innerContent }) => {
  return (
    <Button
      onClick={handleClick}
      variant="contained"
      sx={{
        mt: 1,
        px: 0.5,
        py: 0.5,
        fontSize: "10px",
        fontWeight: "bold",
        borderRadius: "6px",
        backgroundColor: "#7500c0",
        color: "white",
        textTransform: "none",
        "&:hover": {
          backgroundColor: "#7500c0",
          transform: "scale(1.05)",
        },
      }}
    >
      {innerContent}
    </Button>
  );
};

export default CustomButton;
