# Account Atlas

A responsive Actify-style CRM account directory built to match the supplied assignment PDF. It starts with 60 realistic demo accounts and keeps changes in a Redux Toolkit store for the current session.

## Features

- Global search across account name, email, phone, website, industry, status, and remark.
- Status filtering, case-insensitive sortable columns, and 10-record pagination.
- Validated add and edit account form, plus confirmed deletion.
- Excel `.xlsx` export of all matching results, with table sorting applied.
- Empty states, inline validation, success feedback, and a responsive horizontally scrollable table.

## Technologies

React 19, Vite, Redux Toolkit, React Redux, React Hook Form, SheetJS (`xlsx`), Lucide icons, Vitest, and plain CSS.

## Requirements and commands

Use Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
npm run build
npm test
```

Vite prints the local development URL after `npm run dev` starts. `npm run preview` serves the production build locally.

## Using the directory

- Type into **Search accounts** to search the complete dataset; choose **Filter** to narrow by account status. Use **Clear all** or the search clear icon to reset.
- Select a column heading to sort it; select it again to reverse the order.
- Use **Previous** and **Next** to move across 10-record pages.
- Select **Add account** to open the validated form. Row actions provide edit and delete.
- Select **Export** to download every account matching the active search and status filter, independent of the current page. An active sort is reflected in exported row order.

## Project structure

```text
src/
  app/store.js
  components/AccountForm.jsx
  data/dummyAccounts.js
  features/accounts/accountsSlice.js
  utils/accountData.js
  utils/accountData.test.js
  utils/exportToExcel.js
  App.jsx
  index.css
  main.jsx
```

## Screenshots

Desktop and mobile screenshots are included in `screenshots/desktop.png` and `screenshots/mobile.png`. They were captured from the running app in headless Chrome.

## GitHub preparation

This workspace did not contain a Git repository or remote when inspected. Initialize or clone the intended repository before pushing; no remote has been inferred or configured.
