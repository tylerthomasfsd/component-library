import { Paper } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const SlidingButton = ({
  defaultButton,
  buttons,
  overlayColorClasses,
  fontFamilyClasses,
}: {
  defaultButton: string;
  buttons: string[];
  overlayColorClasses: string;
  fontFamilyClasses?: string;
}) => {
  /* USESTATE VARIABLES */
  const [selectedTab, setSelectedTab] = useState<string>(defaultButton);
  const [selectedButton, setSelectedButton] =
    useState<HTMLButtonElement | null>(null);
  const [windowSize, setWindowSize] = useState<number>(0);

  /* REFS */
  const buttonOverlayRef = useRef<HTMLDivElement>(null);

  /* FUNCTIONS */
  const handleButtonClick = (
    buttonLabel: string,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();

    if (!buttonOverlayRef.current) {
      console.log(buttonOverlayRef.current);
      return;
    }

    setSelectedTab(buttonLabel);
    setSelectedButton(event.currentTarget);

    const targetLocation = event.currentTarget.offsetLeft;

    buttonOverlayRef.current.style.translate = `${targetLocation}px`;
  };

  /* USEEFFECT FUNCTIONS */
  useEffect(function trackWindowResize() {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
  });

  useEffect(
    function handleWindowResize() {
      if (!buttonOverlayRef.current) {
        return;
      }

      let targetLocation = 0;

      if (selectedButton) {
        targetLocation = selectedButton.offsetLeft;
      }

      buttonOverlayRef.current.classList.remove("transition");
      buttonOverlayRef.current.style.translate = `${targetLocation}px`;
      buttonOverlayRef.current.style.width = `${100 / buttons.length}%`;

      setTimeout(function addTransition() {
        buttonOverlayRef.current?.classList.add("transition");
      }, 10);
    },
    [buttons.length, selectedButton, windowSize],
  );

  return (
    <Paper
      className="flex relative w-full p-0.5 bg-white rounded-full! z-20"
      elevation={4}
    >
      <div
        className={`flex items-center flex-1 relative w-full rounded-full ${fontFamilyClasses}`}
      >
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`flex-1 py-1 px-3 rounded-full text-nowrap text-[0.75rem] sm:text-sm md:text-md lg:text-lg lg:text-[1.175rem] ${selectedTab === button ? "text-white text-shadow-2xs text-shadow-black" : "text-black"} cursor-pointer z-10`}
            onClick={(e) => handleButtonClick(button, e)}
          >
            {button}
          </button>
        ))}
        <div
          className={`${overlayColorClasses} absolute inset-0 rounded-full transition`}
          ref={buttonOverlayRef}
        ></div>
      </div>
    </Paper>
  );
};

export default SlidingButton;
