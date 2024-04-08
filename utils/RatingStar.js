import { FaStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
export function Rating(value) {
  // Determine the number of filled stars
  const filledStars = Math.round(value * 2) / 2;

  // Generate an array of stars to display
  const stars = [];
  for (let i = 0; i < 5; i++) {
    if (filledStars - i >= 1) {
      stars.push(
        <span key={i}>
          <FaStar />
        </span>
      ); // Filled star
    } else if (filledStars - i === 0.5) {
      stars.push(
        <span key={i}>
          <FaStarHalfAlt />
        </span>
      ); // Half-filled star
    } else {
      stars.push(
        <span key={i}>
          <FaRegStar />
        </span>
      ); // Empty star
    }
  }

  return <div className="flex gap-1">{stars}</div>;
}
