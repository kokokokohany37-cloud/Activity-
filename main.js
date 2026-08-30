const PLUGIN_ID = "com.koko.acodeactivity";

let editorManager;
let startTime;
let timer = null;
let page = null;

function getLanguage(filename) {
  const ext = filename.split(".").pop().toLowerCase();

  const languages = {
    js: "JavaScript",
    mjs: "JavaScript",
    cjs: "JavaScript",

    ts: "TypeScript",
    jsx: "React JSX",
    tsx: "React TSX",

    html: "HTML",
    htm: "HTML",

    css: "CSS",
    scss: "SCSS",
    sass: "SASS",

    json: "JSON",

    py: "Python",
    java: "Java",
    c: "C",
    cpp: "C++",
    h: "C/C++",
    hpp: "C++",

    php: "PHP",
    rb: "Ruby",
    go: "Go",
    rs: "Rust",

    md: "Markdown",
    txt: "Text"
  };

  return languages[ext] || "Code";
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds
  ]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}

function getCurrentActivity() {
  const file = editorManager?.activeFile;

  if (!file) {
    return {
      file: "No file",
      language: "Unknown",
      time: "00:00:00"
    };
  }

  return {
    file: file.filename || file.name || "Unknown",
    language: getLanguage(file.filename || file.name || ""),
    time: formatTime(Date.now() - startTime)
  };
}

function updateUI() {
  if (!page) return;

  const activity = getCurrentActivity();

  page.innerHTML = `
    <div style="
      padding: 20px;
      font-family: sans-serif;
    ">
      <h2>Acode Activity</h2>

      <div style="
        padding: 15px;
        border-radius: 12px;
        background: var(--secondary-background-color);
      ">

        <p>
          📄 <b>File:</b>
          ${activity.file}
        </p>

        <p>
          💻 <b>Language:</b>
          ${activity.language}
        </p>

        <p>
          ⏱️ <b>Working time:</b>
          ${activity.time}
        </p>

      </div>
    </div>
  `;
}

function resetSession() {
  startTime = Date.now();
  updateUI();
}

function init(baseUrl, $page) {
  page = $page;

  editorManager = acode.require("editorManager");

  startTime = Date.now();

  editorManager.on("switch-file", resetSession);

  timer = setInterval(updateUI, 1000);

  updateUI();
}

function unmount() {
  if (editorManager) {
    editorManager.off("switch-file", resetSession);
  }

  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  page = null;
}

acode.setPluginInit(PLUGIN_ID, init);
acode.setPluginUnmount(PLUGIN_ID, unmount);