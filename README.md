# Ticketing System Helpdesk IT (Frontend)
program frontend ini dikembangkan dengan menggunakan framewortk NextJs yang merupakan framework untuk library ReactJs

## Getting Started
clone atau download folder project ini lalu, ketikkan pada terminal

```bash
yarn
```
untuk melakukan instalasi package atau dependency pada aplikasi frontend ini.

### Run pada mode development
```bash
yarn dev
```

### Run pada mode production
```bash
yarn build
```
command diatas merupakan command untuk melakukan build pada aplikasi frontend ini, setelahnya dapat menjalankan aplikasi dengan 
```bash
yarn start
```

### Konfigurasi
secara default, aplikasi frontend ini menggunakan API dengan base url http://localhost:3001, untuk dapat mengubah base url API nya dapat dilakukan pada file direktori `/src/config/baseUrl.ts`

![Screenshot_30](https://user-images.githubusercontent.com/74215225/250711336-a3559218-a8b3-47ab-b13d-6f2551b5836a.png)

Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat hasil aplikasi.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
