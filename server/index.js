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
const scrollPage = async (page, duration) => {
  const endTime = Date.now() + duration * 1000; // 종료 시간을 설정합니다.
  const distance = 100; // 스크롤 거리
  const delay = 100; // 스크롤 간격

  while (Date.now() < endTime) {
    // 페이지를 아래로 스크롤합니다.
    await page.evaluate((distance) => {
      window.scrollBy(0, distance);
    }, distance);

    // 스크롤 간격만큼 대기합니다.
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
};

app.post("/crawl", async (req, res) => {
  const { url, boxNumber } = req.body; // 요청 본문에서 URL을 추출

  console.log(boxNumber);
  try {
    const browser = await puppeteer.launch(); // Puppeteer로 브라우저 실행
    const page = await browser.newPage(); // 새로운 페이지 생성
    await page.goto(url); // 지정된 URL로 이동

    // ~초 동안 스크롤합니다.
    //await scrollPage(page, 3);

    const content = await page.content(); // 페이지의 HTML 콘텐츠를 가져옴
    await browser.close(); // 브라우저 종료

    // const cheerio = require("cheerio"); // Cheerio 불러오기
    // const $ = cheerio.load(content); // Cheerio로 HTML 파싱

    // const results = [];
    // $("a.news_tit").each((index, element) => {
    //   const title = $(element).attr("title"); // title 속성 추출
    //   const href = $(element).attr("href"); // .href

    //   if (title && href) {
    //     results.push({ title, href }); // 배열에 추가
    //   }
    // });

    // // a.api_txt_lines.dsc_txt_wrap 요소를 순회하여 dscText 값을 가져옴
    // const dscTexts = [];
    // $("a.api_txt_lines.dsc_txt_wrap").each((index, element) => {
    //   const dscText = $(element).text(); // <a> 태그 안의 텍스트 가져오기
    //   if (dscText) {
    //     dscTexts.push(dscText); // dscTexts 배열에 추가
    //   }
    // });

    // // results 배열의 각 객체에 dscText 값을 추가
    // results.forEach((result, index) => {
    //   if (dscTexts[index]) {
    //     result.dscText = dscTexts[index]; // dscText 추가
    //   }
    // });
    // //console.log(results);

    const results = crawlData(content, boxNumber); // 크롤링 결과 얻기

    res.json({ results }); // 추출한 제목들을 JSON 형태로 응답
  } catch (error) {
    res.status(500).json({ error: "크롤링 중 오류가 발생했습니다." }); // 오류 발생 시 500 상태 코드와 메시지 반환
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`); // 서버 실행 메시지
});
