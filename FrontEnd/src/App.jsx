import React, { useState } from "react";
import "prismjs/themes/prism-tomorrow.css";

import Prism from "prismjs";
import "prismjs/components/prism-javascript";

import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

import EditorModule from "react-simple-code-editor";
const Editor = EditorModule.default;

const App = () => {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1;
}`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  async function reviewCode() {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/ai/get-review",
        { code }
      );
      setReview(response.data);
    } catch (err) {
      setReview("⚠️ Error fetching review");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      {/* LEFT PANEL */}
      <div className="left">
        <div className="editor-header">
          <span>Code File</span>
          <button onClick={reviewCode}>
            {loading ? "Reviewing..." : "Review Code"}
          </button>
        </div>

        <div className="code">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={(code) =>
              Prism.highlight(code, Prism.languages.javascript, "javascript")
            }
            padding={16}
            style={{
              fontFamily: '"Fira Code", monospace',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <div className="review-header">AI Review</div>

        <div className="review-content">
          {loading ? (
            <p>Analyzing code...</p>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]}>
              {review || "Your review will appear here..."}
            </Markdown>
          )}
        </div>
      </div>
    </main>
  );
};

export default App;