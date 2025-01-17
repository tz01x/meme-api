# Memes Api v2

<h1 align="center">
   <br>
    <img src="./public/images/icon.png" alt="Bob The Bot" width="200">
   <br>
   Memable API v2<br>
</h1>

<h4 align="center">
    Memable is a Meme Explorer website (im working on) and this is a prototype of the API i created for it. It is powered by Rddit!
</h4>

<h4 align="center">
<img src="./public/images/Reddit-Logo.png" alt="Bob The Bot" width="200">
</h4>

<hr>

## Table of content

-   [Usage](#usage)
-   [Endpoints](#endpoints)
-   [Deploy](#deploy)
-   [Support](#show-your-support)

<br>

## Usage

### Clone the repo

```bat
git clone https://github.com/tz01x/meme-api
```

#### Install dependencies

```bat
npm install
```

### Run the server

```bat
npm start
```

<br>

## Endpoints

### `/memes`

```
/memes?subreddits=<subreddit1>,<subreddit>:<last_post_id>&filter=<filter>&max=<max>
```
### `/memes/random`

```
/memes/random
or
/memes/random?subreddits=<subreddit1>,<subreddit>:<last_post_id>&filter=<filter>&max=<max>
```
| Parameter  | Description                                                                               | Example                                               |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| subreddits | Comma separated list of subreddits. Use colon to separate if you need to set last post id | subreddits=wholesomememes:`lastIdLOL`,memes,dankmemes |
| filter     | Add filter (`hot`\|`top`\|`new`\|`controversial` \| `raising`)                            | filter=hot                                            |
| max        | Maximum number of memes from each subreddit. Doesn't mean the exact count.                | max=50                                                |
| time     | Add timestamp (`hour`\| `day`\| `week`\| `month` \| `year`\| `all`)                            | time=day 
| author        | fetch full author details about the post (default is author username)                | auther=all                                                |


#### Example request & response

```bat
/memes?subreddits=memes,dankmemes:uc569x,wholesomememes&filter=hot&max=69
````

<a href="./example-response.json">

| Example response |
| ---------------- |

</a>
<br>

## Deploy

You can deploy this to either Vercel or Railway or any other hosting service.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftz01x%2Fmeme-api&project-name=memeable-api&repo-name=meme-api-repo)

