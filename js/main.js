const textarea = document.getElementById("textInput");
const status = document.getElementById("status");

let historyStack = []; // 存储文本状态的历史栈
let futureStack = [];  // 存储未来的状态（用于前进）
let currentText = '';  // 当前文本

// 更新状态
function updateStatus() {
  const lines = textarea.value.split('\n').length;
  const chars = textarea.value.length;
  status.textContent = `当前共 ${lines} 行, 共 ${chars} 个字符`;
}

// 监听输入变化
textarea.addEventListener("input", updateStatus);

// 去掉空行
function removeEmptyLines() {
  textarea.value = textarea.value.split('\n')
    .filter(line => line.trim() !== '')
    .join('\n');
  updateStatus();
  saveState();
}

// 去掉多余空格
function removeExtraSpaces() {
  textarea.value = textarea.value.replace(/\s+/g, ' ').trim();
  updateStatus();
  saveState();
}

// 逗号拼接
function joinCommas() {
  textarea.value = textarea.value.split('\n').join(', ');
  updateStatus();
  saveState();
}

// 逗号拆分
function splitCommas() {
  textarea.value = textarea.value.split(',').map(item => item.trim()).join('\n');
  updateStatus();
  saveState();
}

// SQL IN 格式化
function sqlIn() {
  const lines = textarea.value.split('\n').map(line => line.trim()).filter(line => line);
  if (lines.length === 0) return;
  textarea.value = `IN (${lines.join(', ')})`;
  updateStatus();
  saveState();
}

// 按行去重
function deduplicate() {
  const lines = textarea.value.split('\n');
  const unique = [...new Set(lines)];
  textarea.value = unique.join('\n');
  updateStatus();
  saveState();
}

// Java命名（驼峰命名法）
function javaNaming() {
  let result = '';
  const lines = textarea.value.split('\n');
  for (let line of lines) {
    const words = line.trim().split(/[\s_-]+/).filter(w => w);
    if (words.length === 0) continue;
    const firstWord = words[0].toLowerCase();
    const restWords = words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1));
    result += firstWord + restWords.join('') + '\n';
  }
  textarea.value = result.trim();
  updateStatus();
  saveState();
}

// SQL命名（下划线命名法）
function sqlNaming() {
  let result = '';
  const lines = textarea.value.split('\n');
  for (let line of lines) {
    const words = line.trim().split(/(?=[A-Z])/).map(w => w.toLowerCase());
    result += words.join('_') + '\n';
  }
  textarea.value = result.trim();
  updateStatus();
  saveState();
}

// 大小写转换
function toggleCase() {
  const text = textarea.value;
  textarea.value = text.split('').map(c => {
    if (c >= 'a' && c <= 'z') return c.toUpperCase();
    if (c >= 'A' && c <= 'Z') return c.toLowerCase();
    return c;
  }).join('');
  updateStatus();
  saveState();
}

// 复制内容
function copyText() {
  navigator.clipboard.writeText(textarea.value).then(() => {
    alert("已复制到剪贴板！");
  });
}
// 保存状态
function saveState() {
  if (textarea.value !== currentText) { // 如果文本已更改
    futureStack = []; // 清空未来栈
    historyStack.push(currentText); // 将当前文本保存到历史栈
    currentText = textarea.value; // 更新当前文本
  }
}
// 更新状态
function updateStatus() {
  const lines = textarea.value.split('\n').length;
  const chars = textarea.value.length;
  status.textContent = `当前共 ${lines} 行, 共 ${chars} 个字符`;
}

// 后退
function back() {
  if (historyStack.length === 0) return;
  futureStack.push(textarea.value); // 当前状态存入未来栈
  textarea.value = historyStack.pop(); // 从历史栈中恢复上一个状态
  currentText = textarea.value;
  updateStatus();
}

// 前进
function forward() {
  if (futureStack.length === 0) return;
  historyStack.push(textarea.value); // 当前状态存入历史栈
  textarea.value = futureStack.pop(); // 从未来栈中恢复下一个状态
  currentText = textarea.value;
  updateStatus();
}

textarea.addEventListener("input", () => {
  saveState();
  updateStatus();
  autoResize();
});

// 自动调整文本框高度
function autoResize() {
  const ta = document.getElementById("textInput");
  ta.style.height = 'auto'; // 重置高度
  ta.style.height = Math.max(ta.scrollHeight, 200) + 'px'; // 最小200px
}

// 页面加载后也自动调整一次
window.addEventListener('load', autoResize);
