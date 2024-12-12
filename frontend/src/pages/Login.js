import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TextField, Button, Typography, Container, Paper, Link, Grid } from '@mui/material';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); 
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  //Login function
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const { username, password } = loginData;
    const user = { username, password };

    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }
    
    
    fetch("http://localhost:8080/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
    .then(response => {
      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem('username', username); 
        navigate("/home");
      } else {
        return response.text().then(text => { throw new Error(text) });
      }
    })
    .catch(error => {
      toast.error(error.message);
    });
  };

  //Register function
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const { username, password } = registerData;
    const user = { username, password };

    if (!username || !password) {
      toast.error("Please fill all fields");
      return;
    }

    fetch("http://localhost:8080/users/add", { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
    .then(response => {
      if (response.ok) {
        toast.success("New User Created!");
        setRegisterData({ username: '', password: '' }); 
        setIsLogin(true); 
      } else {
        return response.text().then(text => { throw new Error(text) });
      }
    })
    .catch(error => {
      toast.error(error.message);
    });
  };

  return (
    <Container 
      component="main" 
      maxWidth={false}  // Disable default max-width
      sx={{ 
        maxWidth: '80vw',  // Set custom max-width
        width: '80vw'
      }}
    >
      <ToastContainer />
      <Paper elevation={3} className="paper" style={{ backgroundColor: '#f9f9f9', border: '2px solid #f23f4c' }}>
        <Typography component="h1" variant="h5">
          {isLogin ? 'Log in' : 'New Account'}
        </Typography>
        <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit} className="form">
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={isLogin ? loginData.username : registerData.username}
            onChange={isLogin ? handleLoginChange : handleRegisterChange}
            style={{ backgroundColor: 'white' }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={isLogin ? loginData.password : registerData.password}
            onChange={isLogin ? handleLoginChange : handleRegisterChange}
            style={{ backgroundColor: 'white' }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="submit"
            style={{ 
              marginTop: '10px', 
              marginBottom: '10px',
              backgroundColor: '#020002' 
            }}
          >
            {isLogin ? 'Login' : 'Sign up'}
          </Button>
          <Grid container>
            <Grid item>
              <Link href="#" variant="body2" onClick={() => setIsLogin(!isLogin)}
              style={{
                color: '#3AC0AC',
              }}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
