## Getting Started

First, install dependencies:

```bash
npm install
```

Add the file `.env.local` in this directory
and set the variables:

```
NEXT_PUBLIC_ENABLE_TESTNETS="true"
NEXT_PUBLIC_MORALIS_API_KEY="yourapikey"
NEXT_PUBLIC_ALCHEMY_API_KEY="yourapikey"
NEXT_PUBLIC_DB_USERNAME_TABLE="projectname"
NEXT_PUBLIC_URL="http://localhost:3000"
SUPABASE_SERVICE_API_KEY="key"
DATABASE_URL="url"
SESSION_KEY="min-32-char-password"
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

To build, run:

```bash
npm run build
```


# Database Schema
'username'

| name                   | type    |
|------------------------|---------|
| username               | varchar |
| address  (primary key) | varchar |

'hidden'
| name             | type    |
|------------------|---------|
| id (primary key) | int8    |
| address          | varchar |
| nftAddress       | varchar |
| nftId            | varchar |

*note `nftId` needs to be varchar to accomodate tokens that use non numerical ids or Big Numbers 