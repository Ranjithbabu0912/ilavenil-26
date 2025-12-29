import "./style.css";

const text = "ILAVENIL'26";

export default function Loader() {
  return (
    <div className="creative-loader-wrapper">
      <div className="word">
        {text.split("").map((char, i) => (
          <span className="logo-text text-4xl md:text-6xl lg:text-8xl" key={i} style={{ "--i": i }}>
            {char}
          </span>
        ))}
      </div>
      <p className="sub">A season of young talent</p>
    </div>
  );
}
