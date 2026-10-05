# SadiyaSamreen — GitHub Pages article website

An editorial journal and private admin editor for officelife.space. No build tools required. Publishing an article writes to Supabase; visitors see it when opening or refreshing the journal. No GitHub edit or redeployment is needed for articles.

## One-time setup (required before live publishing)

1. Create a Supabase project at https://supabase.com. In Authentication → Users, create your single admin user with an email and a strong password. Confirm that user. Copy its UUID. Disable new user signups in Authentication settings. The username can be `admin`; the password you choose is stored securely by Supabase, never in website files.
2. Open `setup.sql`, replace BOTH zero UUIDs with that admin user's UUID, and run it once in Supabase's SQL Editor. This creates the articles table and enforces permissions in the database. Only that exact account can read drafts or change articles.
3. Edit `config.js`: paste the project URL and its PUBLIC publishable key (or legacy anon key), plus the admin email and UUID. Set the username you want. These values are public identifiers, not credentials. Never paste your password, secret key, or service_role key here.
4. Back up your existing GitHub website. Upload the contents of this folder to the root of its Pages publishing branch, replacing the old website files. Include `.nojekyll` and `CNAME`. Keep unrelated repository files. No npm install or build is required.
5. In GitHub Settings → Pages, choose Deploy from a branch, your branch, and `/ (root)`. Set the custom domain to `officelife.space` and enable HTTPS. Since you already host this domain on GitHub, retain its working DNS configuration. See GitHub's custom-domain guide if changing repositories: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
6. Visit `https://officelife.space/admin.html`, sign in with your chosen username and password, and publish your first article.

## Publishing

Click New article, enter its title, category, author, introduction and text. A cover image is optional: paste an HTTPS image URL from an image host you control. This version supports image links, not file uploads. Blank lines make paragraphs; `## ` at the beginning of a paragraph makes a section heading. Click Save draft or Publish article. Select an existing article to edit, unpublish by saving as draft, or delete it.

## Preview

Before configuration, the journal shows three clearly labeled sample articles. They are preview-only, not stored in your database. After configuration, it shows only your actual published articles. Run any static HTTP server from this folder to preview; ES modules require HTTP, so do not double-click the HTML file. For example, with Node and an available static-server package: `npx serve .`.

## Launch check

- Signed-out visitors see published articles and cannot see drafts.
- The configured admin can create, edit, publish, unpublish, and delete.
- A newly published article appears in a separate browser after refreshing.
- Wrong passwords fail. Other Supabase users cannot write or read drafts.
- Check mobile layout and HTTPS on your custom domain.

The files are ready to upload, but live authentication and database behavior require the setup above and must be tested against your actual project. Supabase is a separate service with its own plan limits. The site imports its pinned Supabase client from esm.sh and uses Google Fonts; the text has system-font fallbacks. Keep database backups. Public article links use `index.html?article=UUID`, which works on GitHub Pages without rewrite rules; article content is rendered in the browser, so search-engine indexing and article-specific social previews are limited.

Technical references: https://docs.github.com/en/pages and https://supabase.com/docs/guides/database/postgres/row-level-security and https://supabase.com/docs/reference/javascript/auth-signinwithpassword
