import Footer from "@/components/Footer";
import HeaderMain from "@/components/HeaderMain";
import { useCallback, useState } from "react";
import ReviewModal from "@/components/modal/ReviewModal";
// import useContent from "@/store/useContent";
import { useEffect, useLayoutEffect, useRef, React } from "react";
import { getData, postData } from "@/utils/crud";
import Cookies from "js-cookie";
// import useReview from "@/store/useReviews";
import useContents from "@/store/useContent";
import useReviews from "@/store/useReviews";
import Star from "@/components/Star";
import ChangeReview from "@/components/modal/ChangeReview";
import Spinner from "@/components/Spinner";
import StarRating from "@/components/StarRating";
import { useNavigate } from "react-router-dom";
import useDetail from "@/store/useDetail";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useQueryClient } from "@tanstack/react-query";

import dibs from "@/assets/dibs.svg";
import share from "@/assets/share.svg";
import play from "@/assets/play.svg";

function Detail() {
  const queryClient = useQueryClient();
  const { content, genre, setGenre } = useContents();
  const { isLoading, isSearch, setIsLoading, setIsSearch } = useDetail();
  const { reviewState, setReviewState, reset } = useReviews();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleDotClick = (e) => {
    e.stopPropagation();

    if (isChangeModalOpen) {
      setIsChangeModalOpen(false);
    } else {
      setIsChangeModalOpen(true); // 모달이 닫혀 있을 경우, 열기 실행
    }
  };
  // 모달 창을 여는 함수
  const openModal = () => {
    -setIsModalOpen(true);
  };

  // 모달 창을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 모달 창을 닫는 함수
  const closeChangeModal = () => {
    setIsChangeModalOpen(false);
  };

  const refresh = async () => {
    try {
      const reUrl = `https://hoyeonjigi.site/user/refresh`;

      const userId = Cookies.get("userId");
      const isAutoLogin = Cookies.get("autoLogin");

      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Token": `${Cookies.get("accessToken")}`,
        "Refresh-Token": `${Cookies.get("refreshToken")}`,
      };

      const body = {};

      const response = await postData(reUrl, body, headers);

      Cookies.set("accessToken", response.accessToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", response.refreshToken, {
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("grantType", response.grantType, {
        secure: true,
        sameSite: "strict",
      });
      //자동 로그인 시 만료 시간 재설정
      if (isAutoLogin) {
        Cookies.set("autoLogin", true, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        Cookies.set("accessToken", response.accessToken, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        Cookies.set("refreshToken", response.refreshToken, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        Cookies.set("grantType", response.grantType, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
        Cookies.set("userId", userId, {
          secure: true,
          sameSite: "strict",
          expires: 7,
        });
      }
    } catch (error) {
      //refreshToken 만료 시 onBoarding으로 이동
      navigate("/");
    }
  };

  useLayoutEffect(() => {
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
          const url = `https://hoyeonjigi.site/genre/${genreId}`;
          return getData(url, headers); // getData 함수가 각 URL에 대해 요청을 수행하고, 프로미스를 반환한다고 가정합니다.
        });

        // Promise.all을 사용하여 모든 프로미스가 완료되길 기다립니다.
        const results = await Promise.all(promises);
        setGenre(results);
      } catch (error) {
        console.log(error);
        console.log("장르에러");
        refresh();
      }
    };

    contentData();
  }, [isSearch]); // 이 효과는 컴포넌트가 마운트될 때만 실행됩니다.

  //--------------------------------------------------------------------

  const fetchReviews = async ({ pageParam }) => {
    if (reviewState.endPage === true) {
      return;
    }
    try {
      // API로부터 리뷰 데이터를 페이지별로 가져오는 함수
      const type = Cookies.get("grantType");
      const token = Cookies.get("accessToken");

      const headers = {
        "Content-Type": "application/json",
        Authorization: `${type} ${token}`,
      };

      // API URL 구성, pageParam을 사용하여 현재 페이지 지정
      const url = `https://hoyeonjigi.site/evaluation/${content.contentId}?page=${pageParam}`;

      const response = await getData(url, headers);

      setIsLoading(false);

      return response; // JSON 형태로 파싱된 응답 데이터
    } catch (error) {
      // 에러 발생 시 콘솔에 에러 메시지 출력
      console.error("fetchReviews 에러:", error);

      console.log(data);
      setReviewState({ endPage: true });
    }
  };

  const { ref, inView } = useInView();

  const {
    data,
    status,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["infinity"],
    queryFn: fetchReviews,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // return allPages.length;
      // if (!lastPage) {
      //   return undefined; // 빈 페이지를 명시적으로 처리
      // }
      console.log(lastPage)

      return allPages.length;
    },
  });

  // // 등록, 삭제 됐을 시 로직
  // useEffect(() => {
  //   if (reviewState.isReview || reviewState.deleteReview) {
  //     queryClient.invalidateQueries(["infinity"]);
  //     refetch();
  //     console.log(data);

  //     if (data) {
  //       const updateReviewState = () => {
  //         // reset();
  //         console.log("변경 데이터");
  //         // 초기화 후 새로운 상태를 병합하여 업데이트

  //         console.log(data);
  //         // console.log(data.pages[0].evaluationCount);
  //         // console.log(data.pages[0].evaluationList);
  //         // console.log(reviewState.numberOfReviews);

  //         // if (data.pages[0].evaluationCount !== reviewState.numberOfReviews) {
  //         //   console.log("등록 또는 취소");
  //         //   setReviewState({
  //         //     averageRating: data.pages[0].avg,
  //         //     numberOfReviews: data.pages[0].evaluationCount,
  //         //     review: data.pages[0].evaluationList,
  //         //     isReview: false,
  //         //     deleteReview: false,
  //         //     len: 0,
  //         //   });
  //         // }
  //       };

  //       updateReviewState(); // 리뷰 상태 업데이트 함수 호출
  //       window.scrollTo(0, 0);
  //     }
  //   }
  // }, [data, reviewState.isReview, reviewState.deleteReview]);

  

  

  //스크롤을 내리면 기존 있었던 리뷰에 추가된 리뷰를 업데이트
  useEffect(() => {
    if (reviewState.endPage === true || !inView) {
      return;
    }

    if (data) {
      if (data.pages.length !== reviewState.len) {
        setReviewState({
          averageRating: data.pages[data.pages.length - 1].avg,
          numberOfReviews: data.pages[data.pages.length - 1].evaluationCount,
          review: [
            ...reviewState.review,
            ...data.pages[data.pages.length - 1].evaluationList,
          ],
        });
      }

      console.log(hasNextPage)
      fetchNextPage();
    }
  }, [data, inView, reviewState.endPage]);

  // 맨 처음 랜더링 됐을때 초기 데이터 입력
  useEffect(() => {
    if (reviewState.isFirst === false) {
      return;
    }

    if (data) {
      data.pages.map((reviews) => {
        setReviewState({
          averageRating: reviews.avg,
          numberOfReviews: reviews.evaluationCount,
          review: reviews.evaluationList,
          len: data.pages.length,
          isFirst: false,
        });
      });
    }
  }, [data, reviewState.isFirst]);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // 스크롤을 맨 위로 올립니다
    window.scrollTo(0, 0);

    // React Query 캐시를 초기화합니다
    queryClient.removeQueries(["infinity"]);

    // 컴포넌트의 상태를 초기화합니다
    reset();

    // isLoading 상태를 true로 설정하여 로딩 스피너를 표시합니다
    setIsLoading(true);

    // 필요한 경우 다른 상태들도 초기화합니다
    setIsModalOpen(false);
    setIsChangeModalOpen(false);

    // 컴포넌트가 언마운트될 때 실행될 클린업 함수
    return () => {
      // 필요한 경우 여기에 추가적인 클린업 로직을 작성할 수 있습니다
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []); // 빈 배열을 넣어 컴포넌트가 마운트될 때만 실행되도록 합니다

  return (
    <div className="bg-black">
      <HeaderMain />

      {/* 컨텐츠영역 */}
      {/* flex justify-between font-noto px-16 pb-12 pt-10 */}
      <div className="flex justify-between font-noto px-16 pb-12 pt-10 h-1420:h-[55vh] h-1920:h-[60vh]">
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
          <div className="flex flex-row items-center gap-8 mb-7">
            <button className="flex items-center bg-white px-16 py-6 rounded">
              <img src={play} alt="시청하기" />
              <span className="ml-3 text-xl font-extrabold text-black">
                1화 시청하기
              </span>
            </button>
            <div className="text-white flex gap-8">
              <button>
                <img src={dibs} alt="찜하기" className="w-10" />
                <span>찜</span>
              </button>
              <button>
                <img src={share} alt="공유하기" className="w-10 fill-white" />
                <span>공유</span>
              </button>
            </div>
          </div>

          <p className="text-gray_07 font-semibold w-[70%] text-lg">
            {content.contentOverview}
          </p>
        </div>
        <div className="flex-[0.3] flex justify-center">
          <img
            src={content.src}
            alt={content.alt}
            className="h-[60vh] h-1420:h-[45vh] h-1920:h-[45vh] "
          />
        </div>
      </div>

      <hr className="border-0 h-[1px] bg-gray_04 mx-12" />

      {/* 평점 영역 */}
      <div className="bg-black flex gap-4 mb-10">
        <div className="flex-grow-[0.2] ml-16 mt-10 relative">
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="flex items-center">
              <div className="text-6xl text-white font-extrabold mr-4 flex items-center">
                {reviewState.averageRating}
              </div>
              <div className="flex flex-col gap-2">
                <StarRating rating={reviewState.averageRating} />
                <p className="text-white">
                  {reviewState.numberOfReviews}개 평점
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between mt-8">
            <button
              onClick={openModal}
              className="border border-gray_05 hover:border-white text-white px-10 py-2 font-bold rounded-full"
            >
              리뷰 작성
            </button>

            <button
              className="text-white text-3xl font-bold modal-trigger mr-10"
              onClick={handleDotClick}
            >
              ⋮
            </button>
          </div>
          <ChangeReview
            isOpen={isChangeModalOpen}
            onClose={closeChangeModal}
          ></ChangeReview>
          <ReviewModal
            isOpen={isModalOpen}
            closeModal={closeModal}
          ></ReviewModal>
        </div>

        <div className="flex flex-grow-[0.8] flex-col mb-24">
          <ul>
            <h3 className="text-white font-semibold mt-11">최신순</h3>

            {reviewState.review.length > 0 ? (
              reviewState.review.map((item, index) => (
                <li className="mt-11" key={index}>
                  <Star starRating={item.starRating}></Star>
                  <p className="text-white mt-2 font-medium">{item.review}</p>
                  <span className="mt-2 text-gray_07 text-sm">
                    {item.profileName} • {item.ratingDate}{" "}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray_08 text-3xl mt-6 font-medium">
                등록된 리뷰가 없습니다.
              </p>
            )}
          </ul>
          {/* IntersectionObserver에 의해 관찰될 요소 */}
          <div id="observer"></div>
        </div>
      </div>
      <div ref={ref}></div>
      <Footer />
    </div>
  );
}

export default Detail;
