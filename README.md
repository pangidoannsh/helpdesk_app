## Ticketing System Helpdesk IT (Frontend)
program frontend ini dikembangkan dengan menggunakan framewortk NextJs yang merupakan framework untuk library ReactJs

## Getting Started
clone atau download folder project ini lalu, ketikkan pada terminal

```bash
yarn
```
untuk melakukan instalasi package atau dependency pada aplikasi frontend ini.

# Run pada mode development
```bash
yarn dev
```

# Run pada mode production
```bash
yarn build
# setelah itu
yarn start
```

# Konfigurasi
secara default, aplikasi frontend ini menggunakan API dengan base url http://localhost:3001, untuk dapat mengubah base url API nya dapat dilakukan pada file 
baseUrl.ts yang ada pada direktori /src/config


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
