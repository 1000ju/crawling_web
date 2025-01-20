const express = require("express");
const cors = require("cors");
const puppeteer = require("puppeteer");
const axios = require("axios");
const cheerio = require("cheerio");

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
  const { url } = req.body; // 요청 본문에서 URL을 추출
  try {
    const browser = await puppeteer.launch(); // Puppeteer로 브라우저 실행
    const page = await browser.newPage(); // 새로운 페이지 생성
    await page.goto(url); // 지정된 URL로 이동

    // ~초 동안 스크롤합니다.
    //await scrollPage(page, 3);

    const content = await page.content(); // 페이지의 HTML 콘텐츠를 가져옴
    await browser.close(); // 브라우저 종료

    const cheerio = require("cheerio"); // Cheerio 불러오기
    const $ = cheerio.load(content); // Cheerio로 HTML 파싱

    const results = [];
    $("a.news_tit").each((index, element) => {
      const title = $(element).attr("title"); // title 속성 추출
      const href = $(element).attr("href"); // .href

      if (title && href) {
        results.push({ title, href }); // 배열에 추가
      }
    });

    // a.api_txt_lines.dsc_txt_wrap 요소를 순회하여 dscText 값을 가져옴
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
    //console.log(results);

    res.json({ results }); // 추출한 제목들을 JSON 형태로 응답
  } catch (error) {
    res.status(500).json({ error: "크롤링 중 오류가 발생했습니다." }); // 오류 발생 시 500 상태 코드와 메시지 반환
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`); // 서버 실행 메시지
});

// textarea.dispatchEvent(new Event('input', { bubbles: true })); // input 이벤트 발생 (반응형 UI를 위해)
// textarea.dispatchEvent:

// 이 메서드는 특정 이벤트를 지정된 DOM 요소에 디스패치(전달)합니다. 즉, 주어진 요소에서 특정 이벤트가 발생한 것처럼 처리하게 만듭니다.
// new Event('input', { bubbles: true }):

// new Event('input'): 여기서 'input'은 발생시키고자 하는 이벤트의 종류입니다. input 이벤트는 사용자가 입력 필드(예: 텍스트 상자)에 내용을 입력할 때 발생하는 이벤트입니다.
// { bubbles: true }: 이 옵션은 이벤트가 버블링(전파)되도록 설정합니다. 버블링이란, 이벤트가 발생한 요소에서 시작하여 그 부모 요소로 전파되는 과정을 의미합니다. 이를 통해 상위 요소에서도 이 이벤트를 감지하고 처리할 수 있게 됩니다.

// 이유
// 반응형 UI 업데이트:

// 많은 자바스크립트 프레임워크와 라이브러리(예: React, Vue 등)는 입력 필드의 값이 변경될 때 해당 입력 필드에 대해 input 이벤트를 감지하여 UI를 업데이트하는 방식으로 동작합니다.
// textarea.value = sentencs;로 값을 직접 변경하더라도, 단순히 변수의 값을 변경한 것일 뿐, UI가 변경된 것을 감지하지 못할 수 있습니다. 이때 input 이벤트를 발생시켜 UI가 반응하도록 해줍니다.
// 상태 관리:

// 예를 들어, React에서는 onChange 이벤트 핸들러가 input 이벤트를 감지하여 상태를 업데이트합니다. 이 때문에 input 이벤트를 발생시키지 않으면, 상태가 업데이트되지 않거나 UI가 변경되지 않을 수 있습니다.
