import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import FilterSection from "../components/FilterSection/FilterSection";
import CategorySection from "../components/CategorySection/CategorySection";
import RegisterModal from "../components/RegisterModal/RegisterModal";
import { useSearchParams } from "react-router-dom";
import SignInModal from "../components/SignInModal/SignInModal";
import AddStory from "../components/AddStory/AddStory";
import MobileAddStory from "../components/MobileAddStory/MobileAddStory";
import StoryViewer from "../components/StoryViewer/StoryViewer";
import Slide from "../components/Slide/Slide";
import filters from "../constants/data";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const displayRegisterModal = searchParams.get("register");
  const displaySignInModal = searchParams.get("signin");
  const displayAddStory = searchParams.get("addstory");
  const displayEditStory = searchParams.get("editstory");
  const displayViewStory = searchParams.get("viewstory");
  const displayViewBoomarks = searchParams.get("viewbookmarks");
  const displayYourStories = searchParams.get("yourstories");
  const displaySlide = searchParams.get("slide");

  const [authValidated, setAuthValidated] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState(["All"]);
  const [story, setStory] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const validateToken = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/auth/validate`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          setAuthValidated(true);
        } else {
          setAuthValidated(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
      }
    };

    validateToken();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [displaySignInModal]);

  const handleSelectFilters = (filter) => {
    if (filter === "All") {
      setSelectedFilters(["All"]);
    } else {
      const updatedFilters = selectedFilters.includes("All")
        ? [filter]
        : selectedFilters.includes(filter)
        ? selectedFilters.filter((f) => f !== filter)
        : [...selectedFilters, filter];
      if (updatedFilters.length === 0) updatedFilters.push("All");
      setSelectedFilters(updatedFilters);
    }
  };

  const handleStoryViewer = (story) => {
    setStory(story);
    navigate("/?viewstory=true");
  };

  const renderCategorySections = () => {
    if (displayViewBoomarks) {
      return (
        <CategorySection
          category="bookmarks"
          handleStoryViewer={handleStoryViewer}
        />
      );
    } else if (displayYourStories) {
      return (
        <CategorySection
          category="your-stories"
          handleStoryViewer={handleStoryViewer}
        />
      );
    } else {
      return (
        <>
          <FilterSection
            selectedFilters={selectedFilters}
            handleSelectFilters={handleSelectFilters}
          />
          <CategorySection
            selectedFilters={selectedFilters}
            category="your-stories"
            handleStoryViewer={handleStoryViewer}
          />
          {selectedFilters.includes("All")
            ? filters
                .filter((filter) => filter.name !== "All")
                .map((filter) => (
                  <CategorySection
                    key={filter.name}
                    category={filter.name}
                    handleStoryViewer={handleStoryViewer}
                  />
                ))
            : selectedFilters.map((filter) => (
                <CategorySection
                  key={filter}
                  category={filter}
                  authValidated={authValidated}
                  handleStoryViewer={handleStoryViewer}
                />
              ))}
        </>
      );
    }
  };

  return (
    <>
      <Navbar authValidated={authValidated} />
      {renderCategorySections()}

      {displayRegisterModal && <RegisterModal />}
      {displaySignInModal && <SignInModal />}

      {displayAddStory && (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayEditStory && (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayViewStory && <StoryViewer slides={story} isMobile={isMobile} />}

      {displaySlide && <Slide />}
    </>
  );
};

export default HomePage;
