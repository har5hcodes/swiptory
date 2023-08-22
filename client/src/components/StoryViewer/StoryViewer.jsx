import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./storyViewer.module.css";
import crossIcon from "../../assets/crossIcon.png";
import shareIcon from "../../assets/shareIcon.png";
import bookmarkIcon from "../../assets/bookmarkIcon.png";
import blueBookmarkIcon from "../../assets/blueBookmarkIcon.png";
import likeIcon from "../../assets/likeIcon.png";
import redLikeIcon from "../../assets/redLikeIcon.png";
import leftArrow from "../../assets/leftArrow.png";
import rightArrow from "../../assets/rightArrow.png";

const StoryViewer = (props) => {
  const navigate = useNavigate();
  const slideDuration = 2000;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const slides = props.slides;

  const [bookmarkStatus, setBookmarkStatus] = useState(
    slides.map(() => {
      return false;
    })
  );

  const [linkCopiedStatus, setLinkCopiedStatus] = useState(
    slides.map(() => {
      return false;
    })
  );

  useEffect(() => {
    const fetchBookmarkStatus = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/user/isBookmarked/${slides[currentSlideIndex]._id}`,
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
          const newBookmarkStatus = [...bookmarkStatus];

          newBookmarkStatus[currentSlideIndex] = data.isBookmarked;
          setBookmarkStatus(newBookmarkStatus);
        } else {
          console.error("Bookmark status fetch failed");
        }
      } catch (error) {
        console.error("Error while fetching bookmark status:", error);
      }
    };

    fetchBookmarkStatus();
  }, [currentSlideIndex, bookmarkStatus, slides]);

  const [likeCount, setLikeCount] = useState(
    slides.map((slide) => slide.likes.length)
  );
  const [likeStatus, setLikeStatus] = useState(
    slides.map((slide) => slide.likes.includes(localStorage.getItem("userId")))
  );

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNextSlide();
    }, slideDuration);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSlideIndex]);

  const handlePreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleBookmark = async (slideIndex) => {
    try {
      const slideId = slides[slideIndex]._id;
      const endpoint = bookmarkStatus[slideIndex]
        ? "removeBookmark"
        : "addBookmark";
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ slideId }),
        }
      );

      if (response.ok) {
        const newBookmarkStatus = [...bookmarkStatus];
        newBookmarkStatus[slideIndex] = !bookmarkStatus[slideIndex];
        setBookmarkStatus(newBookmarkStatus);
      } else {
        navigate("/?signin=true");
        console.error("Bookmark action failed");
      }
    } catch (error) {
      console.error("Error while performing bookmark action:", error);
    }
  };

  const handleLike = async (slideIndex) => {
    try {
      const slideId = slides[slideIndex]._id;
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ slideId }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const updatedCount = data.likeCount;
        const newLikeCount = [...likeCount];
        newLikeCount[slideIndex] = updatedCount;
        setLikeCount(newLikeCount);

        const updatedStatus = data.likeStatus;
        const newLikeStatus = [...likeStatus];
        newLikeStatus[slideIndex] = updatedStatus;
        setLikeStatus(newLikeStatus);
      } else {
        navigate("/?signin=true");
        console.error("Like action failed");
      }
    } catch (error) {
      console.error("Error while performing like action:", error);
    }
  };

  const handleShare = (slideIndex) => {
    const link = `${process.env.REACT_APP_FRONTEND_URL}/?slide=true&id=${slides[slideIndex]._id}`;
    navigator.clipboard.writeText(link);
    const newLinkCopiedStatus = [...linkCopiedStatus];
    newLinkCopiedStatus[slideIndex] = true;
    setLinkCopiedStatus(newLinkCopiedStatus);

    setTimeout(() => {
      const newLinkCopiedStatus = [...linkCopiedStatus];
      newLinkCopiedStatus[slideIndex] = false;
      setLinkCopiedStatus(newLinkCopiedStatus);
    }, 1000);
  };

  const handleContainerClick = (event) => {
    const containerWidth = event.currentTarget.offsetWidth;
    const clickX = event.nativeEvent.offsetX;
    const clickY = event.nativeEvent.offsetY;
    const clickPercentage = (clickX / containerWidth) * 100;

    if (clickY >= 75 && clickY <= 550) {
      if (clickPercentage <= 50) {
        handlePreviousSlide();
      } else {
        handleNextSlide();
      }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.storyViewerContainer}>
        {!props.isMobile && (
          <img
            onClick={handlePreviousSlide}
            src={leftArrow}
            alt="left arrow"
            className={styles.leftArrow}
          />
        )}
        <div className={styles.storyViewer}>
          <div className={styles.progressBarContainer}>
            {slides.map((slide, index) => {
              const isCompleted = index <= currentSlideIndex;
              const isActive = index === currentSlideIndex;
              return (
                <div
                  key={index}
                  className={`${styles.progressBar} ${
                    isCompleted ? styles.progressBarCompleted : ""
                  } ${isActive ? styles.progressBarActive : ""}`}
                ></div>
              );
            })}
          </div>
          <div
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0 ), rgba(0, 0, 0,  0.8)), linear-gradient(rgba(0, 0, 0, 0.2 ), rgba(0, 0, 0,   0)) , url(${slides[currentSlideIndex].imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={(event) => handleContainerClick(event)}
            className={styles.categoryStory}
          >
            {linkCopiedStatus[currentSlideIndex] && (
              <div className={styles.linkCopiedMsg}>
                Link copied to clipboard
              </div>
            )}

            <div className={styles.categoryStoryHeader}>
              {slides[currentSlideIndex].header}
            </div>
            <div className={styles.categoryStoryDescription}>
              {slides[currentSlideIndex].description}
            </div>
          </div>

          <img
            onClick={() => {
              navigate(`/`);
            }}
            src={crossIcon}
            alt="cross icon"
            className={styles.crossIcon}
          />
          <img
            onClick={() => {
              handleShare(currentSlideIndex);
            }}
            src={shareIcon}
            alt="share icon"
            className={styles.shareIcon}
          />
          <img
            onClick={() => handleBookmark(currentSlideIndex)}
            src={
              bookmarkStatus[currentSlideIndex]
                ? blueBookmarkIcon
                : bookmarkIcon
            }
            alt="bookmark icon"
            className={styles.bookmarkIcon}
          />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
            className={styles.likeIcon}
          >
            <img
              onClick={() => {
                handleLike(currentSlideIndex);
              }}
              src={likeStatus[currentSlideIndex] ? redLikeIcon : likeIcon}
              alt="like icon"
            />
            <p
              style={{
                color: "white",
              }}
            >
              {likeCount[currentSlideIndex]}
            </p>
          </div>
        </div>
        {!props.isMobile && (
          <img
            onClick={handleNextSlide}
            src={rightArrow}
            alt="right arrow"
            className={styles.rightArrow}
          />
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
