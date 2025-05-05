import React from 'react';
import { Container, Box, Typography, TextField, Button, Link } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
 
const users = [
  { eid: 'john.doe', password: 'password123' },
  { eid: 'jane.smith', password: 'mypassword' },
  { eid: 'enterprise.user', password: 'securepass' },
];
 
function LoginPage() {
  const navigate = useNavigate();
 
  const formik = useFormik({
    initialValues: {
      eid: '',
      password: '',
    },
    validationSchema: Yup.object({
      eid: Yup.string()
        .matches(/^[a-zA-Z.]+$/, 'Enterprise ID must contain only letters and dots.')
        .required('Enterprise ID is required.'),
      password: Yup.string()
        .required('Password is required.'),
    }),
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      const user = users.find(
        (u) => u.eid === values.eid && u.password === values.password
      );
 
      if (user) {
        navigate('/success', { state: { eid: user.eid } });
      } else {
        setFieldError('password', 'Invalid EID or Password.');
      }
 
      setSubmitting(false);
    },
  });
 
  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>Login</Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: '100%' }}
          noValidate
        >
          <TextField
            fullWidth
            margin="normal"
            label="Enterprise ID"
            name="eid"
            value={formik.values.eid}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.eid && Boolean(formik.errors.eid)}
            helperText={formik.touched.eid && formik.errors.eid}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
 
export default LoginPage;
 
 