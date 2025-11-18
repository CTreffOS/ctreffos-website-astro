# Chaostreff Website Astro

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `yarn`                 | Installs dependencies                            |
| `yarn dev`             | Starts local dev server at `localhost:4321`      |
| `yarn build`           | Build your production site to `./dist/`          |
| `yarn preview`         | Preview your build locally, before deploying     |
| `yarn astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `yarn astro -- --help` | Get help using the Astro CLI                     |

## 🐳 Development in Devcontainer

When running the development server in a devcontainer, you need to bind to all interfaces to access the page from outside the container:

```bash
yarn dev --host 0.0.0.0
```

## 👀 Want to learn more?

Feel free to check [the documentation](https://docs.astro.build)
