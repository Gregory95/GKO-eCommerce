// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  loginUrl: 'https://localhost:4200',
  baseUrl: 'https://localhost:7071/api',
  authUrl: 'https://localhost:7071/token',
  url: 'https://localhost:7071'
};