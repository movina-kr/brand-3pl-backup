// /* Qoo10 양식 포함 - 확장자 지원(xlsx, xlsm, csv) 업데이트 */
// import { useState, useRef } from "react";
// import * as XLSX from "xlsx";
// import {
//   Upload,
//   FileSpreadsheet,
//   Loader,
//   Globe,
//   Check,
//   X,
// } from "lucide-react";

// const translations = {
//   한국어: {
//     commonTitle: "일반 3PL 업로드",
//     qoo10Title: "Qoo10 양식 3PL 업로드",
//     brandLabel: "브랜드명",
//     brandPlaceholder: "브랜드 명을 입력하세요", 
//     brandAutoFill: "엑셀 파일 업로드시 자동으로 입력됩니다",
//     brandError: "브랜드명을 입력해야 합니다.",
//     dragText: "클릭하거나 파일을 드래그하세요",
//     fileFormat: ".xlsx, .xlsm, .csv 파일만 지원됩니다", 
//     uploadButton: "업로드하기",
//     uploading: "업로드 중...",
//     selectFile: "파일을 먼저 선택해주세요.",
//     invalidFile: "엑셀 또는 CSV 파일만 업로드 가능합니다.", 
//     wrongFormat: "Qoo10 양식은 우측에 업로드해주세요.",
//     successMessage: "성공적으로 전송되었습니다!",
//     errorMessage: "업로드 중 오류가 발생했습니다.",
//   },
//   日本語: {
//     commonTitle: "一般 3PL アップロード",
//     qoo10Title: "Qoo10 形式 3PL アップロード",
//     brandLabel: "ブランド名",
//     brandPlaceholder: "ブランド名を入力してください",
//     brandAutoFill: "アップロード時に自動入力されます",
//     brandError: "ブランド名を入力する必要があります。",
//     dragText: "クリックまたはファイルをドラッグしてください",
//     fileFormat: ".xlsx, .xlsm, .csvファイルのみ対応",
//     uploadButton: "アップロード",
//     uploading: "アップロード中...",
//     selectFile: "まずファイルを選択してください。",
//     invalidFile: "対応しているファイル形式ではありません。",
//     wrongFormat: "Qoo10形式は右側にアップロードしてください。",
//     successMessage: "正常に送信されました！",
//     errorMessage: "アップロード中にエラーが発生しました。",
//   },
//   English: {
//     commonTitle: "General 3PL Upload",
//     qoo10Title: "Qoo10 Format 3PL Upload",
//     brandLabel: "Brand Name",
//     brandPlaceholder: "Enter brand name",
//     brandAutoFill: "Auto-filled from file",
//     brandError: "Brand name is required.",
//     dragText: "Click or drag file here",
//     fileFormat: ".xlsx, .xlsm, .csv supported",
//     uploadButton: "Upload",
//     uploading: "Uploading...",
//     selectFile: "Please select a file first.",
//     invalidFile: "Only Excel or CSV files can be uploaded.",
//     wrongFormat: "Please upload Qoo10 format to the right.",
//     successMessage: "Successfully sent!",
//     errorMessage: "An error occurred during upload.",
//   },
// };

// function UploadCard({ 
//   language, 
//   colors, 
//   type, 
//   title 
// }: { 
//   language: any, 
//   colors: any, 
//   type: 'common' | 'qoo10',
//   title: string
// }) {
//   const [file, setFile] = useState<File | null>(null);
//   const [brandName, setBrandName] = useState("");
//   const [uploading, setUploading] = useState(false);
//   const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
//   const [messageKey, setMessageKey] = useState<string>("");
//   const [isDragging, setIsDragging] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const t = translations[language as keyof typeof translations] || translations.한국어;
//   const currentMessage = messageKey ? (t as any)[messageKey] || messageKey : "";

//   // 확장자 체크 정규식
//   const isValidFile = (name: string) => /\.(xlsx|xlsm|csv)$/i.test(name);

//   const handleFileChange = async (selectedFile: File) => {
//     // 확장자 검사 로직 추가
//     if (!isValidFile(selectedFile.name)) {
//         setStatus("error");
//         setMessageKey("invalidFile");
//         return;
//     }

//     setFile(selectedFile);
//     setStatus("idle");
//     setMessageKey("");
  
//     try {
//       const data = await selectedFile.arrayBuffer();
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
//       const a1Value = sheet['A1']?.v;
//       const a2Value = sheet['A2']?.v;
  
//       if (type === 'common') {
//         if (a1Value !== '브랜드명') {
//           setStatus("error");
//           setMessageKey("wrongFormat"); 
//           setFile(null);
//           setBrandName("");
//           if (fileInputRef.current) fileInputRef.current.value = "";
//           return;
//         }
//         if (a2Value) {
//           setBrandName(String(a2Value));
//         }
//       }
  
//       if (type === 'qoo10') {
//         if (a1Value === '브랜드명') {
//           setStatus("error");
//           setMessageKey("일반 양식은 좌측에 업로드해주세요."); 
//           setFile(null);
//           setBrandName("");
//           if (fileInputRef.current) fileInputRef.current.value = "";
//           return;
//         }
//       }
  
//     } catch (error) {
//       console.error("Failed to read file", error);
//       setStatus("error");
//       setMessageKey("errorMessage");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) { setStatus("error"); setMessageKey("selectFile"); return; }
//     if (!brandName.trim()) { setStatus("error"); setMessageKey("brandError"); return; }
//     setUploading(true); setStatus("idle");

//     try {
//       const data = await file.arrayBuffer();
//       const workbook = XLSX.read(data, { type: "array" });
//       const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: "" });
//       const response = await fetch('/api/send', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ type, brandName, fileName: file.name, data: jsonData }),
//       });
//       if (response.ok) {
//         setStatus("success"); setMessageKey("successMessage"); setFile(null); setBrandName("");
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else { throw new Error(); }
//     } catch (error) { setStatus("error"); setMessageKey("errorMessage"); } finally { setUploading(false); }
//   };

//   const accentColor = type === 'qoo10' ? "#d946ef" : "#3b82f6";
//   const accentHover = type === 'qoo10' ? "#c026d3" : "#2563eb";

//   return (
//     <div className="w-full lg:w-[500px] shrink-0 flex flex-col">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-1 h-8" style={{ backgroundColor: accentColor }}></div>
//         <h3 className="font-bold text-l tracking-tight" style={{ color: colors.text }}>
//           {title}
//         </h3>
//       </div>

//       <div className="flex flex-col w-full">
//         <div className="flex flex-col gap-2 mb-6">
//           <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
//             {t.brandLabel}
//           </label>
//           <input 
//             type="text" 
//             value={brandName} 
//             onChange={(e) => setBrandName(e.target.value)}
//             placeholder={type === 'common' ? t.brandAutoFill : t.brandPlaceholder}
//             disabled={type === 'common'}
//             className="px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
//             style={{ 
//               backgroundColor: type === 'common' ? '#f5f5f5' : colors.inputBg, 
//               color: type === 'common' ? '#a0a0a0' : colors.text, 
//               borderColor: colors.border,
//               cursor: type === 'common' ? 'not-allowed' : 'text'
//             }}
//           />
//         </div>
        
//         <div
//           className={`relative w-full border-2 border-dashed p-8 text-center cursor-pointer min-h-[280px] flex flex-col justify-center items-center transition-all ${
//             isDragging ? 'scale-[0.98]' : 'scale-100'
//           }`}
//           style={{ 
//             borderColor: status === "error" ? "#ef4444" : (isDragging ? accentColor : colors.borderDashed), 
//             backgroundColor: isDragging ? colors.dropZoneActiveBg : colors.dropZoneBg
//           }}
//           onClick={() => fileInputRef.current?.click()}
//           onDragOver={(e) => {
//             e.preventDefault();
//             setIsDragging(true);
//           }}
//           onDragLeave={() => setIsDragging(false)}
//           onDrop={(e) => {
//             e.preventDefault();
//             setIsDragging(false);
//             const dropped = e.dataTransfer.files[0];
//             if (dropped && isValidFile(dropped.name)) { 
//               handleFileChange(dropped);
//             } else if (dropped) {
//               setStatus("error");
//               setMessageKey("invalidFile");
//             }
//           }}
//         >
//           {/* accept 속성에 확장자 추가 */}
//           <input 
//             ref={fileInputRef} 
//             type="file" 
//             accept=".xlsx, .xlsm, .csv" 
//             onChange={(e) => {
//               const f = e.target.files?.[0];
//               if (f) handleFileChange(f);
//             }} 
//             className="hidden" 
//           />
          
//           {file ? (
//             <div className="flex flex-col items-center gap-4 w-full">
//               <div className="p-4" style={{ backgroundColor: colors.iconBg }}>
//                 <FileSpreadsheet className="w-12 h-12" style={{ color: accentColor }} />
//               </div>
//               <div className="w-full text-center">
//                 <p className="text-base font-semibold break-all px-4" style={{ color: colors.text }}>
//                   {file.name}
//                 </p>
//                 <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
//                   {(file.size / 1024).toFixed(2)} KB
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex flex-col items-center gap-4">
//               <div className="p-4" style={{ backgroundColor: colors.iconBg }}>
//                 <Upload className="w-12 h-12" style={{ color: colors.textSecondary }} />
//               </div>
//               <div>
//                 <p className="text-base font-semibold mb-1" style={{ color: colors.text }}>
//                   {t.dragText}
//                 </p>
//                 <p className="text-xs" style={{ color: colors.textSecondary }}>
//                   {t.fileFormat}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         <button
//           onClick={handleUpload}
//           disabled={!file || uploading}
//           className="w-full mt-6 px-6 py-4 text-white font-semibold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
//           style={{ 
//             backgroundColor: !file || uploading ? colors.buttonDisabled : accentColor,
//             opacity: !file || uploading ? 0.5 : 1
//           }}
//           onMouseEnter={(e) => {
//             if (file && !uploading) {
//               e.currentTarget.style.backgroundColor = accentHover;
//             }
//           }}
//           onMouseLeave={(e) => {
//             if (file && !uploading) {
//               e.currentTarget.style.backgroundColor = accentColor;
//             }
//           }}
//         >
//           {uploading ? (
//             <>
//               <Loader className="w-5 h-5 animate-spin" />
//               <span>{t.uploading}</span>
//             </>
//           ) : (
//             <>
//               <Upload className="w-5 h-5" />
//               <span>{t.uploadButton}</span>
//             </>
//           )}
//         </button>

//         {currentMessage && (
//           <div 
//             className={`mt-4 px-4 py-3 flex items-center gap-3 border-l-4 ${
//               status === "success" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
//             }`}
//           >
//             {status === "success" ? (
//               <Check className="w-5 h-5 text-green-600 shrink-0" />
//             ) : (
//               <X className="w-5 h-5 text-red-600 shrink-0" />
//             )}
//             <span 
//               className={`text-sm font-medium ${
//                 status === "success" ? "text-green-700" : "text-red-700"
//               }`}
//             >
//               {currentMessage}
//             </span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function ExcelUpload() {
//   const [language, setLanguage] = useState<keyof typeof translations>("한국어");
//   const t = translations[language] || translations.한국어;

//   const colors = {
//     bg: "#ffffff",
//     text: "#18181b",
//     textSecondary: "#71717a",
//     border: "#e4e4e7",
//     borderDashed: "#d4d4d8",
//     dropZoneBg: "#fafafa",
//     dropZoneActiveBg: "#f4f4f5",
//     iconBg: "#f4f4f5",
//     inputBg: "#ffffff",
//     buttonDisabled: "#d4d4d8",
//     cardBorder: "#e4e4e7",
//   };

//   return (
//     <div 
//       className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8" 
//       style={{ backgroundColor: "#fafafa" }}
//     >
//       <div 
//         className="w-full max-w-[1200px] shadow-xl border p-8 sm:p-12" 
//         style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
//       >
        
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b" style={{ borderColor: colors.border }}>
//         <button 
//             onClick={() => window.location.reload()} 
//             className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
//           >
//             <span className="font-bold text-2xl sm:text-2xl tracking-tight" style={{ color: "#4C90CB" }}>
//               MOVINA
//             </span>
//             <span 
//               // className="text-2xl font-light leading-none mb-1" 
//               className="font-bold text-2xl sm:text-2xl tracking-tight" 
//               style={{ color: colors.textSecondary }}
//             >
//               ×
//             </span>
//             <span className="font-bold text-2xl sm:text-2xl tracking-tight" style={{ color: "#DBA2AE" }}>
//               ONEMAKE
//             </span>
//           </button>
//           <div className="flex items-center gap-3">
//             <Globe className="w-5 h-5" style={{ color: colors.textSecondary }} />
//             <select 
//               className="px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 transition-all"
//               value={language} 
//               onChange={(e) => setLanguage(e.target.value as any)}
//               style={{ 
//                 backgroundColor: colors.inputBg, 
//                 color: colors.text, 
//                 borderColor: colors.border 
//               }}
//             >
//               <option value="한국어">한국어</option>
//               <option value="日本語">日本語</option>
//               <option value="English">English</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full">
//           <UploadCard 
//             language={language} 
//             colors={colors} 
//             type="common" 
//             title={t.commonTitle} 
//           />
          
//           <div 
//             className="hidden lg:block w-px self-stretch opacity-50" 
//             style={{ backgroundColor: colors.border }}
//           ></div>
          
//           <UploadCard 
//             language={language} 
//             colors={colors} 
//             type="qoo10" 
//             title={t.qoo10Title} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

/* Qoo10 양식 포함 - 확장자 지원(xlsx, xlsm, csv) 업데이트 */
import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  Loader,
  Globe,
  Check,
  X,
} from "lucide-react";

// ### SECTION 1: 번역 데이터 업데이트 (키값 추가)
const translations = {
  한국어: {
    commonTitle: "일반 3PL 업로드",
    qoo10Title: "Qoo10 양식 3PL 업로드",
    brandLabel: "브랜드명",
    brandPlaceholder: "브랜드 명을 입력하세요", 
    brandAutoFill: "엑셀 파일 업로드시 자동으로 입력됩니다",
    brandError: "브랜드명을 입력해야 합니다.",
    dragText: "클릭하거나 파일을 드래그하세요",
    fileFormat: ".xlsx, .xlsm, .csv 파일만 지원됩니다", 
    uploadButton: "업로드하기",
    uploading: "업로드 중...",
    selectFile: "파일을 먼저 선택해주세요.",
    invalidFile: "엑셀 또는 CSV 파일만 업로드 가능합니다.", 
    wrongFormat: "Qoo10 양식은 우측에 업로드해주세요.",
    wrongFormatCommon: "일반 양식은 좌측에 업로드해주세요.", 
    successMessage: "성공적으로 전송되었습니다!",
    errorMessage: "업로드 중 오류가 발생했습니다.",
  },
  日本語: {
    commonTitle: "一般 3PL アップロード",
    qoo10Title: "Qoo10 形式 3PL アップロード",
    brandLabel: "ブランド名",
    brandPlaceholder: "ブランド名を入力してください",
    brandAutoFill: "アップロード時に自動入力されます",
    brandError: "ブランド名を入力する必要があります。",
    dragText: "クリックまたはファイルをドラッグしてください",
    fileFormat: ".xlsx, .xlsm, .csvファイルのみ対応",
    uploadButton: "アップロード",
    uploading: "アップロード中...",
    selectFile: "まずファイルを選択してください。",
    invalidFile: "対応しているファイル形式ではありません。",
    wrongFormat: "Qoo10形式은은 우측에 업로드해주세요.",
    wrongFormatCommon: "一般形式は左側にアップロードしてください。", // 새로 추가
    successMessage: "正常に送信されました！",
    errorMessage: "アップロード中にエラーが発生しました。",
  },
  English: {
    commonTitle: "General 3PL Upload",
    qoo10Title: "Qoo10 Format 3PL Upload",
    brandLabel: "Brand Name",
    brandPlaceholder: "Enter brand name",
    brandAutoFill: "Auto-filled from file",
    brandError: "Brand name is required.",
    dragText: "Click or drag file here",
    fileFormat: ".xlsx, .xlsm, .csv supported",
    uploadButton: "Upload",
    uploading: "Uploading...",
    selectFile: "Please select a file first.",
    invalidFile: "Only Excel or CSV files can be uploaded.",
    wrongFormat: "Please upload Qoo10 format to the right.",
    wrongFormatCommon: "Please upload general format to the left.", // 새로 추가
    successMessage: "Successfully sent!",
    errorMessage: "An error occurred during upload.",
  },
};

function UploadCard({ 
  language, 
  colors, 
  type, 
  title 
}: { 
  language: any, 
  colors: any, 
  type: 'common' | 'qoo10',
  title: string
}) {
  const [file, setFile] = useState<File | null>(null);
  const [brandName, setBrandName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [messageKey, setMessageKey] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = translations[language as keyof typeof translations] || translations.한국어;
  // messageKey가 translations에 정의된 키라면 해당 언어 문구를, 아니라면 key 그대로 노출
  const currentMessage = messageKey ? (t as any)[messageKey] || messageKey : "";

  const isValidFile = (name: string) => /\.(xlsx|xlsm|csv)$/i.test(name);

  // ### SECTION 2: 에러 발생 시 직접 문구 대신 'Key'값 전달하도록 수정
  const handleFileChange = async (selectedFile: File) => {
    if (!isValidFile(selectedFile.name)) {
        setStatus("error");
        setMessageKey("invalidFile");
        return;
    }

    setFile(selectedFile);
    setStatus("idle");
    setMessageKey("");
  
    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      
      const a1Value = sheet['A1']?.v;
      const a2Value = sheet['A2']?.v;
  
      if (type === 'common') {
        if (a1Value !== '브랜드명') {
          setStatus("error");
          setMessageKey("wrongFormat"); 
          setFile(null);
          setBrandName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
        if (a2Value) setBrandName(String(a2Value));
      }
  
      if (type === 'qoo10') {
        // Qoo10 카드에 일반 양식을 올린 경우
        if (a1Value === '브랜드명') {
          setStatus("error");
          // ★ 수정한 부분: 한글 직접 입력 대신 정의한 키값을 사용
          setMessageKey("wrongFormatCommon"); 
          setFile(null);
          setBrandName("");
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }
      }
  
    } catch (error) {
      console.error("Failed to read file", error);
      setStatus("error");
      setMessageKey("errorMessage");
    }
  };

  const handleUpload = async () => {
    if (!file) { setStatus("error"); setMessageKey("selectFile"); return; }
    if (!brandName.trim()) { setStatus("error"); setMessageKey("brandError"); return; }
    setUploading(true); setStatus("idle");

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1, defval: "" });
      const response = await fetch('/api/send', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, brandName, fileName: file.name, data: jsonData }),
      });
      if (response.ok) {
        setStatus("success"); setMessageKey("successMessage"); setFile(null); setBrandName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else { throw new Error(); }
    } catch (error) { 
      setStatus("error"); setMessageKey("errorMessage"); 
    } finally { 
      setUploading(false); 
    }
  };

  const accentColor = type === 'qoo10' ? "#d946ef" : "#3b82f6";
  const accentHover = type === 'qoo10' ? "#c026d3" : "#2563eb";

  return (
    <div className="w-full lg:w-[500px] shrink-0 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8" style={{ backgroundColor: accentColor }}></div>
        <h3 className="font-bold text-l tracking-tight" style={{ color: colors.text }}>
          {title}
        </h3>
      </div>

      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            {t.brandLabel}
          </label>
          <input 
            type="text" 
            value={brandName} 
            onChange={(e) => setBrandName(e.target.value)}
            placeholder={type === 'common' ? t.brandAutoFill : t.brandPlaceholder}
            disabled={type === 'common'}
            className="px-4 py-3 text-sm border focus:outline-none focus:ring-2 transition-all"
            style={{ 
              backgroundColor: type === 'common' ? '#f5f5f5' : colors.inputBg, 
              color: type === 'common' ? '#a0a0a0' : colors.text, 
              borderColor: colors.border,
              cursor: type === 'common' ? 'not-allowed' : 'text'
            }}
          />
        </div>
        
        <div
          className={`relative w-full border-2 border-dashed p-8 text-center cursor-pointer min-h-[280px] flex flex-col justify-center items-center transition-all ${
            isDragging ? 'scale-[0.98]' : 'scale-100'
          }`}
          style={{ 
            borderColor: status === "error" ? "#ef4444" : (isDragging ? accentColor : colors.borderDashed), 
            backgroundColor: isDragging ? colors.dropZoneActiveBg : colors.dropZoneBg
          }}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped && isValidFile(dropped.name)) { 
              handleFileChange(dropped);
            } else if (dropped) {
              setStatus("error");
              setMessageKey("invalidFile");
            }
          }}
        >
          <input 
            ref={fileInputRef} 
            type="file" 
            accept=".xlsx, .xlsm, .csv" 
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileChange(f);
            }} 
            className="hidden" 
          />
          
          {file ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="p-4" style={{ backgroundColor: colors.iconBg }}>
                <FileSpreadsheet className="w-12 h-12" style={{ color: accentColor }} />
              </div>
              <div className="w-full text-center">
                <p className="text-base font-semibold break-all px-4" style={{ color: colors.text }}>
                  {file.name}
                </p>
                <p className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="p-4" style={{ backgroundColor: colors.iconBg }}>
                <Upload className="w-12 h-12" style={{ color: colors.textSecondary }} />
              </div>
              <div>
                <p className="text-base font-semibold mb-1" style={{ color: colors.text }}>
                  {t.dragText}
                </p>
                <p className="text-xs" style={{ color: colors.textSecondary }}>
                  {t.fileFormat}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full mt-6 px-6 py-4 text-white font-semibold transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          style={{ 
            backgroundColor: !file || uploading ? colors.buttonDisabled : accentColor,
            opacity: !file || uploading ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (file && !uploading) e.currentTarget.style.backgroundColor = accentHover;
          }}
          onMouseLeave={(e) => {
            if (file && !uploading) e.currentTarget.style.backgroundColor = accentColor;
          }}
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>{t.uploading}</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span>{t.uploadButton}</span>
            </>
          )}
        </button>

        {currentMessage && (
          <div 
            className={`mt-4 px-4 py-3 flex items-center gap-3 border-l-4 ${
              status === "success" ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
            }`}
          >
            {status === "success" ? (
              <Check className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span 
              className={`text-sm font-medium ${
                status === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {currentMessage}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExcelUpload() {
  const [language, setLanguage] = useState<keyof typeof translations>("한국어");

  const colors = {
    bg: "#ffffff",
    text: "#18181b",
    textSecondary: "#71717a",
    border: "#e4e4e7",
    borderDashed: "#d4d4d8",
    dropZoneBg: "#fafafa",
    dropZoneActiveBg: "#f4f4f5",
    iconBg: "#f4f4f5",
    inputBg: "#ffffff",
    buttonDisabled: "#d4d4d8",
    cardBorder: "#e4e4e7",
  };

  const t = translations[language] || translations.한국어;

  return (
    <div 
      className="w-full min-h-screen flex items-center justify-center p-4 sm:p-8" 
      style={{ backgroundColor: "#fafafa" }}
    >
      <div 
        className="w-full max-w-[1200px] shadow-xl border p-8 sm:p-12" 
        style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
      >
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b" style={{ borderColor: colors.border }}>
          <button 
            onClick={() => window.location.reload()} 
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <span className="font-bold text-2xl sm:text-2xl tracking-tight" style={{ color: "#4C90CB" }}>MOVINA</span>
            <span className="font-bold text-2xl sm:text-2xl tracking-tight" style={{ color: colors.textSecondary }}>×</span>
            <span className="font-bold text-2xl sm:text-2xl tracking-tight" style={{ color: "#DBA2AE" }}>ONEMAKE</span>
          </button>
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5" style={{ color: colors.textSecondary }} />
            <select 
              className="px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-2 transition-all"
              value={language} 
              onChange={(e) => setLanguage(e.target.value as any)}
              style={{ 
                backgroundColor: colors.inputBg, 
                color: colors.text, 
                borderColor: colors.border 
              }}
            >
              <option value="한국어">한국어</option>
              <option value="日本語">日本語</option>
              <option value="English">English</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12 w-full">
          <UploadCard 
            language={language} 
            colors={colors} 
            type="common" 
            title={t.commonTitle} 
          />
          
          <div 
            className="hidden lg:block w-px self-stretch opacity-50" 
            style={{ backgroundColor: colors.border }}
          ></div>
          
          <UploadCard 
            language={language} 
            colors={colors} 
            type="qoo10" 
            title={t.qoo10Title} 
          />
        </div>
      </div>
    </div>
  );
}
