<h1 align="center">📦 Vaults</h1>
<p align="center">
  <i>Your personal protocol. Architect your day, track your progress, and secure your focus without the friction of complex setups.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-Next.js_14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img src="https://img.shields.io/badge/Backend-Golang_Gin-00ADD8?style=for-the-badge&logo=go" />
  <img src="https://img.shields.io/badge/State-Local_Storage-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
</p>

---

## 📌 Project Overview & Intent

**Vaults** is a zero-friction, minimalist personal productivity dashboard designed as a streamlined alternative to over-complicated data-organizers. There are no canvas layouts to design, no nested blocks to configure, and no markdown syntaxes to memorize. It is built strictly for high-performance execution: you simply boot up the interface, activate your workspace, and trigger predefined structural routines with a single click.

Originally developed to orchestrate my daily engineering workflows, financial tracking, and deeply focused studying phases, this repository serves as a powerful standalone operational control unit.

---

## ⚡ The 4 Core Protocol Modes

* ⚡ **Flow State Workspace:** An immersive study/deep-work workspace equipped with an active countdown timer matrix and responsive geometric backdrop configurations (Grid, Noise, or Waves).
* 💼 **Developer Path:** A programmatic lifecycle scheduler built to instantly map out software engineering project scopes, active tech-stacks, and baseline release deadlines.
* 🗓️ **Weekly Routine Protocol:** A quick-click digital board tracking static daily habits, automated morning reviews, and weekly task synchronization lists.
* 💰 **Financial Assistant:** An integrated personal balance book handling transactional logging (Income vs Expenses) which channels telemetry vectors straight to a concurrent backend REST API engine.

---

## 📸 Interface Showroom

### 1. Unified Workspace Portal & Calibration Hub
*A premium terminal landing page featuring isolated grid patterns, ambient lighting glows, and fluid layout controls.*
<p align="center">
  <img src="public/vaults1.png" width="90%" alt="Vaults Landing Hub"/>
</p>
<p align="center">
  <img src="public/vaults8.png" width="90%" alt="Vaults Template Initializer"/>
</p>

### 2. Operational Dashboards & Routine Trackers
*Visual compilation showcasing the analytics engine charts, automated focus timers, task boards, and asset books.*
<table>
  <tr>
    <td align="center"><b>Analytics & Telemetry</b></td>
    <td align="center"><b>Bespoke Personal Settings</b></td>
  </tr>
  <tr>
    <td align="center"><img src="public/vaults2.png" width="100%" alt="Vaults Analytics"/></td>
    <td align="center"><img src="public/vaults3.png" width="100%" alt="Vaults Configuration"/></td>
  </tr>
  <tr>
    <td align="center"><b>Flow State Module</b></td>
    <td align="center"><b>Financial Ledger Engine</b></td>
  </tr>
  <tr>
    <td align="center"><img src="public/vaults4.png" width="100%" alt="Vaults Flow State"/></td>
    <td align="center"><img src="public/vaults5.png" width="100%" alt="Vaults Financial Log"/></td>
  </tr>
  <tr>
    <td align="center"><b>Developer Project Canvas</b></td>
    <td align="center"><b>Weekly Habits Registry</b></td>
  </tr>
  <tr>
    <td align="center"><img src="public/vaults6.png" width="100%" alt="Vaults Dev Track"/></td>
    <td align="center"><img src="public/vaults7.png" width="100%" alt="Vaults Weekly Board"/></td>
  </tr>
</table>

---

## 🚀 Local Development Setup

### Prerequisites
* Go 1.20+ Installed
* Node.js v18+ & npm

### Service Initialization Command
Follow these operational sequences to execute both the web-client deployment interface and the transaction storage endpoint core engine locally:

```bash
# 1. Fire up the concurrent Golang Gin server pipeline (Runs on port :8080)
cd backend
go mod download
go run main.go

# 2. Spin up the modern Next.js client environment (Runs on port :3000 in separate terminal)
cd frontend
npm install
npm run dev
