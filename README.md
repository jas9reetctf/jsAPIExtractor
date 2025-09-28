# Multi-Framework API Extractor

This tool extracts API endpoints from Node.js projects that use **Express**, **NestJS**, or **Next.js**. It generates a JSON output in the console and automatically saves a CSV file under the `output/` folder with the project folder name.

---

## Features

* Detects framework per file: Express, NestJS, or Next.js
* Extracts routes with method, path, and file location
* Automatically generates a CSV file: `output/<project-folder-name>.csv`
* Counts total APIs found
* Supports `pages` and `app` routers for Next.js
* Clears module cache to always use latest analyzer code

---

## Installation

1. Clone this repository or copy files into a folder.
2. Navigate to the folder:

```bash
cd multi_framework_api_extractor
```

3. Install dependencies:

```bash
npm init -y
npm install @babel/parser @babel/traverse
```

---

## Folder Structure

```
multi_framework_api_extractor/
├── extract-apis.js
├── frameworkDetector.js
├── analyzers/
│   ├── express.js
│   ├── nestjs.js
│   └── nextjs.js
└── output/ (generated automatically)
```

* `extract-apis.js`: main script to run
* `frameworkDetector.js`: detects framework per file
* `analyzers/`: framework-specific endpoint extractors
* `output/`: stores generated CSV files

---

## Usage

### Extract APIs from a project

```bash
node extract-apis.js <project-path>
```

Example:

```bash
node extract-apis.js /home/app/tuprt-main
```

* JSON output is printed in console
* Total APIs found is shown
* CSV file is created automatically at:

```
output/tuprt-main.csv
```

### Output CSV format

| framework | method | path        | file                            |
| --------- | ------ | ----------- | ------------------------------- |
| express   | GET    | /users      | /path/to/routes/users.js        |
| nestjs    | POST   | /auth/login | /path/to/auth.controller.ts     |
| nextjs    | ANY    | /api/posts  | /path/to/app/api/posts/route.ts |

* `framework`: Detected framework
* `method`: HTTP method (`ANY` for Next.js routes)
* `path`: API route path
* `file`: Source file location

---

## Notes

* The script automatically clears Node module cache to always load the latest analyzer code.
* For Express and NestJS, base prefixes from `app.use('/prefix', ...)` or `app.setGlobalPrefix()` can be added manually in future enhancements.
* Next.js routes are derived from file structure (`pages/api` or `app/api`), not code parsing.

---

## License

MIT License
