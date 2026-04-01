function showStatus(msg) {
  const status = document.getElementById("status");
  status.textContent = msg;
  setTimeout(() => (status.textContent = ""), 2000);
}

class TranslatorWrapper {
  constructor(from, to) {
    this.translator = null;
    Translator.create({
      sourceLanguage: from,
      targetLanguage: to,
      monitor: (m) => {
        m.addEventListener('downloadprogress', (e) => {
          showStatus(`Downloaded ${from}-${to} ${e.loaded * 100}%`);
        });
      },}).then(t => {
        this.translator = t
      });
  }

  translate(text) {
    if (this.translator != null) {
      return this.translator.translate(text);
    } else {
      return "Translator model wasn't loaded"
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  showStatus("load translation model...")
  const translators = {
      "en-ru": new TranslatorWrapper("en", "ru"),
      "ru-en": new TranslatorWrapper("ru", "en"),
  };

  document.querySelectorAll("textarea").forEach((ta) => {
    const handler = (text) => translators[ta.dataset.dir].translate(text)
          .then(t => document.getElementById(ta.dataset.target).value = t)
          .catch((err) => showStatus(`error ${err}`));

    ta.addEventListener("keyup", () => handler(ta.value));
    ta.addEventListener("paste", (ev) => handler(ev.clipboardData.getData('text')));
  });
});
