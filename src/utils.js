
export function log(txt, element) {
    console.info(txt);
    element.textContent += `${txt.trim()}\n`;
  }