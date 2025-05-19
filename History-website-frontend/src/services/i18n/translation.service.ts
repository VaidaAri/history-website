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