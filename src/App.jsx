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
  const [selectedTemplate, setSelectedTemplate] = useState('cream');

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

  // مداخل وسائط منفصلة لحل مشكلة الضغط مرتين
  const mnemonicImageInputRef = useRef(null);
  const mnemonicVideoInputRef = useRef(null);

  const optARef = useRef(null);
  const optBRef = useRef(null);
  const optCRef = useRef(null);
  const optDRef = useRef(null);
  const optImgRefs = { A: optARef, B: optBRef, C: optCRef, D: optDRef };

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
  }, [options, questionText, questionImage, mnemonicText, mnemonicMediaUrl, mobileTab]);

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) callback(e.target.result);
    };
    reader.readAsDataURL(file);
  };

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
    setMnemonicMediaUrl(null);
    setMnemonicMediaType('none');
  };

  const themes = {
    cream: {
      id: 'cream',
      title: '1. عقدة الأصلي (الكريمي)',
      desc: 'مطابق للصورة الكلاسيكية',
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
    },
    blush: {
      id: 'blush',
      title: '2. عقدة الوردي الفاتح',
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
    },
    sand: {
      id: 'sand',
      title: '3. عقدة الرملي الدافئ',
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
    },
    navy: {
      id: 'navy',
      title: '4. التحصيلي الملكي (كحلي وسيان)',
      desc: 'مود هندسي للفيزياء والرياضيات',
      bg: '#F0F4F9',
      waveTop: '#0F2744',
      waveSub: '#0284C7',
      cardBg: '#FFFFFF',
      border: '#0F2744',
      doodleColor: '#CBD5E1',
      subjectBg: '#0284C7',
      subjectColor: '#FFFFFF',
      optionBadge: '#7DD3FC',
      mnemonicBg: '#E0F2FE',
      mnemonicBadge: '#0369A1',
      textMain: '#0F172A',
      waveType: 'modern',
    },
    emerald: {
      id: 'emerald',
      title: '5. المينت الأكاديمي (أخضر زمردي)',
      desc: 'مود هادئ للأحياء والكيمياء',
      bg: '#F0FDF4',
      waveTop: '#064E3B',
      waveSub: '#10B981',
      cardBg: '#FFFFFF',
      border: '#064E3B',
      doodleColor: '#A7F3D0',
      subjectBg: '#10B981',
      subjectColor: '#FFFFFF',
      optionBadge: '#6EE7B7',
      mnemonicBg: '#D1FAE5',
      mnemonicBadge: '#047857',
      textMain: '#064E3B',
      waveType: 'leaf',
    },
    violet: {
      id: 'violet',
      title: '6. البنفسجي الإبداعي (ذهبي وموف)',
      desc: 'ثيم فخم للقدرات والشامل',
      bg: '#F6F3FF',
      waveTop: '#4C1D95',
      waveSub: '#F59E0B',
      cardBg: '#FFFFFF',
      border: '#4C1D95',
      doodleColor: '#DDD6FE',
      subjectBg: '#7C3AED',
      subjectColor: '#FFFFFF',
      optionBadge: '#C4B5FD',
      mnemonicBg: '#EDE9FE',
      mnemonicBadge: '#6D28D9',
      textMain: '#2E1065',
      waveType: 'arch',
    },
  };

  const t = themes[selectedTemplate] || themes.cream;
  const arabicLabels = ['أ', 'ب', 'ج', 'د'];

  const activeOptions = options.filter(
    (o) => o.enabled && ((o.text && o.text.trim() !== '') || o.image !== null)
  );
  const enabledCount = options.filter((o) => o.enabled).length;

  const hasMnemonicText = enableMnemonic && mnemonicText && mnemonicText.trim() !== '';
  const hasMnemonicMedia = enableMnemonic && mnemonicMediaType !== 'none' && mnemonicMediaUrl;
  const isVideoMnemonic = enableMnemonic && mnemonicMediaType === 'video' && mnemonicMediaUrl;

  // دالة متطورة ترسم كل الصور مباشرة فوق الـ Canvas لتجاوز حظر الـ WebKit في الآيفون 100%
  const renderCardToCanvasWithImages = async (cardEl) => {
    // 1. التقاط إطار القالب بدقة
    const basePngUrl = await toPng(cardEl, {
      pixelRatio: 2,
      cacheBust: false,
    });

    const baseImg = new Image();
    await new Promise((resolve) => {
      baseImg.onload = resolve;
      baseImg.src = basePngUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;
    const ctx = canvas.getContext('2d');

    // رسم القالب الأساسي
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);

    // 2. البحث عن كل الصور داخل القالب ورسمها يدوياً فوق الـ Canvas بمواقعها وأبعادها الدقيقة
    const cardRect = cardEl.getBoundingClientRect();
    const scaleX = canvas.width / cardRect.width;
    const scaleY = canvas.height / cardRect.height;

    const imgElements = Array.from(cardEl.querySelectorAll('img'));
    for (const imgEl of imgElements) {
      if (!imgEl.src) continue;
      const imgRect = imgEl.getBoundingClientRect();
      const destX = (imgRect.left - cardRect.left) * scaleX;
      const destY = (imgRect.top - cardRect.top) * scaleY;
      const destW = imgRect.width * scaleX;
      const destH = imgRect.height * scaleY;

      const loadedImg = new Image();
      await new Promise((resolve) => {
        loadedImg.onload = resolve;
        loadedImg.onerror = resolve;
        loadedImg.src = imgEl.src;
      });

      if (loadedImg.naturalWidth > 0) {
        ctx.save();
        // تطبيق نفس الـ borderRadius الخاص بالصورة
        ctx.beginPath();
        ctx.roundRect(destX, destY, destW, destH, 8 * scaleX);
        ctx.clip();
        ctx.drawImage(loadedImg, destX, destY, destW, destH);
        ctx.restore();
      }
    }

    return canvas;
  };

  // استخراج الصورة مع توافق تام للأجهزة
  const handleExtractImage = async () => {
    if (!templateCardRef.current) return;
    setIsExporting(true);
    try {
      const finalCanvas = await renderCardToCanvasWithImages(templateCardRef.current);
      const dataUrl = finalCanvas.toDataURL('image/png');

      // تجربة التنزيل المباشر
      const link = document.createElement('a');
      link.download = `سؤال_عقدة_${subject || 'تحصيلي'}_${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // في حال كان آيفون وسفاري منع التنزيل التلقائي، نظهر نافذة المعاينة للحفظ بضغطة واحدة
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

  // استخراج الفيديو مدمجاً
  const handleExtractFullVideo = async () => {
    const video = videoPlayerRef.current;
    const cardEl = templateCardRef.current;
    if (!video || !cardEl) {
      alert('يرجى التأكد من رفع مقطع الفيديو أولاً');
      return;
    }

    setIsExporting(true);
    setExportProgress(1);

    try {
      const cardCanvas = await renderCardToCanvasWithImages(cardEl);
      const cardImg = new Image();
      await new Promise((res) => {
        cardImg.onload = res;
        cardImg.src = cardCanvas.toDataURL('image/png');
      });

      const canvas = document.createElement('canvas');
      canvas.width = cardImg.naturalWidth;
      canvas.height = cardImg.naturalHeight;
      const ctx = canvas.getContext('2d');

      const videoRect = video.getBoundingClientRect();
      const cardRect = cardEl.getBoundingClientRect();
      const scaleX = canvas.width / cardRect.width;
      const scaleY = canvas.height / cardRect.height;

      const destX = (videoRect.left - cardRect.left) * scaleX;
      const destY = (videoRect.top - cardRect.top) * scaleY;
      const destW = videoRect.width * scaleX;
      const destH = videoRect.height * scaleY;

      const stream = canvas.captureStream(30);

      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        const sourceNode = audioCtx.createMediaElementSource(video);
        const destNode = audioCtx.createMediaStreamDestination();
        sourceNode.connect(destNode);
        sourceNode.connect(audioCtx.destination);
        const audioTrack = destNode.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
      } catch (audioErr) {
        console.warn('تنبيه مسار الصوت:', audioErr);
      }

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')
        ? 'video/mp4;codecs=avc1'
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : 'video/webm;codecs=vp9';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000,
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        a.download = `سؤال_عقدة_مدمج_${subject || 'تحصيلي'}_${Date.now()}.${ext}`;
        a.click();
        setIsExporting(false);
        setExportProgress(0);
        video.pause();
        video.currentTime = 0;
      };

      video.currentTime = 0;
      try {
        video.muted = false;
        await video.play();
      } catch {
        video.muted = true;
        await video.play();
      }

      mediaRecorder.start();

      const totalDuration = video.duration || 5;

      const drawFrame = () => {
        if (video.paused || video.ended) {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
          return;
        }

        ctx.drawImage(cardImg, 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.drawImage(video, destX, destY, destW, destH);
        ctx.restore();

        const percent = Math.min(99, Math.round((video.currentTime / totalDuration) * 100));
        setExportProgress(percent);

        requestAnimationFrame(drawFrame);
      };

      drawFrame();

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
      {/* نافذة معاينة الصورة للآيفون لحفظها مباشرة في ألبوم الصور */}
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
              {isVideoMnemonic ? 'جاري استخراج القالب والمقطع معاً...' : 'جاري دمج وتثبيت الصور بدقة...'}
            </h3>
            <p className="text-xs text-slate-300">يتم معالجة الصور يدوياً لتظهر بكامل وضوحها على الآيفون</p>
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
                <img src={customLogo} alt="شعار عقدة" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
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
              <p className="text-[10px] sm:text-xs text-slate-500 truncate">تثبيت فوري للصور على الآيفون والأندرويد</p>
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

            {/* 4. الربط الذهني (بمدخلين مستقلين) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-800 block">4. الربط الذهني</span>
                  <span className="text-[11px] text-slate-500">جملة ربط ومقطع أو صورة</span>
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
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">جملة الربط:</label>
                    <input
                      type="text"
                      value={mnemonicText}
                      onChange={(e) => setMnemonicText(e.target.value)}
                      placeholder="اكتب جملة الربط..."
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
          {/* اختيار الثيمات الـ 6 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800">اختر قالب الثيم:</span>
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
                    padding: hasMnemonicMedia ? '20px 28px 0px' : '20px 28px 28px',
                    boxSizing: 'border-box',
                    border: `1.5px solid ${t.border}22`,
                  }}
                >
                  {/* النقوش العلمية في الخلفية */}
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

                  {/* الموجة العلوية */}
                  {t.waveType === 'modern' ? (
                    <svg viewBox="0 0 800 135" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '110px', pointerEvents: 'none' }} preserveAspectRatio="none">
                      <path d="M 0,0 L 800,0 L 800,60 L 500,105 L 200,45 L 0,85 Z" fill={t.waveSub} opacity="0.65" />
                      <path d="M 0,0 L 800,0 L 800,45 L 480,90 L 180,30 L 0,65 Z" fill={t.waveTop} />
                    </svg>
                  ) : t.waveType === 'leaf' ? (
                    <svg viewBox="0 0 800 135" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '110px', pointerEvents: 'none' }} preserveAspectRatio="none">
                      <path d="M 0,0 L 800,0 L 800,75 Q 600,125 400,60 Q 200,5 0,80 Z" fill={t.waveSub} opacity="0.65" />
                      <path d="M 0,0 L 800,0 L 800,55 Q 580,105 380,45 Q 180,0 0,60 Z" fill={t.waveTop} />
                    </svg>
                  ) : t.waveType === 'arch' ? (
                    <svg viewBox="0 0 800 135" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '110px', pointerEvents: 'none' }} preserveAspectRatio="none">
                      <path d="M 0,0 L 800,0 L 800,85 Q 550,-10 320,85 Q 150,130 0,60 Z" fill={t.waveSub} opacity="0.75" />
                      <path d="M 0,0 L 800,0 L 800,65 Q 530,-25 300,70 Q 140,110 0,45 Z" fill={t.waveTop} />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 800 135" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '110px', pointerEvents: 'none' }} preserveAspectRatio="none">
                      <path d="M 0,32 Q 210,-15 470,22 Q 650,120 800,88 L 800,0 L 0,0 Z" fill={t.waveSub} opacity="0.65" />
                      <path d="M 0,24 Q 230,-18 480,15 Q 660,110 800,82 L 800,58 Q 660,85 490,0 L 0,0 Z" fill={t.waveTop} />
                    </svg>
                  )}

                  {/* الشعار */}
                  <div style={{ position: 'relative', zIndex: 2, display: 'flex', marginTop: '4px' }}>
                    {customLogo ? (
                      <img src={customLogo} alt="أكاديمية عقدة" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
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
                        boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                      }}
                    >
                      {subject || 'احياء'}
                    </div>
                  </div>

                  {/* الصندوق الأبيض للأسئلة والخيارات والربط */}
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      backgroundColor: t.cardBg,
                      border: `1.8px solid ${t.border}`,
                      borderRadius: '24px',
                      padding: '40px 22px 18px',
                      boxSizing: 'border-box',
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
                            style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: '12px', objectFit: 'contain', border: `1px solid ${t.border}33` }}
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
                                border: `1.8px solid ${isCorrect ? '#8CE0B0' : t.border}`,
                                backgroundColor: isCorrect ? '#B6F2CF' : '#FFFFFF',
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
                                      maxHeight: '60px',
                                      margin: '4px auto 0',
                                      display: 'block',
                                      borderRadius: '6px',
                                      objectFit: 'contain',
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* جملة الربط الذهني */}
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
                          ربط
                        </span>
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
                        marginTop: '12px',
                        display: 'flex',
                        justifyContent: 'center',
                        borderRadius: '0 0 20px 20px',
                        overflow: 'hidden',
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
                            width: '420px',
                            maxWidth: '100%',
                            aspectRatio: '1 / 0.92',
                            objectFit: 'cover',
                            display: 'block',
                            backgroundColor: '#000',
                            borderTopLeftRadius: '14px',
                            borderTopRightRadius: '14px',
                          }}
                        />
                      ) : (
                        <img
                          src={mnemonicMediaUrl}
                          alt="ربط"
                          style={{
                            width: '420px',
                            maxWidth: '100%',
                            aspectRatio: '1 / 0.92',
                            objectFit: 'cover',
                            display: 'block',
                            borderTopLeftRadius: '14px',
                            borderTopRightRadius: '14px',
                          }}
                        />
                      )}
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