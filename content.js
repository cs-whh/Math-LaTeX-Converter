// 这个脚本会在匹配的网页中执行
console.log('Content script loaded');

// 这里可以添加与网页交互的代码 

// 监听复制按钮的点击事件
function handleCopyButtonClick(e) {
    console.log('Copy button clicked!');
    
    // 延迟执行以确保内容已经被复制到剪贴板
    setTimeout(() => {
        // 从剪贴板读取内容
        navigator.clipboard.readText().then(text => {
            console.log('Original text:', text);
            
            // 如果文本包含 LaTeX 数学符号，进行转换
            if (text.includes('\\(') || text.includes('\\[')) {
                console.log('LaTeX symbols found, converting...');
                
                // 转换文本
                let convertedText = text;
                
                // 先处理 \[ \] 的情况
                console.log('Before \[ \] conversion:', convertedText);
                convertedText = convertedText
                    .replace(/\\\[/g, '$$$$') // 将 \[ 替换为 $$
                    .replace(/\\\]/g, '$$$$'); // 将 \] 替换为 $$
                console.log('After \[ \] conversion:', convertedText);
                
                // 再处理 \( \) 的情况
                console.log('Before \( \) conversion:', convertedText);
                convertedText = convertedText
                    .replace(/\\\(\s*/g, '$')  // 将 \( 和后面的空格替换为 $
                    .replace(/\s*\\\)/g, '$');  // 将前面的空格和 \) 替换为 $
                console.log('After \( \) conversion:', convertedText);
                
                console.log('Final converted text:', convertedText);
                
                // 将转换后的文本写回剪贴板
                navigator.clipboard.writeText(convertedText)
                    .then(() => console.log('Text converted and copied successfully!'))
                    .catch(err => console.error('Error writing to clipboard:', err));
            } else {
                console.log('No LaTeX symbols found, skipping conversion');
            }
        }).catch(err => console.error('Error reading from clipboard:', err));
    }, 100); // 100ms 延迟，确保原始内容已经被复制
}

// 检查元素是否是复制按钮
function isCopyButton(element) {
    // 检查是否是 SVG 复制图标
    if (element.tagName === 'svg') {
        console.log('Found SVG element:', element);
        
        // 检查 SVG 的 viewBox 和尺寸
        const viewBox = element.getAttribute('viewBox');
        const width = element.getAttribute('width');
        const height = element.getAttribute('height');
        
        // 检查是否是 24x24 的 SVG
        if (viewBox === '0 0 24 24' && width === '24' && height === '24') {
            // 获取所有路径
            const paths = element.querySelectorAll('path');
            if (paths.length === 2) {
                // 检查第一个路径
                const firstPath = paths[0].getAttribute('d');
                // 检查第二个路径
                const secondPath = paths[1].getAttribute('d');
                
                // 检查是否匹配复制图标的特征
                if (firstPath && secondPath && 
                    firstPath.includes('M3.65169 12.9243') && 
                    secondPath.includes('M9.66972 21.6772')) {
                    console.log('Found copy SVG icon!');
                    return true;
                }
            }
        }
    }
    
    return false;
}

// 为 iframe 添加事件监听
function setupIframeListeners() {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.addEventListener('click', function(e) {
                const target = e.target;
                console.log('Iframe clicked element:', target);
                console.log('Iframe element tag:', target.tagName);
                console.log('Iframe parent element:', target.parentElement);
                
                if (isCopyButton(target)) {
                    console.log('Iframe copy button detected!');
                    handleCopyButtonClick(e);
                }
            });
        } catch (e) {
            console.log('Cannot access iframe content:', e);
        }
    });
}

// 监听复制按钮的点击事件
document.addEventListener('click', function(e) {
    const target = e.target;
    console.log('Clicked element:', target);
    console.log('Element tag:', target.tagName);
    console.log('Element class:', target.className);
    console.log('Element id:', target.id);
    console.log('Element attributes:', Array.from(target.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '));
    
    // 检查父元素
    let parent = target.parentElement;
    while (parent) {
        console.log('Parent element:', parent.tagName, parent.className);
        if (isCopyButton(parent)) {
            console.log('Copy button detected in parent!');
            handleCopyButtonClick(e);
            return;
        }
        parent = parent.parentElement;
    }
    
    if (isCopyButton(target)) {
        console.log('Copy button detected!');
        handleCopyButtonClick(e);
    } else {
        console.log('Not a copy button');
    }
});

// 为了确保在页面加载完成后也能找到复制按钮，添加一个 MutationObserver
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            // 检查新添加的节点中是否有复制按钮
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // 元素节点
                    // 查找所有 SVG 元素
                    const svgs = node.querySelectorAll('svg');
                    svgs.forEach(svg => {
                        if (isCopyButton(svg)) {
                            console.log('Found new copy button:', svg);
                            svg.addEventListener('click', handleCopyButtonClick);
                        }
                    });
                    
                    // 检查是否有新的 iframe
                    if (node.tagName === 'IFRAME') {
                        setupIframeListeners();
                    }
                }
            });
        }
    });
});

// 开始观察整个文档的变化
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// 在页面加载完成后，查找所有现有的复制按钮
function findExistingCopyButtons() {
    // 查找所有 SVG 元素
    const svgs = document.querySelectorAll('svg');
    console.log('Found SVGs:', svgs.length);
    svgs.forEach(svg => {
        if (isCopyButton(svg)) {
            console.log('Found existing copy button:', svg);
            svg.addEventListener('click', handleCopyButtonClick);
        }
    });
    
    // 设置 iframe 监听器
    setupIframeListeners();
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', findExistingCopyButtons);
// 如果页面已经加载完成，立即执行
if (document.readyState === 'complete') {
    findExistingCopyButtons();
}

console.log('LaTeX Format Converter content script loaded!'); 