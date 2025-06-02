import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type SupportedLanguages = 'ro' | 'en' | 'de';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLangSubject = new BehaviorSubject<SupportedLanguages>('ro');
  public currentLang$ = this.currentLangSubject.asObservable();

  // Adaugă aici toate textele care trebuie traduse din pagina istoric
  private translations: Record<string, Record<string, string>> = {
    'istoricTitle': {
      'ro': 'Istoric și Publicații',
      'en': 'History and Publications',
      'de': 'Geschichte und Publikationen'
    },
    'scurtIstoric': {
      'ro': 'Scurt istoric',
      'en': 'Brief History',
      'de': 'Kurze Geschichte'
    },
    'publicatiiButton': {
      'ro': 'Publicații',
      'en': 'Publications',
      'de': 'Publikationen'
    },
    'istoricP1': {
      'ro': 'Primele preocupări privind înfiinţarea unui muzeu la Năsăud datează din a doua jumătate a secolului al XIX-lea. Astfel, la data de 24 decembrie 1873, botanistul Florian Porcius – vice-căpitanul districtului năsăudean, trimite o adresă direcţiunii Gimnaziului superior greco-catolic din Năsăud prin care anunţă hotărârea Comitetului reprezentativ districtual de a înfiinţa în Districtul Năsăudului o „Reuniune de Ştiinţă şi Muzeu". În această adresă el face şi un apel la intelectualitatea din localitate să se înscrie ca membri ai respectivei reuniuni.',
      'en': 'The first concerns regarding the establishment of a museum in Năsăud date back to the second half of the 19th century. Thus, on December 24, 1873, the botanist Florian Porcius - the vice-captain of the Năsăud district, sent an address to the direction of the Greek-Catholic Superior Gymnasium in Năsăud announcing the decision of the District Representative Committee to establish a "Science and Museum Reunion" in the Năsăud District. In this address, he also makes an appeal to the local intellectuals to enroll as members of the respective reunion.',
      'de': 'Die ersten Bedenken bezüglich der Gründung eines Museums in Năsăud reichen bis in die zweite Hälfte des 19. Jahrhunderts zurück. So sandte der Botaniker Florian Porcius - der Vizekapitän des Bezirks Năsăud - am 24. Dezember 1873 eine Adresse an die Direktion des griechisch-katholischen Obergymnasiums in Năsăud, in der er die Entscheidung des Bezirksrepräsentationskomitees bekannt gab, im Bezirk Năsăud eine "Wissenschafts- und Museumsvereinigung" zu gründen. In dieser Adresse appelliert er auch an die lokalen Intellektuellen, sich als Mitglieder der jeweiligen Vereinigung einzuschreiben.'
    },
    'istoricP2': {
      'ro': 'Deoarece ideea de a înfiinţa o instituţie culturală românească nu se potrivea cu atitudinea de deznaţionalizare promovată de autorităţile Imperiului Austro-Ungar, muzeul rămâne la acea vreme doar în stadiul de proiect. Cu toate acestea, apelul făcut de Florian Porcius n-a rămas fără rezultat. Astfel, până la sfârşitul anului şcolar 1873-1874, biblioteca gimnaziului a primit prin donaţie numeroase cărţi, iar Cabinetului de ştiinţe naturale îi este donată colecţia de minerale în 1060 de exemplare a cavalerului De Manz. În aceeaşi perioadă, Cabinetul de ştiinţe naturale se îmbogăţeşte cu importantul ierbar al lui Florian Porcius.',
      'en': 'Because the idea of establishing a Romanian cultural institution did not align with the denationalization attitude promoted by the authorities of the Austro-Hungarian Empire, the museum remained at that time only at the project stage. However, the appeal made by Florian Porcius did not remain without result. Thus, by the end of the 1873-1874 school year, the gymnasium library received numerous books through donation, and the Natural Sciences Cabinet was donated the mineral collection of 1060 specimens belonging to the knight De Manz. During the same period, the Natural Sciences Cabinet was enriched with the important herbarium of Florian Porcius.',
      'de': 'Da die Idee, eine rumänische Kultureinrichtung zu gründen, nicht mit der von den Behörden der österreichisch-ungarischen Monarchie geförderten Entnationalisierungshaltung übereinstimmte, blieb das Museum zu dieser Zeit nur im Projektstadium. Der von Florian Porcius gemachte Appell blieb jedoch nicht ohne Ergebnis. So erhielt die Gymnasialbibliothek bis zum Ende des Schuljahres 1873-1874 durch Spenden zahlreiche Bücher, und dem Naturwissenschaftlichen Kabinett wurde die Mineraliensammlung mit 1060 Exemplaren des Ritters De Manz gespendet. In der gleichen Zeit wurde das Naturwissenschaftliche Kabinett um das bedeutende Herbarium von Florian Porcius bereichert.'
    },
    'istoricP3': {
      'ro': 'Totodată, unii profesori ai gimnaziului decid constituirea, în cadrul acestei şcoli, a unor expoziţii ce conţin obiecte găsite de profesori şi elevi în săpături arheologice sau care au fost descoperite ocazional de diverse persoane particulare şi oferite apoi şcolii. Aşadar, avem de-a face cu primele încercări de a cuprinde într-o expoziţie documentară valori ale culturii năsăudene. Să mai menţionăm că în aproape toate anuarele gimnaziului se aminteşte înmulţirea numărului de publicaţii, cărţi, manuscrise şi obiecte de muzeu, o mare parte dintre acestea fiind donate de către intelectualii năsăudeni.',
      'en': 'At the same time, some gymnasium professors decided to establish, within this school, exhibitions containing objects found by professors and students in archaeological excavations or which were occasionally discovered by various private individuals and then offered to the school. Thus, we are dealing with the first attempts to include values of Năsăud culture in a documentary exhibition. It should also be mentioned that almost all the yearbooks of the gymnasium mention the increase in the number of publications, books, manuscripts and museum objects, a large part of them being donated by the Năsăud intellectuals.',
      'de': 'Gleichzeitig beschlossen einige Gymnasialprofessoren, in dieser Schule Ausstellungen mit Objekten einzurichten, die von Professoren und Schülern bei archäologischen Ausgrabungen gefunden oder gelegentlich von verschiedenen Privatpersonen entdeckt und dann der Schule angeboten wurden. Somit haben wir es mit den ersten Versuchen zu tun, Werte der Năsăud-Kultur in eine Dokumentarausstellung einzubeziehen. Es ist auch zu erwähnen, dass fast alle Jahrbücher des Gymnasiums die Zunahme der Anzahl von Publikationen, Büchern, Manuskripten und Museumsobjekten erwähnen, von denen ein großer Teil von den Intellektuellen aus Năsăud gespendet wurde.'
    },
    
    // Tarife page translations
    'tarifeTitle': {
      'ro': 'Tarife',
      'en': 'Prices',
      'de': 'Preise'
    },
    'tarifeMuseum': {
      'ro': 'Muzeu',
      'en': 'Museum',
      'de': 'Museum'
    },
    'tarifeStudents': {
      'ro': 'Elevi & Studenți',
      'en': 'Students & Pupils',
      'de': 'Schüler & Studenten'
    },
    'tarifeStudentsDesc': {
      'ro': 'Cu prezentarea carnetului de elev/student',
      'en': 'With student/pupil ID presentation',
      'de': 'Mit Vorlage des Schüler-/Studentenausweises'
    },
    'tarifePensioners': {
      'ro': 'Pensionari',
      'en': 'Pensioners',
      'de': 'Rentner'
    },
    'tarifePensionersDesc': {
      'ro': 'Cu prezentarea cuponului de pensie',
      'en': 'With pension certificate presentation',
      'de': 'Mit Vorlage des Rentenbescheids'
    },
    'tarifeAdults': {
      'ro': 'Adulți',
      'en': 'Adults',
      'de': 'Erwachsene'
    },
    'tarifeAdultsDesc': {
      'ro': 'Bilet standard de intrare',
      'en': 'Standard entrance ticket',
      'de': 'Standard-Eintrittskarte'
    },
    'tarifeCurrency': {
      'ro': 'lei',
      'en': 'lei',
      'de': 'Lei'
    },
    'tarifeNote': {
      'ro': 'Notă',
      'en': 'Note',
      'de': 'Hinweis'
    },
    'tarifeFreeAccess': {
      'ro': 'Accesul este gratuit pentru copiii sub 7 ani și persoane cu dizabilități.',
      'en': 'Free access for children under 7 and people with disabilities.',
      'de': 'Freier Eintritt für Kinder unter 7 Jahren und Menschen mit Behinderungen.'
    },
    
    // Contact page translations
    'contactTitle': {
      'ro': 'Contact',
      'en': 'Contact',
      'de': 'Kontakt'
    },
    'contactMuseum': {
      'ro': 'Muzeu',
      'en': 'Museum',
      'de': 'Museum'
    },
    'contactLandline': {
      'ro': 'Telefon Fix',
      'en': 'Landline',
      'de': 'Festnetz'
    },
    'contactMobile': {
      'ro': 'Telefon Mobil',
      'en': 'Mobile Phone',
      'de': 'Mobiltelefon'
    },
    'contactEmail': {
      'ro': 'E-mail',
      'en': 'E-mail',
      'de': 'E-Mail'
    },
    'contactLocation': {
      'ro': 'Ne găsiți aici',
      'en': 'You can find us here',
      'de': 'Sie finden uns hier'
    },
    'contactAddress': {
      'ro': 'Str. Muzeului Nr. 1, Muzeul Grăniceresc Năsăudean',
      'en': 'Museum Street No. 1, Năsăud Border Guard Museum',
      'de': 'Museumsstraße Nr. 1, Näsäuder Grenzschutzmuseum'
    },
    
    // Rezervari page translations
    'rezervariTitle': {
      'ro': 'Rezervă o Vizită la Muzeu',
      'en': 'Book a Museum Visit',
      'de': 'Museumsbesuch buchen'
    },
    'rezervariScheduleTitle': {
      'ro': 'Program de Vizitare',
      'en': 'Visiting Schedule',
      'de': 'Besuchszeiten'
    },
    'rezervariWeekdays': {
      'ro': 'Marți - Vineri',
      'en': 'Tuesday - Friday',
      'de': 'Dienstag - Freitag'
    },
    'rezervariWeekend': {
      'ro': 'Sâmbătă - Duminică',
      'en': 'Saturday - Sunday',
      'de': 'Samstag - Sonntag'
    },
    'rezervariLoading': {
      'ro': 'Se încarcă programul muzeului...',
      'en': 'Loading museum schedule...',
      'de': 'Museumszeiten werden geladen...'
    },
    'rezervariLastName': {
      'ro': 'Nume reprezentant',
      'en': 'Representative Last Name',
      'de': 'Nachname des Vertreters'
    },
    'rezervariFirstName': {
      'ro': 'Prenume reprezentant',
      'en': 'Representative First Name',
      'de': 'Vorname des Vertreters'
    },
    'rezervariEmail': {
      'ro': 'Email reprezentant',
      'en': 'Representative Email',
      'de': 'E-Mail des Vertreters'
    },
    'rezervariEmailValid': {
      'ro': 'Email valid',
      'en': 'Valid email',
      'de': 'Gültige E-Mail'
    },
    'rezervariDateTime': {
      'ro': 'Data și Ora',
      'en': 'Date and Time',
      'de': 'Datum und Uhrzeit'
    },
    'rezervariDate': {
      'ro': 'Data',
      'en': 'Date',
      'de': 'Datum'
    },
    'rezervariTime': {
      'ro': 'Ora',
      'en': 'Time',
      'de': 'Uhrzeit'
    },
    'rezervariSelectTime': {
      'ro': 'Selectați ora',
      'en': 'Select time',
      'de': 'Zeit wählen'
    },
    'rezervariBookingNote': {
      'ro': 'Notă: Puteți rezerva doar în zilele de marți-duminică, în intervalul orar',
      'en': 'Note: You can only book on Tuesday-Sunday, during the time slots',
      'de': 'Hinweis: Sie können nur dienstags-sonntags in den folgenden Zeitfenstern buchen'
    },
    'rezervariNumberOfPersons': {
      'ro': 'Număr de Persoane',
      'en': 'Number of Persons',
      'de': 'Anzahl der Personen'
    },
    'rezervariGuideRequired': {
      'ro': 'Doriți ghid?',
      'en': 'Do you want a guide?',
      'de': 'Möchten Sie einen Führer?'
    },
    'rezervariSubmit': {
      'ro': 'Rezervă Vizita',
      'en': 'Book Visit',
      'de': 'Besuch buchen'
    }
    // Poți adăuga restul paragrafelor în același mod
  };

  constructor() {
    // Inițializează limba curentă
    this.initLanguage();
  }

  private initLanguage() {
    // Verifică dacă avem parametrul lang în URL
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang') as SupportedLanguages;
      
      if (langParam && this.isValidLanguage(langParam)) {
        this.setLanguage(langParam);
        return;
      }
      
      // Verifică localStorage
      const savedLang = localStorage.getItem('selectedLanguage') as SupportedLanguages;
      if (savedLang && this.isValidLanguage(savedLang)) {
        this.setLanguage(savedLang);
        return;
      }
      
      // Folosește limba browser-ului
      const browserLang = navigator.language.split('-')[0] as SupportedLanguages;
      if (this.isValidLanguage(browserLang)) {
        this.setLanguage(browserLang);
        return;
      }
    }
    
    // Default la română
    this.setLanguage('ro');
  }

  public isValidLanguage(lang: string): lang is SupportedLanguages {
    return ['ro', 'en', 'de'].includes(lang);
  }

  public getLanguage(): SupportedLanguages {
    return this.currentLangSubject.value;
  }

  public setLanguage(lang: SupportedLanguages): void {
    localStorage.setItem('selectedLanguage', lang);
    this.currentLangSubject.next(lang);
  }

  public translate(key: string): string {
    const lang = this.getLanguage();
    
    // Verifică dacă cheia există
    if (this.translations[key] && this.translations[key][lang]) {
      return this.translations[key][lang];
    }
    
    // Returnează cheia dacă nu există traducere
    return key;
  }
}