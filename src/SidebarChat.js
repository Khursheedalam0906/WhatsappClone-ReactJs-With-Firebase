import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./css/sidebarChat.css";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import { Link } from "react-router-dom";

const SidebarChat = ({ addnewchat, id, name }) => {
  const [lastmessage, setLastMessage] = useState("");
  //
  const createChat = () => {
    const room = prompt("Please enter room name");
    if (room) {
      addDoc(collection(db, "rooms"), {
        name: room,
      });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "rooms", `${id}`, "message"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(q, (doc) => {
      setLastMessage(doc.docs.map((doc) => doc.data()));
    });
  }, []);

  console.log("ltm", lastmessage);

  return (
    <>
      {addnewchat ? (
        <div className="sidebar__chat" onClick={createChat}>
          <h2>Add New Chat</h2>
        </div>
      ) : (
        <div className="chat__section">
          <Link to={`/room/${id}`}>
            <div className="sidebar__chat">
              <Avatar src={`https://api.dicebear.com/7.x/pixel-art/svg`} />
              <div className="sidebar__chatInfo">
                <h4>{name}</h4>
                <p>{lastmessage[0]?.message}</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </>
  );
};

export default SidebarChat;
