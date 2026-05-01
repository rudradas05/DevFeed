import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const starterPosts = [
  {
    id: "post-1",
    author: "Maya Chen",
    role: "Frontend Engineer",
    time: "12 min ago",
    body: "Refactored an auth screen today and replaced a pile of one-off utility classes with named UI states. The review diff is finally readable.",
    tags: ["React", "UI"],
    reactions: 18,
    comments: 4,
  },
  {
    id: "post-2",
    author: "Arjun Mehta",
    role: "Full-stack Developer",
    time: "38 min ago",
    body: "Shipping notes: cookie auth, protected routes, and cleaner empty states are all in place. Next step is persistence for feed posts.",
    tags: ["Node", "Auth"],
    reactions: 24,
    comments: 7,
  },
];

const trendingTags = ["React", "Auth", "API", "Design Systems"];

const getInitial = (value) => value?.slice(0, 1).toUpperCase() || "D";

const Home = () => {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [posts, setPosts] = useState(starterPosts);

  const displayName =
    user?.username || user?.email?.split("@")[0] || "Developer";
  const stats = useMemo(
    () => [
      { label: "Posts", value: posts.length },
      { label: "Tags", value: trendingTags.length },
      { label: "Status", value: "Live" },
    ],
    [posts.length],
  );

  const handlePostSubmit = (event) => {
    event.preventDefault();
    const body = draft.trim();

    if (!body) return;

    setPosts((currentPosts) => [
      {
        id: `post-${Date.now()}`,
        author: displayName,
        role: "Your update",
        time: "Just now",
        body,
        tags: ["Update"],
        reactions: 0,
        comments: 0,
      },
      ...currentPosts,
    ]);
    setDraft("");
  };

  return (
    <main className="home-page">
      <div className="home-shell">
        <div className="feed-layout">
          <section className="feed-main" aria-label="Developer feed">
            <header className="hero-panel">
              <div>
                <p className="section-kicker">DevFeed community</p>
                <h1>Welcome back, {displayName}</h1>
                <p>
                  Share progress, ask focused questions, and keep a clean log of
                  what you are building.
                </p>
              </div>
              <div className="hero-stats" aria-label="Feed summary">
                {stats.map((item) => (
                  <div className="hero-stat" key={item.label}>
                    <span>{item.value}</span>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </header>

            <form className="composer-panel" onSubmit={handlePostSubmit}>
              <div className="composer-header">
                <span className="avatar">{getInitial(displayName)}</span>
                <div>
                  <h2>Post an update</h2>
                  <p>Keep it specific, useful, and easy to scan.</p>
                </div>
              </div>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                className="form-input composer-input"
                placeholder="What did you build, fix, or learn today?"
                rows={4}
              />

              <div className="composer-actions">
                <div className="topic-strip" aria-label="Suggested topics">
                  {trendingTags.slice(0, 3).map((tag) => (
                    <span className="topic-pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!draft.trim()}
                >
                  Post update
                </button>
              </div>
            </form>

            <div className="post-list">
              {posts.map((post) => (
                <article className="post-card" key={post.id}>
                  <header className="post-header">
                    <span className="avatar">{getInitial(post.author)}</span>
                    <div className="post-meta">
                      <h2>{post.author}</h2>
                      <p>
                        {post.role} / {post.time}
                      </p>
                    </div>
                  </header>

                  <p className="post-content">{post.body}</p>

                  <div className="post-tags">
                    {post.tags.map((tag) => (
                      <span className="topic-pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <footer className="post-actions">
                    <button type="button" className="post-action">
                      Like <span>{post.reactions}</span>
                    </button>
                    <button type="button" className="post-action">
                      Comment <span>{post.comments}</span>
                    </button>
                    <button type="button" className="post-action">
                      Share
                    </button>
                  </footer>
                </article>
              ))}
            </div>
          </section>

          <aside className="sidebar" aria-label="Feed details">
            <section className="side-panel">
              <h2>Daily Focus</h2>
              <ul className="focus-list">
                <li>Review auth flow</li>
                <li>Write one build note</li>
                <li>Answer a community question</li>
              </ul>
            </section>

            <section className="side-panel">
              <h2>Trending Tags</h2>
              <div className="tag-grid">
                {trendingTags.map((tag) => (
                  <button type="button" className="tag-button" key={tag}>
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="side-panel pulse-panel">
              <h2>Community Pulse</h2>
              <div className="pulse-row">
                <span>New updates</span>
                <strong>{posts.length}</strong>
              </div>
              <div className="pulse-row">
                <span>Active thread</span>
                <strong>Auth UX</strong>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Home;
