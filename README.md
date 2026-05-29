# Platforma-do-wspolnego-planowania-podrozy
Projekt Grupowy 2026
Grupa 2-osobowa 
Borys Bereza
Mikołaj Frankiewicz 

Platforma do wspólnego planowania podróży
Aplikacja webowa do wspólnego planowania podróży , w której użytkownicy mogą tworzyć wyjazdy ,zapraszać znajomych i razem planować , organizować cały plan podróży.
System umożliwia dodawanie limitu budżetu, dodanie preferowanego przez użytkownika miejsca do listy kierunków podróży.
Aplikacji pozwoli na dodawanie przez każdego członka grupy konkretnych hoteli, restauracji bądź atrakcji w pobliżu planowanego miejsca pobytu 


TravelPlanner – opis projektu
Opis projektu
TravelPlanner to aplikacja webowa umożliwiająca planowanie oraz organizację wyjazdów grupowych. Użytkownicy mogą dodawać propozycje podróży, określać budżet, termin wyjazdu oraz dodatkowe informacje dotyczące planowanej podróży. Aplikacja umożliwia również głosowanie na najlepsze propozycje wyjazdów.
Projekt został wykonany w technologii:
    • Frontend: React
    • Backend: Node.js + Express
    • API: REST API
    • Planowana baza danych: PostgreSQL

Zrealizowane funkcjonalności
Backend
    • Utworzenie serwera Express
    • Konfiguracja routingu API
    • Obsługa metod:
        ◦ GET
        ◦ POST
        ◦ DELETE
        ◦ PATCH
    • Tworzenie endpointów dla podróży
    • Obsługa danych JSON
    • Konfiguracja CORS
    • Dodawanie podróży
    • Pobieranie listy podróży
    • Usuwanie podróży
    • System głosowania na podróże
    • Sortowanie podróży po liczbie głosów

Frontend
    • Utworzenie aplikacji React
    • Połączenie frontend ↔ backend
    • Dynamiczne pobieranie danych z API
    • Formularz dodawania podróży
    • Dodawanie:
        ◦ nazwy podróży
        ◦ celu podróży
        ◦ właściciela
        ◦ budżetu
        ◦ terminu wyjazdu
        ◦ dodatkowego opisu
    • Wyświetlanie podróży w formie kart
    • Responsywny  interfejs użytkownika
    • Stylizacja aplikacji przy użyciu CSS
    • System głosowania
    • Ranking podróży według liczby głosów
    • Blokada wpisywania liter w polu budżetu

Podział zadań
Borys Bereza
Backend:
    • Tworzenie serwera Express
    • Implementacja REST API
    • Obsługa CRUD (GET, POST, DELETE, PATCH)
    • System głosowania
    • Przygotowanie struktury pod bazę danych
Frontend:
    • Tworzenie podstawowego UI w React
    • Formularz dodawania podróży
    • Wyświetlanie listy podróży

Mikołaj Frankiewicz 
Backend:
    • Rozbudowa API (głosowanie, sortowanie)
    • Obsługa danych podróży
    • Przygotowanie pod integrację PostgreSQL
    • Walidacja danych wejściowych
Frontend:
    • Stylizacja aplikacji (CSS)
    • Rozbudowa UI (karty, ranking)
    • Funkcja usuwania podróży
    • System głosowania w UI
    • Sortowanie podróży po liczbie głosów


