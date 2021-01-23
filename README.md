# Bot-Ross-server
Bot Ross is my very own virtual assistant. What started as a Discord client to turn off my lights was turned into a viral assistant written to help me with daily tasks such as keeping up with projects, scheduling and general organization.

This is the repository for my Bot Ross project, it contains the back-end logic and uses the brand spanking new programming language Deno, which means it's written in TypeScript. It also makes use of third party Deno packages.

## Developing the package

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

Deno automaticly downloads the dependencies, so the only thing you need to get started is [install Deno](https://deno.land/manual/getting_started/installation) and install [Denon](https://deno.land/x/denon@2.4.5) if you wanna make use of hot reloading:

```bash
deno install -qAf --unstable https://deno.land/x/denon@2.4.4/denon.ts
```

Then you can finish the Denon install by following the instructions from the terminal!

### Compiling

#### Execute

```bash
deno run index.ts
```

#### Hot-reload

```bash
denon run index.ts
```

#### Lint files

```bash
deno lint --unstable
```

#### Testing

```bash
deno test
```

## Console emojis
- ⚠️ General error
- ⌛ General awaiting
- ℹ️ General information
- 🙌 General success
- 🔐 General permission missing

## Deployment

The code will be deployed every at every version release, every commit will be linted and tested with the help of GitHub Actions

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
