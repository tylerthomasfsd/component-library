import { useEffect, useRef, useState } from "react";

// Component that takes a list of buttons and plays a sliding animation 
// when a button is clicked
const SlidingButton = ({
  defaultButton,
  buttons,
  overlayColorClasses,
  fontFamilyClasses,
  onClick = () => {},
}: {
  defaultButton: string;
  buttons: string[];
  overlayColorClasses: string;
  fontFamilyClasses?: string;
  onClick: (button: string) => void;
}) => {
  /* VARIABLES */

  // String value of the button that has been selected
  const [selectedButtonData, setSelectedButtonData] =
    useState<string>(defaultButton);

  // Selected HTML button element, allows the retrieval of the buttons properties
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

    setSelectedButtonData(buttonLabel);
    setSelectedButton(event.currentTarget);

    const targetLocation = event.currentTarget.offsetLeft;

    buttonOverlayRef.current.style.translate = `${targetLocation}px`;
  };

  /* USEEFFECT FUNCTIONS */

  // Tracks the resizing of the window to ensure calculations don't become inaccurate
  useEffect(function trackWindowResize() {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
  });

  // Handles the logic for when the window resizes
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

  /* MAIN COMPONENT */
  return (
    <div className="flex relative w-full bg-white border border-slate-300 rounded-full z-20">
      <div
        className={`flex items-center flex-1 relative w-full rounded-full ${fontFamilyClasses}`}
      >
        {buttons.map((button) => (
          <button
            key={button}
            className={`flex-1 py-1 px-4 rounded-full text-nowrap text-xs ${selectedButtonData === button ? "text-white" : "text-black"} cursor-pointer z-10`}
            onClick={(e) => {
              handleButtonClick(button, e);
              onClick(button);
            }}
          >
            {button}
          </button>
        ))}
        <div
          className={`${overlayColorClasses} absolute inset-0 rounded-full transition`}
          ref={buttonOverlayRef}
        ></div>
      </div>
    </div>
  );
};

export default SlidingButton;
