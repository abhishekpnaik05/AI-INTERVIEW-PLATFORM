interface Props {
  question: any;
}

const ProblemPanel = ({ question }: Props) => {
  return (
    <div className="p-6 overflow-y-auto h-full">
      <h1 className="text-2xl font-bold">{question.title}</h1>
      <p className="text-green-600 mt-2">{question.difficulty}</p>

      <div className="mt-6">
        <p>{question.description}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Examples:</h2>
        {question.examples.map((ex: any, index: number) => (
          <div key={index} className="bg-gray-100 p-3 mt-3 rounded">
            <p><b>Input:</b> {ex.input}</p>
            <p><b>Output:</b> {ex.output}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Constraints:</h2>
        <ul className="list-disc ml-5">
          {question.constraints.map((c: string, i: number) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProblemPanel;
