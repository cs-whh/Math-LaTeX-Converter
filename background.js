// 监听插件安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
 
// 这里可以添加其他后台任务 