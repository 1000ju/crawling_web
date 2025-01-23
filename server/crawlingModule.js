// crawlingModule.js
const cheerio = require("cheerio");

const crawlData = (content, boxNumber) => {
  const results = [];

  // 제목과 링크 추출
  const $ = cheerio.load(content); // Cheerio로 HTML 파싱

  switch (boxNumber) {
    case 1: {
      //네이버 뉴스 검색
      $("a.news_tit").each((index, element) => {
        const title = $(element).attr("title"); // title 속성 추출
        const href = $(element).attr("href"); // .href

        if (title && href) {
          results.push({ title, href }); // 배열에 추가
        }
      });

      // dscText 추출
      const dscTexts = [];
      $("a.api_txt_lines.dsc_txt_wrap").each((index, element) => {
        const dscText = $(element).text(); // <a> 태그 안의 텍스트 가져오기
        if (dscText) {
          dscTexts.push(dscText); // dscTexts 배열에 추가
        }
      });

      // results 배열의 각 객체에 dscText 값을 추가
      results.forEach((result, index) => {
        if (dscTexts[index]) {
          result.dscText = dscTexts[index]; // dscText 추가
        }
      });
      break;
    }

    case 2: {
      //네이버 블로그 검색
      $("a.title_link").each((index, element) => {
        const title = $(element).text(); // title 속성 추출
        const href = $(element).attr("href"); // .href

        if (title && href) {
          results.push({ title, href }); // 배열에 추가
        }
      });

      // dscText 추출
      const dscTexts = [];
      $("a.dsc_link").each((index, element) => {
        const dscText = $(element).text(); // <a> 태그 안의 텍스트 가져오기
        if (dscText) {
          dscTexts.push(dscText); // dscTexts 배열에 추가
        }
      });

      // results 배열의 각 객체에 dscText 값을 추가
      results.forEach((result, index) => {
        if (dscTexts[index]) {
          result.dscText = dscTexts[index]; // dscText 추가
        }
      });
      break;
    }

    case 3: {
      //구글 뉴스 - 고급 검색
      $("a.JtKRv").each((index, element) => {
        const title = $(element).text(); // title 속성 추출
        let href = $(element).attr("href"); // .href
        href = `https://news.google.com/${href}`;

        if (title && href) {
          results.push({ title, href }); // 배열에 추가
        }
      });

      break;
    }

    default: {
      console.log("뭔가 이상한데요, 모듈 오류인듯하니 확인해보슈");
    }
  }

  return results; // 결과 반환
};

module.exports = crawlData; // 모듈 내보내기
