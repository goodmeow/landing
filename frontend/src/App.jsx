import { useEffect, useState } from 'react'
import { Button } from '@heroui/react'

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

function App() {
  const version = useBuildVersion()

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top">
            goodmeow&apos;s blog
          </a>
          <nav className="nav" aria-label="Primary">
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
                <article className="card" key={post.url}>
                  <div className="card-body">
                    <h3>
                      <a href={post.url} rel="noopener noreferrer">
                        {post.title}
                      </a>
                    </h3>
                    <p className="muted">{post.date}</p>
                    <p>{post.description}</p>
                    <div className="tags">
                      {post.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container about">
            <a
              className="avatar-link"
              href="https://gravatar.com/3a273241dc4e42e7044c3fbc3ab24bf2"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Gravatar profile"
            >
              <div className="avatar" aria-hidden="true" />
            </a>
            <div>
              <h2>About</h2>
              <p>
                Experienced Data Analyst with 3+ years in data-driven decision-making, cross-functional project management, and stakeholder
                collaboration. Passionate about leveraging Business Intelligence tools to solve challenges in market forecasting, supply chain
                optimization, and operational risk mitigation.
              </p>
              <p>
                Certified in AWS Cloud, SCRUM, and data visualization (Tableau, SQL), with a proven ability to deliver actionable insights for
                strategic planning in dynamic industry.
              </p>
            </div>
          </div>
        </section>

        <section id="contact" className="section alt">
          <div className="container">
            <h2>Get in touch</h2>
            <p className="lead">Have a project or a question? I’d love to hear from you.</p>
            <div className="cta">
              <Button as="a" href="mailto:aarunalr@pm.me" color="primary" radius="lg">
                Email me
              </Button>
              <Button as="a" href="https://www.linkedin.com/in/aarunalr" variant="bordered" radius="lg">
                LinkedIn
              </Button>
              <Button as="a" href="https://github.com/goodmeow" variant="bordered" radius="lg">
                GitHub
              </Button>
            </div>
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
            · v<span>{version}</span>
          </p>
        </div>
      </footer>
    </>
  )
}

export default App
