import Footer from "@/components/Footer";
import HeaderMain from "@/components/HeaderMain";
import { useState } from "react";
import { motion } from "framer-motion";
import ReviewModal from "@/components/modal/ReviewModal";
import useContent from "@/store/useContent";
import { useEffect } from "react";
import { getData } from "@/utils/crud";
import Cookies from "js-cookie";

// import star from "@/assets/main/star.svg";

function Detail() {
  const [rating, setRating] = useState(0); // 초기 별점 상태 설정
  const [hover, setHover] = useState(0); // 마우스 호버 상태 설정

  // contentTitle과 contentId를 사용하는 로직
  const { content, genre, setGenre } = useContent();

  console.log(content);

  // 모달 창 상태를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 창을 여는 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 창을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const contentData = async () => {
      try {
        const type = Cookies.get("grantType");
        const token = Cookies.get("accessToken");

        const headers = {
          "Content-Type": "application/json",
          Authorization: `${type} ${token}`,
        };

        const str = content.genreIds;
        const genreIds = str.split(",");

        // 각 genreId에 대한 URL을 생성하고, 각 URL에 대해 getData 함수를 호출하는 프로미스 배열을 생성합니다.
        const promises = genreIds.map((genreId) => {
          const url = `http://hoyeonjigi.site:8080/genre/${genreId}`;
          return getData(url, headers); // getData 함수가 각 URL에 대해 요청을 수행하고, 프로미스를 반환한다고 가정합니다.
        });

        // Promise.all을 사용하여 모든 프로미스가 완료되길 기다립니다.
        const results = await Promise.all(promises);

        setGenre(results);
        // results 배열에는 각 genreId에 대한 요청 결과가 들어 있습니다.
        console.log(genre);
      } catch (error) {
        console.log(error);
        console.log("에러출력");
      }
    };

    contentData();
  }, []);

  return (
    <div className="bg-black">
      <HeaderMain />
      <div className="border-b border-b-gray_03 flex justify-between font-noto mx-16 pb-12 mt-10">
        <div className="flex-[0.55] ml-3">
          <h2 className="text-white font-medium text-5xl mb-6">
            {content.contentTitle}
          </h2>
          <div className="mb-7">
            <ul className="flex gap-1">
              {genre.map((item, index) => (
                <li
                  key={index}
                  className="text-gray_06 inline-block border border-gray_05 rounded font-semibold px-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-row items-center gap-6 mb-7">
            <motion.button className="flex items-center bg-white px-16 py-6 rounded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="16"
                viewBox="0 0 13 16"
              >
                <path
                  data-name="\uB2E4\uAC01형 4"
                  d="M12.17 7.489a.6.6 0 010 1.022L.915 15.437a.6.6 0 01-.914-.511V1.074A.6.6 0 01.915.563z"
                  opacity="0.874"
                ></path>
              </svg>
              <span className="ml-3 font-bold text-black">1화 시청하기</span>
            </motion.button>
            <div className="text-white flex gap-6">
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path d="M0 0h32v32H0z" fill="transparent"></path>
                  <g data-name="패\uC2A4 4347" fill="none">
                    <path d="M16 31.5l-2.175-1.979C6.1 22.523 1 17.907 1 12.242A8.165 8.165 0 019.25 4 8.984 8.984 0 0116 7.133 8.984 8.984 0 0122.75 4 8.165 8.165 0 0131 12.242c0 5.665-5.1 10.281-12.822 17.293z"></path>
                    <path
                      d="M16.004 29.34l1.15-1.037c3.73-3.386 6.951-6.31 9.107-8.95 2.17-2.658 3.138-4.851 3.138-7.11v-.016a6.604 6.604 0 00-1.924-4.707 6.522 6.522 0 00-4.713-1.92 7.382 7.382 0 00-5.548 2.575L16 9.589l-1.214-1.414A7.384 7.384 0 009.233 5.6a6.522 6.522 0 00-4.708 1.92A6.604 6.604 0 002.6 12.227v.015c0 2.264.972 4.461 3.151 7.124 2.164 2.644 5.397 5.572 9.141 8.963l.01.008 1.102 1.004M16 31.499l-2.175-1.978C6.099 22.523 1 17.907 1 12.242A8.165 8.165 0 019.25 4 8.984 8.984 0 0116 7.133 8.984 8.984 0 0122.75 4 8.165 8.165 0 0131 12.242c0 5.665-5.1 10.281-12.823 17.294L16 31.499z"
                      fill="#fff"
                    ></path>
                  </g>
                </svg>
                <span>찜</span>
              </button>
              <button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  className="fill-white"
                >
                  <path fill="rgba(20,20,20,0)" d="M0 0h32v32H0z"></path>
                  <path
                    d="M30 31.3H2a.8.8 0 01-.8-.8v-13a.8.8 0 01.8-.8.8.8 0 01.8.8v12.2h26.4V17.5a.8.8 0 01.8-.8.8.8 0 01.8.8v13a.8.8 0 01-.8.8zm-13.963-10a.8.8 0 01-.8-.8V3.414l-6.43 6.43a.8.8 0 01-1.131 0 .8.8 0 01-.234-.566.8.8 0 01.234-.566L15.454.934A.8.8 0 0116.019.7h.023a.8.8 0 01.3.06.8.8 0 01.247.161l.01.01 7.773 7.778a.8.8 0 01.234.565.8.8 0 01-.234.566.8.8 0 01-1.131 0l-6.409-6.412V20.5a.8.8 0 01-.794.8z"
                    opacity="0.995"
                  ></path>
                </svg>
                <span>공유</span>
              </button>
            </div>
          </div>

          <p className="text-gray_06 font-semibold w-[70%] text-lg">{content.contentOverview}</p>
        </div>
        <div className="flex-[0.3] relative">
          <img src={content.src} alt={content.alt} className=" h-full absolute right-[4rem]" />
        </div>
      </div>
      <div>
        <div className="flex items-center">
          <div className="text-5xl text-white font-extrabold mr-4">4.4</div>
          <div className="flex flex-col">
            <p className="text-white">444,444 조회수</p>
          </div>
        </div>

        <button onClick={openModal}>리뷰달기</button>
        <ReviewModal isOpen={isModalOpen} closeModal={closeModal}></ReviewModal>
      </div>
      <Footer />
    </div>
  );
}

export default Detail;
