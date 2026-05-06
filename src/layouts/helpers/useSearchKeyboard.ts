import { useEffect, useRef } from "react";

export const useSearchKeyboard = (onOpen?: () => void) => {
  const onOpenRef = useRef(onOpen);
  onOpenRef.current = onOpen;

  useEffect(() => {
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("searchInput");
    const searchModalOverlay = document.getElementById("searchModalOverlay");
    const searchResultItems = document.querySelectorAll("#searchItem");
    const searchModalTriggers = document.querySelectorAll(
      "[data-search-trigger]"
    );

    let selectedIndex = -1;

    const updateSelection = () => {
      searchResultItems.forEach((item, index) => {
        if (index === selectedIndex) {
          item.classList.add("search-result-item-active");
        } else {
          item.classList.remove("search-result-item-active");
        }
      });

      searchResultItems[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    };

    const openModal = () => {
      searchModal?.classList.add("show");
      searchInput?.focus();
      onOpenRef.current?.();
    };

    const closeModal = () => {
      searchModal?.classList.remove("show");
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        openModal();
        updateSelection();
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
      }

      if (event.key === "Escape") {
        closeModal();
      }

      if (event.key === "ArrowUp" && selectedIndex > 0) {
        selectedIndex--;
      } else if (
        event.key === "ArrowDown" &&
        selectedIndex < searchResultItems.length - 1
      ) {
        selectedIndex++;
      } else if (event.key === "Enter") {
        const activeLink = document.querySelector(
          ".search-result-item-active a"
        ) as HTMLAnchorElement;
        if (activeLink) {
          activeLink?.click();
        }
      }

      updateSelection();
    };

    searchModalTriggers.forEach((button) => {
      button.addEventListener("click", openModal);
    });

    searchModalOverlay?.addEventListener("click", closeModal);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      searchModalTriggers.forEach((button) => {
        button.removeEventListener("click", openModal);
      });
      searchModalOverlay?.removeEventListener("click", closeModal);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};
