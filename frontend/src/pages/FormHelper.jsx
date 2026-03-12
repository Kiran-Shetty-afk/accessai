import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Copy,
  FileText,
  ListChecks,
  Loader2,
  RotateCcw,
  Sparkles,
  Volume2,
} from "lucide-react";
import { getFormHelp } from "../api/api";
import { useAccessibility } from "../context/AccessibilityContext";

const DEMO_FORM = `Applicant Name: Write your full legal name.
Date of Birth: Use the format DD/MM/YYYY.
Proof of Address: Attach a recent utility bill or bank statement.
Medical Certificate: Include a signed note from your doctor.
Signature: Sign the form before submitting it.

You must submit all documents before April 30. Incomplete applications may be delayed or rejected.`;

const DEMO_RESULT = {
  summary:
    "This form asks for your basic personal details and a few supporting documents before your application can be reviewed. You need to provide proof of address, a medical certificate, and a signature before the deadline.",
  steps: [
    "Read the whole form once so you know every section you need to complete.",
    "Fill in your personal details exactly as they appear on your official documents.",
    "Collect the supporting documents before you submit the form.",
    "Check that your form is signed and dated correctly.",
    "Submit everything before April 30 so your application is not delayed.",
  ],
  fields: [
    {
      field: "Applicant Name",
      explanation: "This is your full legal name.",
      what_to_prepare: "Use the same spelling that appears on your ID or passport.",
    },
    {
      field: "Date of Birth",
      explanation: "This section asks for your birthday.",
      what_to_prepare: "Follow the DD/MM/YYYY format shown on the form.",
    },
    {
      field: "Proof of Address",
      explanation: "This proves where you currently live.",
      what_to_prepare: "Prepare a recent utility bill or bank statement with your address on it.",
    },
    {
      field: "Medical Certificate",
      explanation: "This confirms the medical information the form needs.",
      what_to_prepare: "Ask your doctor for a signed certificate or note.",
    },
    {
      field: "Signature",
      explanation: "This confirms that the information is correct.",
      what_to_prepare: "Sign the form in the correct place before submitting.",
    },
  ],
  documents: [
    "A recent utility bill or bank statement",
    "A signed medical certificate or doctor's note",
    "Any ID the form asks you to match your details against",
  ],
  warnings: [
    "Submit everything before April 30.",
    "Incomplete applications may be delayed or rejected.",
    "Check that every required field is filled before submission.",
  ],
};

function buildCopyText(result) {
  if (!result) return "";

  return [
    `Summary: ${result.summary}`,
    "",
    "Steps:",
    ...result.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    "Field Guide:",
    ...result.fields.map(
      (field) =>
        `- ${field.field}: ${field.explanation} Prepare: ${field.what_to_prepare}`
    ),
    "",
    "Documents:",
    ...result.documents.map((item) => `- ${item}`),
    "",
    "Warnings:",
    ...result.warnings.map((item) => `- ${item}`),
  ].join("\n");
}

export default function FormHelper() {
  const { speak } = useAccessibility();

  const [formText, setFormText] = useState(DEMO_FORM);
  const [context, setContext] = useState("The user wants a simple step-by-step explanation.");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleAnalyse = async () => {
    if (!formText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await getFormHelp(formText, context);
      setResult(response.data);
    } catch {
      if (formText.trim() === DEMO_FORM.trim()) {
        setResult({ ...DEMO_RESULT, cached: true });
      } else {
        setError("The form helper could not reach the backend. Try the demo text or start the API server again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormText(DEMO_FORM);
    setContext("The user wants a simple step-by-step explanation.");
    setResult(null);
    setError("");
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(buildCopyText(result));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSpeak = () => {
    if (!result) return;
    speak(
      `${result.summary} Steps: ${result.steps.join(" ")} Warnings: ${
        result.warnings.length ? result.warnings.join(" ") : "No urgent warnings found."
      }`
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-root {
          font-family: 'DM Sans', sans-serif;
          min-height: calc(100vh - 64px);
          padding: 2rem 0 4rem;
        }

        .form-header {
          margin-bottom: 1.65rem;
          animation: fadeUp 0.35s ease both;
        }

        .form-eyebrow {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #92400e;
          margin-bottom: 0.5rem;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.9rem, 4vw, 2.8rem);
          letter-spacing: -0.03em;
          margin: 0 0 0.45rem;
          color: var(--text-primary, #0f172a);
        }

        .form-sub {
          max-width: 760px;
          color: var(--text-secondary, #64748b);
          line-height: 1.7;
        }

        .form-layout {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 1.2rem;
          align-items: start;
        }

        .panel {
          border-radius: 24px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--card-bg, #f8fafc);
          overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.2rem;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          background: var(--bg-primary, #fff);
        }

        .panel-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          color: var(--text-primary, #0f172a);
        }

        .panel-subtitle {
          font-size: 0.82rem;
          color: var(--text-secondary, #64748b);
        }

        .form-textarea,
        .context-box {
          width: 100%;
          border: none;
          outline: none;
          resize: vertical;
          background: transparent;
          color: var(--text-primary, #0f172a);
          font-size: 0.94rem;
          line-height: 1.8;
          padding: 1.1rem 1.2rem;
        }

        .form-textarea {
          min-height: 330px;
        }

        .context-box {
          min-height: 110px;
          border-top: 1px solid var(--border-color, #e2e8f0);
        }

        .input-actions {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
          padding: 0 1.2rem 1.2rem;
        }

        .primary-btn,
        .ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          border-radius: 12px;
          padding: 0.72rem 1rem;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .primary-btn {
          border: none;
          color: #fff;
          background: linear-gradient(135deg, #92400e, #b45309);
          box-shadow: 0 12px 30px rgba(180, 83, 9, 0.22);
        }

        .ghost-btn {
          border: 1px solid var(--border-color, #d8dee6);
          background: var(--bg-primary, #fff);
          color: var(--text-primary, #0f172a);
        }

        .results-shell {
          min-height: 540px;
          padding: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .helper-section {
          border-radius: 20px;
          border: 1px solid rgba(100, 116, 139, 0.16);
          background: var(--bg-primary, #fff);
          padding: 1rem 1.05rem;
        }

        .helper-section h3 {
          margin: 0 0 0.65rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          color: var(--text-primary, #0f172a);
        }

        .helper-section p,
        .helper-section li {
          color: var(--text-secondary, #475569);
          line-height: 1.7;
          font-size: 0.9rem;
        }

        .helper-section ul,
        .helper-section ol {
          margin: 0;
          padding-left: 1.1rem;
          display: grid;
          gap: 0.45rem;
        }

        .field-grid {
          display: grid;
          gap: 0.75rem;
        }

        .field-card {
          border-radius: 16px;
          border: 1px solid var(--border-color, #e2e8f0);
          background: var(--card-bg, #f8fafc);
          padding: 0.85rem 0.95rem;
        }

        .field-card strong {
          display: block;
          color: var(--text-primary, #0f172a);
          margin-bottom: 0.3rem;
        }

        .field-label {
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #92400e;
          margin-bottom: 0.25rem;
        }

        .results-actions {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
        }

        .empty-state,
        .loading-state,
        .error-banner {
          border-radius: 18px;
          padding: 1rem;
          background: var(--bg-primary, #fff);
          border: 1px dashed var(--border-color, #d8dee6);
          color: var(--text-secondary, #64748b);
        }

        .loading-state,
        .error-banner {
          display: flex;
          align-items: center;
          gap: 0.7rem;
        }

        .error-banner {
          border-style: solid;
          color: #dc2626;
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.18);
        }

        @media (max-width: 980px) {
          .form-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="form-root">
        <div className="form-header">
          <div className="form-eyebrow">
            <ClipboardList size={14} />
            Form Helper
          </div>
          <h1 className="form-title">Turn confusing forms into clear next steps.</h1>
          <p className="form-sub">
            Paste a form, application notice, or instruction sheet and get a plain-language
            summary, field-by-field guidance, supporting documents, and watch-outs before you
            submit anything.
          </p>
        </div>

        <div className="form-layout">
          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">
                  <FileText size={16} color="#92400e" />
                  Form Text
                </div>
                <div className="panel-subtitle">
                  Paste the form wording, instructions, or confusing section here.
                </div>
              </div>
            </div>
            <textarea
              className="form-textarea"
              value={formText}
              onChange={(event) => setFormText(event.target.value)}
              placeholder="Paste a government form, medical application, school notice, or support request."
            />
            <textarea
              className="context-box"
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder="Optional context: what the user finds confusing or what they need help with."
            />
            <div className="input-actions">
              <button className="primary-btn" onClick={handleAnalyse} disabled={loading || !formText.trim()}>
                {loading ? (
                  <>
                    <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                    Analysing
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Explain This Form
                  </>
                )}
              </button>
              <button className="ghost-btn" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset Demo
              </button>
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">
                  <ListChecks size={16} color="#0369a1" />
                  Helper Output
                </div>
                <div className="panel-subtitle">
                  A structured guide you can read, copy, or listen to.
                </div>
              </div>
            </div>

            <div className="results-shell">
              {loading ? (
                <div className="loading-state">
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Building a step-by-step explanation...
                </div>
              ) : error ? (
                <div className="error-banner">
                  <AlertTriangle size={18} />
                  {error}
                </div>
              ) : result ? (
                <>
                  <div className="results-actions">
                    <button className="primary-btn" onClick={handleSpeak}>
                      <Volume2 size={16} />
                      Read Aloud
                    </button>
                    <button className="ghost-btn" onClick={handleCopy}>
                      <Copy size={16} />
                      {copied ? "Copied" : "Copy Guide"}
                    </button>
                  </div>

                  <section className="helper-section">
                    <h3>
                      <Sparkles size={16} color="#7c3aed" />
                      Plain-Language Summary
                    </h3>
                    <p>{result.summary}</p>
                  </section>

                  <section className="helper-section">
                    <h3>
                      <CheckCircle2 size={16} color="#0369a1" />
                      Step-by-Step
                    </h3>
                    <ol>
                      {result.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </section>

                  <section className="helper-section">
                    <h3>
                      <FileText size={16} color="#0f766e" />
                      Field Guide
                    </h3>
                    <div className="field-grid">
                      {result.fields.map((field) => (
                        <div key={field.field} className="field-card">
                          <div className="field-label">{field.field}</div>
                          <strong>What it means</strong>
                          <p>{field.explanation}</p>
                          <strong style={{ marginTop: "0.55rem" }}>What to prepare</strong>
                          <p>{field.what_to_prepare}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="helper-section">
                    <h3>
                      <ClipboardList size={16} color="#92400e" />
                      Supporting Documents
                    </h3>
                    <ul>
                      {result.documents.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="helper-section">
                    <h3>
                      <AlertTriangle size={16} color="#dc2626" />
                      Watch Outs
                    </h3>
                    <ul>
                      {result.warnings.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                </>
              ) : (
                <div className="empty-state">
                  Paste a form on the left and click <strong>Explain This Form</strong>. The helper
                  will break it into steps, field guidance, and important warnings.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
