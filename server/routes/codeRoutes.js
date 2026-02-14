const express = require("express");
const router = express.Router();

router.post("/run", async (req, res) => {

  const { code, input } = req.body;

  try {
    const wrappedCode = `
      ${code}
      console.log(twoSum(${JSON.stringify(input.nums)}, ${input.target}));
    `;

    const result = eval(wrappedCode);

    res.json({ output: "Executed (demo only)" });

  } catch (err) {
    res.json({ output: err.message });
  }
});

router.post("/submit", async (req, res) => {
  res.json({ verdict: "Accepted (demo)" });
});

module.exports = router;
