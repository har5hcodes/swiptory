import React, { useEffect, useState } from "react";
import styles from "./yourStories.module.css";
import Story from "../Story/Story";
import { Link } from "react-router-dom";

const YourStories = (props) => {
  const [yourStories, setYourStories] = useState([]);
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

  const fetchYourStories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ filters: props.selectedFilters }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data.posts);
        setYourStories(data.posts);
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
    fetchYourStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.selectedFilters]);

  if (isMobile && isLoading) {
    return (
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
    );
  }

  if (isMobile && yourStories.length === 0) {
    return (
      <div className={styles.categoryContainer}>
        <div
          style={{
            textAlign: "center",
          }}
          className={styles.categoryHeader}
        >
          You have no stories. Create one now!
        </div>
        <Link to="/?addstory=true">
          <button className={styles.addStoryBtn}>Add Story</button>
        </Link>
      </div>
    );
  }

  if (yourStories.length === 0) return null;

  return (
    <>
      <div className={styles.categoryContainer}>
        {<div className={styles.categoryHeader}>Your Stories</div>}
        <div className={styles.categoryStories}>
          {yourStories.slice(0, maxStoriesInRow).map((story, index) => (
            <Story
              key={index}
              story={story}
              authValidated={props.authValidated}
              handleStoryViewer={props.handleStoryViewer}
            />
          ))}
        </div>
        {!isMobile && maxStoriesInRow < yourStories.length && (
          <button
            onClick={() =>
              setMaxStoriesInRow(
                maxStoriesInRow + 4 > yourStories.length
                  ? yourStories.length
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

export default YourStories;
