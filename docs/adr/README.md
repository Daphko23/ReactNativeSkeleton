# 📋 Architectural Decision Records (ADRs)

Dieses Verzeichnis enthält alle wichtigen architektonischen Entscheidungen für das React Native Skeleton Template.

## 🎯 Was sind ADRs?

Architectural Decision Records dokumentieren wichtige technische und architektonische Entscheidungen in unserem Projekt. Sie helfen dabei:

- **Nachvollziehbarkeit**: Warum wurden bestimmte Technologien gewählt?
- **Onboarding**: Neue Entwickler verstehen schnell die Architektur
- **Konsistenz**: Zukünftige Entscheidungen folgen etablierten Prinzipien
- **Wissenstransfer**: Architektur-Wissen bleibt im Team erhalten

## 📁 Struktur

```
docs/adr/
├── README.md                    # Diese Datei
├── 0001-record-architecture-decisions.md
├── 0002-adopt-clean-architecture.md
├── 0003-choose-zustand-over-redux.md
├── 0004-select-supabase-as-backend.md
└── template.md                 # Vorlage für neue ADRs
```

## ✅ ADR Status

- **Proposed**: Vorgeschlagen, noch in Diskussion
- **Accepted**: Akzeptiert und implementiert
- **Deprecated**: Veraltet, wird nicht mehr empfohlen
- **Superseded**: Ersetzt durch neuere Entscheidung

## 🆕 Neue ADR erstellen

1. Kopiere `template.md` zu einer neuen Datei:
   ```bash
   cp docs/adr/template.md docs/adr/XXXX-your-decision.md
   ```

2. Fülle die Vorlage aus:
   - Nummer fortlaufend vergeben
   - Aussagekräftigen Titel wählen
   - Status, Kontext, Entscheidung und Konsequenzen dokumentieren

3. Review durch das Team
4. Nach Akzeptanz: Status auf "Accepted" setzen

## 🔗 Externe Ressourcen

- [ADR GitHub Organization](https://adr.github.io/)
- [Architecture Decision Records Blog Post](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR Tools](https://github.com/npryce/adr-tools)

## 📋 ADR-Liste

| Nr. | Titel | Status | Datum |
|-----|-------|--------|-------|
| [0001](0001-record-architecture-decisions.md) | Record Architecture Decisions | Accepted   | 2025-01-15   |
| [0002](0002-adopt-clean-architecture.md) | Adopt Clean Architecture | Accepted   | 2025-01-15   |
| [0003](0003-choose-zustand-over-redux.md) | Choose Zustand over Redux | Accepted   | 2025-01-15   |