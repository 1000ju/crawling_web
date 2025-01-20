import "./CrawlingPage.css";
import { useState } from "react";
import axios from "axios";
import Excel from "../components/Excel";

const Crawling_page = () => {
  const [search, setSearch] = useState("조선해양"); // 검색어를 관리하기 위한 useState 훅
  const [data, setData] = useState([{}]); // 크롤링 결과 상태를 관리하기 위한 useState 훅
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      //search기반으로 url을 만듦
      const encodedSearch = encodeURIComponent(search); // 검색어를 URL 인코딩
      const url = `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=${encodedSearch}`; //naver 뉴스

      console.log("post요청");
      const response = await axios.post("http://localhost:5000/crawl", { url }); // 서버에 POST 요청
      setData(response.data.results); // response.data는 서버에서 반환된 데이터에 접근하는 방법
      // (응답으로 results로 보냈으니 정확하게 results까지 덧붙여줘야함. props이름 끼리는 맞춰줘야 값을 받아올 수 있음음)
      console.log(response.data.results);
      console.log("Done");
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
        value={search}
        onChange={(e) => setSearch(e.target.value)} // 입력 필드의 값이 변경될 때 URL 상태 업데이트
        onKeyDown={handleKeyPress}
        placeholder="검색어를 입력하세요"
      />
      <button className="button_section" onClick={fetchData}>
        크롤링 시작
      </button>

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
