function replaceABCFences() {
  const abcNodes = document.querySelectorAll('code.language-abc')
  for (const node of abcNodes) {
    const abc = node.textContent
    const div = document.createElement('div')
    ABCJS.renderAbc(div, abc, { visualTranspose: -24, responsive: 'resize' })
    node.parentElement.appendChild(div)
    node.style.display = 'none'
  }
}

document.addEventListener('DOMContentLoaded', replaceABCFences)
