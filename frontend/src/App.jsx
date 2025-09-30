import { useEffect, useMemo, useState } from 'react'
import { Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

const latestPosts = [
  {
    title: 'Coming soon',
    url: 'https://blog.goodmeow.my.id/coming-soon/',
    date: 'Sep 09, 2025',
    description:
      "This is Notebook, a brand new site by Harun Al Rasyid that's just getting started. Things will be up and running here shortly, but you can subscribe in the meantime if you'd like…",
    tags: ['News'],
  },
]

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
  <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" {...props}>
    <g transform="translate(3 3) scale(0.9)">
      <path
        fill="currentColor"
        d="m33.77 27.04c-.71-.5-1.68-.32-2.18.39-2.14 2.96-5.22 5.57-9.58 5.57s-4.62-7.88-2-13c1.61-3.14 3.87-5.73 5.84-5.72 1.39 0 2.18 1.26 1.8 2.6-.46 1.63-.51 2.72-.51 2.81-.04.96.71 1.77 1.68 1.8.02 0 .04.01.07.01.93 0 1.7-.74 1.74-1.68 0-.03.18-3.31 2.78-6.77.63-.84.39-2.07-.57-2.59-.77-.42-1.75-.14-2.27.56-.15.2-.29.39-.42.59-.14.2-.4.27-.62.17-7.7-3.47-12.07 3.86-13.51 7.23-3 7-3 18 5.62 18 7.22 0 10.63-4.75 12.6-7.79.46-.71.27-1.66-.42-2.14-.01 0-.02-.02-.03-.02Z"
      />
    </g>
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
              disableRipple
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
            <h1>Developer, Writer, Lifelong Learner.</h1>
            <p className="lead">
              I build useful things on the web and write about engineering, productivity, and what I learn along the way.
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
              {latestPosts.map((post) => (
                <Card key={post.url} as="article" className="blog-card" radius="lg" shadow="sm" isPressable>
                  <CardBody className="blog-card-body">
                    <h3>
                      <a href={post.url} rel="noopener noreferrer">
                        {post.title}
                      </a>
                    </h3>
                    <p className="muted">{post.date}</p>
                    <p>{post.description}</p>
                    <div className="tags">
                      {post.tags.map((tag) => (
                        <Chip key={tag} size="sm" variant="flat" className="tag-chip" radius="full">
                          {tag}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
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
                  <h2>Let&apos;s make the web prettier.</h2>
                  <p className="contact-lead">
                    Experience thoughtful data storytelling, modern dashboards, and robust engineering. Bring your idea and I&apos;ll help shape it into
                    something people will love to use.
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
