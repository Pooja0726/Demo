import { useState, useEffect, useRef } from "react";

const questions = [
  { id: 1, text: "Do you like me? 🥺", emoji: "💕" },
  { id: 2, text: "Do you want me in your life?", emoji: "🌹" },
  { id: 3, text: "Will you come to me after a fight and say sorry?", emoji: "🤍" },
  { id: 4, text: "Will you make more time for me?", emoji: "⏰" },
  { id: 5, text: "Am I important to you?", emoji: "💌" },
  { id: 6, text: "Do you promise to never ignore me again?", emoji: "🌸" },
  { id: 7, text: "Will you hold my hand when I need you?", emoji: "🫶" },
];

const floatingHearts = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 5 + Math.random() * 5,
  size: 12 + Math.random() * 24,
  opacity: 0.3 + Math.random() * 0.5,
}));

function Heart({ size = 24, color = "#e91e63", className = "", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className} style={style}>
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
    </svg>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro"); // intro | angry | questions | forgive | end
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showHeart, setShowHeart] = useState(false);
  const [shake, setShake] = useState(false);
  const [allYes, setAllYes] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "intro") {
      timerRef.current = setTimeout(() => setPhase("angry"), 3500);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  function handleAnswer(yes) {
    const newAnswers = [...answers, yes];
    setAnswers(newAnswers);
    setShowHeart(yes);
    if (!yes) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
    setTimeout(() => {
      setShowHeart(false);
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        const allAnsweredYes = newAnswers.every(Boolean);
        setAllYes(allAnsweredYes);
        setPhase("end");
      }
    }, 900);
  }

  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 30%, #fce4ec 60%, #fff0f3 100%)",
      fontFamily: "'Georgia', serif",
      overflow: "hidden",
      position: "relative",
    }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20px) rotate(20deg); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        @keyframes heartPop {
          0% { transform: scale(0) translateY(0); opacity: 1; }
          60% { transform: scale(1.4) translateY(-30px); opacity: 1; }
          100% { transform: scale(1) translateY(-60px); opacity: 0; }
        }
        @keyframes glitter {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes swingIn {
          0% { opacity: 0; transform: rotate(-15deg) scale(0.8); }
          100% { opacity: 1; transform: rotate(0deg) scale(1); }
        }
        .btn-yes {
          background: linear-gradient(135deg, #e91e63, #c2185b);
          color: white;
          border: none;
          padding: 14px 40px;
          border-radius: 50px;
          font-size: 18px;
          font-family: Georgia, serif;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(233,30,99,0.35);
          transition: all 0.2s;
        }
        .btn-yes:hover { transform: scale(1.07); box-shadow: 0 6px 28px rgba(233,30,99,0.5); }
        .btn-no {
          background: white;
          color: #c2185b;
          border: 2px solid #f48fb1;
          padding: 14px 40px;
          border-radius: 50px;
          font-size: 18px;
          font-family: Georgia, serif;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-no:hover { background: #fce4ec; transform: scale(1.04); }
      `}</style>

      {/* Floating hearts background */}
      {floatingHearts.map(h => (
        <div key={h.id} style={{
          position: "fixed",
          left: `${h.left}%`,
          bottom: "-60px",
          animation: `floatUp ${h.duration}s ${h.delay}s infinite linear`,
          pointerEvents: "none",
          zIndex: 0,
        }}>
          <Heart size={h.size} color={h.id % 3 === 0 ? "#e91e63" : h.id % 3 === 1 ? "#f06292" : "#ad1457"} style={{ opacity: h.opacity }} />
        </div>
      ))}

      {/* INTRO PHASE */}
      {phase === "intro" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10,
          animation: "fadeInDown 1s ease",
        }}>
          <div style={{ animation: "pulse 1.5s infinite", marginBottom: 24 }}>
            <Heart size={100} color="#e91e63" />
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 6vw, 52px)", color: "#880e4f",
            textAlign: "center", margin: "0 20px 12px",
            textShadow: "0 2px 10px rgba(136,14,79,0.15)",
            animation: "fadeInDown 1s 0.4s both ease",
          }}>I need to tell you something...</h1>
          <p style={{
            fontSize: 20, color: "#c2185b", opacity: 0.8,
            animation: "fadeInUp 1s 0.8s both ease",
          }}>Just a second 💕</p>
        </div>
      )}

      {/* ANGRY PHASE */}
      {phase === "angry" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10, padding: "20px",
        }}>
          <div style={{ animation: "swingIn 0.7s ease", textAlign: "center", maxWidth: 600 }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "bounce 2s infinite" }}>😤</div>
            <div style={{
              background: "white",
              borderRadius: 24,
              padding: "36px 40px",
              boxShadow: "0 8px 40px rgba(233,30,99,0.18)",
              border: "2px solid #f48fb1",
              marginBottom: 32,
            }}>
              <h2 style={{ color: "#880e4f", fontSize: "clamp(20px, 4vw, 30px)", marginBottom: 20, lineHeight: 1.4 }}>
                I am upset with you 😞
              </h2>
              <p style={{ color: "#c2185b", fontSize: "clamp(15px, 3vw, 19px)", lineHeight: 1.8, margin: 0 }}>
                You have not been giving me any time lately. I feel invisible, like I don't matter to you anymore.
                I wait for you, I think about you, and you just... disappear. 💔
                <br /><br />
                I'm not trying to fight. I just want <b>you</b>. Your time. Your attention. <b>Us.</b>
              </p>
            </div>
            <p style={{ color: "#ad1457", fontSize: 17, marginBottom: 28, fontStyle: "italic" }}>
              Before anything else — I have some questions for you.
            </p>
            <button className="btn-yes" onClick={() => setPhase("questions")} style={{ fontSize: 20, padding: "16px 50px" }}>
              Okay, I'm listening 👂
            </button>
          </div>
        </div>
      )}

      {/* QUESTIONS PHASE */}
      {phase === "questions" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10, padding: "20px",
        }}>
          {/* Progress bar */}
          <div style={{ width: "min(500px, 90vw)", marginBottom: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#880e4f", fontSize: 14 }}>Question {currentQ + 1} of {questions.length}</span>
              <span style={{ color: "#c2185b", fontSize: 14 }}>
                {questions[currentQ].emoji}
              </span>
            </div>
            <div style={{ height: 8, background: "#fce4ec", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${progress}%`,
                background: "linear-gradient(90deg, #e91e63, #ad1457)",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>

          <div key={currentQ} style={{
            background: "white",
            borderRadius: 28,
            padding: "44px 40px",
            maxWidth: 500,
            width: "90vw",
            boxShadow: "0 12px 50px rgba(233,30,99,0.18)",
            border: "2px solid #f48fb1",
            textAlign: "center",
            animation: `${shake ? "shake 0.5s" : "swingIn 0.5s ease"}`,
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ fontSize: 50, marginBottom: 20 }}>{questions[currentQ].emoji}</div>
            <h2 style={{ color: "#880e4f", fontSize: "clamp(18px, 4vw, 26px)", lineHeight: 1.5, marginBottom: 36 }}>
              {questions[currentQ].text}
            </h2>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn-yes" onClick={() => handleAnswer(true)}>Yes 💕</button>
              <button className="btn-no" onClick={() => handleAnswer(false)}>No 😔</button>
            </div>

            {/* Heart pop on yes */}
            {showHeart && (
              <div style={{
                position: "absolute", top: "40%", left: "50%",
                transform: "translateX(-50%)",
                animation: "heartPop 0.9s ease forwards",
                pointerEvents: "none",
              }}>
                <Heart size={60} color="#e91e63" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* END PHASE */}
      {phase === "end" && (
        <div style={{
          position: "fixed", inset: 0, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", zIndex: 10, padding: "20px",
        }}>
          <div style={{ animation: "swingIn 0.7s ease", textAlign: "center", maxWidth: 560 }}>
            {allYes ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ display: "inline-block", animation: `glitter ${0.8 + i * 0.2}s ${i * 0.15}s infinite` }}>
                      <Heart size={36} color={i % 2 === 0 ? "#e91e63" : "#f06292"} />
                    </span>
                  ))}
                </div>
                <div style={{
                  background: "white", borderRadius: 28, padding: "40px 36px",
                  boxShadow: "0 12px 50px rgba(233,30,99,0.2)", border: "2px solid #f48fb1",
                  marginBottom: 28,
                }}>
                  <h2 style={{ color: "#880e4f", fontSize: "clamp(22px, 5vw, 34px)", marginBottom: 18 }}>
                    That's all I needed to hear 🌹
                  </h2>
                  <p style={{ color: "#c2185b", fontSize: "clamp(15px, 3vw, 18px)", lineHeight: 1.8 }}>
                    I'm not asking for the moon. Just <b>a little more of you</b>. Your time, your laugh, your presence.
                    I love you so much — please don't make me feel alone. 💕
                    <br /><br />
                    Let's be okay again. Please come to me. 🤍
                  </p>
                </div>
                <div style={{ fontSize: 40, animation: "pulse 1.5s infinite" }}>💑</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 60, marginBottom: 20 }}>😢</div>
                <div style={{
                  background: "white", borderRadius: 28, padding: "40px 36px",
                  boxShadow: "0 12px 50px rgba(233,30,99,0.2)", border: "2px solid #f48fb1",
                  marginBottom: 28,
                }}>
                  <h2 style={{ color: "#880e4f", fontSize: "clamp(20px, 4vw, 28px)", marginBottom: 18 }}>
                    I hope you think again... 💔
                  </h2>
                  <p style={{ color: "#c2185b", fontSize: "clamp(15px, 3vw, 18px)", lineHeight: 1.8 }}>
                    I deserve someone who chooses me every single day.
                    Please think about what we have — and what you might lose.
                    I'm here. I'm waiting. But not forever. 🌹
                  </p>
                </div>
                <button className="btn-yes" onClick={() => { setPhase("questions"); setCurrentQ(0); setAnswers([]); }}>
                  Let me try again 💕
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}