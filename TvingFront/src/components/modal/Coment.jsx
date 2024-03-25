import React from "react";

function Coment() {
  return (
    <div>
      <div className="flex">
              {[1, 2, 3, 4, 5].map((starIndex) => (
                <svg
                  key={starIndex}
                  onMouseEnter={() => setHover(starIndex)} // 마우스가 올라간 별 인덱스 설정
                  onMouseLeave={() => setHover(0)} // 마우스가 떠나면 호버 상태 초기화
                  onClick={() => handleSetRating(starIndex)}
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  className="cursor-pointer"
                  // fill={starIndex <= (hover || rating) ? "blue" : "none"} // 호버 상태 또는 별점에 따라 색상 변경
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.9591 9.2598C21.8668 8.9763 21.6301 8.76371 21.3384 8.70226L15.6279 7.49988L12.7235 2.41971C12.575 2.16013 12.299 2 12 2C11.701 2 11.425 2.16013 11.2765 2.41971L8.37208 7.49988L2.66162 8.70226C2.36991 8.76371 2.1332 8.9763 2.04095 9.2598C1.94866 9.5433 2.01483 9.85446 2.2145 10.0758L6.13167 14.4191L5.50612 20.2443C5.47425 20.5413 5.60371 20.8326 5.84546 21.0079C6.08725 21.1833 6.40437 21.2158 6.67671 21.0933L12 18.6975L17.3233 21.0933C17.4327 21.1425 17.5492 21.1667 17.6652 21.1667C17.8381 21.1667 18.0098 21.1129 18.1546 21.0079C18.3963 20.8326 18.5258 20.5413 18.4939 20.2443L17.8683 14.4191L21.7855 10.0758C21.9851 9.85446 22.0513 9.5433 21.9591 9.2598Z"
                    fill={starIndex <= (hover || rating) ? "#5ac8fa" : "#e0e0e0"}
                  />
                </svg>
              ))}
            </div>
    </div>
  );
}

export default Coment;
