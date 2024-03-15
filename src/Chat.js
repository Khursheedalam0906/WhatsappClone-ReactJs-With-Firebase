import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SearchIcon from "@material-ui/icons/Search";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./css/chat.css";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase/FirebaseConfig";
import { useStateValue } from "./StateProvider";

const Chat = () => {
  const [roomName, setRoomName] = useState("");
  const [textMsg, setTextMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const [{ user }, dispatch] = useStateValue();
  const { roomId } = useParams();

  // console.log(roomId);

  useEffect(() => {
    if (roomId) {
      const getData = async () => {
        const docRef = doc(db, "rooms", roomId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRoomName(docSnap.data().name);
        } else {
          console.log("No such document!");
        }
      };
      getData();

      const getMessageData = async () => {
        const q = query(
          collection(db, "rooms", roomId, "message"),
          orderBy("timestamp", "asc")
        );
        onSnapshot(q, (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ data: doc.data(), id: doc.id }))
          );
        });
      };
      getMessageData();
    }
  }, [roomId]);

  //console.log(roomName);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (textMsg) {
      const messagesRef = collection(db, "rooms", roomId, "message");
      addDoc(messagesRef, {
        name: user.displayName,
        message: textMsg,
        timestamp: serverTimestamp(),
      })
        .then((response) => {
          setTextMsg("");
        })
        .catch((error) => {
          console.log(error.message);
        });
    } else {
      alert("please enter your message");
    }
    // Add a new document with a generated id
  };

  console.log("messages", messages);

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen 12:44 PM
            {/* {new Date(
              (messages.length - 1)?.timestamp?.seconds * 1000
            ).toLocaleTimeString()} */}
          </p>
        </div>
        <div className="header__right">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
        {messages?.map((message) => {
          return (
            <div key={message.id}>
              <p
                className={`chat__message ${
                  user.displayName == message?.data?.name && "chat__recever"
                }`}
              >
                <span className="chat__name" style={{ width: 200 }}>
                  {message?.data?.name}
                </span>
                {message?.data?.message}
                <span className="chat__time">
                  {new Date(
                    message?.data?.timestamp?.seconds * 1000
                  ).toLocaleTimeString()}
                </span>
              </p>
            </div>
          );
        })}
      </div>
      <div className="chat__footer">
        <EmojiEmotionsIcon />
        <AttachFileIcon />
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={textMsg}
            placeholder="Type your message"
            onChange={(e) => setTextMsg(e.target.value)}
          />
          <input type="submit" />
        </form>
        <MicIcon />
      </div>
    </div>
  );
};

export default Chat;
