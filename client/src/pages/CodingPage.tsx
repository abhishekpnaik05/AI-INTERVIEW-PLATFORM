import { useState } from "react";
import ProblemPanel from "../components/ProblemPanel";
import CodeEditor from "../components/CodeEditor";
import RunPanel from "../components/RunPanel";

// ✅ ADD THIS QUESTION OBJECT
const question = {
  title: "Two Sum",
  difficulty: "Easy",
  description:
    "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9",
  ],
  starterCode: {
    javascript: `function twoSum(nums, target) {
    
}`,
    python: `def twoSum(nums, target):
    pass`,
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
  },
};

const CodingPage = () => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(question.starterCode.javascript);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r">
        <ProblemPanel question={question} />
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="flex-1">
          <CodeEditor
            language={language}
            setLanguage={setLanguage}
            code={code}
            setCode={setCode}
            starterCode={question.starterCode}
          />
        </div>

        <RunPanel code={code} language={language} />
      </div>
    </div>
  );
};

export default CodingPage;
