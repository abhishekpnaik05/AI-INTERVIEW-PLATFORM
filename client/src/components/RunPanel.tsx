import axios from "axios";
import { useState } from "react";

interface Props {
  code: string;
  language: string;
}

const RunPanel = ({ code, language }: Props) => {

  const [output, setOutput] = useState("");

  const handleRun = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/run", {
        code,
        language,
        input: {
          nums: [2,7,11,15],
          target: 9
        }
      });

      setOutput(res.data.output);

    } catch (err) {
      setOutput("Error running code");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/submit", {
        code,
        language
      });

      setOutput(res.data.verdict);

    } catch (err) {
      setOutput("Submission Error");
    }
  };

  return (
    <div className="p-3 border-t bg-gray-100">
      <div className="flex gap-3">
        <button onClick={handleRun} className="px-4 py-2 bg-blue-600 text-white rounded">
          Run
        </button>

        <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">
          Submit
        </button>
      </div>

      <div className="mt-3 bg-black text-green-400 p-3 rounded h-32 overflow-auto">
        {output}
      </div>
    </div>
  );
};

export default RunPanel;
