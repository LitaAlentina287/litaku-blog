import { isValidElement, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { resolveArticleImage } from '../lib/articles.js'

const LANGUAGE_LABELS = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  jsx: 'JSX',
  ts: 'TypeScript',
  tsx: 'TSX',
  yaml: 'YAML',
  yml: 'YAML',
  json: 'JSON',
  css: 'CSS',
  html: 'HTML',
  powershell: 'PowerShell',
  bash: 'Bash',
  sh: 'Shell',
  output: 'Output',
  text: 'Output',
}

/**
 * Extract plain code string and language id from ReactMarkdown's <pre> child.
 */
function extractCodeMeta(children) {
  const child = Array.isArray(children) ? children[0] : children
  if (isValidElement(child)) {
    const className = child.props?.className || ''
    const match = className.match(/language-([\w-]+)/i)
    const lang = match ? match[1].toLowerCase() : ''
    const rawText = child.props?.children
    const text = Array.isArray(rawText)
      ? rawText.join('')
      : String(rawText ?? '')
    return { lang, text: text.replace(/\n$/, '') }
  }

  return { lang: '', text: String(children ?? '').replace(/\n$/, '') }
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false)
  const { lang, text } = extractCodeMeta(children)
  const isOutput = lang === 'output' || lang === 'text'
  const label = LANGUAGE_LABELS[lang] || (lang ? lang.toUpperCase() : 'Kode')

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={`code-block ${isOutput ? 'code-block-output' : ''}`}>
      <div className="code-block-header">
        <span className="code-block-lang">
          {isOutput ? `>_ ${label}` : label}
        </span>
        <button
          type="button"
          className="code-block-copy"
          onClick={handleCopy}
          aria-label={`Salin ${label}`}
        >
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>
      <pre className="code-block-pre">{children}</pre>
    </div>
  )
}

const MARKDOWN_COMPONENTS = {
  a: ({ node: _node, href = '', children, ...props }) => {
    const isExternal = /^https?:\/\//i.test(href)
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      )
    }

    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
  pre: ({ node: _node, children }) => <CodeBlock>{children}</CodeBlock>,
  img: ({ node: _node, src = '', alt = '', title = '', ...props }) => {
    const resolvedSrc = resolveArticleImage(src)
    return (
      <span className="prose-figure">
        <img
          src={resolvedSrc}
          alt={alt}
          loading="lazy"
          className="prose-image"
          {...props}
        />
        {title && <span className="prose-caption">{title}</span>}
      </span>
    )
  },
  table: ({ node: _node, children, ...props }) => (
    <div className="table-scroll">
      <table {...props}>{children}</table>
    </div>
  ),
}

export default function MarkdownRenderer({ content }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={MARKDOWN_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
