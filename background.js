// 监听插件安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Math LaTeX Converter installed successfully!');
  console.log('Supported sites: DeepSeek Chat, Grok');
  console.log('Function: Convert \\( \\) and \\[ \\] to $ $ and $$ $$ format');
});

// 监听来自content script的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'convertLatex') {
    console.log('LaTeX conversion requested');
    // 这里可以添加额外的转换逻辑
    sendResponse({success: true});
  }
});

// 这里可以添加其他后台任务 