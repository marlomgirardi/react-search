import PropTypes from "prop-types";
import React, { useRef, useEffect } from "react";
import classNames from "classnames";
import Suggestion from "./Suggestion";

function SuggestionList(props) {
  const focusedSuggestionRef = useRef(null);

  const scrollToSuggestion = () => {
    const focusedSuggestion = focusedSuggestionRef.current;

    if (focusedSuggestion) {
      focusedSuggestion.scrollIntoViewIfNeeded();
    }
  };

  useEffect(() => {
    if (Number.isInteger(props.focusedSuggestionKey)) {
      scrollToSuggestion();
    }
  }, [props.focusedSuggestionKey]);

  const handleMouseLeave = () => props.onHoverSuggestion(null);
  const handleMouseOver = (event, index) => {
    props.onHoverSuggestion(index);
  };

  return (
    <ul
      role="listbox"
      className="react-search__suggestions"
      onMouseLeave={handleMouseLeave}
    >
      {props.suggestions.map((suggestion, index) => {
        const isFocused = props.focusedSuggestionKey === index;
        const isHovered = props.hoveredSuggestionKey === index;

        return (
          <Suggestion
            className={classNames("react-search__suggestion", {
              "react-search__suggestion--focused": isFocused,
              "react-search__suggestion--hovered": isHovered,
            })}
            index={index}
            key={suggestion}
            onClickSuggestion={props.onClickSuggestion}
            onMouseOver={handleMouseOver}
            ref={isFocused ? focusedSuggestionRef : undefined}
            searchTerm={props.searchTerm}
            suggestion={suggestion}
            suggestionRenderer={props.suggestionRenderer}
          />
        );
      })}
    </ul>
  );
}

SuggestionList.propTypes = {
  onClickSuggestion: PropTypes.func.isRequired,
  onHoverSuggestion: PropTypes.func.isRequired,
  focusedSuggestionKey: PropTypes.number,
  hoveredSuggestionKey: PropTypes.number,
  suggestionRenderer: PropTypes.func,
  searchTerm: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.string),
};

export default SuggestionList;
