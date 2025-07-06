document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('actionButton');
 
  button.addEventListener('click', function() {
    // 测试转换功能
    const testText = '这是一个行内公式：\\(E = mc^2\\)，这是一个行间公式：\\[\int_{-\infty}^{\infty} e^{-x^2} dx = \\sqrt{\\pi}\\]';
    
    // 执行转换
    let convertedText = testText;
    
    // 先处理 \[ \] 的情况
    convertedText = convertedText
        .replace(/\\\[/g, '$$$$') // 将 \[ 替换为 $$
        .replace(/\\\]/g, '$$$$'); // 将 \] 替换为 $$
    
    // 再处理 \( \) 的情况
    convertedText = convertedText
        .replace(/\\\(\s*/g, '$')  // 将 \( 和后面的空格替换为 $
        .replace(/\s*\\\)/g, '$');  // 将前面的空格和 \) 替换为 $
    
    // 显示转换结果
    const result = `转换前：\n${testText}\n\n转换后：\n${convertedText}`;
    
    // 创建模态框显示结果
    showResultModal(result);
  });
});

function showResultModal(content) {
  // 创建模态框
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow-y: auto;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    line-height: 1.4;
  `;
  
  modalContent.textContent = content;
  
  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '关闭';
  closeButton.style.cssText = `
    margin-top: 15px;
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  closeButton.addEventListener('click', function() {
    document.body.removeChild(modal);
  });
  
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // 点击背景关闭
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
} 