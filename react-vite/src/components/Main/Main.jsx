import styles from "./Main.module.css";
import { socket } from "../../socket";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../Auth/LoginFormModal";
import SignupFormModal from "../Auth/SignupFormModal";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { initialLoadThunk } from "../../redux/servers";
import ServersList from "../Servers/Servers";
import ChannelsList from "../Channels/";
import MessagesList from "../Messages/";
import { getAllMessagesThunk } from "../../redux/messages";

function MainComponent() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const messages = useSelector((state) => state.messages);
  const [curRoom, setCurRoom] = useState(1);
  const [prevRoom, setPrevRoom] = useState(1);

  useEffect(() => {
    if (user) {
      socket.connect();
      socket.on("message", (message) => {
        dispatch(getAllMessagesThunk(message.message["channel_id"]));
      });
      dispatch(initialLoadThunk());
    }
    return () => socket.disconnect();
  }, [user]);


  return (
    <>
      {user ? (
        <>
          <main className={styles.page}>
            <ServersList
              curRoom={curRoom}
              setCurRoom={setCurRoom}
              setPrevRoom={setPrevRoom}
            />
            <ChannelsList
              curRoom={curRoom}
              setCurRoom={setCurRoom}
              setPrevRoom={setPrevRoom}
            />
            <MessagesList curRoom={curRoom} prevRoom={prevRoom} />
          </main>
        </>
      ) : (
        <main className={styles.greeting}>
          <div className={styles.login_signup}>
            <div className={styles.title}>Welcome to HyperComm!</div>
            <div className={styles.buttons}>
              <OpenModalButton
                buttonText="Log In"
                className={styles.login}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalButton
                buttonText="Sign Up"
                className={styles.signup}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        </main>
      )}
    </>
  );
}

export default MainComponent;
