import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Axios from "axios";
import { Link } from "react-router-dom";
import "./login.scss";
import { useSnackbar, enqueueSnackbar } from "notistack";
import ImageBackground from "../../assets/desk-concept-cyber-monday-min.jpg";

function Login() {
  const navigate = useNavigate();
  // const [errorMsg, setErrorMsg] = React.useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = React.useState(false);
  //const [username, setUsername] = React.useState("");
  //const [password, setPassword] = React.useState("");
  const [credentials, setCredentials] = React.useState({
    username: "",
    password: "",
  });
  //const [noCredentials, setNoCredentials] = React.useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  //console.log(credentials.username);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //if (!username && !password) {
    //setNoCredentials(false);
    //} else {

    // setCredentials((prevCredentials) => ({
    //   username: username,
    //   password: password,
    // }));
    console.log(credentials);
    try {
      setLoading(true);
      const submitCredentials = await Axios.post(
        "http://localhost:5000/api/admin",
        {
          username: credentials.username,
          password: credentials.password,
        }
      );
      enqueueSnackbar("Logged in successfuly", {
        variant: "success",
      });
      //   console.log(submitCredentials.data.token);
      localStorage.setItem("token", `Bearer ${submitCredentials.data.token}`);

      // setErrorMsg(null);

      navigate("/");
    } catch (error) {
      // console.log(error.response.data.msg);
      // setErrorMsg((prevError) => error.response.data.msg);
      // console.log(error.response.data.msg);
      // enqueueSnackbar("Failed", { variant: "error" });
      enqueueSnackbar(error.response.data.msg, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
    // finally {
    //   setNoCredentials(true);
    // }

    //   localStorage.setItem("isLoggedIn", true);
    //   return <Navigate to="/protected" />;
    // navigate("/protected"); //FUNCTIONAL COMPONENTS WE USE USENAVIGATE----------------THE Navigate HOOKS CAN BE USED DIRECTLY BY THE COMPONENT ITSELF
    //}
  };

  return (
    <div className="body-background">
      <form method="POST" className="myForm" onSubmit={handleSubmit}>
        <div
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1),rgba(0,0,0,0.2)),url(${ImageBackground}) `,
          }}
          className="left-image"
        >
          <h1>POWERED BY RAST</h1>
        </div>
        <div className="right-content">
          <div className="form-content">
            {/* <label htmlFor="username">Username:</label> */}
            <h1
              style={{
                fontFamily: "'Brush Script MT', cursive",
                fontSize: "50px",
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
                margin: "8px",
              }}
            >
              FindI
            </h1>
            <p
              style={{
                color: "gray",
                fontWeight: "bold",
                margin: "0 0 10px 0",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              Admin Panel
            </p>
            <input
              // onChange={(e) => setUsername(e.target.value)}
              onChange={handleChange}
              placeholder="E-mail address"
              type="text"
              id="username"
              name="username"
            />
            <br />
            {/* <label htmlFor="password">Password:</label> */}
            <input
              // onChange={(e) => setPassword(e.target.value)}
              onChange={handleChange}
              placeholder="Password"
              type="password"
              id="password"
              name="password"
            />

            <Link>Forgot password?</Link>

            <button className={`${loading && "loading"}`}>
              {loading ? "Please wait..." : "Sign in"}
            </button>
            {/* {!noCredentials ? <p>Please provide credentials</p> : null} */}
            {/* {errorMsg && <p>{errorMsg}</p>} */}
          </div>
        </div>
      </form>
      {/* <button onClick={() => enqueueSnackbar("Test", { variant: "sucess" })}>
        Test
      </button> */}
    </div>
  );
}

export default Login;
