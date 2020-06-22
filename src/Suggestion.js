import PropTypes from "prop-types";
import React, { forwardRef } from "react";

function Suggestion(
  {
    className,
    suggestion,
    searchTerm,
    onClickSuggestion,
    onMouseOver,
    suggestionRenderer,
    index,
  },
  ref
) {
  const handleClick = () => onClickSuggestion(suggestion);
  const handleMouseOver = (event) => onMouseOver(event, index);

  return (
    <li
      role="option"
      ref={ref}
      key={suggestion}
      aria-label={suggestion}
      className={className}
      onClick={handleClick}
      onMouseOver={handleMouseOver}
    >
      {suggestionRenderer(suggestion, searchTerm)}
    </li>
  );
}

Suggestion.propTypes = {
  onClickSuggestion: PropTypes.func.isRequired,
  suggestion: PropTypes.string.isRequired,
  suggestionRenderer: PropTypes.func,
  searchTerm: PropTypes.string,
  className: PropTypes.string,
  index: PropTypes.number.isRequired,
  onMouseOver: PropTypes.func.isRequired,
};

Suggestion.defaultProps = {
  // eslint-disable-next-line react/display-name
  suggestionRenderer: (suggestion) => <div>{suggestion}</div>,
};

export default forwardRef(Suggestion);
