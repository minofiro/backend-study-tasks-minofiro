# General Information
This template repository is designed for a study conducted as part of a bachelor's thesis. Other than that, it has no practical use.

## Einleitung

Willkommen und vielen Dank für deine Unterstützung bei meiner Bachelorarbeits-Studie! 

Dieses Repository dient als vorbereiteter Startpunkt (Boilerplate) für die anstehenden Programmieraufgaben. Es enthält ein fertig konfiguriertes Angular-Frontend, ein vorbereitetes Node.js-Backend sowie zugehörige Testdokumente. Dein Fokus während der Studie wird hauptsächlich auf der Erweiterung des Backends liegen.

---

## 📋 Voraussetzungen

Bevor du loslegst, stelle bitte sicher, dass folgende Programme auf deinem System installiert/vorhanden sind:
* **Node.js** (inkl. npm) --> "node --version"
    --> **WICHTIG: Bitte zwingend eine stabile LTS-Version (z. B. v20.x oder v22.x) nutzen!** Ungerade Versionen (wie v21 oder v23) sind experimentell und können beim Starten des Angular-Frontends zu Fehlern führen.
* **Git** --> "git --version"
* Ein Code-Editor deiner Wahl (empfohlen: **Visual Studio Code**)
* Ein privater GitHub Account

---

## 🚀 Setup & Installation (Schritt-für-Schritt)

Da dieses Projekt als Template eingerichtet ist, musst du es zunächst für dich duplizieren und anschließend lokal einrichten.

### 1. Repository vorbereiten
1. Klicke oben rechts auf der GitHub-Webseite auf den grünen Button **"Use this template"** und wähle **"Create a new repository"**.
2. Gib dem Projekt einen Namen (z.B. `backend-study-tasks-[DeinName]`) und erstelle das Repository auf deinem eigenen GitHub-Account.

Damit ich deine Bearbeitung am Ende der Studie ausgewertet werden kann, muss ich Zugriff auf deinen geschriebenen Code haben. Du hast dafür zwei Möglichkeiten:

**Option 1: Öffentliches Repository (Empfohlen & am einfachsten)**
Belasse dein dupliziertes Repository beim Erstellen auf **Public**. Am Ende der Bearbeitungszeit musst du mir lediglich den Link zu deinem GitHub-Repository zukommen lassen.

**Option 2: Privates Repository**
Falls du deinen Code lieber privat halten möchtest, stelle das Repository auf **Private**. In diesem Fall musst du mich zwingend als Collaborator einladen, damit ich den Code lesen kann:
1. Gehe in deinem Repository auf **Settings -> Collaborators**.
2. Klicke auf **Add people**.
3. Suche nach meinem GitHub-Namen: **sebfro13** und füge mich hinzu.
4. Schicke mir am Ende der Studie den Link zu deinem Repository.


### 2. Projekt lokal klonen
Öffne dein Terminal und klone **dein soeben erstelltes** Repository auf deinen Rechner:
(Stelle sicher, dass du in dem Verzeichnis bist wohin es gespeichert werden soll)

```bash
git clone https://github.com/[DEIN_GITHUB_NAME]/[DEIN_REPO_NAME].git
cd [DEIN_REPO_NAME]
```

### 3. Abhängigkeiten installieren
Das Projekt ist in Frontend und Backend unterteilt. Du musst für beide Bereiche einmalig die Pakete installieren.

**Für das Backend:**
```bash
cd CodeTasks/backend
npm install
```

**Für das Frontend:**
```bash
cd ../frontend
npm install
```

---

## 📁 Projektstruktur
Das Repository ist wie folgt aufgebaut:
```text
📦 BACHELORTASK
 ┣ 📂 CodeTasks
 ┃ ┣ 📂 backend       # Node.js Arbeitsverzeichnis für deine Aufgaben
 ┃ ┗ 📂 frontend      # Fertig konfiguriertes Angular-Frontend
 ┗ 📂 TestDocuments   # PDF-Mockdaten (Gutachten, Schadensbilder etc.) für die Tests in UserStory2
```

---

## 💻 Anwendung starten
Um die Applikation vollständig zu nutzen, müssen Frontend und Backend parallel laufen. Öffne dafür am besten zwei separate Terminals in deinem Editor.

**Terminal 1 (Backend starten):**
```bash
cd CodeTasks/backend
npm run build  # (Nur beim ersten mal oder nach Änderungen notwendig)
npm start      # (Oder der entsprechende Start-Befehl für die Tasks)
```

**Terminal 2 (Frontend starten):**
```bash
cd CodeTasks/frontend
npm run build  # (Nur beim ersten mal oder nach Änderungen notwendig)
npm start
```

Sobald das Frontend geladen ist, ist die Anwendung unter `http://localhost:4200` im Browser erreichbar.

---

## 📝 Hinweise zur Bearbeitung

* Alle genauen Instruktionen zu den Aufgaben erhältst du separat von mir zum Zeitpunkt der Druchführung.
* Bitte committe deine Änderungen regelmäßig in dein eigenes Repository. (mindestens nach Abschluss jeder UserStory mit -m "AI_Used" oder eben "No_AI_Used")

```