#!/usr/bin/env node

/**
 * ADR Management Tool
 * Verwaltet Architectural Decision Records
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const adrDir = path.join(projectRoot, 'docs', 'adr');

// Farben für Console Output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

class ADRManager {
  constructor() {
    this.ensureADRDir();
  }

  ensureADRDir() {
    if (!fs.existsSync(adrDir)) {
      fs.mkdirSync(adrDir, { recursive: true });
      this.log('📁 ADR-Verzeichnis erstellt', 'green');
    }
  }

  log(message, color = 'white') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  // Neue ADR erstellen
  createADR(title) {
    if (!title) {
      this.log('❌ Titel erforderlich: npm run adr:create "My Decision"', 'red');
      return;
    }

    const number = this.getNextNumber();
    const slug = this.titleToSlug(title);
    const filename = `${number.toString().padStart(4, '0')}-${slug}.md`;
    const filepath = path.join(adrDir, filename);

    if (fs.existsSync(filepath)) {
      this.log(`❌ ADR ${filename} existiert bereits`, 'red');
      return;
    }

    const content = this.generateADRContent(number, title);
    fs.writeFileSync(filepath, content);

    this.log(`✅ ADR erstellt: ${filename}`, 'green');
    this.updateIndex();
    
    // Optional: Öffne in Editor
    try {
      execSync(`code "${filepath}"`, { stdio: 'ignore' });
      this.log('📝 ADR in VS Code geöffnet', 'cyan');
    } catch (error) {
      this.log('💡 Öffne die Datei manuell zum Bearbeiten', 'yellow');
    }
  }

  // ADRs auflisten
  listADRs() {
    const adrs = this.getAllADRs();
    
    if (adrs.length === 0) {
      this.log('📋 Keine ADRs gefunden', 'yellow');
      return;
    }

    this.log('\n📋 Architectural Decision Records:', 'cyan');
    this.log('=' .repeat(60), 'cyan');

    adrs.forEach(adr => {
      const statusColor = this.getStatusColor(adr.status);
      this.log(
        `${adr.number}. ${adr.title} [${adr.status}]`, 
        statusColor
      );
      this.log(`   📅 ${adr.date} | 📁 ${adr.filename}`, 'white');
    });

    this.log('\n📊 Statistiken:', 'magenta');
    this.printStatistics(adrs);
  }

  // ADR-Status aktualisieren
  updateStatus(number, newStatus) {
    const validStatuses = ['Proposed', 'Accepted', 'Deprecated', 'Superseded'];
    
    if (!validStatuses.includes(newStatus)) {
      this.log(`❌ Ungültiger Status. Gültig: ${validStatuses.join(', ')}`, 'red');
      return;
    }

    const adr = this.findADRByNumber(number);
    if (!adr) {
      this.log(`❌ ADR ${number} nicht gefunden`, 'red');
      return;
    }

    const filepath = path.join(adrDir, adr.filename);
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Status in der Datei aktualisieren
    content = content.replace(
      /\*\*Status:\*\* \[.*?\]/,
      `**Status:** ${newStatus}`
    );

    fs.writeFileSync(filepath, content);
    this.log(`✅ Status von ADR ${number} auf "${newStatus}" geändert`, 'green');
    this.updateIndex();
  }

  // ADR validieren
  validateADRs() {
    const adrs = this.getAllADRs();
    const issues = [];

    this.log('\n🔍 Validiere ADRs...', 'cyan');

    adrs.forEach(adr => {
      // Prüfe Dateiformat
      if (!adr.filename.match(/^\d{4}-[\w-]+\.md$/)) {
        issues.push(`❌ ${adr.filename}: Ungültiges Dateiformat`);
      }

      // Prüfe Status
      const validStatuses = ['Proposed', 'Accepted', 'Deprecated', 'Superseded'];
      if (!validStatuses.includes(adr.status)) {
        issues.push(`❌ ${adr.filename}: Ungültiger Status "${adr.status}"`);
      }

      // Prüfe Datum
      if (!adr.date || !adr.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        issues.push(`❌ ${adr.filename}: Ungültiges Datum "${adr.date}"`);
      }

      // Prüfe Required Sections
      const content = fs.readFileSync(path.join(adrDir, adr.filename), 'utf8');
      const requiredSections = [
        '## 🎯 Kontext und Problemstellung',
        '## 🔍 Betrachtete Optionen',
        '## ✅ Entscheidung',
        '## 📊 Konsequenzen'
      ];

      requiredSections.forEach(section => {
        if (!content.includes(section)) {
          issues.push(`❌ ${adr.filename}: Sektion fehlt "${section}"`);
        }
      });
    });

    if (issues.length === 0) {
      this.log('✅ Alle ADRs sind valide!', 'green');
    } else {
      this.log(`\n❌ ${issues.length} Probleme gefunden:`, 'red');
      issues.forEach(issue => this.log(issue, 'red'));
    }

    return issues.length === 0;
  }

  // Index aktualisieren
  updateIndex() {
    const adrs = this.getAllADRs();
    const readmePath = path.join(adrDir, 'README.md');
    
    if (!fs.existsSync(readmePath)) {
      this.log('⚠️ README.md nicht gefunden, überspringe Index-Update', 'yellow');
      return;
    }

    let content = fs.readFileSync(readmePath, 'utf8');
    
    // Erstelle neue Tabelle
    const tableRows = adrs.map(adr => 
      `| [${adr.number.toString().padStart(4, '0')}](${adr.filename}) | ${adr.title} | ${adr.status} | ${adr.date} |`
    ).join('\n');

    const newTable = `| Nr. | Titel | Status | Datum |
|-----|-------|--------|-------|
${tableRows}`;

    // Ersetze die Tabelle im README
    const tableRegex = /\| Nr\. \| Titel \| Status \| Datum \|[\s\S]*?(?=\n\n|\n$|$)/;
    content = content.replace(tableRegex, newTable);

    fs.writeFileSync(readmePath, content);
    this.log('📋 ADR-Index aktualisiert', 'green');
  }

  // Hilfsmethoden
  getNextNumber() {
    const adrs = this.getAllADRs();
    return adrs.length > 0 ? Math.max(...adrs.map(adr => adr.number)) + 1 : 1;
  }

  titleToSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  generateADRContent(number, title) {
    const today = new Date().toISOString().split('T')[0];
    
    return `# ${number.toString().padStart(4, '0')}. ${title}

**Status:** Proposed  
**Datum:** ${today}  
**Entscheider:** [Name/Team]  
**Technische Story:** [Link zu Issue/Story falls vorhanden]

## 🎯 Kontext und Problemstellung

Beschreibe hier den Kontext und die Problemstellung, die zu dieser architektonischen Entscheidung geführt hat.

- Was ist das Problem?
- Welche Anforderungen müssen erfüllt werden?
- Welche Constraints existieren?

## 🔍 Betrachtete Optionen

- **Option 1:** [Beschreibung]
- **Option 2:** [Beschreibung] 
- **Option 3:** [Beschreibung]

## ✅ Entscheidung

**Gewählte Option:** [Ausgewählte Option]

**Begründung:** Warum wurde diese Option gewählt?

### Entscheidungskriterien

| Kriterium | Gewichtung | Option 1 | Option 2 | Option 3 |
|-----------|------------|----------|----------|----------|
| Performance | Hoch | ⭐⭐⭐ | ⭐⭐ | ⭐ |
| Wartbarkeit | Hoch | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Lernkurve | Mittel | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| Community Support | Mittel | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

## 📊 Konsequenzen

### Positive Konsequenzen

- ✅ [Positive Auswirkung 1]
- ✅ [Positive Auswirkung 2]
- ✅ [Positive Auswirkung 3]

### Negative Konsequenzen

- ❌ [Negative Auswirkung 1]
- ❌ [Negative Auswirkung 2]

### Risiken und Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| [Risiko 1] | Niedrig/Mittel/Hoch | Niedrig/Mittel/Hoch | [Maßnahme] |

## 🔗 Links und Referenzen

- [Link zur Dokumentation]
- [Relevante GitHub Issues]
- [Blog Posts oder Artikel]
- [Benchmarks oder Performance Tests]

## 📝 Notizen

Zusätzliche Notizen oder Überlegungen, die bei der Entscheidung eine Rolle gespielt haben.

---

**Template Version:** 1.0  
**Letzte Aktualisierung:** ${today}`;
  }

  getAllADRs() {
    if (!fs.existsSync(adrDir)) return [];

    return fs.readdirSync(adrDir)
      .filter(file => file.match(/^\d{4}-[\w-]+\.md$/))
      .map(filename => {
        const filepath = path.join(adrDir, filename);
        const content = fs.readFileSync(filepath, 'utf8');
        
        const numberMatch = filename.match(/^(\d{4})-/);
        const titleMatch = content.match(/^# \d{4}\. (.+)$/m);
        const statusMatch = content.match(/\*\*Status:\*\* (.+)/);
        const dateMatch = content.match(/\*\*Datum:\*\* (.+)/);

        return {
          filename,
          number: numberMatch ? parseInt(numberMatch[1]) : 0,
          title: titleMatch ? titleMatch[1] : 'Unknown Title',
          status: statusMatch ? statusMatch[1].trim() : 'Unknown',
          date: dateMatch ? dateMatch[1].trim() : 'Unknown'
        };
      })
      .sort((a, b) => a.number - b.number);
  }

  findADRByNumber(number) {
    return this.getAllADRs().find(adr => adr.number === parseInt(number));
  }

  getStatusColor(status) {
    switch (status) {
      case 'Accepted': return 'green';
      case 'Proposed': return 'yellow';
      case 'Deprecated': return 'red';
      case 'Superseded': return 'magenta';
      default: return 'white';
    }
  }

  printStatistics(adrs) {
    const statusCounts = adrs.reduce((acc, adr) => {
      acc[adr.status] = (acc[adr.status] || 0) + 1;
      return acc;
    }, {});

    Object.entries(statusCounts).forEach(([status, count]) => {
      const color = this.getStatusColor(status);
      this.log(`  ${status}: ${count}`, color);
    });
  }
}

// CLI Interface
const manager = new ADRManager();
const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

switch (command) {
  case 'create':
  case 'new':
    manager.createADR(arg1);
    break;
    
  case 'list':
  case 'ls':
    manager.listADRs();
    break;
    
  case 'status':
    manager.updateStatus(arg1, arg2);
    break;
    
  case 'validate':
    manager.validateADRs();
    break;
    
  case 'update-index':
    manager.updateIndex();
    break;
    
  default:
    console.log(`
🏗️ ADR Manager

Verwendung:
  npm run adr:create "Decision Title"    Neue ADR erstellen
  npm run adr:list                       Alle ADRs auflisten
  npm run adr:status <nr> <status>       Status ändern
  npm run adr:validate                   ADRs validieren
  npm run adr:update-index               Index aktualisieren

Beispiele:
  npm run adr:create "Use GraphQL"
  npm run adr:status 5 Accepted
  npm run adr:list
    `);
    break;
} 