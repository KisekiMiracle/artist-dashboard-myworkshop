export default function closePopover(
  contentsRef: { current: unknown },
  closeButtonRef: { current: { click: () => void } }
) {
  // eslint-disable-next-line prefer-const
  let intervalId: string | number | NodeJS.Timeout | undefined;

  const checkForElement = () => {
    const targetElement = contentsRef.current; // Or querySelector
    if (targetElement) {
      const target = contentsRef.current as unknown as HTMLDivElement;
      target?.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          closeButtonRef.current?.click();
        });
      });
      // Perform actions on the element here
      clearInterval(intervalId); // Stop polling once found
    }
  };

  intervalId = setInterval(checkForElement, 100);
}
