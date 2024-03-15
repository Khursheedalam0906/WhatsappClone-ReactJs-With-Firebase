import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Login from "./Login";
import { useStateValue } from "./StateProvider";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/FirebaseConfig";

function App() {
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      dispatch({
        type: "SET_USER",
        user: user,
      });
    });
  }, []);
  return (
    <>
      {user ? (
        <>
          <div className="App">
            <div className="app__body">
              <BrowserRouter>
                <Sidebar />
                <Routes>
                  <Route exact path="/" element={<Chat />} />
                  <Route exact path="/room/:roomId" element={<Chat />} />
                </Routes>
              </BrowserRouter>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login />
        </>
      )}
    </>
  );
}

export default App;
