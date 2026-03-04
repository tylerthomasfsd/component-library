import { useEffect, useRef, useState } from "react";

const TabButtons = ({
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

    const targetLocation = event.currentTarget.offsetLeft;

    buttonOverlayRef.current.style.translate = `${targetLocation}px`;
  };

  /* USEEFFECT FUNCTIONS */
  useEffect(function trackWindowResize() {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    }
  })

  useEffect(
    function setOverlayWidth() {
      if (!buttonOverlayRef.current) {
        return;
      }

      buttonOverlayRef.current.style.width = `${100 / buttons.length}%`;
    },
    [buttons.length, windowSize],
  );

  return (
    <div className="flex relative w-full p-0.5 bg-white rounded-full z-20">
      <div
        className={`flex items-center flex-1 relative w-full rounded-full ${fontFamilyClasses}`}
      >
        {buttons.map((button, index) => (
          <button
            key={index}
            className={`flex-1 py-1 px-3 rounded-full text-nowrap text-[0.75rem] sm:text-sm md:text-md lg:text-lg lg:text-[1.175rem] ${selectedTab === button ? "text-white" : "text-black"} cursor-pointer z-10`}
            onClick={(e) => handleButtonClick(button, e)}
          >
            {button}
          </button>
        ))}
        <div
          className={`${overlayColorClasses} absolute inset-0 transition rounded-full`}
          ref={buttonOverlayRef}
        ></div>
      </div>
    </div>
  );
};

export default TabButtons;
