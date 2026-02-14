import Editor from "@monaco-editor/react";

interface Props {
  language: string;
  setLanguage: (lang: string) => void;
  code: string;
  setCode: (code: string) => void;
  starterCode: any;
}

const CodeEditor = ({
  language,
  setLanguage,
  code,
  setCode,
  starterCode
}: Props) => {

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setCode(starterCode[lang]);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b bg-gray-100">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
      </div>

      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
};

export default CodeEditor;
