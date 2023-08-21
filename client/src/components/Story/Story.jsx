import React from "react";
import styles from "./story.module.css";
import editIcon from "../../assets/editIcon.png";
import { Link } from "react-router-dom";

const Story = (props) => {
  if (props.story.slides.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div
        onClick={() => {
          props.handleStoryViewer(props.story.slides);
        }}
        className={styles.categoryStory}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0 ), rgba(0, 0, 0,  0.9)), url(${props.story.slides[0].imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={styles.categoryStoryHeader}>
          {props.story.slides[0].header}
        </div>
        <div className={styles.categoryStoryDescription}>
          {props.story.slides[0].description}
        </div>
      </div>

      {/* show edit btn only for the posts created by the user */}
      {props.story.postedBy === localStorage.getItem("userId") && (
        <button className={styles.editBtn}>
          <Link
            to={`?editstory=true&id=${props.story._id}`}
            style={{
              textDecoration: "none",
              color: "black",
            }}
          >
            <div className={styles.editBtnContainer}>
              <img src={editIcon} alt="edit-icon" />

              <p> Edit</p>
            </div>
          </Link>
        </button>
      )}
    </div>
  );
};

export default Story;
