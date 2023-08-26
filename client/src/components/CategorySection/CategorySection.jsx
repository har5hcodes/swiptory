import React, { useEffect, useState } from "react";
import styles from "./categorySection.module.css";
import Story from "../Story/Story";
import { useSearchParams } from "react-router-dom";

const CategorySection = (props) => {
  const [searchParams] = useSearchParams();
  const displayYourStories = searchParams.get("yourstories");
  const [isMobile, setIsMobile] = useState(false);
  const [categoryStories, setCategoryStories] = useState([]);
  const [maxStoriesInRow, setMaxStoriesInRow] = useState(4);

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
        setCategoryStories(data.posts);
      } else {
        console.error("Failed to fetch your stories");
      }
    } catch (error) {
      console.error("Error fetching your stories:", error);
    }
  };

  const fetchBookmarks = async () => {
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
        console.log(data.posts);
        setCategoryStories(data.posts);
      } else {
        console.error("Failed to fetch your stories");
      }
    } catch (error) {
      console.error("Error fetching your stories:", error);
    }
  };

  useEffect(() => {
    const fetchCategoryStories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/post/${props.category}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.posts);
          setCategoryStories(data.posts);
        } else {
          console.error("Failed to fetch category stories");
        }
      } catch (error) {
        console.error("Error fetching category stories:", error);
      }
    };

    fetchCategoryStories();

    if (props.category === "your-stories") {
      fetchYourStories();
    }

    if (props.category === "bookmarks") {
      fetchBookmarks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.category, props.selectedFilters]);

  if (categoryStories.length === 0) {
    return null;
  }
  if (isMobile && !displayYourStories && props.category === "your-stories") {
    return null;
  }

  if (categoryStories.length === 0) {
    <div>Loading</div>;
  }

  return (
    <>
      <div className={styles.categoryContainer}>
        {!isMobile && (
          <div className={styles.categoryHeader}>
            {props.category === "your-stories"
              ? "Your Stories"
              : props.category === "bookmarks"
              ? "Your Bookmarks"
              : `Top stories about ${props.category}`}
          </div>
        )}
        {isMobile && (
          <div className={styles.categoryHeader}>
            {props.category === "your-stories"
              ? "Your Stories"
              : props.category === "bookmarks"
              ? "Your Bookmarks"
              : null}
          </div>
        )}
        <div className={styles.categoryStories}>
          {categoryStories.slice(0, maxStoriesInRow).map((story, index) => (
            <Story
              key={index}
              story={story}
              authValidated={props.authValidated}
              handleStoryViewer={props.handleStoryViewer}
            />
          ))}
        </div>
        {!isMobile && maxStoriesInRow < categoryStories.length && (
          <button
            onClick={() =>
              setMaxStoriesInRow(
                maxStoriesInRow + 4 > categoryStories.length
                  ? categoryStories.length
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

export default CategorySection;
