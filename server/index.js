const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");
const crawlData = require("./crawlingModule");

const app = express();

app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 요청 본문을 파싱

// 스크롤하는 함수
const scrollPage = async (page, scrollCount) => {
  const viewportHeight = await page.evaluate(() => window.innerHeight); // 현재 뷰포트 높이
  const distance = viewportHeight; // 스크롤 거리
  const delay = 300; // 스크롤 간격

  // 페이지의 끝까지 스크롤
  await page.evaluate(async () => {
    const scrollHeight = document.documentElement.scrollHeight; // 전체 페이지 높이
    let currentHeight = 0;

    while (currentHeight < scrollHeight) {
      window.scrollBy(0, window.innerHeight);
      currentHeight += window.innerHeight;
      await new Promise((resolve) => setTimeout(resolve, 100)); // 스크롤 간격
    }
  });

  // 첫 스크롤 전 대기
  await new Promise((resolve) => setTimeout(resolve, delay));

  // 지정된 횟수만큼 스크롤
  for (let i = 0; i < scrollCount; i++) {
    // 페이지를 아래로 스크롤합니다.
    await page.evaluate((distance) => {
      window.scrollBy(0, distance);
    }, distance);

    // 스크롤 간격만큼 대기합니다.
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

app.post("/crawl", async (req, res) => {
  const { url, boxNumber, selectedNumber, Osearch, Xsearch } = req.body;

  //정밀, 제외 검색어 분할
  const OsearchList = Osearch.split(",").map((term) => term.trim());
  const XsearchList = Xsearch.split(",").map((term) => term.trim());
  console.log(OsearchList, XsearchList);

  try {
    const browser = await puppeteer.launch(); // Puppeteer로 브라우저 실행
    const page = await browser.newPage(); // 새로운 페이지 생성
    await page.goto(url); // 지정된 URL로 이동

    //n회 스크롤합니다.
    if (Number(selectedNumber) > 0) {
      await scrollPage(page, Number(selectedNumber));
      //console.log("scroll");
    }

    const content = await page.content(); // 페이지의 HTML 콘텐츠를 가져옴
    await browser.close(); // 브라우저 종료

    const results = crawlData(content, boxNumber, OsearchList, XsearchList); // 크롤링 결과 얻기

    res.json({ results }); // 추출한 제목들을 JSON 형태로 응답
  } catch (error) {
    res.status(500).json({ error: "크롤링 중 오류가 발생했습니다." }); // 오류 발생 시 500 상태 코드와 메시지 반환
  }
});

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`); // 서버 실행 메시지
});
