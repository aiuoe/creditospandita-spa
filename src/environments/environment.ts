// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
      apiUrl: 'http://localhost/creditospandaAdmin/backend/public/api',
      webUrl: 'http://localhost:4200',
      apiBase: 'http://localhost/creditospandaAdmin/backend',
    // apiUrl: 'https://www.creditospanda.com/admin/backend/public/api',
    // webUrl: 'https://www.creditospanda.com',
    // apiBase: 'https://www.creditospanda.com/admin/backend',
    serviceWorker: false,
    firebaseConfig : {
      apiKey: "AIzaSyAEM0RujpZZUeE4Y2TdrmDfJYQ_uDcIuL4",
      authDomain: "creditos-panda.firebaseapp.com",
      projectId: "creditos-panda",
      storageBucket: "creditos-panda.appspot.com",
      messagingSenderId: "707531743803",
      appId: "1:707531743803:web:f02e9c260416061d7bf21e"
    }
};
