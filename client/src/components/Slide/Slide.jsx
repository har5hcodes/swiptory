import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoryViewer from "../../components/StoryViewer/StoryViewer";
import Home from "../HomePage/HomePage";

const Slide = () => {
  const { id } = useParams();
  const [slideData, setSlideData] = useState(null);

  useEffect(() => {
    async function fetchSlide() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/slide/slideDetails/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setSlideData([data.slide]);
        } else {
          console.error("Failed to fetch slide data");
        }
      } catch (error) {
        console.error("Error while fetching slide:", error);
      }
    }

    fetchSlide();
  }, [id]);

  if (!slideData) {
    return <div>Page doesn't exist.</div>;
  }

  return (
    <>
      <Home />
      <StoryViewer slides={slideData} />
    </>
  );
};

export default Slide;
