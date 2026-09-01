import DefaultTheme from 'vitepress/theme'
import { nextTick, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
import Layout from './Layout.vue'
import './style.css'

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>
      startup?: {
        promise?: Promise<void>
      }
      tex?: unknown
      svg?: unknown
    }
  }
}

let mermaidInstance: any
let mathJaxLoading: Promise<void> | undefined

function loadMathJax() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.MathJax?.typesetPromise) return Promise.resolve()
  if (mathJaxLoading) return mathJaxLoading

  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true
    },
    svg: {
      fontCache: 'global'
    },
    startup: {
      typeset: false
    }
  } as any

  mathJaxLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load MathJax'))
    document.head.appendChild(script)
  })

  return mathJaxLoading
}

async function renderMath() {
  await loadMathJax()
  await window.MathJax?.startup?.promise
  await window.MathJax?.typesetPromise?.([document.body])
}

async function renderMermaid() {
  if (typeof window === 'undefined') return
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('.mermaid'))
  if (nodes.length === 0) return

  if (!mermaidInstance) {
    mermaidInstance = await import(
      /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs'
    )
    mermaidInstance.default.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'default'
    })
  }

  nodes.forEach((node) => node.removeAttribute('data-processed'))
  await mermaidInstance.default.run({ nodes })
}

function useRichMarkdownRender() {
  const route = useRoute()

  async function render() {
    await nextTick()
    await Promise.all([renderMermaid(), renderMath()])
  }

  onMounted(render)
  watch(() => route.path, render)
}

export default {
  extends: DefaultTheme,
  Layout,
  setup() {
    useRichMarkdownRender()
  }
}
