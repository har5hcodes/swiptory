import React from "react";
import { Link } from "react-router-dom";
import styles from "./navbar.module.css";

const NavItemsOut = () => {
  return (
    <>
      <Link to="/?register=true">
        <button className={styles.registerBtn}>Register</button>
      </Link>
      <Link to="/?signin=true">
        <button className={styles.signinBtn}>Sign in</button>
      </Link>
    </>
  );
};

export default NavItemsOut;
