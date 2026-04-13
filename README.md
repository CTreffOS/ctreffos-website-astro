# Chaostreff Website Astro

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## 🐳 Development in Devcontainer

When running the development server in a devcontainer, you need to bind to all interfaces to access the page from outside the container:

```bash
pnpm dev --host 0.0.0.0
```

## 👀 Want to learn more?

Feel free to check [the documentation](https://docs.astro.build)
