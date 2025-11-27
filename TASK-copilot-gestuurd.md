# TASK: Toevoegen van moeilijkheidsgraad (makkelijk / gemiddeld / moeilijk)

**Samenvatting**

Voeg een nieuw veld `difficulty` toe aan taken zodat gebruikers bij het aanmaken/en bewerken kunnen kiezen uit de opties:

- `makkelijk`
- `gemiddeld`
- `moeilijk`

De moeilijkheidsgraad moet zichtbaar zijn in de UI (`task-card`), instelbaar via het `add-task-form`, en filterbaar via `task-filters`. De backend moet het nieuwe veld accepteren, valideren en teruggeven in API-responses.

**Waarom**

Studenten moeten taken beter kunnen prioriteren en inschatten. Moeilijkheidsgraad helpt bij planning en filteren in het dashboard.

**Requirements**

- UI: voeg een keuzelijst toe in `frontend/components/add-task-form.tsx` met Nederlandse labels `makkelijk`, `gemiddeld`, `moeilijk`.
- UI: toon de gekozen moeilijkheidsgraad in `frontend/components/task-card.tsx`.
- UI: voeg filtermogelijkheden toe in `frontend/components/task-filters.tsx` zodat gebruikers taken kunnen filteren op moeilijkheidsgraad.
- Frontend types: update `frontend/lib/types.ts` (of `frontend/components` types) om `difficulty` te bevatten.
- Backend types: update `backend/src/types.ts` zodat `Task` een `difficulty` veld heeft (gebruik intern genormaliseerde waarden `'easy' | 'medium' | 'hard'`).
- Backend API: endpoints moeten `difficulty` accepteren bij create/update en de nieuwe waarde teruggeven in JSON volgens de API conventie `{ success: boolean, data?: any, error?: string }`.
- Seed data: werk `backend/src/database.ts` bij met voorbeeldtaken die `difficulty` bevatten.

**Technische details en keuzes**

- Storage/Model: in TypeScript gebruiken we voor interne waarde-enums: `'easy' | 'medium' | 'hard'`.
- UI weergave: map intern waarden naar Nederlandse labels:
  - `easy` -> `makkelijk`
  - `medium` -> `gemiddeld`
  - `hard` -> `moeilijk`
- Default: wanneer niet gespecificeerd, default naar `medium` (`gemiddeld`).

**Backend wijzigingssuggesties**

- `backend/src/types.ts`:
  - Voeg in `Task` interface: `difficulty: 'easy' | 'medium' | 'hard'`
- `backend/src/index.ts` (of routes):
  - Valideer `difficulty` bij POST/PUT: alleen `easy|medium|hard` toegestaan.
  - Indien ontbrekend, vul `medium` in.
  - Zorg dat responses het veld `difficulty` teruggeven.
- `backend/src/database.ts`:
  - Update bestaande seed items met `difficulty` (bijv. `medium`).

**Frontend wijzigingssuggesties**

- `frontend/lib/types.ts` of `frontend/app` types:
  - Voeg `difficulty?: 'easy' | 'medium' | 'hard'` toe aan `Task` type.
- `frontend/components/add-task-form.tsx`:
  - Voeg een `select` toe met opties (labels in het Nederlands).
  - Bij submit, stuur het genormaliseerde waarde (`easy|medium|hard`) naar de API.
- `frontend/components/task-card.tsx`:
  - Toon `difficulty` (label + optioneel kleur/badge):
    - `makkelijk` - groen
    - `gemiddeld` - geel
    - `moeilijk` - rood
- `frontend/components/task-filters.tsx`:
  - Voeg filterchips/checkboxes/select toe om op difficulty te filteren.
  - Pas API-call of client-side filter logica aan om te filteren.

**API voorbeeld**

- Request body bij POST `/api/tasks`:
```
{
  "title": "Lees hoofdstuk 3",
  "description": "Samenvatting maken",
  "estimatedTime": 60,
  "difficulty": "medium"
}
```
- Response:
```
{ "success": true, "data": { "id": 1, "title": "Lees hoofdstuk 3", "difficulty": "medium", ... } }
```

**Acceptatiecriteria**

- Gebruikers kunnen bij het aanmaken van een taak een moeilijkheid kiezen uit `makkelijk/gemiddeld/moeilijk`.
- Het gekozen label wordt zichtbaar in de `task-card`.
- Taken kunnen gefilterd worden op moeilijkheid in het dashboard.
- Backend slaat `difficulty` op en geeft deze terug in de API-responses.
- Alle bestaande functionaliteit blijft werken wanneer `difficulty` ontbreekt (default `medium`).

**Tests / QA**

- Unit: backend validering voor `difficulty` (toegestane waarden + default).
- E2E / Integration: maak een taak aan met elke moeilijkheidsgraad en controleer zichtbaarheid, filtering en persistente waarde.
- Frontend: snapshot/visual check voor `task-card` met badges.

**Implementatiestappen (volgorde)**

1. Backend: update `backend/src/types.ts` en `backend/src/database.ts` met `difficulty` en seed values.
2. Backend: update create/update endpoints met validatie en defaulting.
3. Frontend: update `frontend/lib/types.ts` met `difficulty`.
4. Frontend: voeg `select` toe aan `frontend/components/add-task-form.tsx` en stuur waarde mee bij submit.
5. Frontend: toon badge in `frontend/components/task-card.tsx`.
6. Frontend: voeg filtering toe in `frontend/components/task-filters.tsx`.
7. Tests: schrijf unit tests voor backend en basic UI checks.
8. Review/PR en merge.

**PR checklist**

- [ ] Types bijgewerkt in zowel frontend als backend (`Task` bevat `difficulty`).
- [ ] Seed data bijgewerkt.
- [ ] API endpoints valideren `difficulty` en gebruiken default `medium`.
- [ ] UI bevat select in `add-task-form` en toont badge in `task-card`.
- [ ] Filtering werkt in dashboard.
- [ ] Tests toegevoegd of aangepast.
- [ ] Documentatie / changelog vermeld.

**Geschatte inspanning**

- Backend: 1-2 uur
- Frontend: 2-3 uur
- Tests & review: 1 uur

---

Als je wilt, kan ik deze wijziging nu implementeren: ik kan de benodigde bestanden aanpassen (types, database seed, add-task-form, task-card, task-filters) en een PR voorstel maken. Wil je dat ik daarmee begin?
