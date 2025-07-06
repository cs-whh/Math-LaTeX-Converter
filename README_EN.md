# Math LaTeX Converter

English | [中文](README.md)

A Chrome extension designed specifically for converting mathematical formula formats. When you copy content containing mathematical formulas from supported AI chat websites, it automatically converts standard LaTeX mathematical symbol formats `\(` and `\[` to Markdown-compatible `$` and `$$` formats.

## 🎯 Main Purpose

Especially suitable for use in **Obsidian** and other Markdown editors, as these environments typically only support `$` and `$$` as mathematical formula delimiters, not standard LaTeX formats.

## ✨ Features

- 🔄 **Automatic Format Conversion**: `\(...\)` → `$...$` (inline formulas)
- 🔄 **Automatic Format Conversion**: `\[...\]` → `$$...$$` (block formulas)
- ⚡ **Real-time Conversion**: Automatic conversion when clicking the copy button
- 🎯 **Smart Recognition**: Automatically detects copy buttons, no manual operation required
- 🌐 **Multi-site Support**: Supports multiple mainstream AI chat websites

## 🚀 Supported Websites

- **DeepSeek Chat** (chat.deepseek.com)
- **Grok** (grok.com)

## 📦 Installation Instructions

1. Open Chrome browser
2. Visit `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked extension"
5. Select the folder containing these files

## 💡 Usage

1. After installing the extension, visit supported AI chat websites
2. Have a conversation with AI to get answers containing mathematical formulas
3. Click the copy button next to the answer
4. Paste into Obsidian or other Markdown editors
5. Mathematical formulas will be automatically converted to the correct format

## 🔧 Technical Details

- Automatically detects copy button click events
- Reads clipboard content and performs format conversion
- Writes converted content back to clipboard
- Supports dynamically loaded copy buttons

## ⚠️ Notes

- The extension requires clipboard read/write permissions to function properly
- Currently only supports specified AI chat websites

## 🎯 Use Cases

- **Obsidian Notes**: Directly paste AI-generated mathematical formulas into Obsidian
- **Markdown Documents**: Use mathematical formulas on Markdown-supported platforms
- **Academic Writing**: Quickly convert AI-generated mathematical content formats
- **Technical Blogs**: Insert correctly formatted mathematical formulas in blog posts

## 🔄 Conversion Examples

**Before conversion:**
```
This is an inline formula: \(E = mc^2\), and this is a block formula:
\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]
```

**After conversion:**
```
This is an inline formula: $E = mc^2$, and this is a block formula:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

## 🌐 Language Switch

- English - English version (current page)
- [中文](README.md) - Chinese version 