import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import FilterSection from "../FilterSection/FilterSection";
import CategorySection from "../CategorySection/CategorySection";
import RegisterModal from "../RegisterModal/RegisterModal";
import { useSearchParams } from "react-router-dom";
import SignInModal from "../SignInModal/SignInModal";
import AddStory from "../AddStory/AddStory";
import MobileAddStory from "../MobileAddStory/MobileAddStory";
import StoryViewer from "../StoryViewer/StoryViewer";

const filters = [
  {
    name: "All",
    imageUrl:
      "https://images.unsplash.com/photo-1606639386467-3d28d4e99d64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFsbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    name: "Education",
    imageUrl:
      "https://images.unsplash.com/photo-1594312915251-48db9280c8f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  },
  {
    name: "Fashion",
    imageUrl:
      "https://images.unsplash.com/photo-1566206091558-7f218b696731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80",
  },
  {
    name: "Fitness",
    imageUrl:
      "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Food",
    imageUrl:
      "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=710&q=80",
  },

  {
    name: "Movie",
    imageUrl:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
  },

  {
    name: "Music",
    imageUrl:
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
  },
  {
    name: "Sports",
    imageUrl:
      "https://images.unsplash.com/photo-1444491741275-3747c53c99b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
  {
    name: "Travel",
    imageUrl:
      "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
];

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
  const [authValidated, setAuthValidated] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

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

  const [selectedFilters, setSelectedFilters] = useState(["All"]);

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

  const [story, setStory] = useState(null);

  const handleStoryViewer = (story) => {
    setStory(story);
    navigate("/?viewstory=true");
  };

  return (
    <>
      <Navbar authValidated={authValidated} />

      {displayViewBoomarks ? (
        <CategorySection
          category="bookmarks"
          handleStoryViewer={handleStoryViewer}
        />
      ) : displayYourStories ? (
        <CategorySection
          category="your-stories"
          handleStoryViewer={handleStoryViewer}
        />
      ) : (
        <>
          <FilterSection
            selectedFilters={selectedFilters}
            handleSelectFilters={handleSelectFilters}
          />
          <CategorySection
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
      )}

      {displayRegisterModal && <RegisterModal />}
      {displaySignInModal && <SignInModal />}
      {displayAddStory && (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayEditStory && (isMobile ? <MobileAddStory /> : <AddStory />)}
      {displayViewStory && <StoryViewer slides={story} isMobile={isMobile} />}
    </>
  );
};

export default HomePage;
