import * as streams from "/web.js";
globalThis.console = new streams.DomConsole("console", globalThis.console);
const txtFile = document.getElementById("txtFile");
const txtResult = document.getElementById("txtResult");
const imgResult = document.getElementById("imgResult");
txtFile.onchange = async () => {
  if (!txtFile.files || txtFile.files.length === 0) {
    return;
  }
  let base64 = "";
  await txtFile.files[0].stream().pipeThrough(new streams.BaseEncoder("base64").transformable()).pipeTo(new WritableStream({
    write(chunk) {
      base64 += chunk;
    }
  }));
  txtResult.textContent = base64;
  imgResult.src = `data:image/png;base64,${base64}`;
};
//# sourceMappingURL=PngToBase64.js.map
