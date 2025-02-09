import "./CrawlingPage.css";
import { useState } from "react";
import axios from "axios";
import Excel from "../components/Excel";

const Crawling_page = () => {
  const [search, setSearch] = useState({
    search1: "조선해양",
    search2: "",
    search3: "",
    selectedNumber: "0",
  }); // 검색어를 관리하기 위한 useState 훅
  const [data, setData] = useState([]); // 크롤링 결과 상태를 관리하기 위한 useState 훅
  const [loading, setLoading] = useState(false);
  const [selectBox, setSelectBox] = useState({
    box1: true,
    box2: false,
    box3: false,
  });
  const searchChange = (e) => {
    const { name, value } = e.target;
    setSearch({
      ...search,
      [name]: value,
    });
  };
  const boxChange = (e) => {
    const { name, checked } = e.target;
    setSelectBox({
      ...selectBox,
      [name]: checked,
    });
  };

  //
  const createUrlNBox = (selectBox, boxKey, encodedSearch) => {
    let url = "";
    let boxNumber = 0;

    if (boxKey === "box1" && selectBox.box1 === true) {
      url = `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodedSearch}`; //naver 뉴스
      boxNumber = 1;
    } else if (boxKey === "box2" && selectBox.box2 === true) {
      url = `https://search.naver.com/search.naver?ssc=tab.blog.all&sm=tab_jum&query=${encodedSearch}`; //naver blog
      boxNumber = 2;
    } else if (boxKey === "box3" && selectBox.box3 === true) {
      url = `https://news.google.com/search?sca_esv=c137534a6bb4ed6f&sxsrf=ADLYWII_Y-rZFqebKYMz7mbqecYFgzJP0g:1737350036068&q=${encodedSearch}&fbs=AEQNm0DmKhoYsBCHazhZSCWuALW8zG5KKXpo1pyYBW121r8ao-kBOnxMvGPVEXCCF3I4-Z-FmZ_yoRDoU-jmPBe7c_ooMSh5XYNhi1mODLDxBzi7I6xcVcE2WMmDPHgEHee2JYh5rkoUxcRz8Qem7jKENSm7lLS4CeTYHyFfSGgU_8DvnQfA1r-MglHpMTH-MDR0jkK__B3QcwO2baciWQWq6gKxy4octw&biw=1745&bih=859&dpr=1.1&hl=ko&gl=KR&ceid=KR:ko
`; //google 뉴스
      boxNumber = 3;
    }

    return { url, boxNumber };
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 검색어를 URL 인코딩
      const encodedSearch = encodeURIComponent(search.search1);

      // 모든 키 가져오기
      const keys = Object.keys(selectBox);
      setData(() => []); // 빈 배열로 초기화
      const Osearch = search.search2;
      const Xsearch = search.search3;

      if (selectBox.box1) {
        // box1의 키 가져오기
        const boxKey = keys.find((key) => key === "box1");

        const { url, boxNumber } = createUrlNBox(
          selectBox,
          boxKey,
          encodedSearch
        );
        console.log("post요청");
        const selectedNumber = search.selectedNumber;
        const response = await axios.post("http://localhost:5000/crawl", {
          url,
          boxNumber,
          selectedNumber,
          Osearch,
          Xsearch,
        }); // 서버에 POST 요청
        setData((prevData) => [...prevData, ...response.data.results]); // 이전 상태와 새 데이터 결합
        console.log("Naver News");
        // (응답으로 results로 보냈으니 정확하게 results까지 덧붙여줘야함. props이름 끼리는 맞춰줘야 값을 받아올 수 있음음)
      }
      if (selectBox.box2) {
        // box1의 키 가져오기
        const boxKey = keys.find((key) => key === "box2");

        const { url, boxNumber } = createUrlNBox(
          selectBox,
          boxKey,
          encodedSearch
        );
        const selectedNumber = search.selectedNumber;
        const response = await axios.post("http://localhost:5000/crawl", {
          url,
          boxNumber,
          selectedNumber,
          Osearch,
          Xsearch,
        }); // 서버에 POST 요청
        setData((prevData) => [...prevData, ...response.data.results]);
        console.log("Naver Blog");
      }

      if (selectBox.box3) {
        // box1의 키 가져오기
        const boxKey = keys.find((key) => key === "box3");

        const { url, boxNumber } = createUrlNBox(
          selectBox,
          boxKey,
          encodedSearch
        );
        const selectedNumber = search.selectedNumber;
        const response = await axios.post("http://localhost:5000/crawl", {
          url,
          boxNumber,
          selectedNumber,
          Osearch,
          Xsearch,
        }); // 서버에 POST 요청
        setData((prevData) => [...prevData, ...response.data.results]);
        console.log("Google News");
        // fall through
      }
    } catch (error) {
      console.error(error); // 오류가 발생하면 콘솔에 출력
    } finally {
      setLoading(false);
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter") fetchData(); // 엔터 키가 눌리면 fetchData 호출
  };
  return (
    <div className="CrawlingPage">
      <h1 className="title_section">웹 크롤러</h1>
      <input
        className="input_section"
        type="text"
        value={search.search1}
        name="search1"
        onChange={searchChange} // 입력 필드의 값이 변경될 때 URL 상태 업데이트
        onKeyDown={handleKeyPress}
        placeholder="검색어를 입력하세요"
      />
      <button className="button_section" onClick={fetchData}>
        크롤링 시작
      </button>

      <div className="filtering_section">
        <input
          type="text"
          value={search.search2}
          name="search2"
          onChange={searchChange}
          onKeyDown={handleKeyPress}
          placeholder="정밀검색어"
        />
        <input
          type="text"
          value={search.search3}
          name="search3"
          onChange={searchChange}
          onKeyDown={handleKeyPress}
          placeholder="제외검색어"
        />

        <select
          className="scroll"
          name="selectedNumber"
          value={search.selectedNumber}
          onChange={searchChange}
        >
          {/* 숫자 옵션을 생성합니다. */}
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
        <div>스크롤 횟수</div>
      </div>

      <div className="checkbox_section">
        <label>
          네이버 뉴스
          <input
            type="checkbox"
            name="box1"
            checked={selectBox.box1}
            onChange={boxChange}
          />
        </label>
        <label>
          네이버 Blog
          <input
            type="checkbox"
            name="box2"
            checked={selectBox.box2}
            onChange={boxChange}
          />
        </label>
        <label>
          구글 뉴스
          <input
            type="checkbox"
            name="box3"
            checked={selectBox.box3}
            onChange={boxChange}
          />
        </label>
      </div>

      <div className="output_section">
        {loading ? ( // 로딩 상태에 따라 메시지 표시
          <h2>검색 중...</h2>
        ) : (
          data.map((item, index) =>
            item.title !== undefined ? (
              <Excel
                key={index}
                id={index}
                href={item.href}
                title={item.title}
                pageText={item.dscText}
              />
            ) : (
              ""
            )
          )
        )}
      </div>
    </div>
  );
};

export default Crawling_page;
