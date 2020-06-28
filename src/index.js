import PropTypes from "prop-types";
import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import SuggestionList from "./SuggestionList";
import noop from "./utils/noop";

function Search({
  className,
  style,
  autoFocus = false,
  label,
  onChange = noop,
  onClear = noop,
  onSearch,
  showClearButton = false,
  showSearchButton = false,
  suggestionRenderer,
  suggestions = [],
  clearButtonContent = "✕",
  searchButtonContent = "Search",
  ...rest
}) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [originalInputValue, setOriginalInputValue] = useState(undefined);
  const [focusedSuggestionKey, setFocusedSuggestionKey] = useState(null);
  const [hoveredSuggestionKey, setHoveredSuggestionKey] = useState(null);
  const [isSuggestionsOpened, setIsSuggestionsOpened] = useState(false);
  const hasSuggestions = suggestions.length > 0;
  const shouldShowClearButton = inputValue && showClearButton;

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
    }

    /** @param {KeyboardEvent} event */
    const handleDocumentKeyDown = (event) => {
      if (hasSuggestions && event.key === "Escape") {
        if (hasSuggestions) {
          setIsSuggestionsOpened(false);
          setFocusedSuggestionKey(null);
        }

        if (originalInputValue) {
          setInputValue(originalInputValue);
        }
      }
    };

    /** @param {MouseEvent} event */
    const handleClick = (event) => {
      if (!containerRef.current.contains(event.target)) {
        setIsSuggestionsOpened(false);
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
      document.removeEventListener("click", handleClick);
    };
  });

  useEffect(() => setIsSuggestionsOpened(hasSuggestions), [
    hasSuggestions,
    inputValue,
  ]);

  useEffect(() => {
    if (suggestions[focusedSuggestionKey]) {
      setInputValue(suggestions[focusedSuggestionKey]);
    }
  }, [suggestions, focusedSuggestionKey]);

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleInputChange = ({ target: { value } }) => {
    setOriginalInputValue(value);
    setFocusedSuggestionKey(null);
    setInputValue(value);
    setSearchTerm(value.toLowerCase());

    if (!value.trim()) {
      onClear();
      return;
    }

    onChange(value);
  };
  const handleSuggestionHover = (current) => setHoveredSuggestionKey(current);

  const handleClearClick = () => {
    setInputValue("");
    setSearchTerm("");
    inputRef.current.focus();
    onClear();
  };

  const handleSearchSubmit = () => {
    setOriginalInputValue(undefined);
    setFocusedSuggestionKey(null);
    setIsSuggestionsOpened(false);
    onSearch(inputValue);
  };

  /**
   * @param {React.KeyboardEvent<HTMLInputElement>} event
   */
  const handleKeyDown = (event) => {
    if (!hasSuggestions) {
      return null;
    }

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        if (!isSuggestionsOpened && inputValue.trim() !== "") {
          event.target.selectionStart = inputValue.length;
          onChange(inputValue);
          setIsSuggestionsOpened(true);
        }

        if (hasSuggestions && isSuggestionsOpened) {
          let newFocusedSuggestionKey =
            focusedSuggestionKey === null ? 0 : focusedSuggestionKey + 1;

          if (newFocusedSuggestionKey >= suggestions.length) {
            newFocusedSuggestionKey = null;
            setInputValue(originalInputValue);
          }

          setFocusedSuggestionKey(newFocusedSuggestionKey);
        }

        break;
      }

      case "ArrowUp":
        event.preventDefault();
        if (!isSuggestionsOpened && inputValue.trim() !== "") {
          event.target.selectionStart = inputValue.length;
          onChange(inputValue);
          setIsSuggestionsOpened(true);
        }

        if (hasSuggestions && isSuggestionsOpened) {
          let newFocusedSuggestionKey =
            focusedSuggestionKey === null
              ? suggestions.length - 1
              : focusedSuggestionKey - 1;

          if (newFocusedSuggestionKey < 0) {
            newFocusedSuggestionKey = null;
            setInputValue(originalInputValue);
          }

          setFocusedSuggestionKey(newFocusedSuggestionKey);
        }
        break;

      case "Enter":
        handleSearchSubmit();
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSearchTerm(suggestion);
    onClear();
    onSearch(suggestion);
  };

  return (
    <div
      className={classNames("react-search", className)}
      style={style}
      ref={containerRef}
    >
      <div className="react-search__search-box">
        <input
          className="react-search__input"
          ref={inputRef}
          type="text"
          aria-label={label}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          {...rest}
        />
        {shouldShowClearButton && (
          <button
            className="react-search__clear-button"
            onClick={handleClearClick}
          >
            {clearButtonContent}
          </button>
        )}
        {showSearchButton && (
          <button
            className="react-search__search-button"
            onClick={handleSearchSubmit}
          >
            {searchButtonContent}
          </button>
        )}
      </div>
      {isSuggestionsOpened && (
        <SuggestionList
          focusedSuggestionKey={focusedSuggestionKey}
          hoveredSuggestionKey={hoveredSuggestionKey}
          onClickSuggestion={handleSuggestionClick}
          onHoverSuggestion={handleSuggestionHover}
          searchTerm={searchTerm}
          suggestions={suggestions}
          suggestionRenderer={suggestionRenderer}
        />
      )}
    </div>
  );
}

Search.propTypes = {
  clearButtonContent: PropTypes.node,
  searchButtonContent: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  suggestions: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onSearch: PropTypes.func.isRequired,
  suggestionRenderer: PropTypes.func,
  showClearButton: PropTypes.bool,
  showSearchButton: PropTypes.bool,
};

export default Search;
