import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';

// الشعار المطابق للصورة بـ SVG نظيف ومستقر
const UqdahLogo = ({ size = 80 }) => (
  <svg viewBox="0 0 180 175" width={size} height={size} style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="uqdahBrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#E46C76" />
        <stop offset="60%" stopColor="#D64C5B" />
        <stop offset="100%" stopColor="#C13B4A" />
      </linearGradient>
    </defs>
    <circle cx="126" cy="34" r="19" fill="#F2C94C" />
    <circle cx="148" cy="84" r="8" fill="#F2C94C" />
    <path
      d="M 42,74 C 18,74 14,42 36,32 C 48,26 58,34 62,38 C 60,18 76,6 96,12 C 108,16 114,28 112,38 C 128,34 150,46 146,68 C 144,82 130,90 120,88 C 116,104 94,108 82,94 C 70,108 46,102 44,84 C 36,82 36,74 42,74 Z"
      fill="url(#uqdahBrainGrad)"
      stroke="#B83746"
      strokeWidth="2"
    />
    <path d="M 20,48 L 42,48 Q 44,68 50,76 Q 56,84 52,96" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="42" cy="48" r="4" fill="#FFFDF9" />
    <circle cx="56" cy="42" r="4.5" fill="#FFFDF9" />
    <path d="M 65,60 Q 78,76 66,98" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="65" cy="60" r="4" fill="#FFFDF9" />
    <path d="M 88,22 Q 74,40 84,82" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 79,45 Q 81,58 83,68" fill="none" stroke="#F2994A" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="88" cy="22" r="4" fill="#FFFDF9" />
    <circle cx="84" cy="82" r="4" fill="#FFFDF9" />
    <path d="M 94,44 L 102,90" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="94" cy="44" r="4" fill="#FFFDF9" />
    <circle cx="102" cy="90" r="4" fill="#FFFDF9" />
    <path d="M 106,42 Q 116,68 110,94" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 110,56 Q 114,68 112,78" fill="none" stroke="#F2994A" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="106" cy="42" r="4" fill="#FFFDF9" />
    <circle cx="110" cy="94" r="4" fill="#FFFDF9" />
    <path d="M 120,48 Q 130,68 146,54" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <path d="M 128,74 Q 138,78 134,88" fill="none" stroke="#FFFDF9" strokeWidth="4.5" strokeLinecap="round" />
    <circle cx="128" cy="74" r="4" fill="#FFFDF9" />
    <circle cx="134" cy="88" r="4" fill="#FFFDF9" />
    <text x="90" y="132" textAnchor="middle" fill="#B8334A" fontFamily="'Tajawal', sans-serif" fontWeight="900" fontSize="30">
      أكاديمية
    </text>
    <text x="90" y="164" textAnchor="middle" fill="#DFB44B" fontFamily="'Tajawal', sans-serif" fontWeight="800" fontSize="28">
      عـقـــــدة
    </text>
  </svg>
);

export default function App() {
  const [customLogo, setCustomLogo] = useState(null);

  const [subjects, setSubjects] = useState(['احياء', 'رياضيات', 'فيزياء', 'كيمياء']);
  const [subject, setSubject] = useState('احياء');
  const [newSubjectInput, setNewSubjectInput] = useState('');

  // القالب المختار
  const [selectedTemplate, setSelectedTemplate] = useState('emerald');

  // السؤال
  const [questionText, setQuestionText] = useState('أي الهرمونات التالية يُنتج في الخصية؟');
  const [questionImage, setQuestionImage] = useState(null);

  // الخيارات
  const [options, setOptions] = useState([
    { id: 'A', label: 'أ', text: 'الألدوستيرون', image: null, enabled: true },
    { id: 'B', label: 'ب', text: 'الكورتيزول', image: null, enabled: true },
    { id: 'C', label: 'ج', text: 'التستوستيرون', image: null, enabled: true },
    { id: 'D', label: 'د', text: 'البروجيسترون', image: null, enabled: true },
  ]);

  const [rightAnswer, setRightAnswer] = useState('C');
  const [highlightCorrectAnswer, setHighlightCorrectAnswer] = useState(true);

  // الربط الذهني
  const [enableMnemonic, setEnableMnemonic] = useState(true);
  const [mnemonicLabel, setMnemonicLabel] = useState('ربط');
  const [mnemonicText, setMnemonicText] = useState('هو هرمون ذكري ف أخوك لما يشوفكم يقول تسترو (تستيستيرون)');
  const [mnemonicMediaType, setMnemonicMediaType] = useState('video');
  const [mnemonicMediaUrl, setMnemonicMediaUrl] = useState(null);

  // تبويب الجوال
  const [mobileTab, setMobileTab] = useState('edit');

  // حالة التصدير
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // معاينة الصورة المستخرجة للآيفون لحفظها بضغطة مطولة
  const [extractedPreviewImage, setExtractedPreviewImage] = useState(null);

  // مراجع القالب
  const previewWrapperRef = useRef(null);
  const templateCardRef = useRef(null);
  const [canvasScale, setCanvasScale] = useState(1);
  const [measuredCardHeight, setMeasuredCardHeight] = useState(0);

  const logoRef = useRef(null);
  const qImgRef = useRef(null);
  const videoPlayerRef = useRef(null);

  // مراجع الصوت لمنع تعليق متصفح سفاري
  const audioCtxRef = useRef(null);
  const sourceNodeRef = useRef(null);

  // مداخل وسائط منفصلة
  const mnemonicImageInputRef = useRef(null);
  const mnemonicVideoInputRef = useRef(null);

  const optARef = useRef(null);
  const optBRef = useRef(null);
  const optCRef = useRef(null);
  const optDRef = useRef(null);
  const optImgRefs = { A: optARef, B: optBRef, C: optCRef, D: optDRef };

  // دالة تصغير وضغط ذكية لأي صورة ترفع من الآيفون حتى لا تتجاوز حدود ذاكرة WebKit
  const compressImage = (file, maxWidth = 900, maxHeight = 900, quality = 0.88) => {
    return new Promise((resolve) => {
      if (!file || !file.type.startsWith('image/')) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/png', quality));
        };
        img.onerror = () => resolve(e.target?.result);
        img.src = e.target?.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file, callback) => {
    if (!file) return;
    const compressed = await compressImage(file, 900, 900, 0.88);
    if (compressed) callback(compressed);
  };

  const handleMnemonicMediaUpload = (file) => {
    if (!file) return;
    if (mnemonicMediaType === 'video') {
      const url = URL.createObjectURL(file);
      setMnemonicMediaUrl(url);
    } else {
      handleFileUpload(file, setMnemonicMediaUrl);
    }
  };

  // حساب الأبعاد بدقة للجوال
  useEffect(() => {
    const handleResize = () => {
      if (!previewWrapperRef.current || !templateCardRef.current) return;
      const containerWidth = previewWrapperRef.current.offsetWidth;
      const baseWidth = 540;
      if (containerWidth > 0 && containerWidth < baseWidth) {
        setCanvasScale(containerWidth / baseWidth);
      } else {
        setCanvasScale(1);
      }
      setMeasuredCardHeight(templateCardRef.current.offsetHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    const observer = new ResizeObserver(handleResize);
    if (templateCardRef.current) observer.observe(templateCardRef.current);
    if (previewWrapperRef.current) observer.observe(previewWrapperRef.current);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, [options, questionText, questionImage, mnemonicText, mnemonicLabel, mnemonicMediaUrl, mobileTab, selectedTemplate]);

  const updateOption = (id, patch) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };

  const setQuickOptionCount = (count) => {
    setOptions((prev) =>
      prev.map((opt, idx) => ({ ...opt, enabled: idx < count }))
    );
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    const trimmed = newSubjectInput.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects([...subjects, trimmed]);
      setSubject(trimmed);
      setNewSubjectInput('');
    }
  };

  const resetQuestionFields = () => {
    setQuestionText('');
    setQuestionImage(null);
    setOptions([
      { id: 'A', label: 'أ', text: '', image: null, enabled: true },
      { id: 'B', label: 'ب', text: '', image: null, enabled: true },
      { id: 'C', label: 'ج', text: '', image: null, enabled: true },
      { id: 'D', label: 'د', text: '', image: null, enabled: true },
    ]);
    setMnemonicText('');
    setMnemonicLabel('ربط');
    setMnemonicMediaUrl(null);
    setMnemonicMediaType('none');
  };

  // القوالب السبعة
  const themes = {
    torn_paper: {
      id: 'torn_paper',
      title: '1. كولاج التحدي (الورق الممزق)',
      desc: 'مطابق للصورة: ثيم داكن، ورق ممزق، وعلامة ؟ 3D',
      bg: '#14112E',
      waveTop: '#7548DC',
      waveSub: '#FF7A1A',
      cardBg: '#1B1638',
      border: '#7548DC',
      doodleColor: '#FF7A1A',
      subjectBg: '#C85000',
      subjectColor: '#FFFFFF',
      optionBadge: '#7548DC',
      mnemonicBg: '#2E1916',
      mnemonicBadge: '#FF7A1A',
      textMain: '#FFFFFF',
      waveType: 'torn_paper',
      isDark: true,
    },
    cream: {
      id: 'cream',
      title: '2. عقدة الأصلي (الكريمي)',
      desc: 'مطابق للتصميم الكلاسيكي',
      bg: '#F8F5EC',
      waveTop: '#DE6E79',
      waveSub: '#F3C75F',
      cardBg: '#FCFBF7',
      border: '#9A4854',
      doodleColor: '#D8CFBE',
      subjectBg: '#FCE052',
      subjectColor: '#FFFFFF',
      optionBadge: '#E5A5AE',
      mnemonicBg: '#F3C6CB',
      mnemonicBadge: '#E397A1',
      textMain: '#2B1810',
      waveType: 'wave',
      isDark: false,
    },
    blush: {
      id: 'blush',
      title: '3. عقدة الوردي الفاتح',
      desc: 'نسق ناعم بخلفية وردية',
      bg: '#FDF3F4',
      waveTop: '#C94A58',
      waveSub: '#F2C94C',
      cardBg: '#FFFFFF',
      border: '#9A4854',
      doodleColor: '#EBCBCE',
      subjectBg: '#F2C94C',
      subjectColor: '#FFFFFF',
      optionBadge: '#E5A5AE',
      mnemonicBg: '#FCE7EA',
      mnemonicBadge: '#E397A1',
      textMain: '#2B1810',
      waveType: 'wave',
      isDark: false,
    },
    sand: {
      id: 'sand',
      title: '4. عقدة الرملي الدافئ',
      desc: 'بيج كلاسيكي دافئ',
      bg: '#F4EFE6',
      waveTop: '#B83B4A',
      waveSub: '#E6B84F',
      cardBg: '#FFFDF9',
      border: '#8B3A46',
      doodleColor: '#CEC4B0',
      subjectBg: '#E6B84F',
      subjectColor: '#FFFFFF',
      optionBadge: '#D49B86',
      mnemonicBg: '#F0E2D6',
      mnemonicBadge: '#BA684A',
      textMain: '#2B1810',
      waveType: 'wave',
      isDark: false,
    },
    navy: {
      id: 'navy',
      title: '5. التحصيلي الملكي (فيزياء ورياضيات)',
      desc: 'قصاصات ورق + ذرات، مغناطيس، تكاملات وهندسة',
      bg: '#F0F4F9',
      waveTop: '#0F2744',
      waveSub: '#0284C7',
      cardBg: '#FFFFFF',
      border: '#0F2744',
      doodleColor: '#0284C7',
      subjectBg: '#0284C7',
      subjectColor: '#FFFFFF',
      optionBadge: '#0284C7',
      mnemonicBg: '#E0F2FE',
      mnemonicBadge: '#0369A1',
      textMain: '#0F172A',
      waveType: 'navy',
      isDark: false,
    },
    emerald: {
      id: 'emerald',
      title: '6. المينت الأكاديمي (أحياء وكيمياء)',
      desc: 'قصاصات ورق + حمض نووي، دوارق كيميائية ومجهر',
      bg: '#F0FDF4',
      waveTop: '#064E3B',
      waveSub: '#10B981',
      cardBg: '#FFFFFF',
      border: '#064E3B',
      doodleColor: '#10B981',
      subjectBg: '#10B981',
      subjectColor: '#FFFFFF',
      optionBadge: '#059669',
      mnemonicBg: '#D1FAE5',
      mnemonicBadge: '#047857',
      textMain: '#064E3B',
      waveType: 'emerald',
      isDark: false,
    },
    violet: {
      id: 'violet',
      title: '7. البنفسجي الإبداعي (قدرات وشامل)',
      desc: 'قصاصات ورق + عقل وتروس، مصباح فكرة وأهداف',
      bg: '#F6F3FF',
      waveTop: '#4C1D95',
      waveSub: '#F59E0B',
      cardBg: '#FFFFFF',
      border: '#4C1D95',
      doodleColor: '#7C3AED',
      subjectBg: '#7C3AED',
      subjectColor: '#FFFFFF',
      optionBadge: '#7C3AED',
      mnemonicBg: '#EDE9FE',
      mnemonicBadge: '#6D28D9',
      textMain: '#2E1065',
      waveType: 'violet',
      isDark: false,
    },
  };

  const t = themes[selectedTemplate] || themes.emerald;
  const arabicLabels = ['أ', 'ب', 'ج', 'د'];

  const isLeftLogoTheme = ['navy', 'emerald', 'violet', 'torn_paper'].includes(t.waveType);

  const activeOptions = options.filter(
    (o) => o.enabled && ((o.text && o.text.trim() !== '') || o.image !== null)
  );
  const enabledCount = options.filter((o) => o.enabled).length;

  const hasMnemonicText = enableMnemonic && mnemonicText && mnemonicText.trim() !== '';
  const hasMnemonicMedia = enableMnemonic && mnemonicMediaType !== 'none' && mnemonicMediaUrl;
  const isVideoMnemonic = enableMnemonic && mnemonicMediaType === 'video' && mnemonicMediaUrl;

  // استخراج الصورة في خطوة نظيفة واحدة بدون أي تكرار
  const handleExtractImage = async () => {
    if (!templateCardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(templateCardRef.current, {
        pixelRatio: 2,
        cacheBust: false,
      });

      const link = document.createElement('a');
      link.download = `سؤال_عقدة_${subject || 'تحصيلي'}_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        setExtractedPreviewImage(dataUrl);
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء استخراج الصورة، يرجى المحاولة مجدداً');
    } finally {
      setIsExporting(false);
    }
  };

  // استخراج الفيديو مدمجاً بدون تعليق ومحمي ضد توقف الـ 1%
  const handleExtractFullVideo = async () => {
    const video = videoPlayerRef.current;
    const cardEl = templateCardRef.current;
    if (!video || !cardEl) {
      alert('يرجى التأكد من رفع مقطع الفيديو أولاً');
      return;
    }

    setIsExporting(true);
    setExportProgress(5);

    try {
      // 1. التقاط خلفية القالب
      setExportProgress(12);
      const cardPngUrl = await toPng(cardEl, {
        pixelRatio: 2,
        cacheBust: false,
      });

      setExportProgress(20);
      const cardImg = new Image();
      await new Promise((res, rej) => {
        cardImg.onload = res;
        cardImg.onerror = rej;
        // صمام أمان حتى لا يعلق المتصفح أبداً
        setTimeout(res, 2000);
        cardImg.src = cardPngUrl;
      });

      setExportProgress(25);
      const canvas = document.createElement('canvas');
      canvas.width = cardImg.naturalWidth || 1080;
      canvas.height = cardImg.naturalHeight || 1350;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);

      const videoRect = video.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const scaleX = canvas.width / cardRect.width;
      const scaleY = canvas.height / cardRect.height;

      const destX = (videoRect.left - cardRect.left) * scaleX;
      const destY = (videoRect.top - cardRect.top) * scaleY;
      const destW = videoRect.width * scaleX;
      const destH = videoRect.height * scaleY;

      ctx.save();
      ctx.drawImage(video, destX, destY, destW, destH);
      ctx.restore();

      const stream = canvas.captureStream(30);

      // إعادة تدوير الـ AudioContext والـ SourceNode لمنع خطأ الآيفون
      let audioCtx = audioCtxRef.current;
      if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          audioCtxRef.current = audioCtx;
        }
      }

      if (audioCtx) {
        if (audioCtx.state === 'suspended') {
          try { await audioCtx.resume(); } catch (_) {}
        }
        try {
          if (!sourceNodeRef.current) {
            sourceNodeRef.current = audioCtx.createMediaElementSource(video);
          }
          const destNode = audioCtx.createMediaStreamDestination();
          sourceNodeRef.current.disconnect();
          sourceNodeRef.current.connect(destNode);
          sourceNodeRef.current.connect(audioCtx.destination);
          const audioTrack = destNode.stream.getAudioTracks()[0];
          if (audioTrack) {
            stream.addTrack(audioTrack);
          }
        } catch (audioErr) {
          console.warn('تنبيه مسار الصوت:', audioErr);
        }
      }

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4;codecs=avc1'
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 3500000,
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `سؤال_عقدة_مدمج_${subject || 'تحصيلي'}_${Date.now()}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsExporting(false);
        setExportProgress(0);
        video.pause();
        video.currentTime = 0;
      };

      video.currentTime = 0;
      video.muted = false;

      try {
        await video.play();
      } catch {
        video.muted = true;
        await video.play();
      }

      // بدء التسجيل فورياً دون تأخير
      mediaRecorder.start(250);

      const totalDuration = video.duration || 10;
      let animationFrameId = null;

      const renderLoop = () => {
        if (video.paused || video.ended || video.currentTime >= totalDuration) {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
          return;
        }

        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }

        ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.drawImage(video, destX, destY, destW, destH);
        ctx.restore();

        // تحديث النسبة المئوية فورياً بدون توقف
        const percent = Math.min(99, Math.max(25, Math.round((video.currentTime / totalDuration) * 100)));
        setExportProgress(percent);

        animationFrameId = requestAnimationFrame(renderLoop);
      };

      animationFrameId = requestAnimationFrame(renderLoop);

      video.onended = () => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };
    } catch (err) {
      console.error(err);
      alert('تعذر استخراج الفيديو، يرجى المحاولة مرة أخرى');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F6F9] text-slate-900 flex flex-col font-sans">
      {/* نافذة معاينة الصورة للآيفون لحفظها في الصور بضغطة مطولة */}
      {extractedPreviewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm font-black text-slate-900">تم استخراج الصورة بنجاح 🎉</span>
              <button
                type="button"
                onClick={() => setExtractedPreviewImage(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-600 font-bold">
              اضغط مطولاً على الصورة أدناه ثم اختر <span className="text-[#D65261]">"حفظ في الصور" (Save to Photos)</span>
            </p>
            <div className="max-h-[60vh] overflow-auto rounded-2xl border border-slate-200">
              <img src={extractedPreviewImage} alt="المعاينة النهائية" className="w-full h-auto block" />
            </div>
            <button
              type="button"
              onClick={() => setExtractedPreviewImage(null)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* نافذة التحميل أثناء التصدير */}
      {isExporting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 border-4 border-[#D65261] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-base font-black">
              {isVideoMnemonic ? 'جاري استخراج القالب والمقطع معاً...' : 'جاري استخراج القالب...'}
            </h3>
            <p className="text-xs text-slate-300">يتم إعداد القالب بدون أي تكرار وبأعلى دقة</p>
            {isVideoMnemonic && exportProgress > 0 && (
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                <div
                  className="bg-emerald-500 h-full transition-all duration-200"
                  style={{ width: `${exportProgress}%` }}
                ></div>
              </div>
            )}
            {isVideoMnemonic && <span className="text-xs text-slate-400 font-mono">{exportProgress}%</span>}
          </div>
        </div>
      )}

      {/* الشريط العلوي */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            <button
              type="button"
              onClick={() => logoRef.current?.click()}
              title="اضغط لتغيير الشعار"
              className="rounded-2xl p-1 bg-[#FFFDF9] border border-slate-200 hover:border-[#D65261] transition-all cursor-pointer flex items-center justify-center shrink-0"
            >
              {customLogo ? (
                <img src={customLogo} alt="شعار" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              ) : (
                <UqdahLogo size={42} />
              )}
            </button>
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files?.[0], setCustomLogo)}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-sm sm:text-base font-black text-slate-900 truncate">أكاديمية عقدة</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D65261]/10 text-[#A83846]">
                  صانع القوالب الذكي
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 truncate">معالجة فورية وتصدير سريع للآيفون</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isVideoMnemonic ? (
              <button
                type="button"
                onClick={handleExtractFullVideo}
                disabled={isExporting}
                className="bg-[#D65261] hover:bg-[#B83746] text-white text-xs font-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Extract: استخراج القالب مع الفيديو 🎬</span>
                <span className="sm:hidden">استخراج 🎬</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleExtractImage}
                disabled={isExporting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">Extract: استخراج القالب (PNG) 🖼️</span>
                <span className="sm:hidden">استخراج 🖼️</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* شريط التبويبات للجوال */}
      <div className="lg:hidden flex items-center bg-slate-200/80 p-1 rounded-2xl mx-3 mt-3">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
            mobileTab === 'edit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          ✏️ تعديل السؤال والبيانات
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'preview' ? 'bg-[#D65261] text-white shadow-sm' : 'text-slate-600'
          }`}
        >
          <span>👁️ المعاينة والاستخراج</span>
          {isVideoMnemonic && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
        </button>
      </div>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* العمود الأيمن: إدخال البيانات */}
        <section
          className={`lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${
            mobileTab === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h2 className="text-sm font-black text-slate-900">بيانات السؤال والخيارات</h2>
            <button
              type="button"
              onClick={resetQuestionFields}
              className="text-xs font-bold text-slate-600 hover:text-rose-600 bg-white px-2.5 py-1 rounded-xl border border-slate-200 cursor-pointer"
            >
              تفريغ لسؤال جديد
            </button>
          </div>

          <div className="p-4 sm:p-5 space-y-4 sm:space-y-5">
            {/* 1. اسم المادة */}
            <div className="space-y-2">
              <label className="flex items-center justify-between text-xs font-black text-slate-800">
                <span>1. اسم المادة</span>
                <span className="text-[11px] font-bold text-[#A83846] bg-[#D65261]/10 px-2 py-0.5 rounded-md">
                  {subject}
                </span>
              </label>

              <div className="flex flex-wrap gap-1.5">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSubject(sub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      subject === sub
                        ? 'bg-[#D65261] text-white border-[#D65261]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddSubject} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSubjectInput}
                  onChange={(e) => setNewSubjectInput(e.target.value)}
                  placeholder="أو اكتب اسم مادة أخرى..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold shrink-0 cursor-pointer"
                >
                  + إضافة
                </button>
              </form>
            </div>

            <hr className="border-slate-100" />

            {/* 2. السؤال (نص + صورة) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-black text-slate-800">2. السؤال (نص أو صورة)</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => qImgRef.current?.click()}
                    className="text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    {questionImage ? 'تغيير صورة السؤال' : '+ إرفاق صورة للسؤال'}
                  </button>
                  {questionImage && (
                    <button
                      type="button"
                      onClick={() => setQuestionImage(null)}
                      className="text-xs font-bold px-2 py-1 rounded-xl bg-rose-50 text-rose-600 cursor-pointer"
                    >
                      حذف
                    </button>
                  )}
                </div>
                <input
                  ref={qImgRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files?.[0], setQuestionImage)}
                />
              </div>

              <textarea
                rows={2}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="اكتب نص السؤال هنا..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-sm font-bold text-slate-900 focus:outline-none focus:bg-white resize-none"
              />

              {questionImage && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5">
                  <img src={questionImage} alt="السؤال" className="h-10 w-10 object-contain bg-white rounded-lg border border-slate-200" />
                  <span className="text-xs text-slate-600 font-bold truncate">تم إرفاق صورة السؤال بنجاح</span>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* 3. الخيارات */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-black text-slate-800 block">3. الخيارات</label>
                  <span className="text-[11px] text-slate-500">اختر عدد الخيارات:</span>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { count: 4, label: '4' },
                    { count: 3, label: '3' },
                    { count: 2, label: '2' },
                    { count: 1, label: '1 (خيار واحد)' },
                    { count: 0, label: 'بدون' },
                  ].map((item) => (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setQuickOptionCount(item.count)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-all ${
                        enabledCount === item.count
                          ? 'bg-[#D65261] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {enabledCount > 0 && (
                <>
                  <div className="flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-600">اضغط لتعيين الجواب:</span>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={highlightCorrectAnswer}
                        onChange={(e) => setHighlightCorrectAnswer(e.target.checked)}
                        className="rounded accent-emerald-600 cursor-pointer"
                      />
                      تلوين الجواب الصحيح
                    </label>
                  </div>

                  <div className={`grid gap-2 ${enabledCount === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                    {options.map((opt) => {
                      if (!opt.enabled) return null;
                      const isSelectedRight = rightAnswer === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2 rounded-xl border transition-all ${
                            isSelectedRight ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setRightAnswer(opt.id)}
                              className={`w-7 h-7 rounded-full font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                                isSelectedRight ? 'bg-emerald-600 text-white' : 'bg-[#E5A5AE] text-white'
                              }`}
                            >
                              {opt.label}
                            </button>

                            <input
                              type="text"
                              value={opt.text}
                              onChange={(e) => updateOption(opt.id, { text: e.target.value })}
                              placeholder={`نص الخيار (${opt.label})...`}
                              className="flex-1 min-w-0 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                            />

                            <button
                              type="button"
                              onClick={() => optImgRefs[opt.id]?.current?.click()}
                              className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-bold text-slate-600 cursor-pointer"
                            >
                              صورة
                            </button>
                            <button
                              type="button"
                              onClick={() => updateOption(opt.id, { enabled: false })}
                              title="إخفاء"
                              className="px-1.5 py-1 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                            <input
                              ref={optImgRefs[opt.id]}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleFileUpload(e.target.files?.[0], (url) =>
                                  updateOption(opt.id, { image: url })
                                )
                              }
                            />
                          </div>

                          {opt.image && (
                            <div className="mt-1.5 bg-white rounded-lg p-1 border border-slate-200 flex items-center justify-between">
                              <img src={opt.image} alt="" className="h-8 object-contain rounded" />
                              <button
                                type="button"
                                onClick={() => updateOption(opt.id, { image: null })}
                                className="text-[10px] font-bold text-rose-600 px-2 cursor-pointer"
                              >
                                حذف الصورة
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* 4. الربط الذهني مع شارة قابلة للتعديل أو الحذف */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">4. الربط والشرح الذهني</span>
                  <span className="text-[11px] text-slate-500">خصص شارة الكلمة أو احذفها واكتب الشرح</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableMnemonic(!enableMnemonic)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer ${
                    enableMnemonic ? 'bg-[#D65261] text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {enableMnemonic ? 'الربط مفعّل ✓' : '+ تفعيل'}
                </button>
              </div>

              {enableMnemonic && (
                <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-700">كلمة الشارة (اتركها فارغة لإخفائها):</label>
                      {mnemonicLabel.trim() !== '' ? (
                        <button
                          type="button"
                          onClick={() => setMnemonicLabel('')}
                          className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          إخفاء الشارة ✕
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setMnemonicLabel('ربط')}
                          className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
                        >
                          استعادة "ربط" ✓
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={mnemonicLabel}
                        onChange={(e) => setMnemonicLabel(e.target.value)}
                        placeholder="اكتب كلمة الشارة أو اتركها فارغة للإخفاء..."
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none text-center placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 font-bold">خيارات سريعة:</span>
                      {['ربط', 'فكرة', 'تلميح', 'توضيح', 'قانون', ''].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setMnemonicLabel(tag)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                            mnemonicLabel === tag
                              ? 'bg-[#D65261] text-white border-[#D65261]'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {tag === '' ? 'بدون شارة' : tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">نص جملة الربط / الشرح:</label>
                    <input
                      type="text"
                      value={mnemonicText}
                      onChange={(e) => setMnemonicText(e.target.value)}
                      placeholder="اكتب جملة الربط أو الشرح هنا..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">نوع الميديا أسفل الكرت:</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setMnemonicMediaType('none');
                          setMnemonicMediaUrl(null);
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                          mnemonicMediaType === 'none'
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        بدون
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMnemonicMediaType('image');
                          mnemonicImageInputRef.current?.click();
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer truncate ${
                          mnemonicMediaType === 'image'
                            ? 'bg-[#D65261] text-white border-[#D65261]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        🖼️ صورة
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMnemonicMediaType('video');
                          mnemonicVideoInputRef.current?.click();
                        }}
                        className={`py-2 rounded-xl text-xs font-bold border cursor-pointer truncate ${
                          mnemonicMediaType === 'video'
                            ? 'bg-[#D65261] text-white border-[#D65261]'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        🎬 فيديو
                      </button>
                    </div>

                    <input
                      ref={mnemonicImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], setMnemonicMediaUrl)}
                    />

                    <input
                      ref={mnemonicVideoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setMnemonicMediaUrl(url);
                        }
                      }}
                    />

                    {mnemonicMediaUrl && (
                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-rose-200">
                        <span className="text-xs font-bold text-slate-700 truncate">
                          {mnemonicMediaType === 'video' ? '🎬 تم إرفاق مقطع الفيديو' : '🖼️ تم إرفاق صورة الربط'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setMnemonicMediaUrl(null)}
                          className="text-xs font-bold text-rose-600 px-2 py-0.5 bg-rose-50 rounded-lg cursor-pointer shrink-0"
                        >
                          حذف
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* زر انتقال سريع للمعاينة على الجوال */}
            <div className="lg:hidden pt-2">
              <button
                type="button"
                onClick={() => setMobileTab('preview')}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>الانتقال للمعاينة واستخراج القالب ←</span>
              </button>
            </div>
          </div>
        </section>

        {/* العمود الأيسر: المعاينة الحية */}
        <section
          className={`lg:col-span-7 space-y-4 ${
            mobileTab === 'preview'
              ? 'block'
              : 'fixed -left-[9999px] top-0 opacity-0 pointer-events-none lg:relative lg:left-0 lg:opacity-100 lg:pointer-events-auto lg:block'
          }`}
        >
          {/* اختيار الثيمات السبعة */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">اختر ثيم القالب:</span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {t.title.split('.')[1] || t.title}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(themes).map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedTemplate === tpl.id
                      ? 'bg-[#FFF5F6] border-[#D65261] shadow-sm ring-2 ring-[#D65261]/20'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] sm:text-xs font-black text-slate-900 truncate">{tpl.title}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-black/10 shrink-0 mr-1"
                      style={{ backgroundColor: tpl.waveTop }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{tpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* حاوية المعاينة الثابتة هندسياً */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-5 shadow-sm">
            <div
              ref={previewWrapperRef}
              className="w-full flex justify-center items-start overflow-hidden"
              style={{
                height: canvasScale < 1 && measuredCardHeight > 0 ? `${measuredCardHeight * canvasScale}px` : 'auto',
              }}
            >
              <div
                style={{
                  width: '540px',
                  minWidth: '540px',
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'top center',
                }}
              >
                <div
                  ref={templateCardRef}
                  style={{
                    width: '540px',
                    fontFamily: "'Tajawal', sans-serif",
                    direction: 'rtl',
                    backgroundColor: t.bg,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '24px',
                    padding: hasMnemonicMedia ? '20px 28px 20px' : '20px 28px 28px',
                    boxSizing: 'border-box',
                    border: `1.5px solid ${t.border}22`,
                  }}
                >
                  {/* عناصر الجرافيك لقالب الورق الممزق والكولاج (Torn Paper Theme) */}
                  {t.waveType === 'torn_paper' ? (
                    <>
                      {/* زاوية أعلى اليسار */}
                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 0,0 L 140,0 Q 120,35 90,68 L 52,108 L 0,132 Z" fill="#FF7A1A" />
                        <path d="M 0,0 L 130,0 L 126,10 L 120,14 L 122,24 L 115,30 L 117,38 L 108,46 L 110,54 L 98,62 L 95,72 L 80,80 L 78,90 L 62,98 L 58,108 L 40,116 L 35,124 L 18,128 L 0,122 Z" fill="#7548DC" stroke="#FFFFFF" strokeWidth="1.5" />
                        <polygon points="122,78 140,90 135,76" fill="#FF7A1A" />
                        <polygon points="106,98 124,115 118,100" fill="#FF7A1A" />
                        <polygon points="90,122 105,142 98,126" fill="#FF7A1A" />
                      </svg>

                      {/* زاوية أعلى اليمين مع علامة الاستفهام 3D */}
                      <svg viewBox="0 0 160 170" style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '170px', pointerEvents: 'none', zIndex: 1 }}>
                        <polygon points="32,70 10,75 18,84" fill="#FF7A1A" />
                        <polygon points="40,88 15,100 28,108" fill="#FF7A1A" />
                        <polygon points="52,108 30,128 42,130" fill="#FF7A1A" />

                        <path d="M 45,0 L 160,0 L 160,135 Q 120,120 75,100 L 55,60 Z" fill="#FF7A1A" />
                        <path d="M 55,0 L 160,0 L 160,125 L 148,122 L 140,130 L 130,120 L 120,125 L 110,115 L 98,118 L 88,105 L 75,110 L 68,95 L 62,70 L 52,45 L 60,25 Z" fill="#7548DC" stroke="#FFFFFF" strokeWidth="1.5" />

                        <g transform="translate(68, 8) rotate(10 35 60)">
                          <text x="6" y="78" fontFamily="'Arial Black', Impact, sans-serif" fontSize="76" fontWeight="900" fill="#D95A00">?</text>
                          <text x="4" y="76" fontFamily="'Arial Black', Impact, sans-serif" fontSize="76" fontWeight="900" fill="#FF7A1A">?</text>
                          <text x="0" y="72" fontFamily="'Arial Black', Impact, sans-serif" fontSize="76" fontWeight="900" fill="#FFFFFF">?</text>
                        </g>

                        <path d="M 125,135 Q 115,155 130,162 Q 148,165 145,142" fill="none" stroke="#FF7A1A" strokeWidth="2.5" strokeLinecap="round" />
                        <polyline points="138,140 146,141 148,150" fill="none" stroke="#FF7A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                      {/* زاوية أسفل اليسار */}
                      <svg viewBox="0 0 170 160" style={{ position: 'absolute', bottom: 0, left: 0, width: '170px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <g fill="#6C44D6" opacity="0.85">
                          <circle cx="20" cy="25" r="3.2" />
                          <circle cx="36" cy="25" r="3.2" />
                          <circle cx="52" cy="25" r="3.2" />
                          <circle cx="20" cy="40" r="3.2" />
                          <circle cx="36" cy="40" r="3.2" />
                          <circle cx="52" cy="40" r="3.2" />
                          <circle cx="20" cy="55" r="3.2" />
                          <circle cx="36" cy="55" r="3.2" />
                          <circle cx="52" cy="55" r="3.2" />
                        </g>

                        <path d="M 12,95 C 35,50 75,55 60,85 C 48,110 18,90 25,72 C 32,55 72,70 65,100" fill="none" stroke="#FF7A1A" strokeWidth="3.5" strokeLinecap="round" />

                        <path d="M 0,160 L 165,160 Q 130,125 90,118 L 45,125 L 0,85 Z" fill="#FF7A1A" />
                        <path d="M 0,160 L 155,160 L 150,150 L 140,145 L 132,152 L 120,142 L 110,148 L 98,135 L 85,142 L 72,130 L 60,135 L 45,120 L 30,126 L 15,105 L 0,110 Z" fill="#7548DC" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>

                      {/* زاوية أسفل اليمين */}
                      <svg viewBox="0 0 170 140" style={{ position: 'absolute', bottom: 0, right: 0, width: '170px', height: '140px', pointerEvents: 'none', zIndex: 1 }}>
                        <polygon points="50,90 28,100 38,108" fill="#FF7A1A" />
                        <polygon points="68,70 48,82 58,90" fill="#FF7A1A" />

                        <path d="M 170,140 L 0,140 Q 35,105 80,95 L 125,105 L 170,65 Z" fill="#FF7A1A" />
                        <path d="M 170,140 L 10,140 L 22,130 L 35,134 L 48,122 L 60,128 L 75,115 L 90,120 L 105,108 L 120,115 L 135,100 L 150,108 L 160,85 L 170,90 Z" fill="#7548DC" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>

                      {/* منتصف الحافة اليمنى */}
                      <svg viewBox="0 0 50 120" style={{ position: 'absolute', top: '45%', right: 0, width: '45px', height: '110px', pointerEvents: 'none', zIndex: 1 }}>
                        <g fill="#6C44D6" opacity="0.8">
                          <circle cx="12" cy="15" r="2.8" />
                          <circle cx="24" cy="15" r="2.8" />
                          <circle cx="12" cy="28" r="2.8" />
                          <circle cx="24" cy="28" r="2.8" />
                        </g>
                        <path d="M 45,35 L 5,60 L 15,75 L 8,90 L 45,105 Z" fill="#FF7A1A" />
                        <path d="M 45,40 L 15,62 L 20,72 L 14,85 L 45,98 Z" fill="#7548DC" stroke="#FFFFFF" strokeWidth="1.2" />
                      </svg>
                    </>
                  ) : t.waveType === 'emerald' ? (
                    /* قالب المينت الأكاديمي (أحياء وكيمياء) */
                    <>
                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 0,0 L 145,0 Q 120,35 90,70 L 50,110 L 0,135 Z" fill="#10B981" />
                        <path d="M 0,0 L 135,0 L 130,12 L 122,16 L 124,26 L 115,32 L 118,42 L 105,50 L 108,58 L 95,66 L 90,78 L 75,85 L 72,96 L 55,104 L 50,115 L 32,122 L 25,130 L 0,125 Z" fill="#064E3B" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx="115" cy="85" r="4" fill="#10B981" />
                        <circle cx="132" cy="72" r="3" fill="#34D399" />
                        <circle cx="98" cy="108" r="3.5" fill="#10B981" />
                      </svg>

                      <svg viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 50,0 L 160,0 L 160,130 Q 115,115 70,95 L 45,55 Z" fill="#10B981" />
                        <path d="M 60,0 L 160,0 L 160,120 L 148,118 L 142,126 L 130,116 L 120,122 L 108,112 L 95,116 L 85,102 L 72,106 L 65,88 L 58,65 L 50,40 L 60,20 Z" fill="#064E3B" stroke="#FFFFFF" strokeWidth="1.5" />
                        <g stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.95" transform="translate(85, 20)">
                          <path d="M 15,5 Q 35,25 15,45 Q -5,65 15,85" />
                          <path d="M 30,5 Q 10,25 30,45 Q 50,65 30,85" />
                          <line x1="16" y1="15" x2="28" y2="15" strokeWidth="1.8" />
                          <line x1="22" y1="25" x2="24" y2="25" strokeWidth="1.8" />
                          <line x1="16" y1="35" x2="28" y2="35" strokeWidth="1.8" />
                          <line x1="16" y1="55" x2="28" y2="55" strokeWidth="1.8" />
                          <line x1="22" y1="65" x2="24" y2="65" strokeWidth="1.8" />
                          <line x1="16" y1="75" x2="28" y2="75" strokeWidth="1.8" />
                        </g>
                      </svg>

                      <svg viewBox="0 0 170 160" style={{ position: 'absolute', bottom: 0, left: 0, width: '170px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <g transform="translate(15, 20)">
                          <path d="M 28,15 L 28,28 L 10,65 A 6,6 0 0,0 16,74 L 54,74 A 6,6 0 0,0 60,65 L 42,28 L 42,15 Z" fill="#D1FAE5" stroke="#059669" strokeWidth="2.5" />
                          <path d="M 18,52 Q 35,46 52,52 L 56,66 A 4,4 0 0,1 52,71 L 18,71 A 4,4 0 0,1 14,66 Z" fill="#10B981" opacity="0.85" />
                          <circle cx="32" cy="58" r="2.5" fill="#FFFFFF" />
                          <circle cx="40" cy="48" r="3" fill="#FFFFFF" />
                          <circle cx="30" cy="36" r="2" fill="#059669" />
                          <circle cx="36" cy="24" r="2.5" fill="#10B981" />
                          <circle cx="44" cy="12" r="3" fill="#059669" />
                        </g>
                        <polygon points="100,35 118,25 136,35 136,55 118,65 100,55" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3,2" />
                        <circle cx="118" cy="45" r="8" fill="none" stroke="#059669" strokeWidth="1.8" />
                        <path d="M 0,160 L 160,160 Q 125,125 85,115 L 40,122 L 0,80 Z" fill="#10B981" />
                        <path d="M 0,160 L 150,160 L 145,150 L 135,144 L 126,150 L 115,140 L 104,146 L 90,132 L 78,138 L 65,126 L 50,130 L 35,116 L 20,122 L 0,105 Z" fill="#064E3B" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>

                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', bottom: 0, right: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <g transform="translate(45, 15) rotate(35)">
                          <rect x="0" y="0" width="14" height="42" rx="7" fill="#D1FAE5" stroke="#059669" strokeWidth="2" />
                          <path d="M 2,20 Q 7,17 12,20 L 12,35 A 5,5 0 0,1 2,35 Z" fill="#10B981" />
                          <circle cx="7" cy="48" r="2" fill="#059669" />
                          <circle cx="7" cy="55" r="2.5" fill="#10B981" />
                        </g>
                        <path d="M 170,145 L 0,145 Q 35,108 80,98 L 125,108 L 170,68 Z" fill="#10B981" />
                        <path d="M 170,145 L 10,145 L 22,135 L 35,138 L 48,126 L 60,132 L 75,118 L 90,124 L 105,112 L 120,118 L 135,104 L 150,112 L 160,88 L 170,94 Z" fill="#064E3B" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                    </>
                  ) : t.waveType === 'navy' ? (
                    /* قالب الفيزياء والرياضيات */
                    <>
                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 0,0 L 140,0 Q 120,35 90,68 L 52,108 L 0,132 Z" fill="#0284C7" />
                        <path d="M 0,0 L 130,0 L 126,10 L 120,14 L 122,24 L 115,30 L 117,38 L 108,46 L 110,54 L 98,62 L 95,72 L 80,80 L 78,90 L 62,98 L 58,108 L 40,116 L 35,124 L 18,128 L 0,122 Z" fill="#0F2744" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="95" y="125" fontFamily="serif" fontSize="18" fill="#0284C7" fontWeight="bold">∑</text>
                        <text x="125" y="85" fontFamily="serif" fontSize="20" fill="#38BDF8" fontWeight="bold">∫</text>
                      </svg>

                      <svg viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 45,0 L 160,0 L 160,135 Q 120,120 75,100 L 55,60 Z" fill="#0284C7" />
                        <path d="M 55,0 L 160,0 L 160,125 L 148,122 L 140,130 L 130,120 L 120,125 L 110,115 L 98,118 L 88,105 L 75,110 L 68,95 L 62,70 L 52,45 L 60,25 Z" fill="#0F2744" stroke="#FFFFFF" strokeWidth="1.5" />
                        <g transform="translate(100, 50)" stroke="#38BDF8" strokeWidth="1.8" fill="none">
                          <ellipse cx="0" cy="0" rx="32" ry="11" />
                          <ellipse cx="0" cy="0" rx="32" ry="11" transform="rotate(60)" />
                          <ellipse cx="0" cy="0" rx="32" ry="11" transform="rotate(120)" />
                          <circle cx="0" cy="0" r="5" fill="#0284C7" stroke="none" />
                          <circle cx="28" cy="0" r="2.5" fill="#FFFFFF" stroke="none" />
                          <circle cx="-14" cy="24" r="2.5" fill="#FFFFFF" stroke="none" />
                        </g>
                      </svg>

                      <svg viewBox="0 0 170 160" style={{ position: 'absolute', bottom: 0, left: 0, width: '170px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <g transform="translate(30, 25)">
                          <path d="M 12,55 L 12,24 A 20,20 0 0,1 52,24 L 52,55 L 40,55 L 40,24 A 8,8 0 0,0 24,24 L 24,55 Z" fill="#E2E8F0" stroke="#0F2744" strokeWidth="2" />
                          <rect x="12" y="42" width="12" height="13" fill="#EF4444" />
                          <rect x="40" y="42" width="12" height="13" fill="#3B82F6" />
                          <text x="15" y="52" fontSize="9" fontWeight="bold" fill="#FFF">N</text>
                          <text x="44" y="52" fontSize="9" fontWeight="bold" fill="#FFF">S</text>
                        </g>
                        <text x="95" y="40" fontFamily="sans-serif" fontSize="13" fill="#0284C7" fontWeight="bold">E = mc²</text>
                        <text x="95" y="65" fontFamily="sans-serif" fontSize="13" fill="#0F2744" fontWeight="bold">F = ma</text>
                        <path d="M 0,160 L 165,160 Q 130,125 90,118 L 45,125 L 0,85 Z" fill="#0284C7" />
                        <path d="M 0,160 L 155,160 L 150,150 L 140,145 L 132,152 L 120,142 L 110,148 L 98,135 L 85,142 L 72,130 L 60,135 L 45,120 L 30,126 L 15,105 L 0,110 Z" fill="#0F2744" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>

                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', bottom: 0, right: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <polygon points="50,60 110,60 110,15" fill="none" stroke="#0284C7" strokeWidth="2" />
                        <text x="75" y="75" fontSize="10" fill="#0F2744" fontWeight="bold">a² + b² = c²</text>
                        <path d="M 170,145 L 0,145 Q 35,108 80,98 L 125,108 L 170,68 Z" fill="#0284C7" />
                        <path d="M 170,145 L 10,145 L 22,135 L 35,138 L 48,126 L 60,132 L 75,118 L 90,124 L 105,112 L 120,118 L 135,104 L 150,112 L 160,88 L 170,94 Z" fill="#0F2744" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                    </>
                  ) : t.waveType === 'violet' ? (
                    /* قالب القدرات والتفكير */
                    <>
                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', top: 0, left: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 0,0 L 140,0 Q 120,35 90,68 L 52,108 L 0,132 Z" fill="#F59E0B" />
                        <path d="M 0,0 L 130,0 L 126,10 L 120,14 L 122,24 L 115,30 L 117,38 L 108,46 L 110,54 L 98,62 L 95,72 L 80,80 L 78,90 L 62,98 L 58,108 L 40,116 L 35,124 L 18,128 L 0,122 Z" fill="#4C1D95" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text x="95" y="125" fontFamily="sans-serif" fontSize="22" fill="#F59E0B" fontWeight="900">%</text>
                        <text x="125" y="85" fontFamily="sans-serif" fontSize="16" fill="#8B5CF6" fontWeight="bold">100%</text>
                      </svg>

                      <svg viewBox="0 0 160 160" style={{ position: 'absolute', top: 0, right: 0, width: '160px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <path d="M 45,0 L 160,0 L 160,135 Q 120,120 75,100 L 55,60 Z" fill="#F59E0B" />
                        <path d="M 55,0 L 160,0 L 160,125 L 148,122 L 140,130 L 130,120 L 120,125 L 110,115 L 98,118 L 88,105 L 75,110 L 68,95 L 62,70 L 52,45 L 60,25 Z" fill="#4C1D95" stroke="#FFFFFF" strokeWidth="1.5" />
                        <g transform="translate(100, 42)">
                          <path d="M 12,0 A 16,16 0 0,0 2,24 Q 7,30 7,36 L 17,36 Q 17,30 22,24 A 16,16 0 0,0 12,0 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2.5" />
                          <rect x="7" y="37" width="10" height="4" rx="2" fill="#D97706" />
                          <line x1="12" y1="-8" x2="12" y2="-3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                          <line x1="-3" y1="2" x2="2" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                          <line x1="27" y1="2" x2="22" y2="5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                        </g>
                      </svg>

                      <svg viewBox="0 0 170 160" style={{ position: 'absolute', bottom: 0, left: 0, width: '170px', height: '160px', pointerEvents: 'none', zIndex: 1 }}>
                        <g transform="translate(25, 20)" stroke="#7C3AED" strokeWidth="2" fill="none">
                          <path d="M 25,15 C 10,15 5,30 15,45 C 5,55 15,70 30,68 C 45,72 55,55 45,45 C 55,30 40,15 25,15 Z" fill="#EDE9FE" />
                          <circle cx="28" cy="42" r="7" stroke="#F59E0B" strokeWidth="2" />
                          <path d="M 28,31 L 28,35 M 28,49 L 28,53 M 17,42 L 21,42 M 35,42 L 39,42" stroke="#F59E0B" strokeWidth="2" />
                        </g>
                        <path d="M 0,160 L 165,160 Q 130,125 90,118 L 45,125 L 0,85 Z" fill="#F59E0B" />
                        <path d="M 0,160 L 155,160 L 150,150 L 140,145 L 132,152 L 120,142 L 110,148 L 98,135 L 85,142 L 72,130 L 60,135 L 45,120 L 30,126 L 15,105 L 0,110 Z" fill="#4C1D95" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>

                      <svg viewBox="0 0 170 145" style={{ position: 'absolute', bottom: 0, right: 0, width: '170px', height: '145px', pointerEvents: 'none', zIndex: 1 }}>
                        <g transform="translate(50, 15)">
                          <circle cx="25" cy="25" r="22" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
                          <circle cx="25" cy="25" r="14" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="2" />
                          <circle cx="25" cy="25" r="6" fill="#EF4444" stroke="none" />
                          <path d="M 5,5 L 25,25" stroke="#4C1D95" strokeWidth="2.5" strokeLinecap="round" />
                          <polyline points="20,12 25,25 12,20" fill="#4C1D95" />
                        </g>
                        <path d="M 170,145 L 0,145 Q 35,108 80,98 L 125,108 L 170,68 Z" fill="#F59E0B" />
                        <path d="M 170,145 L 10,145 L 22,135 L 35,138 L 48,126 L 60,132 L 75,118 L 90,124 L 105,112 L 120,118 L 135,104 L 150,112 L 160,88 L 170,94 Z" fill="#4C1D95" stroke="#FFFFFF" strokeWidth="1.5" />
                      </svg>
                    </>
                  ) : (
                    /* القوالب الكلاسيكية الأصلية */
                    <>
                      <svg
                        viewBox="0 0 800 750"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          pointerEvents: 'none',
                          opacity: 0.35,
                        }}
                        preserveAspectRatio="xMidYMid slice"
                      >
                        <g fill={t.doodleColor} stroke={t.doodleColor} fontFamily="serif" fontSize="22">
                          <text x="110" y="65" stroke="none">= ln x</text>
                          <text x="450" y="75" stroke="none">.. = tan</text>
                          <text x="720" y="210" stroke="none">2R</text>
                          <text x="610" y="520" stroke="none" fontSize="28">tan</text>
                          <text x="640" y="560" stroke="none">E = mc²</text>
                          <text x="690" y="625" stroke="none">sin</text>
                          <text x="690" y="655" stroke="none">cos</text>
                          <text x="15" y="370" stroke="none">in</text>
                          <text x="5" y="405" stroke="none">cos</text>
                          <text x="150" y="595" stroke="none" fontSize="28">%</text>
                          <polygon points="240,35 290,90 215,90" fill="none" strokeWidth="2" />
                          <polygon points="680,600 745,675 655,675" fill="none" strokeWidth="2" />
                        </g>
                      </svg>

                      <svg viewBox="0 0 800 135" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '110px', pointerEvents: 'none' }} preserveAspectRatio="none">
                        <path d="M 0,32 Q 210,-15 470,22 Q 650,120 800,88 L 800,0 L 0,0 Z" fill={t.waveSub} opacity="0.65" />
                        <path d="M 0,24 Q 230,-18 480,15 Q 660,110 800,82 L 800,58 Q 660,85 490,0 L 0,0 Z" fill={t.waveTop} />
                      </svg>
                    </>
                  )}

                  {/* الشعار: على اليسار للقوالب المعدلة، وعلى اليمين للقوالب الكلاسيكية */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 3,
                      display: 'flex',
                      justifyContent: isLeftLogoTheme ? 'flex-end' : 'flex-start',
                      width: '100%',
                      marginTop: '4px',
                      backgroundColor: 'transparent',
                      padding: isLeftLogoTheme ? '0 10px 0 0' : '0 0 0 10px',
                    }}
                  >
                    {customLogo ? (
                      <img
                        src={customLogo}
                        alt="شعار"
                        style={{
                          maxHeight: '80px',
                          maxWidth: '120px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <UqdahLogo size={80} />
                    )}
                  </div>

                  {/* دائرة اسم المادة */}
                  <div style={{ position: 'relative', zIndex: 3, display: 'flex', justifyContent: 'center', marginTop: '-30px', marginBottom: '-38px' }}>
                    <div
                      style={{
                        width: '86px',
                        height: '86px',
                        borderRadius: '50%',
                        backgroundColor: t.subjectBg,
                        color: t.subjectColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '28px',
                        textShadow: '0 1px 2px rgba(0,0,0,0.15)',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                        border: t.isDark ? '2.5px solid #FFFFFF' : 'none',
                      }}
                    >
                      {subject || 'احياء'}
                    </div>
                  </div>

                  {/* الصندوق للأسئلة والخيارات والربط */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      backgroundColor: t.cardBg,
                      border: `2px solid ${t.border}`,
                      borderRadius: '24px',
                      padding: '40px 22px 18px',
                      boxSizing: 'border-box',
                      boxShadow: t.isDark ? '0 8px 24px rgba(0,0,0,0.35)' : '0 4px 14px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* نص وصورة السؤال */}
                    <div
                      style={{
                        textAlign: 'center',
                        fontWeight: 800,
                        fontSize: '22px',
                        color: t.textMain,
                        lineHeight: 1.4,
                      }}
                    >
                      {questionText && <div>{questionText}</div>}
                      {questionImage && (
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                          <img
                            src={questionImage}
                            alt="صورة السؤال"
                            style={{
                              maxHeight: '220px',
                              maxWidth: '100%',
                              width: 'auto',
                              height: 'auto',
                              borderRadius: '12px',
                              border: `1px solid ${t.border}33`,
                              display: 'block',
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* الخيارات */}
                    {activeOptions.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: activeOptions.length === 1 ? '1fr' : 'repeat(2, 1fr)',
                          gap: '12px 14px',
                          marginTop: '15px',
                          maxWidth: activeOptions.length === 1 ? '380px' : '100%',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                        }}
                      >
                        {activeOptions.map((opt, index) => {
                          const isCorrect = highlightCorrectAnswer && rightAnswer === opt.id;
                          return (
                            <div
                              key={opt.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: `1.8px solid ${isCorrect ? '#10B981' : t.border}`,
                                backgroundColor: isCorrect
                                  ? (t.isDark ? '#064E3B' : '#B6F2CF')
                                  : (t.isDark ? '#14112F' : '#FFFFFF'),
                                borderRadius: '10px',
                                padding: '6px 10px',
                                gap: '8px',
                                minHeight: '44px',
                              }}
                            >
                              <span
                                style={{
                                  width: '26px',
                                  height: '26px',
                                  borderRadius: '50%',
                                  backgroundColor: isCorrect ? '#10B981' : t.optionBadge,
                                  color: '#ffffff',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '14px',
                                  flexShrink: 0,
                                }}
                              >
                                {arabicLabels[index] || opt.label}
                              </span>
                              <div
                                style={{
                                  flex: 1,
                                  textAlign: 'center',
                                  fontWeight: 800,
                                  fontSize: '17px',
                                  color: t.textMain,
                                }}
                              >
                                {opt.text && <div>{opt.text}</div>}
                                {opt.image && (
                                  <img
                                    src={opt.image}
                                    alt=""
                                    style={{
                                      maxHeight: '70px',
                                      maxWidth: '100%',
                                      width: 'auto',
                                      height: 'auto',
                                      margin: '4px auto 0',
                                      display: 'block',
                                      borderRadius: '6px',
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* جملة الربط الذهني مع شارة قابلة للتعديل والإخفاء */}
                    {hasMnemonicText && (
                      <div
                        style={{
                          marginTop: '14px',
                          backgroundColor: t.mnemonicBg,
                          borderRadius: '12px',
                          padding: '7px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {mnemonicLabel && mnemonicLabel.trim() !== '' && (
                          <span
                            style={{
                              backgroundColor: t.mnemonicBadge,
                              color: '#ffffff',
                              padding: '2px 10px',
                              borderRadius: '999px',
                              fontSize: '13px',
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {mnemonicLabel.trim()}
                          </span>
                        )}
                        <div
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '16.5px',
                            color: t.textMain,
                          }}
                        >
                          {mnemonicText}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* الميديا أسفل الصندوق */}
                  {hasMnemonicMedia && (
                    <div
                      style={{
                        position: 'relative',
                        zIndex: 2,
                        marginTop: '14px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      <div
                        style={{
                          borderRadius: '16px',
                          overflow: 'hidden',
                          border: `2px solid ${t.border}`,
                          boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          maxWidth: '100%',
                          backgroundColor: mnemonicMediaType === 'video' ? '#000' : 'transparent',
                        }}
                      >
                        {mnemonicMediaType === 'video' ? (
                          <video
                            ref={videoPlayerRef}
                            src={mnemonicMediaUrl}
                            controls
                            playsInline
                            webkit-playsinline="true"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '440px',
                              width: 'auto',
                              height: 'auto',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <img
                            src={mnemonicMediaUrl}
                            alt="ربط"
                            style={{
                              maxWidth: '100%',
                              maxHeight: '440px',
                              width: 'auto',
                              height: 'auto',
                              display: 'block',
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}