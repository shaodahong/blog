const { promises: fs } = require("fs");
const path = require("path");
const RSS = require("rss");
const matter = require("gray-matter");
const fg = require("fast-glob");

// @TODO: for now let's generate with all posts, unsorted
async function generate() {
  const feed = new RSS({
    title: "Bie Wen",
    site_url: "https://biewen.me",
    feed_url: "https://biewen.me/feed.xml",
  });

  const posts = await fg([
    path.join(__dirname, "..", "pages/posts", "*", "*.md"),
    path.join(__dirname, "..", "pages/posts", "*", "*.mdx"),
  ]);

  const feeds = await Promise.all(
    posts.map(async (postName) => {
      const lastSlashIndex = postName.lastIndexOf("/");
      const name = postName.substring(lastSlashIndex + 1);

      if (name.startsWith("index.")) return;

      const content = await fs.readFile(postName);

      const a = content.toString();

      const frontmatter = matter(content);

      return {
        title: frontmatter.data.title,
        url: "/posts/" + name.replace(/\.mdx?/, ""),
        date: frontmatter.data.date,
        description: frontmatter.data.description,
        categories: frontmatter.data.tag?.split(", ") ?? "",
        author: frontmatter.data.author,
      };
    })
  );

  feeds
    .filter(Boolean)
    .sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
    .forEach((feedItem) => {
      feed.item(feedItem);
    });

  await fs.writeFile("./public/feed.xml", feed.xml({ indent: true }));
}

generate();
