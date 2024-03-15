import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import "./css/sidebar.css";
import SidebarChat from "./SidebarChat";
import { onSnapshot, collection } from "firebase/firestore";
import { auth, db } from "./firebase/FirebaseConfig";
import { useStateValue } from "./StateProvider";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const [rooms, setRooms] = useState([]);
  const [{ user }] = useStateValue();

  useEffect(() => {
    onSnapshot(collection(db, "rooms"), (doc) => {
      setRooms(
        doc.docs.map((doc) => ({
          data: doc.data(),
          id: doc.id,
        }))
      );
    });
  }, []);

  console.log("sidebar", user);

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <IconButton onClick={() => signOut(auth)}>
          {user ? (
            <img
              src={user.photoURL}
              alt="ProfimeImg"
              style={{ width: 40, borderRadius: 50 }}
            />
          ) : (
            <div>
              <Avatar />
            </div>
          )}
        </IconButton>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchIcon />
          <input type="search" placeholder="Search or start a new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
        <SidebarChat addnewchat />
        {rooms.map((room) => (
          <SidebarChat key={room?.id} id={room?.id} name={room?.data?.name} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
