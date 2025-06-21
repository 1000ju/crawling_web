// crawlingModule.js
const cheerio = require("cheerio");

const crawlData = (content, boxNumber, OsearchList, XsearchList) => {
  const results = [];

  // 제목과 링크 추출
  const $ = cheerio.load(content); // Cheerio로 HTML 파싱

  switch (boxNumber) {
    case 1: {
      // 네이버 뉴스 검색 (2025년 기준 최신 구조)
      $("div.sds-comps-base-layout").each((index, element) => {
        // 제목 추출 (헤드라인 텍스트)
        const titleElement = $(element).find(
          "span.sds-comps-text-type-headline1"
        );
        const title = titleElement.text().trim();

        // 링크 추출 (제목 링크)
        const hrefElement = $(element).find("a").first();
        const href = hrefElement.attr("href");

        // 본문 요약 텍스트 추출
        const dscTextElement = $(element).find(
          "span.sds-comps-text-type-body1"
        );
        const dscText = dscTextElement.text().trim();

        // 조건 검사 후 결과 저장
        if (
          title &&
          href &&
          dscText &&
          isValidResult(title, OsearchList, XsearchList) &&
          isValidResult(dscText, OsearchList, XsearchList)
        ) {
          results.push({ title, href, dscText });
        }
      });
      break;
    }

    case 2: {
      // 네이버 블로그 검색
      $("a.title_link").each((index, element) => {
        const title = $(element).text(); // title 속성 추출
        const href = $(element).attr("href"); // .href

        // dscText 추출
        const dscTextElement = $("a.dsc_link").eq(index); // 같은 인덱스의 dscText 요소 가져오기
        const dscText = dscTextElement.text(); // dscText 추출

        // 조건 체크: title과 dscText 모두 유효한 경우에만 결과에 추가
        if (
          title &&
          href &&
          dscText &&
          isValidResult(title, OsearchList, XsearchList) &&
          isValidResult(dscText, OsearchList, XsearchList)
        ) {
          results.push({ title, href, dscText }); // 배열에 추가
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

        if (title && href && isValidResult(title, OsearchList, XsearchList)) {
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

// 수집 조건을 확인하는 함수 text에 title, dsctext넣어서 검사
const isValidResult = (text, OsearchList, XsearchList) => {
  const hasValidOsearch = OsearchList.some(
    (searchItem) => searchItem.trim() !== ""
  );
  const hasValidXsearch = XsearchList.some(
    (searchItem) => searchItem.trim() !== ""
  );

  if (!hasValidOsearch && !hasValidXsearch) {
    return true;
  } else {
    let isInOsearch = true;
    let isInXsearch = false;
    // OsearchList에 해당하는 내용이 있는지 확인
    if (hasValidOsearch) {
      isInOsearch = OsearchList.some((searchItem) => text.includes(searchItem));
    }
    // XsearchList에 해당하는 내용이 있는지 확인
    if (hasValidXsearch) {
      isInXsearch = XsearchList.some((searchItem) => text.includes(searchItem));
    }
    console.log(isInOsearch, !isInXsearch);
    return isInOsearch && !isInXsearch; // 조건에 맞으면 true 반환
  }
};

module.exports = crawlData; // 모듈 내보내기
