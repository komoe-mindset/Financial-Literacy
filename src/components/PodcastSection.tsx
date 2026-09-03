import { useState, useRef, useEffect, useId } from "react";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  ExternalLink,
  Download,
  BookOpenCheck,
  Radio,
  FileText,
  ListOrdered,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { PODCAST_MP3_URL, PODCAST_SUMMARY } from "../data/podcastData";

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function PodcastSection() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "chapters">("summary");

  const scrubId = useId();
  const volumeId = useId();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
        setAudioError(false);
      } catch (err) {
        console.warn("Audio play blocked or interrupted:", err);
        setAudioError(true);
      }
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const newTime = Math.min(
      Math.max(0, audioRef.current.currentTime + seconds),
      duration || 999999
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
      audioRef.current.muted = newVol === 0;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.muted = false;
      audioRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <section className="podcast-section" id="podcast" aria-labelledby="podcast-title">
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={PODCAST_MP3_URL}
        preload="metadata"
        aria-hidden="true"
      />

      <div className="podcast-container">
        {/* Header Title Area */}
        <div className="podcast-header">
          <div className="podcast-badge-wrap">
            <span className="podcast-pill">
              <Headphones size={14} className="podcast-icon-teal" aria-hidden="true" />
              <span>အသံဖိုင်ဖြင့် နားဆင်လေ့လာရန်</span>
            </span>
            <span className="podcast-tag">Audio Podcast (MP3)</span>
          </div>

          <h2 id="podcast-title" className="podcast-heading">
            MoneyWise Financial Literacy & Website Content Podcast
          </h2>
          <p className="podcast-subheading">
            {PODCAST_SUMMARY.description}
          </p>
        </div>

        {/* Player & Action Center Grid */}
        <div className="podcast-player-card">
          {/* Main Visual & Audio Controls */}
          <div className="podcast-player-main">
            {/* Visual Cover Art / Equalizer */}
            <div className="podcast-cover-art" aria-hidden="true">
              <div className="podcast-disc-wrap">
                <Radio size={36} className={`podcast-radio-icon ${isPlaying ? "spin-slow" : ""}`} />
              </div>
              <div className="podcast-waves">
                <span className={`wave-bar ${isPlaying ? "wave-anim-1" : ""}`} />
                <span className={`wave-bar ${isPlaying ? "wave-anim-2" : ""}`} />
                <span className={`wave-bar ${isPlaying ? "wave-anim-3" : ""}`} />
                <span className={`wave-bar ${isPlaying ? "wave-anim-4" : ""}`} />
                <span className={`wave-bar ${isPlaying ? "wave-anim-5" : ""}`} />
              </div>
            </div>

            {/* Audio Progress & Controls */}
            <div className="podcast-controls-wrap">
              <div className="podcast-track-meta">
                <strong className="podcast-track-title">{PODCAST_SUMMARY.title}</strong>
                <span className="podcast-track-sub">{PODCAST_SUMMARY.subtitle}</span>
              </div>

              {/* Progress Slider */}
              <div className="podcast-progress-block">
                <label htmlFor={scrubId} className="sr-only">
                  အသံဖိုင် တိုး/ဆုတ်ချိန်ညှိရန်
                </label>
                <div className="podcast-slider-track">
                  <div
                    className="podcast-slider-fill"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <input
                    id={scrubId}
                    type="range"
                    min="0"
                    max={duration || 100}
                    step="0.5"
                    value={currentTime}
                    onChange={handleScrub}
                    className="podcast-range-input"
                    aria-valuemin={0}
                    aria-valuemax={duration || 100}
                    aria-valuenow={currentTime}
                    aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  />
                </div>

                <div className="podcast-time-row">
                  <span className="podcast-time-current">{formatTime(currentTime)}</span>
                  <span className="podcast-time-duration">
                    {duration > 0 ? formatTime(duration) : "--:--"}
                  </span>
                </div>
              </div>

              {/* Playback Buttons Row */}
              <div className="podcast-buttons-row">
                {/* 10s Replay */}
                <button
                  type="button"
                  onClick={() => handleSkip(-10)}
                  className="podcast-btn-circle"
                  aria-label="၁၀ စက္ကန့် နောက်သို့ ပြန်သွားမည်"
                  title="၁၀ စက္ကန့် နောက်သို့"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  <span className="btn-skip-label">10s</span>
                </button>

                {/* Main Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="podcast-btn-play"
                  aria-label={isPlaying ? "အသံဖိုင် ခေတ္တရပ်မည် (Pause)" : "အသံဖိုင် ဖွင့်မည် (Play)"}
                  title={isPlaying ? "ခေတ္တရပ်မည်" : "ဖွင့်မည်"}
                >
                  {isPlaying ? (
                    <Pause size={22} fill="currentColor" aria-hidden="true" />
                  ) : (
                    <Play size={22} fill="currentColor" className="ml-0.5" aria-hidden="true" />
                  )}
                </button>

                {/* 10s Forward */}
                <button
                  type="button"
                  onClick={() => handleSkip(10)}
                  className="podcast-btn-circle"
                  aria-label="၁၀ စက္ကန့် ရှေ့သို့ ကျော်မည်"
                  title="၁၀ စက္ကန့် ရှေ့သို့"
                >
                  <RotateCw size={16} aria-hidden="true" />
                  <span className="btn-skip-label">10s</span>
                </button>

                {/* Playback Speed Switcher */}
                <div className="podcast-speed-selector" role="group" aria-label="အသံဖိုင် အမြန်နှုန်း ရွေးချယ်ရန်">
                  {[1, 1.25, 1.5, 2].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleRateChange(rate)}
                      className={`podcast-speed-btn ${playbackRate === rate ? "active" : ""}`}
                      aria-pressed={playbackRate === rate}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>

                {/* Volume Controls */}
                <div className="podcast-volume-wrap">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="podcast-btn-circle"
                    aria-label={isMuted ? "အသံပြန်ဖွင့်မည်" : "အသံပိတ်မည်"}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={16} aria-hidden="true" />
                    ) : (
                      <Volume2 size={16} aria-hidden="true" />
                    )}
                  </button>
                  <label htmlFor={volumeId} className="sr-only">
                    အသံအတိုးအကျယ်
                  </label>
                  <input
                    id={volumeId}
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="podcast-volume-slider"
                    aria-label="အသံအတိုးအကျယ် ထိန်းညှိရန်"
                  />
                </div>
              </div>

              {audioError && (
                <div className="podcast-error-alert" role="alert">
                  <span>ဘရောက်ဇာမှ အသံဖိုင် တိုက်ရိုက်မဖွင့်နိုင်ပါက အောက်ပါ MP3 လင့်ခ်ခလုတ်ဖြင့် တိုက်ရိုက်နားဆင်နိုင်ပါသည်။</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Link Buttons */}
          <div className="podcast-external-actions">
            <div className="podcast-action-info">
              <span className="podcast-action-label">အသံဖိုင် တိုက်ရိုက်လင့်ခ် & သိမ်းဆည်းရန်</span>
              <p className="podcast-action-note">
                အခြား App များ သို့မဟုတ် တိုက်ရိုက်နားဆင်လိုပါက ဖွင့်နိုင်ပါသည်
              </p>
            </div>

            <div className="podcast-action-buttons">
              {/* Primary Direct Link Button */}
              <a
                href={PODCAST_MP3_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="podcast-link-btn primary"
                id="podcast-direct-mp3-link"
                title="MP3 ဖိုင်ကို ဝင်းဒိုးအသစ်တွင် တိုက်ရိုက်နားဆင်ရန်"
              >
                <ExternalLink size={15} aria-hidden="true" />
                <span>Podcast MP3 ဖွင့်မည်</span>
              </a>

              {/* Download Button */}
              <a
                href={PODCAST_MP3_URL}
                download="MoneyWise-Myanmar-Podcast.mp3"
                className="podcast-link-btn secondary"
                id="podcast-download-mp3-btn"
                title="အော့ဖ်လိုင်းနားဆင်ရန် MP3 ဖိုင် ဒေါင်းလုဒ်ရယူပါ"
              >
                <Download size={15} aria-hidden="true" />
                <span>MP3 ဒေါင်းလုဒ်ယူမည်</span>
              </a>
            </div>
          </div>
        </div>

        {/* Podcast Content & Concept Breakdown Area */}
        <div className="podcast-content-tabs">
          <div className="podcast-tab-nav" role="tablist" aria-label="Podcast အကြောင်းအရာများ">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "summary"}
              className={`podcast-tab-btn ${activeTab === "summary" ? "active" : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              <FileText size={15} aria-hidden="true" />
              <span>အဓိက အနှစ်ချုပ် (Summary)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "chapters"}
              className={`podcast-tab-btn ${activeTab === "chapters" ? "active" : ""}`}
              onClick={() => setActiveTab("chapters")}
            >
              <ListOrdered size={15} aria-hidden="true" />
              <span>အခန်းလိုက် အကြောင်းအရာများ (Chapters)</span>
            </button>
          </div>

          {/* Tab 1: Executive Summary & Financial Literacy Concept */}
          {activeTab === "summary" && (
            <div className="podcast-tab-panel" role="tabpanel">
              <div className="podcast-summary-grid">
                <div className="podcast-summary-text-block">
                  <h3 className="podcast-concept-title">
                    <Sparkles size={16} className="podcast-icon-amber" aria-hidden="true" />
                    Financial Literacy ဆိုတာ ဘာလဲ? အသံဖိုင်၏ အဓိက သဘောတရား
                  </h3>
                  <p className="podcast-concept-desc">
                    Financial Literacy (ငွေကြေးအသိပညာ) ဆိုသည်မှာ <strong>“ငွေရှာရုံသာမက ရှာဖွေရရှိလာသော ငွေကြေးကို ဘဝတစ်လျှောက်လုံး စိတ်အေးချမ်းသာစွာဖြင့် ကောင်းမွန်စွာ စီမံခန့်ခွဲ၊ ကာကွယ်၊ တိုးပွားအောင် ပြုလုပ်နိုင်သည့် စွမ်းရည်”</strong> ဖြစ်သည်။ ဝင်ငွေနည်းသည်ဖြစ်စေ၊ များသည်ဖြစ်စေ လူတိုင်းအတွက် မရှိမဖြစ် လိုအပ်သောအခြေခံအသိပညာဖြစ်ပါသည်။
                  </p>

                  <div className="podcast-takeaway-list">
                    <h4>
                      <BookOpenCheck size={16} className="podcast-icon-teal" aria-hidden="true" />
                      Podcast မှ အဓိက မှတ်သားစရာ ၄ ချက် -
                    </h4>
                    <ul>
                      {PODCAST_SUMMARY.keyTakeaways.map((point, index) => (
                        <li key={index}>
                          <CheckCircle2 size={15} className="podcast-check-icon" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="podcast-highlight-box">
                  <h4>💡 Website အကြောင်းအရာ အနှစ်ချုပ်</h4>
                  <p>
                    ဒီ MoneyWise Website သည် ရှုပ်ထွေးသော စာရင်းအင်းသီအိုရီများကို မသုံးဘဲ၊
                    မြန်မာနိုင်ငံ၏ လက်တွေ့ဘဝနှင့် ကိုက်ညီသော -
                  </p>
                  <div className="podcast-tag-chips">
                    <span className="podcast-chip">၁။ 50/30/20 Budget စနစ်</span>
                    <span className="podcast-chip">၂။ ၃ လစာ Emergency Fund</span>
                    <span className="podcast-chip">၃။ အကြွေးလျှော့ချနည်းလမ်းများ</span>
                    <span className="podcast-chip">၄။ ဝင်ငွေတိုးပွားရေး & စီးပွားရေး</span>
                  </div>
                  <a
                    href={PODCAST_MP3_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="podcast-listen-now-link"
                  >
                    <Headphones size={14} aria-hidden="true" />
                    <span>နားဆင်ရန် MP3 တိုက်ရိုက်ဖွင့်ပါ</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Detailed Chapter Outline */}
          {activeTab === "chapters" && (
            <div className="podcast-tab-panel" role="tabpanel">
              <div className="podcast-chapters-list">
                {PODCAST_SUMMARY.chapters.map((chap, idx) => (
                  <article key={chap.id} className="podcast-chapter-card">
                    <div className="podcast-chapter-num" aria-hidden="true">
                      0{idx + 1}
                    </div>
                    <div className="podcast-chapter-info">
                      <div className="podcast-chapter-titles">
                        <h4>{chap.myanmarTitle}</h4>
                        <span className="podcast-chapter-en">{chap.title}</span>
                      </div>
                      <p>{chap.desc}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
