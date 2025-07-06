// 这个脚本会在匹配的网页中执行
console.log('Content script loaded');

// Grok网站专用的调试和监听函数
function setupGrokDebugListeners() {
    console.log('Setting up Grok debug listeners...');
    
    // 监听所有点击事件，输出详细信息
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // 检查是否在Grok网站
        if (window.location.hostname.includes('grok.com')) {
            console.log('=== GROK DEBUG: Click Event ===');
            console.log('Clicked element:', target);
            console.log('Element tag:', target.tagName);
            console.log('Element class:', target.className);
            console.log('Element id:', target.id);
            console.log('Element text content:', target.textContent?.substring(0, 100));
            console.log('Element innerHTML:', target.innerHTML?.substring(0, 200));
            console.log('Element attributes:', Array.from(target.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '));
            
            // 检查父元素链
            let parent = target.parentElement;
            let level = 1;
            while (parent && level <= 5) {
                console.log(`Parent level ${level}:`, parent.tagName, parent.className, parent.id);
                console.log(`Parent level ${level} attributes:`, Array.from(parent.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '));
                parent = parent.parentElement;
                level++;
            }
            
            // 检查是否有data-*属性
            const dataAttrs = Array.from(target.attributes).filter(attr => attr.name.startsWith('data-'));
            if (dataAttrs.length > 0) {
                console.log('Data attributes:', dataAttrs.map(attr => `${attr.name}="${attr.value}"`).join(', '));
            }
            
            // 检查是否有aria-*属性
            const ariaAttrs = Array.from(target.attributes).filter(attr => attr.name.startsWith('aria-'));
            if (ariaAttrs.length > 0) {
                console.log('Aria attributes:', ariaAttrs.map(attr => `${attr.name}="${attr.value}"`).join(', '));
            }
            
            // 检查是否包含复制相关的文本 - 修复className错误
            const copyKeywords = ['copy', '复制', '复制代码', '复制文本', '复制内容'];
            const targetClassName = typeof target.className === 'string' ? target.className : 
                                  (target.className?.baseVal || '');
            const hasCopyKeyword = copyKeywords.some(keyword => 
                target.textContent?.toLowerCase().includes(keyword.toLowerCase()) ||
                targetClassName.toLowerCase().includes(keyword.toLowerCase()) ||
                target.id?.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (hasCopyKeyword) {
                console.log('*** POTENTIAL COPY BUTTON DETECTED ***');
                console.log('Contains copy-related keyword');
            }
            
            // 检查是否是按钮或可点击元素
            const clickableSelectors = ['button', '[role="button"]', '[tabindex]', 'a', 'input[type="button"]', 'input[type="submit"]'];
            const isClickable = clickableSelectors.some(selector => target.matches(selector));
            if (isClickable) {
                console.log('*** CLICKABLE ELEMENT DETECTED ***');
                console.log('Element is clickable');
            }
            
            console.log('=== END GROK DEBUG ===');
        }
    }, true); // 使用捕获阶段
    
    // 监听DOM变化，特别关注新添加的元素
    const grokObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length && window.location.hostname.includes('grok.com')) {
                console.log('=== GROK DEBUG: DOM Mutation ===');
                console.log('Added nodes count:', mutation.addedNodes.length);
                
                mutation.addedNodes.forEach((node, index) => {
                    if (node.nodeType === 1) { // 元素节点
                        console.log(`New element ${index}:`, node.tagName, node.className, node.id);
                        console.log(`New element ${index} attributes:`, Array.from(node.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '));
                        
                        // 检查是否包含复制相关的关键词 - 修复className错误
                        const copyKeywords = ['copy', '复制', '复制代码', '复制文本', '复制内容'];
                        const nodeClassName = typeof node.className === 'string' ? node.className : 
                                            (node.className?.baseVal || '');
                        const hasCopyKeyword = copyKeywords.some(keyword => 
                            node.textContent?.toLowerCase().includes(keyword.toLowerCase()) ||
                            nodeClassName.toLowerCase().includes(keyword.toLowerCase()) ||
                            node.id?.toLowerCase().includes(keyword.toLowerCase())
                        );
                        
                        if (hasCopyKeyword) {
                            console.log(`*** NEW ELEMENT ${index} CONTAINS COPY KEYWORD ***`);
                        }
                        
                        // 查找SVG图标
                        const svgs = node.querySelectorAll('svg');
                        if (svgs.length > 0) {
                            console.log(`New element ${index} contains ${svgs.length} SVG(s)`);
                            svgs.forEach((svg, svgIndex) => {
                                console.log(`SVG ${svgIndex}:`, svg.outerHTML.substring(0, 200));
                            });
                        }
                    }
                });
                
                console.log('=== END GROK DEBUG ===');
            }
        });
    });
    
    // 开始观察DOM变化
    grokObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'id', 'style', 'data-*', 'aria-*']
    });
    
    // 监听键盘事件，特别是Ctrl+C
    document.addEventListener('keydown', function(e) {
        if (window.location.hostname.includes('grok.com') && (e.ctrlKey || e.metaKey) && e.key === 'c') {
            console.log('=== GROK DEBUG: Copy Keyboard Shortcut ===');
            console.log('Ctrl+C pressed');
            console.log('Active element:', document.activeElement);
            console.log('Selected text:', window.getSelection().toString());
            console.log('=== END GROK DEBUG ===');
        }
    });
    
    // 监听剪贴板事件
    document.addEventListener('copy', function(e) {
        if (window.location.hostname.includes('grok.com')) {
            console.log('=== GROK DEBUG: Copy Event ===');
            console.log('Copy event triggered');
            console.log('Target:', e.target);
            console.log('Selection:', window.getSelection().toString());
            console.log('=== END GROK DEBUG ===');
        }
    });
}

// 在页面加载完成后设置Grok调试监听器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGrokDebugListeners);
} else {
    setupGrokDebugListeners();
}

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
        
        // Grok网站的复制按钮识别
        if (window.location.hostname.includes('grok.com')) {
            return isGrokCopyButton(element);
        }
    }
    
    return false;
}

// Grok网站专用的复制按钮识别函数
function isGrokCopyButton(element) {
    // 检查是否是SVG元素
    if (element.tagName !== 'svg') {
        return false;
    }
    
    // 检查SVG的基本属性
    const viewBox = element.getAttribute('viewBox');
    const width = element.getAttribute('width');
    const height = element.getAttribute('height');
    
    // Grok的复制按钮SVG特征：16x16, viewBox="0 0 24 24"
    if (viewBox === '0 0 24 24' && width === '16' && height === '16') {
        // 检查父元素是否是BUTTON且有aria-label="复制"
        let parent = element.parentElement;
        while (parent) {
            if (parent.tagName === 'BUTTON') {
                const ariaLabel = parent.getAttribute('aria-label');
                if (ariaLabel === '复制') {
                    console.log('Found Grok copy button!');
                    return true;
                }
                break;
            }
            parent = parent.parentElement;
        }
        
        // 检查SVG内容是否包含复制图标的特征
        const rect = element.querySelector('rect');
        const path = element.querySelector('path');
        
        if (rect && path) {
            const rectX = rect.getAttribute('x');
            const rectY = rect.getAttribute('y');
            const rectWidth = rect.getAttribute('width');
            const rectHeight = rect.getAttribute('height');
            
            // 检查是否是复制图标的矩形部分
            if (rectX === '3' && rectY === '8' && rectWidth === '13' && rectHeight === '13') {
                console.log('Found Grok copy button by SVG content!');
                return true;
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
    
    // 在Grok网站上，减少调试输出，只保留关键信息
    if (window.location.hostname.includes('grok.com')) {
        console.log('Grok click detected on:', target.tagName, target.className);
    } else {
        console.log('Clicked element:', target);
        console.log('Element tag:', target.tagName);
        console.log('Element class:', target.className);
        console.log('Element id:', target.id);
        console.log('Element attributes:', Array.from(target.attributes).map(attr => `${attr.name}="${attr.value}"`).join(', '));
    }
    
    // 检查父元素
    let parent = target.parentElement;
    while (parent) {
        if (window.location.hostname.includes('grok.com')) {
            // 在Grok网站上，检查父元素是否是复制按钮
            if (parent.tagName === 'BUTTON') {
                const ariaLabel = parent.getAttribute('aria-label');
                if (ariaLabel === '复制') {
                    console.log('Grok copy button detected in parent!');
                    handleCopyButtonClick(e);
                    return;
                }
            }
        } else {
            console.log('Parent element:', parent.tagName, parent.className);
            if (isCopyButton(parent)) {
                console.log('Copy button detected in parent!');
                handleCopyButtonClick(e);
                return;
            }
        }
        parent = parent.parentElement;
    }
    
    if (isCopyButton(target)) {
        console.log('Copy button detected!');
        handleCopyButtonClick(e);
    } else {
        if (!window.location.hostname.includes('grok.com')) {
            console.log('Not a copy button');
        }
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