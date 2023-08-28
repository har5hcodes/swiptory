import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./mobileAddStory.module.css";
import ModalContainer from "../ModalContainer/ModalContainer";
import modalCloseIcon from "../../assets/modalCloseIcon.jpg";

const Slide = (props) => (
  <div className={styles.slideContainer}>
    {[...Array(props.slideCount)].map((_, index) => (
      <div
        key={index}
        onClick={() => props.handleSlideClick(index + 1)}
        style={{
          border:
            index + 1 === props.activeSlideIndex
              ? "2px solid #73ABFF"
              : "2px solid transparent",
        }}
        className={styles.slideNumber}
      >
        Slide {index + 1}
        {props.activeSlideIndex === index + 1 && (
          <img
            onClick={async () => {
              if (index + 1 === props.slideCount) {
                await props.handleSlideClick(index + 1);
                props.handleDeleteSlide(index + 1);
              } else {
                props.handleDeleteSlide(index + 1);
              }
            }}
            className={styles.modalCloseIcon}
            src={modalCloseIcon}
            alt="modal-close-icon"
          />
        )}
      </div>
    ))}
    {props.slideCount < 6 && (
      <div
        onClick={() => {
          props.handleAddSlide();
        }}
        className={styles.addSlide}
      >
        Add +
      </div>
    )}
  </div>
);

const Form = (props) => {
  if (props.activeSlideIndex > props.postData.slides.length) {
    return null;
  }

  return (
    <div className={styles.formContainer}>
      <div>
        <label>Heading:</label>
        <input
          onChange={(e) => {
            props.handleHeadingChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].header}
          type="text"
          placeholder="Your heading"
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          onChange={(e) => {
            props.handleDescriptionChange(
              props.activeSlideIndex,
              e.target.value
            );
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].description}
          placeholder="Story description"
        ></textarea>
      </div>
      <div>
        <label>Image:</label>
        <input
          onChange={(e) => {
            props.handleImageChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].imageUrl}
          type="text"
          placeholder="Add Image uri"
        />
      </div>
      <div>
        <label>Category:</label>
        <select
          onChange={(e) => {
            props.handleCategoryChange(props.activeSlideIndex, e.target.value);
          }}
          value={props.postData.slides[props.activeSlideIndex - 1].category}
        >
          <option value="">Select</option>
          <option value="Education">Education</option>
          <option value="Fashion">Fashion</option>
          <option value="Fitness">Fitness</option>
          <option value="Food">Food</option>
          <option value="Movie">Movie</option>
          <option value="Music">Music</option>
          <option value="Sports">Sports</option>
          <option value="Travel">Travel</option>
        </select>
      </div>
    </div>
  );
};

const MobileAddStory = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");

  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [slideCount, setSlideCount] = useState(3);
  const [postData, setPostData] = useState({
    slides: [
      {
        header: "",
        description: "",
        imageUrl: "",
        category: "",
      },
      {
        header: "",
        description: "",
        imageUrl: "",
        category: "",
      },
      {
        header: "",
        description: "",
        imageUrl: "",
        category: "",
      },
    ],
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const getPost = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/post/postDetails/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setPostData(data);
          setSlideCount(data.slides.length);
        } else {
          console.error("Failed to fetch category stories");
        }
      };
      getPost();
    }
  }, [id]);

  const handleAddSlide = () => {
    setSlideCount(slideCount + 1);
    setActiveSlideIndex(slideCount + 1);
    const newPostData = { ...postData };
    newPostData.slides.push({
      header: "",
      description: "",
      imageUrl: "",
      category: "",
    });
    setPostData(newPostData);
    if (slideCount >= 3) {
      setShowError(false);
      setErrorMessage("");
    }
  };

  const handleSlideClick = (index) => {
    setActiveSlideIndex(index);
  };

  const handleHeadingChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].header = value;
    setPostData(newPostData);
  };

  const handleDescriptionChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].description = value;
    setPostData(newPostData);
  };

  const handleImageChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].imageUrl = value;
    setPostData(newPostData);
  };

  const handleCategoryChange = (index, value) => {
    const newPostData = { ...postData };
    newPostData.slides[index - 1].category = value;
    setPostData(newPostData);
  };

  const handleDeleteSlide = (index) => {
    if (slideCount === 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }
    if (index === postData.slides.length) {
      setActiveSlideIndex(index - 1);
    }

    const newPostData = { ...postData };
    newPostData.slides.splice(index - 1, 1);

    if (index === activeSlideIndex) {
      setActiveSlideIndex(Math.max(index - 1, 1));
    } else if (index < activeSlideIndex) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }

    setSlideCount(slideCount - 1);
    setPostData(newPostData);
  };

  const handlePost = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.header === "" ||
        slide.description === "" ||
        slide.imageUrl === "" ||
        slide.category === ""
    );

    if (slideCount < 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields in all slides");
      return;
    }

    setShowError(false);
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/post/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ slides: postData.slides }),
        }
      );
      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setShowSuccessMessage(false);
        console.log("Error creating post");
      }
    } catch (error) {
      setShowSuccessMessage(false);
      console.error("Network error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdate = async () => {
    const error = postData.slides.some(
      (slide) =>
        slide.header === "" ||
        slide.description === "" ||
        slide.imageUrl === "" ||
        slide.category === ""
    );

    if (slideCount < 3) {
      setShowError(true);
      setErrorMessage("You need to have at least 3 slides");
      return;
    }

    if (error) {
      setShowError(true);
      setErrorMessage("Please fill all the fields in all slides");
      return;
    }

    setShowError(false);
    setErrorMessage("");
    setIsProcessing(true);

    try {
      const payload = postData.slides.map((slide) => ({
        slideNumber: slide.slideNumber,
        header: slide.header,
        description: slide.description,
        imageUrl: slide.imageUrl,
        category: slide.category,
      }));

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/post/edit/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ slides: payload }),
        }
      );

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate("/");
        }, 1200);
      } else {
        setShowSuccessMessage(false);
        console.log("Error updating post");
      }
    } catch (error) {
      setShowSuccessMessage(false);
      console.error("Network error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <ModalContainer>
        <h1 className={styles.formHeader}>Processing...</h1>
      </ModalContainer>
    );
  }

  return (
    <ModalContainer>
      {showSuccessMessage ? (
        <h1 className={styles.formHeader}>
          {id ? "Post updated successfully." : "Post created successfully."}
        </h1>
      ) : (
        <>
          {" "}
          <h1 className={styles.header}>Add story to feed</h1>
          <div className={styles.wrapper}>
            <>
              <Slide
                slideCount={slideCount}
                activeSlideIndex={activeSlideIndex}
                handleSlideClick={handleSlideClick}
                handleAddSlide={handleAddSlide}
                handleDeleteSlide={handleDeleteSlide}
              />
              <Form
                postData={postData}
                activeSlideIndex={activeSlideIndex}
                handleHeadingChange={handleHeadingChange}
                handleDescriptionChange={handleDescriptionChange}
                handleImageChange={handleImageChange}
                handleCategoryChange={handleCategoryChange}
              />
            </>
          </div>
          {showError && <div className={styles.error}>{errorMessage}</div>}
          <div>
            <button
              onClick={id ? handleUpdate : handlePost}
              className={styles.postBtn}
            >
              {id ? "Update" : "Post"}
            </button>
          </div>
        </>
      )}
    </ModalContainer>
  );
};

export default MobileAddStory;
