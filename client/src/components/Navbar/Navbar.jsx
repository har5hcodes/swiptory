import React, { useState, useEffect } from "react";
import MobileMenu from "../MobileMenu/MobileMenu";
import hamburger from "../../assets/hamburger.png";
import cross from "../../assets/cross.png";
import styles from "./navbar.module.css";
import NavItemsIn from "./NavItemsIn";
import NavItemsOut from "./NavItemsOut";
import { useNavigate } from "react-router-dom";

const Navbar = (props) => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={styles.navbarWrapper}>
      <div
        className={`${styles.navbarContainer} ${
          showModal ? styles.noBoxShadow : styles.boxShadow
        }`}
      >
        <div onClick={() => navigate("/")} className={styles.logo}>
          SwipTory
        </div>
        <div className={styles.btnContainer}>
          {!isMobile ? (
            <>
              {props.authValidated ? (
                <NavItemsIn showModal={showModal} />
              ) : (
                <NavItemsOut />
              )}
            </>
          ) : (
            <>
              <img
                onClick={toggleModal}
                className={`${styles.toggleIcon} ${
                  showModal ? styles.cross : styles.hamburger
                }`}
                src={showModal ? cross : hamburger}
                alt={showModal ? "cross" : "hamburger"}
              />
            </>
          )}
        </div>
      </div>

      {showModal && isMobile && (
        <MobileMenu
          authValidated={props.authValidated}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

export default Navbar;
