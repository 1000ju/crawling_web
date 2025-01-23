import "./Excel.css";

const output = ({ id, href, title, pageText }) => {
  return (
    <div className="Excel">
      <a
        className="output_title"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`${id + 1}.  ${title}`}
      </a>
      <div className="output_text">{pageText ? pageText : ""}</div>
      {/* google news의 경우에는 본문 내용이 없음. 있을 경우에만 출력 */}
    </div>
  );
};

export default output;
