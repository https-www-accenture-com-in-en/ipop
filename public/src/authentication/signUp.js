import React from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik"; // Import Formik
import * as Yup from "yup"; // Import Yup for validation
 
const SignUp = () => {
  const navigate = useNavigate();
 
  // Define Yup validation schema
  const validationSchema = Yup.object({
    enterpriseId: Yup.string()
      .matches(/^[A-Za-z.]+$/, "Enterprise ID must contain only letters and dots (.)")
      .test('includes-dot', 'Enterprise ID must contain at least one dot', (value) => value && value.includes('.'))
      .required('Enterprise ID is required'),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(/[a-z]/, "Password must contain a lowercase letter")
      .matches(/[A-Z]/, "Password must contain an uppercase letter")
      .matches(/\d/, "Password must contain a number")
      .matches(/[!@#$%^&*]/, "Password must contain a special character")
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required('Confirm your password'),
  });
 
  // Formik handling
  const formik = useFormik({
    initialValues: {
      enterpriseId: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Capture enterpriseId and password
      const { enterpriseId, password } = values;
 
      // Create a JSON object with enterpriseId and password
      const signUpData = {
        enterpriseId: enterpriseId,
        password: password,
      };
 
      // Log the JSON object to the console
      console.log("Signing up with:", JSON.stringify(signUpData, null, 2));
 
      // Store the sign-up data in localStorage (optional)
      // localStorage.setItem('signUpData', JSON.stringify(signUpData));
 
      // Navigate to Login page after submission
      navigate("/clockView");
    },
  });
 
  return (
    <Container maxWidth="xs">
      <Box mt={5} sx={{ backgroundColor: "#f8f8f8", padding: "2rem", borderRadius: "12px", boxShadow: 3 }}>
        <Typography variant="h4" align="center" sx={{ color: "#1976d2", marginBottom: "1rem" }}>
          Sign Up
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            label="Enterprise ID"
            variant="outlined"
            fullWidth
            value={formik.values.enterpriseId} // Bind to Formik value
            onChange={formik.handleChange} // Handle change with Formik's handleChange
            onBlur={formik.handleBlur} // Handle blur with Formik's handleBlur
            name="enterpriseId" // Name attribute is required for Formik to identify the field
            margin="normal"
            error={formik.touched.enterpriseId && Boolean(formik.errors.enterpriseId)} // Show error when touched
            helperText={formik.touched.enterpriseId && formik.errors.enterpriseId} // Show error message
            sx={{
              borderRadius: "8px",
              '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: '8px' } },
              '&:hover .MuiOutlinedInput-root': { borderColor: '#1976d2' }
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.password} // Bind to Formik value
            onChange={formik.handleChange} // Handle change with Formik's handleChange
            onBlur={formik.handleBlur} // Handle blur with Formik's handleBlur
            name="password" // Name attribute is required for Formik to identify the field
            margin="normal"
            error={formik.touched.password && Boolean(formik.errors.password)} // Show error when touched
            helperText={formik.touched.password && formik.errors.password} // Show error message
            sx={{
              borderRadius: "8px",
              '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: '8px' } },
              '&:hover .MuiOutlinedInput-root': { borderColor: '#1976d2' }
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            value={formik.values.confirmPassword} // Bind to Formik value
            onChange={formik.handleChange} // Handle change with Formik's handleChange
            onBlur={formik.handleBlur} // Handle blur with Formik's handleBlur
            name="confirmPassword" // Name attribute is required for Formik to identify the field
            margin="normal"
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)} // Show error when touched
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword} // Show error message
            sx={{
              borderRadius: "8px",
              '& .MuiOutlinedInput-root': { '& fieldset': { borderRadius: '8px' } },
              '&:hover .MuiOutlinedInput-root': { borderColor: '#1976d2' }
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              mt: 2,
              padding: "10px",
              borderRadius: "8px",
              '&:hover': { backgroundColor: "#1565c0" }
            }}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};
 
export default SignUp;
 
 