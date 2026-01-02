import { useEffect, useState, useRef } from "react";
import { RULES } from "../../data/rules";

const RULES_PER_STEP = 2;

/* 📱 Device detection */
const isMobile = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* 🗣 Voice cache */
let cachedVoices = [];

/* Load voices safely */
const loadVoices = () =>
  new Promise((resolve) => {
    const voices = speechSynthesis.getVoices();
    if (voices.length) {
      cachedVoices = voices;
      resolve(voices);
    } else {
      speechSynthesis.onvoiceschanged = () => {
        cachedVoices = speechSynthesis.getVoices();
        resolve(cachedVoices);
      };
    }
  });

const RulesModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("en");
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const [muted, setMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  /* Auto height */
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("auto");

  const totalSteps = Math.ceil(RULES.length / RULES_PER_STEP);

  /* 🔊 SPEAK (STABLE) */
  const speak = async (text) => {
    if (muted) return;

    await loadVoices();
    speechSynthesis.cancel();

    const mobile = isMobile();
    const voices = cachedVoices;

    const tamilVoice = voices.find(v => v.lang.startsWith("ta"));
    const englishVoice = voices.find(v => v.lang.startsWith("en"));

    if (lang === "ta" && !mobile) return;
    if (lang === "ta" && mobile && !tamilVoice) return;

    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.95;

    msg.onstart = () => setIsSpeaking(true);
    msg.onend = () => setIsSpeaking(false);
    msg.onerror = () => setIsSpeaking(false);

    if (lang === "ta") {
      msg.lang = "ta-IN";
      msg.voice = tamilVoice;
    } else {
      msg.lang = "en-US";
      msg.voice = englishVoice;
    }

    speechSynthesis.speak(msg);
  };

  /* 🔊 AUTO TTS */
  useEffect(() => {
    if (muted) return;

    const text = RULES
      .slice(step * RULES_PER_STEP, step * RULES_PER_STEP + RULES_PER_STEP)
      .map(r => r[lang])
      .join(". ");

    speak(text);
  }, [step, lang]);

  /* 📐 Auto height */
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [step, lang]);

  /* Navigation */
  const nextStep = () => {
    if (step + 1 >= totalSteps) {
      closePopup();
    } else {
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  /* Swipe */
  let touchStartX = 0;

  const onTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50) nextStep();
    if (diff < -50) prevStep();
  };

  /* MUTE */
  const muteAudio = () => {
    speechSynthesis.cancel();
    setMuted(true);
    setIsSpeaking(false);
  };

  /* LISTEN */
  const listenNow = () => {
    setMuted(false);
    const text = RULES
      .slice(step * RULES_PER_STEP, step * RULES_PER_STEP + RULES_PER_STEP)
      .map(r => r[lang])
      .join(". ");
    speak(text);
  };

  const closePopup = () => {
    if (dontShowAgain) {
      localStorage.setItem("hideRulesPopup", "true");
    }
    speechSynthesis.cancel();
    onClose();
  };

  const disableTamilTTS = lang === "ta" && !isMobile();

  return (
    <div className="fixed inset-0 z-101 bg-black/60 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-md rounded-xl p-6 overflow-x-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">📜 Rules & Guidelines</h2>
          <button
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
            className="border px-3 py-1 rounded-md text-sm"
          >
            {lang === "en" ? "தமிழ்" : "English"}
          </button>
        </div>

        {/* RULES SLIDER */}
        <div
          className="overflow-hidden transition-[height] duration-300"
          style={{ height: contentHeight }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={contentRef}
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${step * 100}%)` }}
          >
            {Array.from({ length: totalSteps }).map((_, index) => {
              const rulesForStep = RULES.slice(
                index * RULES_PER_STEP,
                index * RULES_PER_STEP + RULES_PER_STEP
              );

              return (
                <div
                  key={index}
                  className="w-full shrink-0 space-y-3 px-3"
                >
                  {rulesForStep.map((rule, i) => (
                    <div
                      key={i}
                      className="bg-gray-100 p-3 rounded-md text-sm wrap-break-word leading-relaxed"
                    >
                      {rule[lang]}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* 🔊 LISTEN + 🔇 MUTE (TWO BUTTONS) */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={listenNow}
            disabled={disableTamilTTS}
            className={`flex-1 py-2 rounded-md text-white ${
              disableTamilTTS ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            🔊 Listen
          </button>

          <button
            onClick={muteAudio}
            className={`px-4 py-2 rounded-md ${
              muted ? "bg-red-500 text-white" : "bg-gray-200"
            }`}
          >
            🔇 Mute
          </button>
        </div>

        {disableTamilTTS && (
          <p className="text-xs text-center text-red-500 mt-1">
            Tamil voice supported only on mobile
          </p>
        )}

        {/* ☑ DON’T SHOW AGAIN */}
        <label className="flex items-center gap-2 mt-3 text-sm">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don’t show again
        </label>

        {/* DOTS */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === step ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex justify-between mt-5">
          <button
            onClick={prevStep}
            disabled={step === 0}
            className="px-4 py-2 rounded-md bg-gray-200 text-sm"
          >
            ⬅ Prev
          </button>

          <button
            onClick={nextStep}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {step + 1 === totalSteps ? "Finish" : "Next ➡"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RulesModal;
