import React from "react";
import { Link } from "react-router-dom";
import styles from "./modalContainer.module.css";
import modalCloseIcon from "../../assets/modalCloseIcon.jpg";

const ModalContainer = (props) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalContent}>{props.children}</div>
        <Link to="/">
          <img
            className={styles.modalCloseIcon}
            src={modalCloseIcon}
            alt="modal-close-icon"
          />
        </Link>
      </div>
    </div>
  );
};

export default ModalContainer;
