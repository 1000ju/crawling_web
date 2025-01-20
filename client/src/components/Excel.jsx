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
      <div className="output_text">{pageText}</div>
    </div>
  );
};

export default output;
