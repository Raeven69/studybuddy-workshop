**Samenvatting**
- **Doel:** Voeg een moeilijkheidsgraad-optie toe aan StudyBuddy+ zodat gebruikers bij het aanmaken van een taak kunnen kiezen uit `makkelijk`, `gemiddeld` en `moeilijk`.

**Doel**
- **Waarom:** Maakt taken rijker en helpt bij filteren, planning en prioritering.
- **Scope:** UI-keuze in het taak-aanmaakformulier, opslag in de backend/database, tonen op taakkaarten, en filters in het dashboard.

**Acceptatiecriteria**
- **AC-1:** Bij het toevoegen van een taak kan de gebruiker één van `makkelijk`, `gemiddeld`, `moeilijk` selecteren.
- **AC-2:** Als geen keuze wordt gemaakt, wordt standaard `gemiddeld` gebruikt.
- **AC-3:** De gekozen moeilijkheid wordt opgeslagen in de backend en verschijnt in de taaklijst en op individuele taakkaarten.
- **AC-4:** Het dashboard/filtervoorziening kan taken filteren op moeilijkheidsgraad.
- **AC-5:** Bestaande taken zonder veld behouden functionaliteit en krijgen automatisch `gemiddeld` aangewezen bij eerste update of via migratie.

**Frontend wijzigingen**
- **Component:** `add-task-form.tsx`
  - **Actie:** Voeg een nieuw veld toe (select/segmented control) met opties `makkelijk`, `gemiddeld`, `moeilijk`.
  - **Default:** `gemiddeld` wanneer gebruiker niets selecteert.
- **Component:** `task-card.tsx`
  - **Actie:** Toon de moeilijkheidsgraad visueel (label, kleur of icoon).
- **Component:** `task-filters.tsx` / `study-dashboard.tsx`
  - **Actie:** Voeg filter(s) toe om te filteren op moeilijkheidsgraad (multi-select of enkelvoudige filter).
- **Types & API client:** `frontend/lib/types.ts` of `lib/types.ts`
  - **Actie:** Voeg `difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk'` toe aan het `Task` type.
- **UX:** Zorg dat de select toegankelijk is (aria-labels, keyboard-navigatie).

**Backend wijzigingen**
- **Types:** `backend/src/types.ts`
  - **Actie:** Breid `Task` interface uit met `difficulty` property (zelfde union-strings).
- **API:** `backend/src/index.ts` (of relevante route)
  - **Actie:** Accepteer en valideer `difficulty` bij create/update requests; default naar `gemiddeld`.
- **Validatie:** Weersta ongeldige waarden en retourneer 400 bij invalide input.

**Database**
- **Schema:** `backend/src/database.ts` / opslaglaag
  - **Actie:** Voeg kolom/veld `difficulty` (string) toe, default `gemiddeld`.
  - **Migratie:** Voor bestaande data, update records zonder `difficulty` naar `gemiddeld`.
  - **Tip:** Als er geen migratietool is, voer een opstartscript uit dat oude records bijwerkt.

**API contract**
- **Request create/update:** accepteer JSON veld `difficulty` met waarde `makkelijk|gemiddeld|moeilijk`.
- **Response Task:** bevat `difficulty` in de taakrepresentatie.

**Tests**
- **Frontend unit tests:** validate component rendering met elk van de drie opties en default.
- **Backend unit tests:** valideer acceptatie van geldige waarden en weigering van ongeldige waarden.
- **Integratie:** test volledige flow: create task -> GET tasks -> check `difficulty`.
- **E2E (optioneel):** UI-test die taak aanmaakt met verschillende moeilijkheidsniveaus en filtert.

**Migratie & backwards compatibility**
- **Default aanpak:** Gebruik `gemiddeld` als fallback.
- **Migratie script:** Een script dat:
  - leest alle taken
  - zet `difficulty` op `gemiddeld` waar ontbrekend
  - logt wijzigingen
- **Compatibiliteit:** API accepteert oude client-requests zonder `difficulty`.

**Tijdsindicatie**
- **Schrijven TASK.md & planning:** 0.5 uur (gereed)
- **Frontend implementatie:** 2–4 uur (componenten + styles + tests)
- **Backend implementatie:** 1–3 uur (types, API, DB)
- **Tests & QA:** 1–2 uur
- **Totale inschatting:** 4.5–9.5 uur

**Checklist voor PR**
- **Code:** alle wijzigingen in frontend en backend toegevoegd.
- **Types:** `Task` type bijgewerkt in beide lagen.
- **DB:** migratie toegevoegd of script aanwezig.
- **Tests:** unit/integratie tests toegevoegd en groen.
- **Docs:** `README.md` of componentdocs bijgewerkt met nieuwe field.
- **Review:** UI is getest op desktop en mobiel.

**Aanpak implementatie (kort stappenplan)**
1. Update types in zowel frontend als backend.
2. Voeg UI-element toe in `add-task-form.tsx` en style het.
3. Zorg dat create/update requests `difficulty` meesturen (default `gemiddeld`).
4. Update `task-card.tsx` om moeilijkheidsgraad te tonen.
5. Voeg filteropties toe in `task-filters.tsx`.
6. Voeg DB-migratie of init-script toe.
7. Schrijf tests en voer lokale QA uit.

Als je wil, kan ik nu:
- direct de frontend componenten patchen (maak `add-task-form.tsx` en `task-card.tsx` changes),
- of een migratiescript en backend-validatie aanmaken.
Geef aan welke stappen je eerst wilt laten uitvoeren en ik start ermee.