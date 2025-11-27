**Title:** Voeg moeilijkheidsgraad-selector toe aan taakcreatie

**User Story:**
Als student,
wil ik een moeilijkheidsgraad (Makkelijk, Gemiddeld, Moeilijk) kunnen kiezen bij het aanmaken van een taak,
zodat ik beter kan inschatten en prioriteren hoeveel inspanning een taak vereist.

**Description:**
Breid de taakcreatie-interface uit met een moeilijkheidsgraad-selector en sla deze waarde op in het taakmodel. Dit maakt het makkelijker voor studenten om taken te prioriteren en realistische studieblokken te plannen. Afhankelijkheden: frontend (Next.js) moet het formulier en `task-card` tonen aanpassen; backend (Express) moet het model valideren en de `POST /api/tasks` en `PATCH /api/tasks/:id` endpoints updaten. Gebruik het bestaande in-memory database-formaat; houd backward compatibility in gedachten.

**Acceptance Criteria:**
- [ ] Er verschijnt een select/dropdown met opties: `Makkelijk`, `Gemiddeld`, `Moeilijk` in het taak-aanmaakformulier.
- [ ] De geselecteerde moeilijkheid wordt opgeslagen wanneer een taak wordt aangemaakt (`POST /api/tasks`).
- [ ] De moeilijkheid wordt zichtbaar op taakkaarten in het dashboard en bij taakdetails.
- [ ] De API accepteert en valideert de moeilijkheidsgraad (mogelijke waarden: `easy`/`medium`/`hard` of NL-equivalenten), en geeft fout 400 bij ongeldige waarden.
- [ ] Bestaande taken zonder moeilijkheid krijgen een standaardwaarde `Gemiddeld`.

**Technical Notes:**
- **Frontend:** Update `frontend/components/add-task-form.tsx` om een select-invoerveld toe te voegen; update `frontend/components/task-card.tsx` en `frontend/components/study-dashboard.tsx` om de moeilijkheid weer te geven. Gebruik i18n-compatibele labels (`Makkelijk`, `Gemiddeld`, `Moeilijk`) maar stuur genormaliseerde waarden (`easy`, `medium`, `hard`) naar de API.
- **Backend:** Update `backend/src/types.ts` om de moeilijkheidsgraad toe te voegen aan `Task` en `CreateTaskInput`. Pas `POST /api/tasks` en `PATCH /api/tasks/:id` in `backend/src/index.ts` aan om de nieuwe eigenschap te valideren en default `medium` te zetten wanneer ontbrekend.
- **Database:** Breid de in-memory taak-objecten in `backend/src/database.ts` uit met `difficulty` met default `medium` voor seeded tasks.

**Testing Considerations:**
- Unit tests voor backend validatie: zorg dat `POST` ongeldige moeilijkheidswaarden weigert en default instelt wanneer ontbrekend.
- Frontend: test dat de select-control de gekozen waarde opslaat en dat task-cards deze tonen.
- Integratie: maak een taak via de UI of directe API-aanroep en verifieer dat de waarde in de in-memory DB verschijnt tijdens runtime.
- Edge cases: ontbrekende waarde (gebruik default), onverwachte strings, case-insensitivity, en backward compatibility met bestaande taken.

---

Opmerkingen:
- Dit issue volgt de project prompt in `.github/prompts/create-task.prompt.md` en is bedoeld om direct als GitHub Issue gebruikt te worden of verder uitgewerkt te worden in de backlog.