import React, { useEffect, useState } from "react";
import styles from "./bookmarks.module.css";
import Story from "../Story/Story";

const Bookmarks = (props) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [maxStoriesInRow, setMaxStoriesInRow] = useState(4);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/bookmarks`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      } else {
        console.error("Failed to fetch your stories");
      }
    } catch (error) {
      console.error("Error fetching your stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (isLoading) {
    return (
      <>
        <div className={styles.categoryContainer}>
          <div
            style={{
              textAlign: "center",
            }}
            className={styles.categoryHeader}
          >
            Loading...
          </div>
        </div>
      </>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <>
        <div className={styles.categoryContainer}>
          <div
            style={{
              textAlign: "center",
            }}
            className={styles.categoryHeader}
          >
            You have no bookmarks.
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.categoryContainer}>
        {<div className={styles.categoryHeader}>Your Bookmarks</div>}
        <div className={styles.categoryStories}>
          {bookmarks.slice(0, maxStoriesInRow).map((story, index) => (
            <Story
              key={index}
              story={story}
              authValidated={props.authValidated}
              handleStoryViewer={props.handleStoryViewer}
            />
          ))}
        </div>
        {!isMobile && maxStoriesInRow < bookmarks.length && (
          <button
            onClick={() =>
              setMaxStoriesInRow(
                maxStoriesInRow + 4 > bookmarks.length
                  ? bookmarks.length
                  : maxStoriesInRow + 4
              )
            }
            className={styles.seemoreBtn}
          >
            See more
          </button>
        )}
      </div>
    </>
  );
};

export default Bookmarks;
