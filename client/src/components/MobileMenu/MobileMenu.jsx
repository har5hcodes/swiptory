import React from "react";
import styles from "./mobileMenu.module.css";
import avatar from "../../assets/avatar.png";
import { Link } from "react-router-dom";

const MobileMenu = (props) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <>
      {props.authValidated ? (
        <div className={styles.mobileMenuSectionIn}>
          <div>
            <img className={styles.avatar} src={avatar} alt="avatar" />
            <p>{localStorage.getItem("username")}</p>
          </div>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?yourstories=true"
          >
            <button>Your Story</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?addstory=true"
          >
            <button>Add Story</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?viewbookmarks=true"
          >
            <button className={styles.bookmarkBtn}>Bookmarks</button>
          </Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className={styles.mobileMenuSectionOut}>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?register=true"
          >
            <button className={styles.registerBtn}>Register</button>
          </Link>
          <Link
            onClick={() => {
              props.toggleModal();
            }}
            to="/?signin=true"
          >
            <button className={styles.signinBtn}>Sign in</button>
          </Link>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
