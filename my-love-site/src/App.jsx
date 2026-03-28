import { useState, useEffect, useRef } from "react";

const questions = [
  { id: 1, text: "Do you like me? 🥺", emoji: "💕" },
  { id: 2, text: "Do you want me in your life?", emoji: "🌹" },
  { id: 3, text: "Will you come to me after a fight and say sorry?", emoji: "🤍" },
  { id: 4, text: "Will you make more time for me?", emoji: "⏰" },
  { id: 5, text: "Am I important to you?", emoji: "💌" },
  { id: 6, text: "Do you promise to never ignore me again?", emoji: "🌸" },
  { id: 7, text: "Will you choose me, every single day?", emoji: "🫶" },
];

const floatingHearts = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 5 + Math.random() * 6,
  size: 12 + Math.random() * 22,
  opacity: 0.25 + Math.random() * 0.45,
}));

const flowerEmojis = ["🌸", "🌺", "🌷", "🌹", "💐", "🌼", "🪷"];
const flowers = Array.from({ length: 35 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 3 + Math.random() * 3,
  size: 20 + Math.random() * 28,
  emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
  swing: Math.random() * 40 - 20,
}));

function Heart({ size = 24, color = "#e91e63", style = {} }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
    </svg>
  );
}

function Typewriter({ text, speed = 32, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const i = useRef(0);
  useEffect(() => {
    i.current = 0;
    setDisplayed("");
    const iv = setInterval(() => {
      if (i.current < text.length) {
        setDisplayed(text.slice(0, i.current + 1));
        i.current++;
      } else {
        clearInterval(iv);
        if (onDone) setTimeout(onDone, 500);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text]);
  return (
    <span style={{ whiteSpace: "pre-line", color: "#880e4f", fontSize: "clamp(14px, 2.5vw, 17px)", lineHeight: 2 }}>
      {displayed}
      <span style={{ animation: "blink 1s infinite", opacity: 0.5 }}>|</span>
    </span>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showHeart, setShowHeart] = useState(false);
  const [shake, setShake] = useState(false);
  const [typeDone1, setTypeDone1] = useState(false);
  const [typeDone2, setTypeDone2] = useState(false);
  const [showILY, setShowILY] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "intro") {
      timerRef.current = setTimeout(() => setPhase("letter1"), 3200);
    }
    if (phase === "flowers") {
      timerRef.current = setTimeout(() => {
        setPhase("finale");
        setTimeout(() => setShowILY(true), 900);
      }, 4000);
    }
    return () => clearTimeout(timerRef.current);
  }, [phase]);

  function handleAnswer(yes) {
    const newAnswers = [...answers, yes];
    setAnswers(newAnswers);
    setShowHeart(yes);
    if (!yes) { setShake(true); setTimeout(() => setShake(false), 600); }
    setTimeout(() => {
      setShowHeart(false);
      if (currentQ + 1 < questions.length) {
        setCurrentQ(currentQ + 1);
      } else {
        setPhase("flowers");
      }
    }, 900);
  }

  const progress = (currentQ / questions.length) * 100;
  const allYes = answers.length === questions.length && answers.every(Boolean);

  const bgStyle = phase === "finale"
    ? "linear-gradient(135deg, #880e4f 0%, #c2185b 45%, #e91e63 100%)"
    : "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 35%, #fce4ec 65%, #fff0f3 100%)";

  return (
    <div style={{
      minHeight: "100vh",
      background: bgStyle,
      fontFamily: "'Georgia', serif",
      overflow: "hidden",
      position: "relative",
      transition: "background 1.5s ease",
    }}>
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-20px) rotate(20deg); opacity: 0; }
        }
        @keyframes flowerFall {
          0% { transform: translateY(-80px) rotate(0deg); opacity: 0; }
          8% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0.6; }
        }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes fadeInDown { from{opacity:0;transform:translateY(-40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)}
          40%{transform:translateX(10px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)}
        }
        @keyframes heartPop {
          0%{transform:scale(0) translateY(0);opacity:1}
          60%{transform:scale(1.4) translateY(-30px);opacity:1}
          100%{transform:scale(1) translateY(-60px);opacity:0}
        }
        @keyframes glitter {
          0%,100%{opacity:0.4;transform:scale(0.8) rotate(-5deg)}
          50%{opacity:1;transform:scale(1.3) rotate(5deg)}
        }
        @keyframes blink { 50%{opacity:0} }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes swingIn {
          0%{opacity:0;transform:rotate(-12deg) scale(0.85)}
          100%{opacity:1;transform:rotate(0deg) scale(1)}
        }
        @keyframes pageFlip {
          0%{opacity:1;transform:perspective(900px) rotateY(0deg)}
          45%{opacity:0;transform:perspective(900px) rotateY(-90deg)}
          100%{opacity:1;transform:perspective(900px) rotateY(0deg)}
        }
        @keyframes ilyPop {
          0%{opacity:0;transform:scale(0.2) rotate(-10deg)}
          60%{transform:scale(1.08) rotate(2deg)}
          100%{opacity:1;transform:scale(1) rotate(0deg)}
        }
        @keyframes shimmer {
          0%,100%{text-shadow:0 0 20px rgba(255,200,220,0.9),0 0 50px rgba(255,100,150,0.4)}
          50%{text-shadow:0 0 40px rgba(255,230,240,1),0 0 90px rgba(255,150,180,0.8),0 0 130px rgba(255,100,130,0.4)}
        }
        @keyframes floatDrift {
          0%,100%{transform:translateY(0px) rotate(-1deg)}
          50%{transform:translateY(-12px) rotate(1deg)}
        }
        .btn-yes {
          background: linear-gradient(135deg,#e91e63,#c2185b);
          color:white;border:none;padding:14px 40px;
          border-radius:50px;font-size:18px;font-family:Georgia,serif;
          cursor:pointer;box-shadow:0 4px 20px rgba(233,30,99,0.35);transition:all 0.2s;
        }
        .btn-yes:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(233,30,99,0.55)}
        .btn-no {
          background:white;color:#c2185b;border:2px solid #f48fb1;
          padding:14px 40px;border-radius:50px;font-size:18px;
          font-family:Georgia,serif;cursor:pointer;transition:all 0.2s;
        }
        .btn-no:hover{background:#fce4ec;transform:scale(1.04)}
        .page-btn {
          background:linear-gradient(135deg,#e91e63,#ad1457);
          color:white;border:none;padding:13px 36px;border-radius:50px;
          font-size:17px;font-family:Georgia,serif;cursor:pointer;
          box-shadow:0 4px 18px rgba(233,30,99,0.32);transition:all 0.2s;
        }
        .page-btn:hover{transform:scale(1.06);box-shadow:0 6px 24px rgba(233,30,99,0.48)}
      `}</style>

      {/* Floating hearts bg */}
      {phase !== "finale" && floatingHearts.map(h => (
        <div key={h.id} style={{
          position:"fixed", left:`${h.left}%`, bottom:"-60px",
          animation:`floatUp ${h.duration}s ${h.delay}s infinite linear`,
          pointerEvents:"none", zIndex:0,
        }}>
          <Heart size={h.size} color={h.id%3===0?"#e91e63":h.id%3===1?"#f06292":"#ad1457"} style={{opacity:h.opacity}} />
        </div>
      ))}

      {/* Flower shower */}
      {phase === "flowers" && flowers.map(f => (
        <div key={f.id} style={{
          position:"fixed", left:`${f.left}%`, top:"-80px",
          fontSize:f.size, pointerEvents:"none", zIndex:5,
          animation:`flowerFall ${f.duration}s ${f.delay}s ease-in forwards`,
        }}>
          {f.emoji}
        </div>
      ))}

      {/* ── INTRO ── */}
      {phase === "intro" && (
        <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10}}>
          <div style={{animation:"pulse 1.4s infinite",marginBottom:28}}>
            <Heart size={110} color="#e91e63" />
          </div>
          <h1 style={{fontSize:"clamp(26px,6vw,50px)",color:"#880e4f",textAlign:"center",margin:"0 20px 14px",animation:"fadeInDown 1s 0.3s both ease"}}>
            I have something to say...
          </h1>
          <p style={{fontSize:19,color:"#c2185b",opacity:0.75,animation:"fadeInUp 1s 0.7s both ease"}}>
            Please read this, Babe 💕
          </p>
        </div>
      )}

      {/* ── LETTER PAGE 1 ── */}
      {phase === "letter1" && (
        <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:"20px",overflowY:"auto"}}>
          <div style={{
            background:"white",borderRadius:28,
            padding:"44px clamp(22px,6vw,52px)",
            maxWidth:580,width:"95vw",
            boxShadow:"0 16px 60px rgba(233,30,99,0.18)",
            border:"2px solid #f48fb1",
            animation:"swingIn 0.7s ease",position:"relative",
          }}>
            {[{top:12,left:14},{top:12,right:14},{bottom:12,left:14},{bottom:12,right:14}].map((pos,i)=>(
              <div key={i} style={{position:"absolute",...pos,opacity:0.28}}>
                <Heart size={18} color="#e91e63" />
              </div>
            ))}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:46,animation:"bounce 2s infinite"}}>💌</div>
              <h2 style={{color:"#880e4f",fontSize:"clamp(18px,4vw,26px)",margin:"10px 0 6px"}}>A letter from my heart</h2>
              <div style={{width:64,height:2.5,background:"linear-gradient(90deg,#f48fb1,#e91e63)",margin:"0 auto",borderRadius:99}} />
            </div>
            <Typewriter
              text={`Babe... I love you so much. More than I can ever put into words. ❤️\n\nBut I need you to know — your actions hurt me. You blocked me. And yes, I know you are hurt too. I understand that. But did you even stop for a second to think about what I go through every single day? 💔\n\nYou say you will try to give me time. You have said it so many times before. Every single time... you didn't. And I waited. I always wait. 🥺`}
              speed={30}
              onDone={() => setTypeDone1(true)}
            />
            {typeDone1 && (
              <div style={{textAlign:"center",marginTop:28,animation:"fadeInUp 0.6s ease"}}>
                <p style={{color:"#ad1457",fontStyle:"italic",fontSize:15,marginBottom:14}}>— Turn the page —</p>
                <button className="page-btn" onClick={() => { setTypeDone2(false); setPhase("letter2"); }}>
                  Next Page 📖 →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LETTER PAGE 2 ── */}
      {phase === "letter2" && (
        <div style={{position:"fixed",inset:0,display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,padding:"20px",overflowY:"auto"}}>
          <div style={{
            background:"white",borderRadius:28,
            padding:"44px clamp(22px,6vw,52px)",
            maxWidth:580,width:"95vw",
            boxShadow:"0 16px 60px rgba(233,30,99,0.18)",
            border:"2px solid #f48fb1",
            animation:"pageFlip 0.8s ease",position:"relative",
          }}>
            {[{top:12,left:14},{top:12,right:14},{bottom:12,left:14},{bottom:12,right:14}].map((pos,i)=>(
              <div key={i} style={{position:"absolute",...pos,opacity:0.28}}>
                <Heart size={18} color="#e91e63" />
              </div>
            ))}
            <div style={{textAlign:"center",marginBottom:24}}>
              <div style={{fontSize:46,animation:"bounce 2s infinite"}}>🥺</div>
              <h2 style={{color:"#880e4f",fontSize:"clamp(18px,4vw,26px)",margin:"10px 0 6px"}}>Please understand me...</h2>
              <div style={{width:64,height:2.5,background:"linear-gradient(90deg,#f48fb1,#e91e63)",margin:"0 auto",borderRadius:99}} />
            </div>
            <Typewriter
              text={`This time, you should have come to me. But you didn't. 😞\n\nAnd I am also going through the same things every day that you feel. The same pain. The same longing. The same waiting. I just need you to see that too.\n\nI love you so much, Babe. It's just — I need your time and your attention too. That is all I am asking for. Just you. Just a little of you.\n\nPlease understand my feelings too... 🌹 Please come to me. 💕`}
              speed={30}
              onDone={() => setTypeDone2(true)}
            />
            {typeDone2 && (
              <div style={{textAlign:"center",marginTop:28,animation:"fadeInUp 0.6s ease"}}>
                <p style={{color:"#ad1457",fontStyle:"italic",fontSize:15,marginBottom:14}}>— Now answer me honestly —</p>
                <button className="page-btn" onClick={() => setPhase("questions")}>
                  Okay, I will answer 💬
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── QUESTIONS ── */}
      {phase === "questions" && (
        <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10,padding:"20px"}}>
          <div style={{width:"min(500px,90vw)",marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{color:"#880e4f",fontSize:14}}>Question {currentQ+1} of {questions.length}</span>
              <span style={{color:"#c2185b",fontSize:14}}>{questions[currentQ].emoji}</span>
            </div>
            <div style={{height:8,background:"#fce4ec",borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#e91e63,#ad1457)",borderRadius:99,transition:"width 0.6s ease"}} />
            </div>
          </div>
          <div key={currentQ} style={{
            background:"white",borderRadius:28,padding:"44px 36px",
            maxWidth:500,width:"90vw",
            boxShadow:"0 12px 50px rgba(233,30,99,0.18)",
            border:"2px solid #f48fb1",textAlign:"center",
            animation:shake?"shake 0.5s":"swingIn 0.5s ease",
            position:"relative",overflow:"hidden",
          }}>
            <div style={{fontSize:52,marginBottom:20}}>{questions[currentQ].emoji}</div>
            <h2 style={{color:"#880e4f",fontSize:"clamp(18px,4vw,26px)",lineHeight:1.5,marginBottom:36}}>
              {questions[currentQ].text}
            </h2>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-yes" onClick={()=>handleAnswer(true)}>Yes 💕</button>
              <button className="btn-no" onClick={()=>handleAnswer(false)}>No 😔</button>
            </div>
            {showHeart && (
              <div style={{position:"absolute",top:"40%",left:"50%",transform:"translateX(-50%)",animation:"heartPop 0.9s ease forwards",pointerEvents:"none"}}>
                <Heart size={64} color="#e91e63" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FLOWER SHOWER SCREEN ── */}
      {phase === "flowers" && (
        <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10}}>
          <div style={{textAlign:"center",animation:"fadeInDown 0.8s ease"}}>
            <div style={{fontSize:64,marginBottom:16,animation:"bounce 1s infinite"}}>🌸</div>
            <h2 style={{color:"#880e4f",fontSize:"clamp(22px,5vw,38px)",marginBottom:10}}>Showering you with love...</h2>
            <p style={{color:"#c2185b",fontSize:19}}>Just like you fill my every thought 💕</p>
          </div>
        </div>
      )}

      {/* ── FINALE ── */}
      {phase === "finale" && (
        <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:10,padding:"20px",overflow:"hidden"}}>
          {/* hearts in finale */}
          {floatingHearts.map(h=>(
            <div key={h.id} style={{position:"fixed",left:`${h.left}%`,bottom:"-60px",animation:`floatUp ${h.duration}s ${h.delay}s infinite linear`,pointerEvents:"none",zIndex:0}}>
              <Heart size={h.size} color={h.id%2===0?"#ffb3c6":"#ff8fa3"} style={{opacity:h.opacity+0.2}} />
            </div>
          ))}

          {showILY && (
            <div style={{textAlign:"center",zIndex:10,animation:"ilyPop 1s cubic-bezier(0.34,1.56,0.64,1) both"}}>
              {/* sparkling hearts */}
              <div style={{marginBottom:20,display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                {[...Array(7)].map((_,i)=>(
                  <span key={i} style={{display:"inline-block",animation:`glitter ${0.7+i*0.15}s ${i*0.12}s infinite`}}>
                    <Heart size={24+(i===3?16:0)} color={i%2===0?"#ffb3c6":"#ffe4ec"} />
                  </span>
                ))}
              </div>

              {/* BIG TEXT */}
              <div style={{
                fontSize:"clamp(40px,11vw,92px)",
                fontWeight:"bold",fontFamily:"Georgia,serif",
                color:"white",letterSpacing:"0.04em",lineHeight:1.1,
                animation:"shimmer 2s infinite, floatDrift 3s ease-in-out infinite",
                textShadow:"0 0 30px rgba(255,180,210,0.9),0 4px 20px rgba(0,0,0,0.15)",
                marginBottom:10,
              }}>
                I LOVE YOU
              </div>
              <div style={{
                fontSize:"clamp(32px,9vw,76px)",
                fontWeight:"bold",fontFamily:"Georgia,serif",
                color:"#ffe4ec",letterSpacing:"0.05em",
                animation:"shimmer 2s 0.5s infinite, floatDrift 3.2s 0.4s ease-in-out infinite",
                textShadow:"0 0 25px rgba(255,210,230,0.9),0 4px 20px rgba(0,0,0,0.12)",
                marginBottom:30,
              }}>
                BABBEEEEE 💕
              </div>

              {/* message card */}
              <div style={{
                background:"rgba(255,255,255,0.14)",
                backdropFilter:"blur(14px)",
                borderRadius:26,padding:"26px 34px",maxWidth:480,
                border:"1.5px solid rgba(255,255,255,0.32)",
                margin:"0 auto 28px",
                animation:"fadeInUp 1s 0.5s both ease",
              }}>
                <p style={{color:"white",fontSize:"clamp(14px,2.8vw,18px)",lineHeight:1.95,margin:0,textShadow:"0 1px 4px rgba(0,0,0,0.12)"}}>
                  {allYes
                    ? "Thank you for hearing me, Babe 🥺\nNo matter how many fights, no matter how much pain — I always come back to loving you. Just give me your time. That is all I need. Come to me. I am right here. Always. 🌹"
                    : "Even if you didn't answer the way I hoped — I still love you endlessly, Babe 💔\nSit with this for a while. Think about me too. I am not going anywhere. But please... choose me. 🌸"
                  }
                </p>
              </div>

              {/* pulsing heart */}
              <div style={{animation:"pulse 1.4s infinite"}}>
                <Heart size={56} color="white" style={{filter:"drop-shadow(0 0 18px rgba(255,180,210,0.85))"}} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}