const form = document.getElementById("rewrite-form");
const submitBtn = document.getElementById("submit-btn");
const btnLabel = submitBtn.querySelector(".btn__label");
const btnSpinner = submitBtn.querySelector(".btn__spinner");
const resultSection = document.getElementById("result-section");
const resultText = document.getElementById("result-text");
const resultToneBadge = document.getElementById("result-tone-badge");
const copyBtn = document.getElementById("copy-btn");
const copyBtnLabel = document.getElementById("copy-btn-label");
const errorEl = document.getElementById("error-message");

const TONE_LABELS = {
  friendly: "Friendly",
  professional: "Professional",
  formal: "Formal",
};

let lastRewritten = "";

function showError(message) {
  errorEl.textContent = message;
  errorEl.hidden = !message;
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  btnLabel.hidden = loading;
  btnSpinner.hidden = !loading;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  showError("");
  resultSection.hidden = true;

  const customerMessage = document.getElementById("customer-message").value;
  const draftReply = document.getElementById("draft-reply").value;
  const tone = form.elements.tone.value;

  if (!draftReply.trim()) {
    showError("Please enter a draft reply.");
    document.getElementById("draft-reply").focus();
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerMessage, draftReply, tone }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    lastRewritten = data.rewritten;
    resultText.textContent = lastRewritten;
    resultToneBadge.textContent = TONE_LABELS[tone] || tone;
    resultSection.hidden = false;
    copyBtn.classList.remove("copied");
    copyBtnLabel.textContent = "Copy to clipboard";
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  } catch (err) {
    showError(err.message || "Failed to rewrite. Try again.");
  } finally {
    setLoading(false);
  }
});

copyBtn.addEventListener("click", async () => {
  if (!lastRewritten) return;

  try {
    await navigator.clipboard.writeText(lastRewritten);
    copyBtn.classList.add("copied");
    copyBtnLabel.textContent = "Copied!";
    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyBtnLabel.textContent = "Copy to clipboard";
    }, 2000);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(resultText);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    showError("Could not copy automatically. Text is selected — use Copy manually.");
  }
});
