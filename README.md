# launchpad

A web platform for managing and running Playwright tests.

## Usage

### Local Development

Clone the playwright repository into the `pw-project` directory and install its dependencies.

Then run with `pnpm`.

```sh
pnpm run dev
```

```sh
# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

### Docker

```sh
docker compose up
```

```sh
docker compose down
```

## Building

To create a production version of the app:

```sh
pnpm run build
```

You can preview the production build with `pnpm run preview`.
