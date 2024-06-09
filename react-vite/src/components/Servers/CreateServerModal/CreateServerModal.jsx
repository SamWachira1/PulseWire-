import styles from "./CreateServerModal.module.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import {
  createServerThunk,
  setCurrentServerThunk,
} from "../../../redux/servers";
import { useEffect } from "react";
import { clearCurrentMessagesThunk } from "../../../redux/messages";
import { clearCurrentChannelThunk } from "../../../redux/channels";

const CreateServerModal = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [serverName, setServerName] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (errors.length) {
      setErrors(errors);
    }
  }, [errors]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (!serverName.trim().length) {
        setErrors({ error: "Server Name is required" });
      } else {
        // this will be changed when the
        // image upload feature is integrated with AWS
        const newServer = await dispatch(
          createServerThunk({
            serverName,
            ownerId: sessionUser.id,
            image_url: 'nullable.com',

          })
        );
        await dispatch(setCurrentServerThunk(newServer));
        dispatch(clearCurrentMessagesThunk());
        dispatch(clearCurrentChannelThunk());
        closeModal();
      }
    } catch (e) {
      console.log;
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.title}>Make a new server!</div>
      <div className={styles.error}>{errors.error && errors.error}</div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new server name"
          value={serverName}
          onChange={(e) => setServerName(e.target.value)}
          required
        />
        {/*
          create ServerProfileImageUpload by copy/pasting UserProfileImageUpload component
          import that component into this file and render it here

          <ServerProfileImageUpload />

        */}
        <button className={styles.create} type="submit">Create</button>
      </form>
    </main>
  );
};

export default CreateServerModal;
