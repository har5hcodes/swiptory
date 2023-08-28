import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StoryViewer from "../../components/StoryViewer/StoryViewer";

const Slide = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [slideData, setSlideData] = useState(null);

  useEffect(() => {
    async function fetchSlide() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/slide/slideDetails/${id}`
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
    return <> </>;
  }

  return (
    <>
      <StoryViewer slides={slideData} />
    </>
  );
};

export default Slide;
