import React from "react";
import "./css/Login.css";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase/FirebaseConfig";
import { useStateValue } from "./StateProvider";

const Login = () => {
  const [dispatch] = useStateValue();
  const provider = new GoogleAuthProvider();

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        dispatch({ type: "SET_USER", user: result.user });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <div className="login__wrapper">
      <div className="login">
        <img
          src="https://pngmind.com/wp-content/uploads/2019/08/Whatsapp-Logo-Png-Transparent-Background.png"
          style={{ width: 75 }}
          alt="whatsapplogo"
        />
        <h2>SignIn WhatsApp</h2>
        <button onClick={loginWithGoogle}>Login With Gmail</button>
      </div>
    </div>
  );
};

export default Login;
