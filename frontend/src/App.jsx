import { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'


function useBuildVersion() {
  const [version, setVersion] = useState('')

  useEffect(() => {
    const meta = document.querySelector('meta[name="x-build"]')
    if (meta?.content) {
      setVersion(meta.content)
    }
  }, [])

  return version
}

const THEME_STORAGE_KEY = 'gm-theme-preference'
const DEFAULT_GHOST_API_URL = 'https://blog.goodmeow.my.id/ghost/api/content/posts/'

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date)
}

function normaliseTags(tags = []) {
  if (!Array.isArray(tags)) return []
  return tags
    .map((tag) => {
      if (!tag) return ''
      if (typeof tag === 'string') return tag
      if (typeof tag?.name === 'string') return tag.name
      return tag?.slug ?? ''
    })
    .filter(Boolean)
}

const ProtonMailIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="m15.24 8.998 3.656-3.073v15.81H2.482C1.11 21.735 0 20.609 0 19.223V6.944l7.58 6.38a2.186 2.186 0 0 0 2.871-.042l4.792-4.284h-.003zm-5.456 3.538 1.809-1.616a2.438 2.438 0 0 1-1.178-.533L.905 2.395A.552.552 0 0 0 0 2.826v2.811l8.226 6.923a1.186 1.186 0 0 0 1.558-.024zM23.871 2.463a.551.551 0 0 0-.776-.068l-3.199 2.688v16.653h1.623c1.371 0 2.481-1.127 2.481-2.513V2.824a.551.551 0 0 0-.129-.36z"
    />
  </svg>
)

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  </svg>
)

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M4.983 3.5c0 1.381-1.11 2.5-2.5 2.5S0 4.881 0 3.5 1.11 1 2.483 1s2.5 1.119 2.5 2.5zM.24 8.46h4.487v12.24H.24zm7.546 0h4.303v1.672h.062c.599-1.134 2.064-2.33 4.247-2.33 4.54 0 5.381 2.99 5.381 6.877v7.021H16.29v-6.22c0-1.484-.027-3.39-2.065-3.39-2.07 0-2.387 1.62-2.387 3.289v6.321H7.786z"
    />
  </svg>
)

const CredlyIcon = (props) => (
  <svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" {...props}>
    <circle cx="512" cy="512" r="512" fill="#f36c21" />
    <path
      fill="#fff"
      d="M671.2 371.6h3c3.7.3 7.4 2.1 9.7 5 3.4 4.2 4.3 9.8 4.6 15.1.8 16.1-2.7 32.1-7.3 47.5-5.9 20.4-14.2 40-21 60.1-1.2 3.5-2.4 7.1-3.3 10.7-1.5 6-1.3 12.3-1.5 18.5-.2 5.8.2 11.6 1.3 17.3.6 3.1 1.9 6.4 4.3 8.6 2.2 2 5.4 2.9 8.3 2 3.9-1.2 7-4.2 9.8-7.1 3.9-4.3 7.6-8.7 10.3-13.8 3.8-6.8 6-14.3 7.1-22 1.5-11.6 2.7-23.4 6.9-34.4 1.6-4.2 3.6-8.5 7.4-11.1 5.1-3.6 12.8-2.1 16.7 2.7 1.9 2.4 2.4 5.5 2.4 8.4-.2 3.9-1 7.8-2.3 11.5-4.5 13.2-7.1 27.1-6.6 41.1.1 3.2.4 6.6 2.1 9.5 1.4 2.4 3.8 4.3 6.6 4.3 3.2 0 6-1.9 8-4.2 3.1-3.5 5.6-7.5 7.6-11.7 4-8.5 5.9-17.8 7.6-27 1.4-7.8 2.8-15.6 5-23.2 1.2-3.9 2.7-7.8 5.6-10.8 1.9-2.1 4.8-2.9 7.5-2.9 2.8.1 5.4 1.7 7.3 3.8 2.6 2.9 3.1 6.9 2.8 10.6-2.8 22.1-5.9 44.2-8.4 66.3-1.8 13.8-3.4 27.6-4.6 41.4-.1 1.5 1.7 2.4 2.7 1.4 7.2-6.9 14.3-14.1 19.7-22.5 2.5-3.8 4.3-7.9 6.7-11.7 1-1.7 2.2-3.4 4.1-4 2.9-1.4 6.6-1 9.1 1 1.9 1.4 2.9 3.7 3.2 6v2.7c-.6 4.6-3.3 8.5-5.3 12.5-5.5 11-13.1 21-22.6 28.9-6.8 5.8-14.8 10.2-23.2 13.2-.5.2-1.3.3-1.4 1-3.1 12.7-10 24.4-19.3 33.5-10.3 10.2-23.6 17.2-37.7 20.5-7.7 1.7-15.8 2.4-23.6 1-8-1.5-15.8-5.2-21.5-11-5.2-5.2-8.7-12.1-9.3-19.5-.6-6.7 1.1-13.5 4.3-19.4 3.7-6.7 9.3-12.3 15.9-16.2 6.3-3.8 13.5-5.6 20.6-6.5 8.1-.9 16.4-.9 24.6-.2 5.1.4 10.2.9 15.3 1.3 2.8.2 5.9 1.2 8.6-.2 1.9-.9 2.5-3.2 2.8-5.1 1.2-9 3-18.1 1.9-27.3-.2-1.2-.5-3-2-3.1-1.8.8-2.7 2.7-3.7 4.3-3.1 6-8.9 10.6-15.6 11.9-6.7 1.3-14-2.1-17.1-8.1-1.5-2.5-2.2-5.5-4.4-7.6-1.5-1.4-3.7-1.4-5.5-.6-3.2 1.4-5.3 4.3-7.9 6.5-6.8 6.1-15.4 10.7-24.7 11.2-10.8.7-21.9-5.4-26.4-15.4-.6-1.4-1.1-3.4-2.9-3.6-2-.3-3.5 1.3-4.6 2.7-5.3 6.7-10.3 13.9-17.3 18.9-4.5 3.2-9.9 5.4-15.5 5.3-5.9-.1-11.8-3.3-14.6-8.5-1.3-2.3-1.8-5.2-3.9-7-1.6-1.4-4.1-1.2-5.8-.1-2.6 1.5-4.1 4.2-6.2 6.3-5.8 5.8-14.2 8.7-22.3 7.9-9.8-1-18.7-7.8-22.3-17-.5-1.3-1.2-2.8-2.6-3.2-1.1-.4-2 .4-2.7 1.1-5.4 5-10.8 10.1-17.3 13.6-6.6 3.5-13.9 5.8-21.4 5.6-7.9.1-15.8-2.3-22.2-6.8-5.4-3.7-9.7-8.9-12.2-15-.7-1.6-1.6-3.4-3.4-3.8-1.6-.4-3 .8-3.9 2-2.7 3.8-6.2 7.1-10.1 9.6-6 3.9-13 6.6-20.3 6.6-5.6 0-11.2-2.1-15.2-6-4.3-4.2-6.6-10.1-7.5-16-1.1-7.7.5-15.5 2.7-22.8 1.4-4.8 3.2-9.4 4.3-14.3.6-2.5.8-5.2-.3-7.5-.9-1.8-2.8-2.9-4.6-3.7-2-.8-4.1.3-5.5 1.6-1.4 1.3-2.1 3-2.9 4.7-4.9 11.8-11.5 22.9-19.6 32.8-7.8 9.6-17.1 17.9-27.1 25.2-11.4 8.1-24.5 14-38.4 15.9-10.1 1.4-20.6.6-30.4-2.3-5.8-1.7-11.5-4.1-16.5-7.6-8.6-6-15.5-14.3-20.4-23.5-3.8-7.1-6.7-14.7-8.8-22.5-2.9-11.1-3.9-22.5-4.4-33.9v-7.8c.2-8.4 1-16.8 2.7-25 3-14.9 8.4-29.2 15.7-42.5 5.8-10.4 12.7-20.2 21.4-28.3 9.5-8.9 21-15.8 33.7-18.6 12.1-2.7 25.1-2 36.4 3.2 3.4 1.5 6.4 3.7 10 4.8 2.5.8 5.4.5 7.5-1.1 3.2-2.5 4.7-6.5 7.4-9.5 3.4-3.7 8.9-5.2 13.7-3.8 4.5 1.3 8 5.2 9.1 9.7.7 3 .3 6.1-.6 9-1.4 4.1-3.7 7.8-5.9 11.5-7.3 12.6-12.8 26.2-16.3 40.3-1.1 4.3-2 8.8-3.7 12.9-1.6 3.9-4.1 7.6-7.7 10-3.1 2.1-7.2 3.1-10.9 2-3.4-1-6-3.8-7.4-7-1.6-3.4-2.1-7.3-1.6-11.1 1-8.9 5.9-17 6.1-26.1.2-5.1-1.5-10.4-5.5-13.7-5.6-4.8-13.5-6.1-20.6-5.1-8.4 1.1-16.3 5.1-22.5 10.8-6.7 6.2-11.7 14-15.7 22.1-11.6 23.2-16.7 49.8-13.7 75.6 1 8.4 3 16.8 7 24.4 2.5 4.8 5.8 9.1 9.9 12.5 5.3 4.4 11.7 7.4 18.5 8.7 9.7 1.9 19.9.6 29-2.9 12.2-4.7 22.8-13.1 31.2-23 4.5-5.1 8.4-10.7 12.2-16.4 3.8-5.3 7.8-10.9 9.3-17.4 1-4.3.1-8.7-.9-12.9-.7-5.8 1.5-11.7 5.3-16 2.4-2.5 5.4-4.8 8.9-5.5 3.3-.6 7 0 9.8 2.1 3.1 2.2 4.7 6.4 3.6 10.1-.7 2.4-1.5 4.9-.8 7.4.7 2.1 2.8 3.4 4.9 3.5 4.8.4 9.8-.5 14.4 1.1 5.4 2.1 10.2 6.4 12 12.1 1.2 3.8 1.6 8.1.4 11.9-2.1 7.4-4.7 14.7-6.1 22.3-.4 2.5-.8 5.1-.1 7.6.4 1.8 2 3.4 3.9 3.5 3.3.3 6.3-1.5 8.6-3.7 4.7-4.7 7.8-10.7 10-16.9 2.7-7.5 4.1-15.4 6.1-23.1 2.1-7.9 5.3-15.6 10.3-22.1 7.4-9.8 19.4-16.1 31.8-15.8 6.9.1 13.7 2.8 18.6 7.8 4.1 4.2 6.3 9.9 7.2 15.7 1.5 9.8-.3 20.1-4.8 29-6.2 12.2-18.9 20.9-32.6 22-2 .2-4.3.1-5.8 1.6-1.3 1.3-1.2 3.3-1 5 .5 4.6 2 9.3 5.1 12.9 3.6 3.7 9 6.3 14.3 5.1 6.1-1.3 11.3-5.2 15.6-9.4 4.1-4.1 7.7-8.7 11-13.5 4.6-6.6 7.4-14.2 10.2-21.6 2.7-7.3 5.2-14.7 9.7-21.1 3.6-5.4 8.3-10.1 13.9-13.5 6.2-3.9 13.6-5.9 21-5.5 2.3.1 4.9.2 6.8-1.2 1.7-1.3 2.3-3.6 2.3-5.7 0-3.8.4-7.5.7-11.3.5-5.9 1-11.8 1.8-17.6 1.7-14.6 4.7-29 8.6-43.1 2-7.1 4.6-14.3 9.1-20.3 1.9-2.7 4.2-5.3 7.2-6.9 2.9-1.7 6.6-1.6 9.7-.7 4 1.2 6.6 5 8.2 8.6 2.9 7.1 2.1 15 1.5 22.5-.8 11.8-3.6 23.4-6 35-2.1 10.2-3.8 20.5-5.7 30.7-2.6 14-5.1 28.1-7.7 42.1-2.2 11.5-4.7 23.2-3.3 35 .4 3.1.8 6.5 2.9 8.9 1.5 1.7 4 2.1 6 1.4 2.7-.9 4.6-3.3 6-5.7 3.3-5.6 6.2-11.5 9.1-17.4 4.2-8.2 8.4-16.7 9.8-25.9 2.2-14 3.7-28.2 5.7-42.3 1.6-10.5 3.4-21 5.1-31.4 2.1-13.1 4.5-26.1 8.2-38.8 1.8-6 4.2-11.9 8.4-16.6 3.8-3.8 8.3-6.5 13.3-7zM478 487.8c-2 .6-3.6 2.2-4.9 3.8-2.9 3.7-5.1 7.9-6.6 12.4-1.6 4.8-3.1 9.8-2.5 14.8.1 1.5 1.6 2.6 3 2.6 2.7.1 5.1-1.4 7.2-3 4.7-3.3 7.7-8.4 9.8-13.6 1.3-3.3 2.2-6.9 1.9-10.5-.2-2.4-1.4-4.9-3.5-6.1-1.3-.8-3-.9-4.4-.4zm85.7 11.2c-5.6 1-10.6 4.3-14.2 8.7-3.9 4.7-6.6 10.4-8 16.4-2.1 8.5-2.3 17.5 0 26 .7 2.6 1.9 5.2 3.9 7.1 1.3 1.3 3.1 2 4.9 2.1 4.7.7 9.1-1.9 12.7-4.6 4.5-3.3 7.4-8.2 9.2-13.4 1.1-3.2.4-6.6.1-9.9-.5-6.7-.5-13.4-.1-20.1.1-2.3.8-4.5.8-6.8 0-1.8-.7-3.8-2.4-4.8-2.1-1.3-4.6-1.1-6.9-.7zm133.7 119.6c-4.8.3-9.6 1.3-14.1 3.2-4.9 2-9.1 5.7-11.2 10.5-1.4 3-2 6.6-.5 9.6 1.5 3.1 4.3 5.4 7.4 6.8 4.3 1.9 9.1 2.2 13.6 1.7 14.2-1.6 27.7-8.9 36.7-20 1.8-2.2 3.2-4.7 4.7-7.1.4-.8 1-2.1.1-2.8-1.1-.8-2.5-.5-3.7-.5-5.1-.3-10.2-.8-15.3-1-5.9-.3-11.8-.8-17.7-.4z"
    />
  </svg>
)

function resolvePreferredTheme() {
  if (typeof window === 'undefined') {
    return { theme: 'dark', manual: false }
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') {
    return { theme: stored, manual: true }
  }

  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return { theme: prefersLight ? 'light' : 'dark', manual: false }
}

function App() {
  const version = useBuildVersion()
  const [{ theme, manual }, setThemeState] = useState(resolvePreferredTheme)
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const ghostContentUrl =
    import.meta.env.VITE_GHOST_CONTENT_URL?.trim() || DEFAULT_GHOST_API_URL
  const ghostContentKey = import.meta.env.VITE_GHOST_CONTENT_KEY?.trim() || ''
  const [blogPosts, setBlogPosts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(Boolean(ghostContentKey))
  const [postsErrored, setPostsErrored] = useState(false)

  useEffect(() => {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme

    if (typeof window !== 'undefined') {
      if (manual) {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme)
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY)
      }
    }
  }, [theme, manual])

  useEffect(() => {
    if (manual || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = (event) => {
      setThemeState({ theme: event.matches ? 'light' : 'dark', manual: false })
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [manual])

  useEffect(() => {
    if (!ghostContentKey) {
      setLoadingPosts(false)
      return
    }

    setLoadingPosts(true)
    setPostsErrored(false)
    let ignore = false
    const controller = new AbortController()

    async function loadPosts() {
      try {
        const url = new URL(ghostContentUrl || DEFAULT_GHOST_API_URL)
        url.searchParams.set('key', ghostContentKey)
        url.searchParams.set('limit', '3')
        url.searchParams.set('include', 'tags')
        url.searchParams.set('fields', 'title,url,excerpt,published_at')

        const response = await fetch(url, {
          headers: { Accept: 'application/json' },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`Ghost Content API error: ${response.status} ${response.statusText}`)
        }

        const payload = await response.json()
        const posts = Array.isArray(payload?.posts) ? payload.posts : []
        if (!posts.length) return

        const mapped = posts
          .map((post) => ({
            title: post?.title ?? '',
            url: post?.url ?? '',
            date: formatDate(post?.published_at),
            isoDate: post?.published_at ?? '',
            description: post?.excerpt ?? '',
            tags: normaliseTags(post?.tags),
          }))
          .filter((post) => post.title && post.url)
          .sort((a, b) => {
            if (!a.isoDate) return 1
            if (!b.isoDate) return -1
            return new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
          })

        if (!ignore && mapped.length) {
          setBlogPosts(mapped)
          setPostsErrored(false)
        }
      } catch (error) {
        if (error.name === 'AbortError') return
        if (!ignore) {
          setPostsErrored(true)
        }
        console.warn('[App] Failed to fetch Ghost posts; showing empty list.', error)
      } finally {
        if (!ignore) {
          setLoadingPosts(false)
        }
      }
    }

    loadPosts()
    return () => {
      ignore = true
      controller.abort()
    }
  }, [ghostContentKey, ghostContentUrl])

  const toggleTheme = () => {
    setThemeState({ theme: nextTheme, manual: true })
  }

  const commitInfo = useMemo(() => {
    if (!version) return null
    const parts = version.split('+')
    const sha = parts[1]
    if (!sha) return null
    return {
      sha,
      url: `https://github.com/goodmeow/landing/commit/${sha}`,
    }
  }, [version])

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">
            goodmeow&apos;s blog
          </a>
          <nav className="nav" aria-label="Primary">
            <Button
              isIconOnly
              variant="bordered"
              size="sm"
              radius="full"
              className="theme-toggle"
              aria-label={`Switch to ${nextTheme} mode`}
              onPress={toggleTheme}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <a href="#blog">Blog</a>
            <a href="#about">About</a>
            <Button as="a" href="#contact" size="sm" color="primary" radius="lg">
              Contact
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="container">
            <h1>Longlife Learner, Developer, & Writer</h1>
            <p className="lead">
              I build useful things on the daily basis and write about tech, productivity, and what I learn along the way.
            </p>
            <div className="cta">
              <Button as="a" href="#blog" color="primary" size="md" radius="lg">
                Read the Blog
              </Button>
            </div>
          </div>
        </section>

        <section id="blog" className="section">
          <div className="container">
            <div className="section-head">
              <h2>Latest Writing</h2>
              <a href="https://blog.goodmeow.my.id/" className="see-all">
                View all posts →
              </a>
            </div>
            <div className="grid cards">
              {blogPosts.map((post) => (
                <Card key={post.url} as="article" className="blog-card" radius="lg" shadow="sm" isPressable>
                  <CardBody className="blog-card-body">
                    <a
                      className="blog-card-link"
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read ${post.title}`}
                    >
                      <h3>{post.title}</h3>
                      <p className="muted">
                        <time dateTime={post.isoDate ?? post.date}>{post.date}</time>
                      </p>
                      <p>{post.description}</p>
                      <div className="tags">
                        {post.tags.map((tag) => (
                          <Chip key={tag} size="sm" variant="flat" className="tag-chip" radius="full">
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </a>
                  </CardBody>
                </Card>
              ))}
            </div>
            {loadingPosts && (
              <p className="blog-status" role="status" aria-live="polite">
                Loading latest posts…
              </p>
            )}
            {!loadingPosts && blogPosts.length === 0 && (
              <p className="blog-status" role="status" aria-live="polite">
                {postsErrored ? 'Unable to load the latest posts right now.' : 'No recent posts published yet.'}{' '}
                <a href="https://blog.goodmeow.my.id/" target="_blank" rel="noopener noreferrer">
                  Visit the full blog
                </a>
                .
              </p>
            )}
          </div>
        </section>

        <section id="about" className="section">
          <div className="container">
            <Card className="about-card" radius="lg" shadow="sm" isBlurred>
              <CardHeader className="about-card-header">
                <a
                  className="avatar-link"
                  href="https://gravatar.com/3a273241dc4e42e7044c3fbc3ab24bf2"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Gravatar profile"
                >
                  <div className="avatar" aria-hidden="true" />
                </a>
                <Divider orientation="vertical" className="about-divider" />
                <div>
                  <h2>About</h2>
                </div>
              </CardHeader>
              <CardBody className="about-card-body">
                <p>
                  Experienced Data Analyst with 3+ years in data-driven decision-making, cross-functional project management, and stakeholder
                  collaboration. Passionate about leveraging Business Intelligence tools to solve challenges in market forecasting, supply chain
                  optimization, and operational risk mitigation.
                </p>
                <p>
                  Certified in AWS Cloud, SCRUM, and data visualization (Tableau, SQL), with a proven ability to deliver actionable insights for
                  strategic planning in dynamic industry.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>

        <section id="contact" className="section contact">
          <div className="container">
            <Card className="contact-panel" radius="2xl" shadow="lg" isBlurred>
              <CardBody className="contact-panel-body">
                <div className="contact-intro">
                  <h2>Let&apos;s catch up!</h2>
                  <p className="contact-lead">
                    This is where you can find me to work with.
                  </p>
                  <div className="contact-actions">
                    <Button
                      as="a"
                      href="mailto:aarunalr@pm.me"
                      variant="bordered"
                      size="lg"
                      radius="full"
                      startContent={<ProtonMailIcon className="contact-button-icon" />}
                      className="contact-button"
                    >
                      Email me
                    </Button>
                    <Button
                      as="a"
                      href="https://github.com/goodmeow"
                      variant="bordered"
                      size="lg"
                      radius="full"
                      startContent={<GithubIcon className="contact-button-icon" />}
                      className="contact-button"
                    >
                      GitHub
                    </Button>
                    <Button
                      as="a"
                      href="https://www.credly.com/users/harun-al-rasyid.244a3d00"
                      variant="bordered"
                      size="lg"
                      radius="full"
                      startContent={<CredlyIcon className="contact-button-icon credly-icon" />}
                      className="contact-button"
                    >
                      Credly
                    </Button>
                    <Button
                      as="a"
                      href="https://www.linkedin.com/in/aarunalr"
                      variant="bordered"
                      size="lg"
                      radius="full"
                      startContent={<LinkedinIcon className="contact-button-icon" />}
                      className="contact-button"
                    >
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p className="muted license">
            <a
              className="license-badge"
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              rel="license noopener noreferrer"
              target="_blank"
              aria-label="Content licensed under CC BY-SA 4.0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" />
                <path d="M9.5 10.25a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0zm5.5 0a1.75 1.75 0 103.5 0 1.75 1.75 0 10-3.5 0z" />
                <path d="M7 15.25c.9-1.2 2.5-2 5-2s4.1.8 5 2" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              CC BY‑SA 4.0
            </a>
            · v
            {commitInfo ? (
              <a
                href={commitInfo.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View commit ${commitInfo.sha} on GitHub`}
              >
                {version}
              </a>
            ) : (
              <span>{version}</span>
            )}
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
