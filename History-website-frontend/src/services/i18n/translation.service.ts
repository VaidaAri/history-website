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
    'istoricP4': {
      'ro': 'După Marea Unire de la 1 Decembrie 1918 s-a reluat problema înfiinţării Muzeului Năsăudean. În 1923, din iniţiativa unui grup de cărturari năsăudeni, ce-l au în frunte pe maiorul în rezervă Iulian Marţian, se hotărăşte organizarea unui muzeu. În acest scop se publică un aviz prin care se preciza că Ministerul Artelor îşi dă acordul privind înfiinţarea unui muzeu regional în Năsăud, muzeu ce urma să fie găzduit provizoriu într-una din sălile Liceului Grăniceresc „George Coşbuc" din localitate.',
      'en': 'After the Great Union of December 1, 1918, the issue of establishing the Năsăud Museum was resumed. In 1923, on the initiative of a group of Năsăud scholars, led by the reserve major Iulian Marțian, the organization of a museum was decided. For this purpose, a notice was published stating that the Ministry of Arts agreed to the establishment of a regional museum in Năsăud, a museum that was to be temporarily housed in one of the halls of the "George Coșbuc" Border Guard High School in the locality.',
      'de': 'Nach der Großen Union vom 1. Dezember 1918 wurde die Frage der Gründung des Năsăud-Museums wieder aufgenommen. 1923 wurde auf Initiative einer Gruppe von Năsăuder Gelehrten unter der Führung des Reservemajors Iulian Marțian die Organisation eines Museums beschlossen. Zu diesem Zweck wurde eine Bekanntmachung veröffentlicht, die besagte, dass das Kunstministerium der Gründung eines regionalen Museums in Năsăud zustimmte, ein Museum, das vorübergehend in einem der Säle des Grenzwacht-Gymnasiums "George Coșbuc" in der Ortschaft untergebracht werden sollte.'
    },
    'istoricP5': {
      'ro': 'Se face apel către persoanele ce au în posesie cărţi, manuscrise, desene, picturi, monede, vase de lut, ţesături vechi populare, instrumente, obiecte de tehnică populară sau orice alt fel de obiecte să le doneze sau să le vândă acestei instituţii. În aceste circumstanţe, inspectorul general al muzeelor, pe numele său Alexandru Tzigara-Samurcaş, îi aduce lui Iulian Marţian o subvenţie de 10.000 de lei din partea ministrului de resort, pentru crearea unei secţiuni de etnografie în cadrul respectivului muzeu.',
      'en': 'An appeal is made to people who possess books, manuscripts, drawings, paintings, coins, clay vessels, old folk textiles, instruments, folk technology objects or any other kind of objects to donate or sell them to this institution. Under these circumstances, the general inspector of museums, Alexandru Tzigara-Samurcaș, brought Iulian Marțian a subsidy of 10,000 lei from the relevant minister, for the creation of an ethnography section within the respective museum.',
      'de': 'Es wird an Personen appelliert, die Bücher, Manuskripte, Zeichnungen, Gemälde, Münzen, Tongefäße, alte Volkstextilien, Instrumente, Objekte der Volkstechnik oder andere Arten von Objekten besitzen, diese der Institution zu spenden oder zu verkaufen. Unter diesen Umständen brachte der Generalinspektor der Museen, Alexandru Tzigara-Samurcaș, Iulian Marțian eine Subvention von 10.000 Lei vom zuständigen Minister für die Schaffung einer Ethnographie-Abteilung innerhalb des jeweiligen Museums.'
    },
    'istoricP6': {
      'ro': 'Cu ajutorul a încă 5.000 de lei ce se găseau în posesia muzeului, au fost strânse suficiente materiale etnografice pentru a se putea declanşa acţiunea de organizare a muzeului. Dar, pe parcurs, entuziasmul s-a stins, iar începând cu anul 1926 încetează acţiunea de strângere a materialelor necesare amenajării muzeului.',
      'en': 'With the help of another 5,000 lei that the museum possessed, sufficient ethnographic materials were gathered to be able to launch the museum organization action. But, over time, the enthusiasm waned, and starting with 1926, the action of gathering the materials necessary for the museum\'s arrangement ceased.',
      'de': 'Mit Hilfe weiterer 5.000 Lei, die das Museum besaß, wurden ausreichend ethnographische Materialien gesammelt, um die Museumsorganisationsaktion starten zu können. Aber mit der Zeit ließ die Begeisterung nach, und ab 1926 hörte die Sammlung der für die Museumseinrichtung notwendigen Materialien auf.'
    },
    'istoricP7': {
      'ro': 'Pe de altă parte, trebuie consemnată şi înfiinţarea, în 1924, din iniţiativa intelectualilor năsăudeni Iuliu Moisil, Virgil Şotropa şi Iulian Marţian, a revistei de orientare istorică şi culturală Arhiva Someşană. Din ea se desprindea clar necesitatea extinderii activităţii de cercetare a ţinutului grăniceresc şi, de asemenea, necesitatea expunerii şi valorificării vestigiilor trecutului într-o instituţie specializată în acest scop.',
      'en': 'On the other hand, the establishment in 1924, on the initiative of the Năsăud intellectuals Iuliu Moisil, Virgil Șotropa and Iulian Marțian, of the historical and cultural magazine Arhiva Someșană must also be noted. From it, the need to extend the research activity of the border region clearly emerged, as well as the need to display and valorize the vestiges of the past in an institution specialized for this purpose.',
      'de': 'Andererseits muss auch die Gründung der historischen und kulturellen Zeitschrift Arhiva Someșană im Jahr 1924 auf Initiative der Năsăuder Intellektuellen Iuliu Moisil, Virgil Șotropa und Iulian Marțian erwähnt werden. Daraus ging klar die Notwendigkeit hervor, die Forschungstätigkeit der Grenzregion zu erweitern sowie die Notwendigkeit, die Überreste der Vergangenheit in einer darauf spezialisierten Institution auszustellen und zu verwerten.'
    },
    'istoricP8': {
      'ro': 'Lucrurile încep să evolueze din nou favorabil după ce are loc alegerea lui Iuliu Moisil în funcţia de preşedinte al Despărţământului Năsăud al „Astrei". Acesta împreună cu Virgil Şotropa, Iulian Marţian, Alexa David şi Artene Mureşan au luat decizia de a înfiinţa neîntârziat muzeul.',
      'en': 'Things began to evolve favorably again after Iuliu Moisil was elected president of the Năsăud Branch of "Astra". He, together with Virgil Șotropa, Iulian Marțian, Alexa David and Artene Mureșan, decided to establish the museum without delay.',
      'de': 'Die Dinge begannen wieder günstig zu verlaufen, nachdem Iuliu Moisil zum Präsidenten der Năsăuder Zweigstelle der "Astra" gewählt wurde. Er beschloss zusammen mit Virgil Șotropa, Iulian Marțian, Alexa David und Artene Mureșan, das Museum unverzüglich zu gründen.'
    },
    'istoricP9': {
      'ro': 'În după-masa zilei de 2 august 1931, cei cinci pomeniţi anterior, adunaţi în casa maiorului Iulian Marţian, au semnat actul de constituire a Muzeului Năsăudean. În acest scop, ei au donat recent-înfiinţatei instituţii colecţii de documente, manuscrise, publicaţii, diplome, cărţi şi alte piese de muzeu, obiecte adunate cu trudă în timpul vieţii şi care se aflau în proprietatea lor personală.',
      'en': 'On the afternoon of August 2, 1931, the five mentioned earlier, gathered in Major Iulian Marțian\'s house, signed the act of establishment of the Năsăud Museum. For this purpose, they donated to the newly established institution collections of documents, manuscripts, publications, diplomas, books and other museum pieces, objects gathered with toil during their lifetime and which were in their personal property.',
      'de': 'Am Nachmittag des 2. August 1931 unterzeichneten die fünf zuvor erwähnten Personen, die sich im Haus von Major Iulian Marțian versammelt hatten, die Gründungsurkunde des Năsăud-Museums. Zu diesem Zweck spendeten sie der neu gegründeten Institution Sammlungen von Dokumenten, Manuskripten, Publikationen, Diplomen, Büchern und anderen Museumsstücken, Objekten, die sie mühsam während ihres Lebens gesammelt hatten und die sich in ihrem persönlichen Eigentum befanden.'
    },
    'istoricP10': {
      'ro': 'Iuliu Moisil arată şi care este scopul muzeului, şi anume: „Scopul acestui muzeu este de a forma un centru în jurul căruia să se grupeze toţi cei ce doresc să contribuie la studiul, explorarea ţinutului nostru din diferite puncte de vedere: preistoric, istoric, turistic, al ştiinţelor naturale, igienic, şcolar, agricol, industrial, patriotic – pentru a dezvolta, populaţiei acestui ţinut gustul pentru istorie, literatură, artă şi ştiinţă, a crea şi organiza forţele necesare pentru ridicarea culturală, economică, a ţinutului".',
      'en': 'Iuliu Moisil also shows what the purpose of the museum is, namely: "The purpose of this museum is to form a center around which all those who wish to contribute to the study and exploration of our region from different points of view should gather: prehistoric, historical, tourist, natural sciences, hygienic, school, agricultural, industrial, patriotic – to develop in the population of this region the taste for history, literature, art and science, to create and organize the necessary forces for the cultural and economic elevation of the region".',
      'de': 'Iuliu Moisil zeigt auch, was der Zweck des Museums ist, nämlich: "Der Zweck dieses Museums ist es, ein Zentrum zu bilden, um das sich all jene versammeln sollen, die zur Erforschung und Erkundung unserer Region aus verschiedenen Gesichtspunkten beitragen möchten: prähistorisch, historisch, touristisch, naturwissenschaftlich, hygienisch, schulisch, landwirtschaftlich, industriell, patriotisch – um in der Bevölkerung dieser Region den Geschmack für Geschichte, Literatur, Kunst und Wissenschaft zu entwickeln, die notwendigen Kräfte für die kulturelle und wirtschaftliche Erhebung der Region zu schaffen und zu organisieren".'
    },
    'istoricP11': {
      'ro': 'În urma cererii fondatorilor, Administraţia Fondurilor Grănicereşti Năsăudene aprobă în acelaşi an, 1931, punerea la dispoziţia acestora a două săli mari în incinta imobilului fostului internat al Liceului „George Coşbuc" din Năsăud, pentru a se înfiinţa un muzeu şi o bibliotecă. La data de 6 februarie 1932 se pun bazele instituţiei culturale intitulată Muzeul Năsăudean, cu acest prilej redactându-se şi statutele acestei instituţii. În continuare s-a purces la acţiunea de executare a mobilierului necesar, precum şi la aranjarea primelor colecţii obţinute din donaţii. În această clădire Muzeul Năsăudean va fiinţa până la data de 1 octombrie 1948.',
      'en': 'Following the founders\' request, the Administration of the Năsăud Border Guard Funds approved in the same year, 1931, the provision of two large halls within the building of the former boarding school of the "George Coșbuc" High School in Năsăud, for the establishment of a museum and a library. On February 6, 1932, the foundations of the cultural institution called the Năsăud Museum were laid, on this occasion the statutes of this institution were also drafted. Subsequently, the action of making the necessary furniture, as well as arranging the first collections obtained from donations, was undertaken. The Năsăud Museum would exist in this building until October 1, 1948.',
      'de': 'Auf Antrag der Gründer genehmigte die Verwaltung der Năsăuder Grenzwachtfonds im selben Jahr 1931 die Bereitstellung von zwei großen Sälen innerhalb des Gebäudes des ehemaligen Internats des "George Coșbuc"-Gymnasiums in Năsăud für die Gründung eines Museums und einer Bibliothek. Am 6. Februar 1932 wurden die Grundlagen der kulturellen Institution namens Năsăud-Museum gelegt, bei dieser Gelegenheit wurden auch die Statuten dieser Institution verfasst. Anschließend wurde mit der Herstellung der notwendigen Möbel sowie der Anordnung der ersten aus Spenden erhaltenen Sammlungen begonnen. Das Năsăud-Museum würde bis zum 1. Oktober 1948 in diesem Gebäude bestehen.'
    },
    'istoricP12': {
      'ro': 'Datorită donaţiilor făcute de diferite persoane iubitoare de cultură, are loc treptat mărirea fondului documentar, aşa încât în anul 1937 revista Arhiva Someşană precizează că Muzeul Năsăudean dispune de patru secţii, după cum urmează:',
      'en': 'Thanks to donations made by various culture-loving people, the documentary fund gradually increased, so that in 1937 the magazine Arhiva Someșană specified that the Năsăud Museum had four sections, as follows:',
      'de': 'Dank der Spenden verschiedener kulturliebender Menschen vergrößerte sich der Dokumentenfonds allmählich, so dass 1937 die Zeitschrift Arhiva Someșană angab, dass das Năsăud-Museum vier Abteilungen hatte, wie folgt:'
    },
    'istoricLi1': {
      'ro': 'I. Biblioteca, cu un număr mare de cărţi, cele mai multe dintre ele vechi, câştigate din colecţiile a diferite persoane, îndeosebi profesori.',
      'en': 'I. The Library, with a large number of books, most of them old, obtained from the collections of various people, especially teachers.',
      'de': 'I. Die Bibliothek, mit einer großen Anzahl von Büchern, die meisten davon alt, erhalten aus den Sammlungen verschiedener Personen, insbesondere Lehrern.'
    },
    'istoricLi2': {
      'ro': 'II. O arhivă bogată în acte, manuscrise, documente, corespondenţă care fac referire la istoria şi oamenii marcanţi din ţinutul Năsăudului.',
      'en': 'II. A rich archive of deeds, manuscripts, documents, correspondence referring to the history and prominent people of the Năsăud region.',
      'de': 'II. Ein reiches Archiv von Urkunden, Manuskripten, Dokumenten, Korrespondenz, die sich auf die Geschichte und prominenten Personen der Region Năsăud beziehen.'
    },
    'istoricLi3': {
      'ro': 'III. Colecţii de diferite obiecte de muzeu.',
      'en': 'III. Collections of various museum objects.',
      'de': 'III. Sammlungen verschiedener Museumsobjekte.'
    },
    'istoricLi4': {
      'ro': 'IV. Portrete de fruntaşi ai grănicerilor şi fotografii.',
      'en': 'IV. Portraits of border guard leaders and photographs.',
      'de': 'IV. Porträts von Grenzwachtführern und Fotografien.'
    },
    'istoricP13': {
      'ro': 'Pentru sporirea autorităţii muzeului şi pentru îmbunătăţirea condiţiilor de funcţionare, fondatorii insistă pentru transformarea lui în instituţie de stat. Astfel, datorită demersurilor făcute de Iuliu Moisil, Direcţia Generală a Arhivelor Statului înfiinţează, în noiembrie 1937, o Subdirecţie a Arhivelor Statului în oraşul Năsăud. Această instituţie nouă cuprindea:',
      'en': 'To increase the museum\'s authority and improve operating conditions, the founders insisted on transforming it into a state institution. Thus, thanks to the efforts made by Iuliu Moisil, the General Directorate of State Archives established, in November 1937, a Sub-directorate of State Archives in the city of Năsăud. This new institution included:',
      'de': 'Um die Autorität des Museums zu erhöhen und die Betriebsbedingungen zu verbessern, bestanden die Gründer auf der Umwandlung in eine staatliche Institution. So gründete dank der Bemühungen von Iuliu Moisil die Generaldirektion der Staatsarchive im November 1937 eine Unterdirektion der Staatsarchive in der Stadt Năsăud. Diese neue Institution umfasste:'
    },
    'istoricLi5': {
      'ro': '1) toate arhivele vechi ale autorităţilor civile, bisericeşti şi militare ale statului, judeţului şi comunelor din judeţul Năsăud de la acea vreme;',
      'en': '1) all the old archives of the civil, ecclesiastical and military authorities of the state, county and communes of Năsăud county from that time;',
      'de': '1) alle alten Archive der zivilen, kirchlichen und militärischen Behörden des Staates, des Kreises und der Gemeinden des Kreises Năsăud aus jener Zeit;'
    },
    'istoricLi6': {
      'ro': '2) arhiva, biblioteca şi obiectele de muzeu ale societăţii Muzeul Năsăudean;',
      'en': '2) the archive, library and museum objects of the Năsăud Museum society;',
      'de': '2) das Archiv, die Bibliothek und die Museumsobjekte der Gesellschaft Năsăud-Museum;'
    },
    'istoricLi7': {
      'ro': '3) arhivele şi bibliotecile instituţiilor grănicereşti şi ale persoanelor particulare din judeţ.',
      'en': '3) the archives and libraries of border guard institutions and private individuals in the county.',
      'de': '3) die Archive und Bibliotheken der Grenzwachtinstitutionen und Privatpersonen im Kreis.'
    },
    'istoricP14': {
      'ro': 'În actul de donaţie făcut de fondatorii muzeului, se specifica faptul că atât arhiva, cât şi muzeul şi biblioteca ce vor fi dăruite să nu se înstrăineze niciodată, să nu fie duse în altă localitate, ci să rămână pentru totdeauna în oraşul Năsăud. Principalul organ de publicitate al muzeului era revista Arhiva Someşană, aflată acum sub conducerea lui Virgil Şotropa. Profesorul pensionar Iuliu Moisil a îndeplinit, fără retribuţie, funcţia de director al muzeului.',
      'en': 'In the donation act made by the museum founders, it was specified that both the archive, the museum and the library that would be donated should never be alienated, should not be taken to another locality, but should remain forever in the city of Năsăud. The main publicity organ of the museum was the magazine Arhiva Someșană, now under the leadership of Virgil Șotropa. The retired professor Iuliu Moisil fulfilled, without remuneration, the function of museum director.',
      'de': 'In der von den Museumsgründern gemachten Schenkungsurkunde wurde festgelegt, dass sowohl das Archiv als auch das Museum und die Bibliothek, die gespendet werden sollten, niemals veräußert werden sollten, nicht in eine andere Ortschaft gebracht werden sollten, sondern für immer in der Stadt Năsăud verbleiben sollten. Das wichtigste Publizitätsorgan des Museums war die Zeitschrift Arhiva Someșană, die nun unter der Leitung von Virgil Șotropa stand. Der pensionierte Professor Iuliu Moisil erfüllte ohne Vergütung die Funktion des Museumsdirektors.'
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
    },
    
    // Menu translations
    'menuMuseumName': {
      'ro': 'Muzeul Grăniceresc Năsăudean',
      'en': 'Năsăud Border Guard Museum',
      'de': 'Näsäuder Grenzschutzmuseum'
    },
    'menuHome': {
      'ro': 'Acasă',
      'en': 'Home',
      'de': 'Startseite'
    },
    'menuHistory': {
      'ro': 'Istoric',
      'en': 'History',
      'de': 'Geschichte'
    },
    'menuReservations': {
      'ro': 'Rezervări',
      'en': 'Reservations',
      'de': 'Reservierungen'
    },
    'menuEvents': {
      'ro': 'Evenimente',
      'en': 'Events',
      'de': 'Veranstaltungen'
    },
    'menuPricesContact': {
      'ro': 'Tarife & Contact',
      'en': 'Prices & Contact',
      'de': 'Preise & Kontakt'
    },
    
    // Home page translations
    'welcomeTitle': {
      'ro': 'Bine ați venit la Muzeul Grăniceresc Năsăudean',
      'en': 'Welcome to the Năsăud Border Guard Museum',
      'de': 'Willkommen im Năsăuder Grenzwacht-Museum'
    },
    'exploreMuseum': {
      'ro': 'Explorează Muzeul',
      'en': 'Explore the Museum',
      'de': 'Museum erkunden'
    },
    'permanentExhibitions': {
      'ro': 'Expoziții Permanente',
      'en': 'Permanent Exhibitions',
      'de': 'Dauerausstellungen'
    },
    'permanentExhibitionsDesc': {
      'ro': 'Descoperă colecțiile noastre valoroase',
      'en': 'Discover our valuable collections',
      'de': 'Entdecken Sie unsere wertvollen Sammlungen'
    },
    'museumLandscapes': {
      'ro': 'Peisaje din curtea muzeului',
      'en': 'Museum Courtyard Landscapes',
      'de': 'Museumshof-Landschaften'
    },
    'museumLandscapesDesc': {
      'ro': 'Frumusețea exterioară a muzeului',
      'en': 'The exterior beauty of the museum',
      'de': 'Die äußere Schönheit des Museums'
    },
    'friendsOfMuseum': {
      'ro': 'Prietenii Muzeului',
      'en': 'Friends of the Museum',
      'de': 'Freunde des Museums'
    },
    'friendsOfMuseumDesc': {
      'ro': 'Comunitatea care susține muzeul',
      'en': 'The community that supports the museum',
      'de': 'Die Gemeinschaft, die das Museum unterstützt'
    },
    'news': {
      'ro': 'Noutăți',
      'en': 'News',
      'de': 'Neuigkeiten'
    },
    'noPosts': {
      'ro': 'Nu există postări momentan.',
      'en': 'No posts available at the moment.',
      'de': 'Momentan sind keine Beiträge verfügbar.'
    },
    
    // Events page translations
    'eventsCalendarTitle': {
      'ro': 'Calendar Evenimente',
      'en': 'Events Calendar',
      'de': 'Veranstaltungskalender'
    },
    'eventsAdminDescription': {
      'ro': 'Sunteți autentificat ca administrator. Puteți adăuga evenimente noi făcând click pe o dată în calendar.',
      'en': 'You are authenticated as administrator. You can add new events by clicking on a date in the calendar.',
      'de': 'Sie sind als Administrator authentifiziert. Sie können neue Veranstaltungen hinzufügen, indem Sie auf ein Datum im Kalender klicken.'
    },
    'eventsHideList': {
      'ro': 'Ascunde lista de evenimente',
      'en': 'Hide events list',
      'de': 'Veranstaltungsliste ausblenden'
    },
    'eventsShowList': {
      'ro': 'Arată lista de evenimente',
      'en': 'Show events list',
      'de': 'Veranstaltungsliste anzeigen'
    },
    'eventsListTitle': {
      'ro': 'Lista de evenimente',
      'en': 'Events List',
      'de': 'Veranstaltungsliste'
    },
    'eventsTableId': {
      'ro': 'ID',
      'en': 'ID',
      'de': 'ID'
    },
    'eventsTableName': {
      'ro': 'Nume eveniment',
      'en': 'Event Name',
      'de': 'Veranstaltungsname'
    },
    'eventsTableStartDate': {
      'ro': 'Data început',
      'en': 'Start Date',
      'de': 'Startdatum'
    },
    'eventsTableEndDate': {
      'ro': 'Data sfârșit',
      'en': 'End Date',
      'de': 'Enddatum'
    },
    'eventsTableLocation': {
      'ro': 'Locație',
      'en': 'Location',
      'de': 'Ort'
    },
    'eventsTableDescription': {
      'ro': 'Descriere',
      'en': 'Description',
      'de': 'Beschreibung'
    },
    'eventsTableImages': {
      'ro': 'Imagini',
      'en': 'Images',
      'de': 'Bilder'
    },
    'eventsTableActions': {
      'ro': 'Acțiuni',
      'en': 'Actions',
      'de': 'Aktionen'
    },
    'eventsNoDescription': {
      'ro': 'Fără descriere',
      'en': 'No description',
      'de': 'Keine Beschreibung'
    },
    'eventsEditTooltip': {
      'ro': 'Editează eveniment',
      'en': 'Edit event',
      'de': 'Veranstaltung bearbeiten'
    },
    'eventsDeleteTooltip': {
      'ro': 'Șterge eveniment',
      'en': 'Delete event',
      'de': 'Veranstaltung löschen'
    },
    'eventsNoEvents': {
      'ro': 'Nu există evenimente înregistrate',
      'en': 'No registered events',
      'de': 'Keine registrierten Veranstaltungen'
    },
    'eventsUserDescription': {
      'ro': 'Descoperiți evenimentele organizate de Muzeul Grăniceresc Năsăudean. Faceți click pe un eveniment pentru a vedea detaliile.',
      'en': 'Discover the events organized by the Năsăud Border Guard Museum. Click on an event to see the details.',
      'de': 'Entdecken Sie die vom Năsăuder Grenzwacht-Museum organisierten Veranstaltungen. Klicken Sie auf eine Veranstaltung, um die Details zu sehen.'
    },
    'eventsVisitUsTitle': {
      'ro': 'Vizitați-ne',
      'en': 'Visit Us',
      'de': 'Besuchen Sie uns'
    },
    'eventsVisitUsDesc': {
      'ro': 'Programul de vizitare este zilnic între orele 9:00 - 17:00, cu excepția zilei de luni.',
      'en': 'Visiting hours are daily from 9:00 AM - 5:00 PM, except Mondays.',
      'de': 'Die Besuchszeiten sind täglich von 9:00 - 17:00 Uhr, außer montags.'
    },
    'eventsSpecialTitle': {
      'ro': 'Evenimente speciale',
      'en': 'Special Events',
      'de': 'Besondere Veranstaltungen'
    },
    'eventsSpecialDesc': {
      'ro': 'Urmăriți calendarul pentru expoziții temporare, târguri și alte activități culturale.',
      'en': 'Follow the calendar for temporary exhibitions, fairs and other cultural activities.',
      'de': 'Verfolgen Sie den Kalender für Wechselausstellungen, Messen und andere kulturelle Aktivitäten.'
    },
    'eventsAnnouncementsTitle': {
      'ro': 'Anunțuri',
      'en': 'Announcements',
      'de': 'Ankündigungen'
    },
    'eventsAnnouncementsDesc': {
      'ro': 'Verificați periodic pentru noutăți și anunțuri importante legate de programul muzeului.',
      'en': 'Check periodically for news and important announcements related to the museum program.',
      'de': 'Überprüfen Sie regelmäßig Neuigkeiten und wichtige Ankündigungen zum Museumsprogramm.'
    },
    
    // Additional reservations translations
    'rezervariListTitle': {
      'ro': 'Lista Rezervărilor',
      'en': 'Reservations List',
      'de': 'Reservierungsliste'
    },
    'rezervariTableLastName': {
      'ro': 'Nume',
      'en': 'Last Name',
      'de': 'Nachname'
    },
    'rezervariTableFirstName': {
      'ro': 'Prenume',
      'en': 'First Name',
      'de': 'Vorname'
    },
    'rezervariTableEmail': {
      'ro': 'Email',
      'en': 'Email',
      'de': 'E-Mail'
    },
    'rezervariTableDateTime': {
      'ro': 'Data și Ora Vizitei',
      'en': 'Date and Time of Visit',
      'de': 'Datum und Uhrzeit des Besuchs'
    },
    'rezervariTableCreatedAt': {
      'ro': 'Data Creării',
      'en': 'Creation Date',
      'de': 'Erstellungsdatum'
    },
    'rezervariTablePersons': {
      'ro': 'Persoane',
      'en': 'Persons',
      'de': 'Personen'
    },
    'rezervariTableGuide': {
      'ro': 'Ghid',
      'en': 'Guide',
      'de': 'Führer'
    },
    'rezervariTableStatus': {
      'ro': 'Status',
      'en': 'Status',
      'de': 'Status'
    },
    'rezervariTableActions': {
      'ro': 'Acțiuni',
      'en': 'Actions',
      'de': 'Aktionen'
    },
    'rezervariYes': {
      'ro': 'Da',
      'en': 'Yes',
      'de': 'Ja'
    },
    'rezervariNo': {
      'ro': 'Nu',
      'en': 'No',
      'de': 'Nein'
    },
    'rezervariApprove': {
      'ro': 'Aprobă',
      'en': 'Approve',
      'de': 'Genehmigen'
    },
    'rezervariReject': {
      'ro': 'Respinge',
      'en': 'Reject',
      'de': 'Ablehnen'
    },
    'rezervariDelete': {
      'ro': 'Șterge',
      'en': 'Delete',
      'de': 'Löschen'
    },
    'rezervariNoBookings': {
      'ro': 'Nu există rezervări momentan',
      'en': 'No reservations at the moment',
      'de': 'Momentan keine Reservierungen'
    },
    'rezervariImportant': {
      'ro': 'Important:',
      'en': 'Important:',
      'de': 'Wichtig:'
    },
    'rezervariConfirmationEmail': {
      'ro': 'După trimiterea formularului, veți primi un email de confirmare.',
      'en': 'After submitting the form, you will receive a confirmation email.',
      'de': 'Nach dem Absenden des Formulars erhalten Sie eine Bestätigungs-E-Mail.'
    },
    'rezervariActivation': {
      'ro': 'Rezervarea va deveni activă doar după confirmarea email-ului prin click pe link-ul primit.',
      'en': 'The reservation will become active only after confirming the email by clicking on the received link.',
      'de': 'Die Reservierung wird erst aktiv, nachdem Sie die E-Mail durch Klicken auf den erhaltenen Link bestätigt haben.'
    },
    'rezervariChanges': {
      'ro': 'Pentru modificări sau anulări, vă rugăm să contactați muzeul la numărul de telefon afișat pe pagina de contact.',
      'en': 'For changes or cancellations, please contact the museum at the phone number displayed on the contact page.',
      'de': 'Für Änderungen oder Stornierungen wenden Sie sich bitte an das Museum unter der auf der Kontaktseite angezeigten Telefonnummer.'
    },
    'rezervariThankYou': {
      'ro': 'Vă mulțumim și vă așteptăm cu drag la muzeu!',
      'en': 'Thank you and we look forward to welcoming you to the museum!',
      'de': 'Vielen Dank und wir freuen uns darauf, Sie im Museum begrüßen zu dürfen!'
    },
    
    // Publications page translations
    'publicationsBackToHistory': {
      'ro': 'Înapoi la Istoric',
      'en': 'Back to History',
      'de': 'Zurück zur Geschichte'
    },
    'publicationsTitle': {
      'ro': 'Publicații',
      'en': 'Publications',
      'de': 'Publikationen'
    },
    'publicationsArhivaSomesana': {
      'ro': 'Arhiva Someșană',
      'en': 'Someș Archive',
      'de': 'Someș-Archiv'
    },
    'publicationsReviste': {
      'ro': 'Reviste',
      'en': 'Magazines',
      'de': 'Zeitschriften'
    },
    'publicationsArhivaSomesanaDesc': {
      'ro': 'Colecție de articole istorice și documente despre regiunea Someșană. Faceți click pe imagini pentru a le vizualiza în galerie.',
      'en': 'Collection of historical articles and documents about the Someș region. Click on images to view them in the gallery.',
      'de': 'Sammlung historischer Artikel und Dokumente über die Someș-Region. Klicken Sie auf die Bilder, um sie in der Galerie anzuzeigen.'
    },
    'publicationsRevisteDesc': {
      'ro': 'Colecție de reviste istorice. Faceți click pe imagini pentru a le vizualiza în galerie.',
      'en': 'Collection of historical magazines. Click on images to view them in the gallery.',
      'de': 'Sammlung historischer Zeitschriften. Klicken Sie auf die Bilder, um sie in der Galerie anzuzeigen.'
    },
    'publicationsPage': {
      'ro': 'Pagina',
      'en': 'Page',
      'de': 'Seite'
    },
    'publicationsCover': {
      'ro': 'Coperta',
      'en': 'Cover',
      'de': 'Umschlag'
    },
    'publicationsMagazine': {
      'ro': 'Revista',
      'en': 'Magazine',
      'de': 'Zeitschrift'
    },
    'publicationsZoomOut': {
      'ro': 'Micșorează',
      'en': 'Zoom Out',
      'de': 'Verkleinern'
    },
    'publicationsZoomIn': {
      'ro': 'Mărește',
      'en': 'Zoom In',
      'de': 'Vergrößern'
    },
    'publicationsResetZoom': {
      'ro': 'Resetează zoom',
      'en': 'Reset Zoom',
      'de': 'Zoom zurücksetzen'
    },
    
    // Restul paragrafelor din pagina istoric
    'istoricP15': {
      'ro': 'În perioada ocupaţiei maghiare a Ardealului (1940-1944), şi apoi în timpul retragerii trupelor horthyste (în toamna anului 1944), colecţiile muzeului au fost devastate, distruse şi chiar înstrăinate de către ocupanţii străini.',
      'en': 'During the period of Hungarian occupation of Transylvania (1940-1944), and then during the retreat of Horthy troops (in the fall of 1944), the museum collections were devastated, destroyed and even alienated by foreign occupiers.',
      'de': 'Während der Zeit der ungarischen Besetzung Siebenbürgens (1940-1944) und dann während des Rückzugs der Horthy-Truppen (im Herbst 1944) wurden die Museumssammlungen von ausländischen Besatzern verwüstet, zerstört und sogar entfremdet.'
    },
    'istoricP16': {
      'ro': 'La data de 1 octombrie 1948, Administraţia Fondurilor Grănicereşti, aflată în lichidare, cedează Arhivelor Statului din oraşul Năsăud pentru obiectele de muzeu, pentru bibliotecă şi pentru arhivă, imobilul fostului hotel „Rahova" (localul ce adăpostise odinioară Casina, iar în prezent Jandarmeria Năsăudeană).',
      'en': 'On October 1, 1948, the Administration of Border Guard Funds, in liquidation, ceded to the State Archives of Năsăud city for museum objects, library and archive, the building of the former "Rahova" hotel (the premises that once housed the Casino, and currently the Năsăud Gendarmerie).',
      'de': 'Am 1. Oktober 1948 übertrug die Verwaltung der Grenzwachtfonds, die sich in Liquidation befand, dem Staatsarchiv der Stadt Năsăud für Museumsobjekte, Bibliothek und Archiv das Gebäude des ehemaligen Hotels „Rahova" (die Räumlichkeiten, die einst das Casino beherbergten und derzeit die Năsăuder Gendarmerie).'
    },
    'istoricP17': {
      'ro': 'Cedarea s-a făcut acordându-se dreptul de folosinţă gratuită. La parterul acestei clădiri s-a reuşit să se organizeze, după un an, în cinci săli spaţioase, o expoziţie ce avea caracter istoric şi etnografic. Această expoziţie va constitui nucleul muzeului de mai târziu, muzeu care, ca instituţie bugetară de stat, se va deschide în anul 1950. Toată colecţia muzeistică (care, între timp, s-a îmbogăţit cu diferite obiecte obţinute în urma unor donaţii particulare) se va muta în anul 1951 în vechea clădire a „Şvardei", unde se află şi acum. Mai întâi s-a numit Muzeul Regional Năsăud, apoi Muzeul Raional Năsăud şi actualmente Muzeul Grăniceresc Năsăudean.',
      'en': 'The transfer was made by granting the right to free use. On the ground floor of this building, after one year, an exhibition with historical and ethnographic character was successfully organized in five spacious halls. This exhibition would constitute the nucleus of the later museum, which, as a state budgetary institution, would open in 1950. The entire museum collection (which, in the meantime, was enriched with various objects obtained from private donations) would move in 1951 to the old building of "Švarda", where it is still located today. It was first called the Regional Museum of Năsăud, then the District Museum of Năsăud and currently the Năsăud Border Guard Museum.',
      'de': 'Die Übertragung erfolgte durch Gewährung des Rechts auf kostenlose Nutzung. Im Erdgeschoss dieses Gebäudes wurde nach einem Jahr erfolgreich eine Ausstellung mit historischem und ethnographischem Charakter in fünf geräumigen Sälen organisiert. Diese Ausstellung würde den Kern des späteren Museums bilden, das als staatliche Haushaltseinrichtung 1950 eröffnet werden sollte. Die gesamte Museumssammlung (die inzwischen durch verschiedene Objekte aus privaten Spenden bereichert wurde) würde 1951 in das alte Gebäude der „Švarda" umziehen, wo es sich noch heute befindet. Es hieß zuerst Regionalmuseum Năsăud, dann Kreismuseum Năsăud und heute Năsăuder Grenzwachtmuseum.'
    },
    'istoricP18': {
      'ro': 'În ceea ce priveşte actuala clădire ce adăposteşte muzeul, trebuie menţionat că „Şvarda" este fosta cazarmă a Regimentului II Românesc de Graniţă: o clădire masivă, puternică inclusă astăzi pe lista monumentelor istorice naţionale. Aceasta a fost ridicată, după cum ne informează Virgil Şotropa, în anul 1770, an în care la Năsăud se clădeşte şi biserica romano-catolică.',
      'en': 'Regarding the current building that houses the museum, it must be mentioned that "Švarda" is the former barracks of the 2nd Romanian Border Regiment: a massive, powerful building included today on the list of national historical monuments. It was built, as Virgil Șotropa informs us, in 1770, the year when the Roman Catholic church was also built in Năsăud.',
      'de': 'Was das aktuelle Gebäude betrifft, das das Museum beherbergt, muss erwähnt werden, dass „Švarda" die ehemalige Kaserne des 2. Rumänischen Grenzregiments ist: ein massives, mächtiges Gebäude, das heute auf der Liste der nationalen historischen Denkmäler steht. Es wurde, wie uns Virgil Șotropa informiert, im Jahr 1770 erbaut, dem Jahr, in dem auch die römisch-katholische Kirche in Năsăud gebaut wurde.'
    },
    'istoricP19': {
      'ro': 'Iniţial „Şvarda" a avut două nivele, însă în anul 1815 Consiliul aulic al Transilvaniei aprobă dărâmarea etajului superior al cazărmii, din cauza faptului că pereţii începuseră a se crăpa, existând astfel ameninţarea prăbuşirii. Până la transformarea ei în muzeu, respectiva clădire a funcţionat, printre altele, şi cu rol de internat pentru elevii Şcolii Normale din localitate sau, moment nefericit, grajd pentru animale.',
      'en': 'Initially "Švarda" had two levels, but in 1815 the Aulic Council of Transylvania approved the demolition of the upper floor of the barracks, due to the fact that the walls had begun to crack, thus threatening collapse. Until its transformation into a museum, the respective building functioned, among other things, as a boarding school for students of the local Normal School or, unfortunately, as a stable for animals.',
      'de': 'Ursprünglich hatte „Švarda" zwei Ebenen, aber 1815 genehmigte der Aulische Rat von Siebenbürgen den Abriss des oberen Stockwerks der Kaserne, da die Wände zu reißen begonnen hatten und somit ein Einsturz drohte. Bis zu ihrer Umwandlung in ein Museum fungierte das jeweilige Gebäude unter anderem als Internat für Schüler der örtlichen Normalschule oder unglücklicherweise als Stall für Tiere.'
    },
    'istoricP20': {
      'ro': 'La cererea conducerii muzeului, între anii 1951-1954 şi după aceea, între anii 1961-1964, s-au făcut reparaţii capitale atât în interiorul cât şi în exteriorul clădirii muzeului. Reparaţiile au continuat şi după anul 1989 însă, datorită fondurilor insuficiente de care a beneficiat, muzeul n-a putut dobândi în întregime imaginea pe care o merita. Totuşi, trebuie amintită perioada 2001-2002, când din nou clădirea muzeului a fost supusă unor reparaţii capitale, obţinându-se un aspect corespunzător al edificiului. Începând cu anul 2006, s-au reluat lucrările în vederea reabilitării muzeului, de data aceasta în cadrul unui proiect de mare complexitate, ce a beneficiat şi de o finanţare Europeană (Fonduri Phare). Proiectul, care a urmărit continuarea lucrărilor de reparaţie începute în anul 2001, a vizat o serie de noi aspecte, iar unul dintre cele mai importante l-a constituit construirea unei clădiri noi în care se regăsesc birourile, o sală de conferinţe, o bibliotecă şi o sală ce are ca destinaţie depozitarea arhivei muzeului (documente, dosare, registre etc.). De „Zilele Năsăudului", în mai 2009, s-a inaugurat noua expoziţie de etnografie a muzeului, în prezenţa a numeroşi oaspeţi din Ţara Năsăudului, din judeţ şi din ţară.',
      'en': 'At the request of the museum management, between 1951-1954 and then between 1961-1964, major repairs were made both inside and outside the museum building. The repairs continued after 1989, but due to insufficient funds, the museum could not fully achieve the image it deserved. However, the period 2001-2002 must be mentioned, when the museum building was again subjected to major repairs, obtaining a proper appearance of the edifice. Starting in 2006, work resumed for the rehabilitation of the museum, this time within the framework of a highly complex project that also benefited from European funding (Phare Funds). The project, which aimed to continue the repair work begun in 2001, targeted a series of new aspects, and one of the most important was the construction of a new building housing offices, a conference hall, a library and a hall intended for storing the museum archive (documents, files, registers, etc.). During "Năsăud Days" in May 2009, the museum\'s new ethnography exhibition was inaugurated in the presence of numerous guests from Năsăud Land, the county and the country.',
      'de': 'Auf Antrag der Museumsleitung wurden zwischen 1951-1954 und dann zwischen 1961-1964 größere Reparaturen sowohl im Inneren als auch im Äußeren des Museumsgebäudes durchgeführt. Die Reparaturen wurden nach 1989 fortgesetzt, aber aufgrund unzureichender Mittel konnte das Museum nicht vollständig das Bild erreichen, das es verdiente. Dennoch muss die Periode 2001-2002 erwähnt werden, als das Museumsgebäude erneut größeren Reparaturen unterzogen wurde und ein angemessenes Aussehen des Gebäudes erhalten wurde. Ab 2006 wurden die Arbeiten zur Sanierung des Museums wieder aufgenommen, diesmal im Rahmen eines hochkomplexen Projekts, das auch von europäischen Mitteln (Phare-Fonds) profitierte. Das Projekt, das darauf abzielte, die 2001 begonnenen Reparaturarbeiten fortzusetzen, zielte auf eine Reihe neuer Aspekte ab, und einer der wichtigsten war der Bau eines neuen Gebäudes mit Büros, einem Konferenzsaal, einer Bibliothek und einem Saal zur Aufbewahrung des Museumsarchivs (Dokumente, Akten, Register usw.). Während der „Năsăud-Tage" im Mai 2009 wurde die neue ethnographische Ausstellung des Museums in Anwesenheit zahlreicher Gäste aus dem Năsăud-Land, dem Kreis und dem Land eingeweiht.'
    },
    'istoricP21': {
      'ro': 'În anul 2010 a fost finalizată amenajarea secţiei în aer liber, cu specific etnografic, în curtea din spate a muzeului, atracţia principală reprezentând-o o veche casă cu specific ţărănesc, strămutată din localitatea Ilva Mare. Inaugurarea acestei secţii în aer liber s-a făcut în luna decembrie 2010. Un an mai târziu, în decembrie 2011 a avut loc inaugurarea expoziţiei permanente de istorie. Tot legat de muzeul din Năsăud, mai trebuie menţionat faptul că încă din perioada interbelică s-a pus problema strângerii de fonduri băneşti pentru ridicarea unui bust al învăţătorului Vasile Naşcu, o personalitate marcantă a istoriei moderne a Năsăudului.',
      'en': 'In 2010, the arrangement of the outdoor section with ethnographic specifics was completed in the back courtyard of the museum, the main attraction being an old peasant-specific house, relocated from the locality of Ilva Mare. The inauguration of this outdoor section took place in December 2010. A year later, in December 2011, the inauguration of the permanent history exhibition took place. Also related to the museum in Năsăud, it must be mentioned that since the interwar period the issue of fundraising for the erection of a bust of teacher Vasile Nașcu, a prominent personality of Năsăud\'s modern history, was raised.',
      'de': 'Im Jahr 2010 wurde die Einrichtung des Freilichtbereichs mit ethnographischen Besonderheiten im Hinterhof des Museums abgeschlossen, wobei die Hauptattraktion ein altes bäuerliches Haus war, das aus der Ortschaft Ilva Mare verlegt wurde. Die Einweihung dieses Freilichtbereichs fand im Dezember 2010 statt. Ein Jahr später, im Dezember 2011, fand die Einweihung der permanenten Geschichtsausstellung statt. Ebenfalls im Zusammenhang mit dem Museum in Năsăud muss erwähnt werden, dass bereits in der Zwischenkriegszeit die Frage der Mittelbeschaffung für die Errichtung einer Büste des Lehrers Vasile Nașcu, einer prominenten Persönlichkeit der modernen Geschichte von Năsăud, aufgeworfen wurde.'
    },
    'istoricP22': {
      'ro': 'Abia în anul 1967, în urma eforturilor susţinute ale scriitorului Anton Coşbuc, s-a reuşit dezvelirea bustului lui Vasile Naşcu, operă în bronz a renumitului sculptor Corneliu Medrea. Respectivul bust se găseşte amplasat în curtea principală a Muzeului Grăniceresc Năsăudean.',
      'en': 'Only in 1967, following the sustained efforts of writer Anton Coșbuc, was the unveiling of Vasile Nașcu\'s bust achieved, a bronze work by the renowned sculptor Corneliu Medrea. The respective bust is located in the main courtyard of the Năsăud Border Guard Museum.',
      'de': 'Erst 1967, nach anhaltenden Bemühungen des Schriftstellers Anton Coșbuc, wurde die Enthüllung der Büste von Vasile Nașcu erreicht, ein Bronzewerk des renommierten Bildhauers Corneliu Medrea. Die jeweilige Büste befindet sich im Haupthof des Năsăuder Grenzwachtmuseums.'
    },
    
    // Footer translations
    'footerLocation': {
      'ro': 'Locația',
      'en': 'Location',
      'de': 'Standort'
    },
    'footerAddress': {
      'ro': 'Strada Grănicerilor, nr 19',
      'en': 'Grănicerilor Street, no. 19',
      'de': 'Grănicerilor Straße, Nr. 19'
    },

    // Permanent Exhibitions translations
    'exhibitionsBackHome': {
      'ro': '← Înapoi la pagina principală',
      'en': '← Back to main page',
      'de': '← Zurück zur Hauptseite'
    },
    'exhibitionsPermanentTitle': {
      'ro': 'Expoziții Permanente',
      'en': 'Permanent Exhibitions',
      'de': 'Dauerausstellungen'
    },
    'exhibitionsIntroText': {
      'ro': 'Muzeul Grăniceresc Năsăudean găzduiește trei expoziții permanente care pun în valoare istoria, cultura și tradițiile regiunii. Vă invităm să descoperiți bogăția patrimoniului nostru prin intermediul acestor colecții valoroase.',
      'en': 'The Năsăud Border Guard Museum hosts three permanent exhibitions that highlight the history, culture and traditions of the region. We invite you to discover the richness of our heritage through these valuable collections.',
      'de': 'Das Năsăuder Grenzwacht-Museum beherbergt drei Dauerausstellungen, die die Geschichte, Kultur und Traditionen der Region hervorheben. Wir laden Sie ein, den Reichtum unseres Erbes durch diese wertvollen Sammlungen zu entdecken.'
    },
    'exhibitionsHistoryBtn': {
      'ro': 'Expoziția de Istorie',
      'en': 'History Exhibition',
      'de': 'Geschichtsausstellung'
    },
    'exhibitionsEthnographyBtn': {
      'ro': 'Expoziția de Etnografie',
      'en': 'Ethnography Exhibition',
      'de': 'Ethnographische Ausstellung'
    },
    'exhibitionsOutdoorBtn': {
      'ro': 'Secția în Aer Liber',
      'en': 'Outdoor Section',
      'de': 'Freiluftbereich'
    },
    'exhibitionsHistoryTitle': {
      'ro': 'Expoziția Permanentă de Istorie',
      'en': 'Permanent History Exhibition',
      'de': 'Permanente Geschichtsausstellung'
    },
    'exhibitionsHistoryInaugurated': {
      'ro': 'Inaugurată în decembrie 2011',
      'en': 'Inaugurated in December 2011',
      'de': 'Eingeweiht im Dezember 2011'
    },
    'exhibitionsHistoryDescription': {
      'ro': 'Această expoziție permanentă prezintă istoria fascinantă a Regimentului II Românesc de Graniță și impactul său asupra dezvoltării zonei Năsăud. Vizitatorii pot descoperi documentele, armele, uniformele și obiectele personale care ilustrează viața și activitatea grănicerilor năsăudeni. De asemenea, expoziția include o secțiune dedicată personalităților marcante care au contribuit la dezvoltarea culturală și istorică a regiunii.',
      'en': 'This permanent exhibition presents the fascinating history of the 2nd Romanian Border Regiment and its impact on the development of the Năsăud area. Visitors can discover the documents, weapons, uniforms and personal objects that illustrate the life and activity of the Năsăud border guards. The exhibition also includes a section dedicated to prominent personalities who contributed to the cultural and historical development of the region.',
      'de': 'Diese Dauerausstellung präsentiert die faszinierende Geschichte des 2. Rumänischen Grenzregiments und seinen Einfluss auf die Entwicklung des Gebiets Năsăud. Besucher können die Dokumente, Waffen, Uniformen und persönlichen Gegenstände entdecken, die das Leben und die Tätigkeit der Năsăuder Grenzwachen veranschaulichen. Die Ausstellung umfasst auch einen Bereich, der prominenten Persönlichkeiten gewidmet ist, die zur kulturellen und historischen Entwicklung der Region beigetragen haben.'
    },
    'exhibitionsEthnographyTitle': {
      'ro': 'Expoziția de Etnografie',
      'en': 'Ethnography Exhibition',
      'de': 'Ethnographische Ausstellung'
    },
    'exhibitionsEthnographyInaugurated': {
      'ro': 'Inaugurată în mai 2009, de "Zilele Năsăudului"',
      'en': 'Inaugurated in May 2009, during "Năsăud Days"',
      'de': 'Eingeweiht im Mai 2009, während der "Năsăud Tage"'
    },
    'exhibitionsEthnographyDescription': {
      'ro': 'Expoziția de etnografie prezintă tradițiile, costumele și obiceiurile specifice zonei Năsăud și Țării Năsăudului. Colecția cuprinde costume populare autentice, obiecte de uz casnic tradițional, instrumente de lucru și piese de artizanat local. Această expoziție oferă o perspectivă completă asupra vieții și culturii tradiționale din regiunea grănicerească năsăudeană.',
      'en': 'The ethnography exhibition presents the traditions, costumes and customs specific to the Năsăud area and Năsăud Land. The collection includes authentic folk costumes, traditional household objects, working tools and local handicraft pieces. This exhibition offers a complete perspective on traditional life and culture in the Năsăud border region.',
      'de': 'Die ethnographische Ausstellung präsentiert die Traditionen, Kostüme und Bräuche, die für das Gebiet Năsăud und das Năsăud-Land spezifisch sind. Die Sammlung umfasst authentische Volkstrachten, traditionelle Haushaltsgegenstände, Arbeitsgeräte und lokale Handwerksstücke. Diese Ausstellung bietet eine vollständige Perspektive auf das traditionelle Leben und die Kultur in der Năsăuder Grenzregion.'
    },
    'exhibitionsOutdoorTitle': {
      'ro': 'Secția în Aer Liber',
      'en': 'Outdoor Section',
      'de': 'Freiluftbereich'
    },
    'exhibitionsOutdoorCompleted': {
      'ro': 'Finalizată în 2010, inaugurată în decembrie 2010',
      'en': 'Completed in 2010, inaugurated in December 2010',
      'de': 'Abgeschlossen 2010, eingeweiht im Dezember 2010'
    },
    'exhibitionsOutdoorDescription': {
      'ro': 'Situată în curtea din spate a muzeului, secția în aer liber cu specific etnografic reprezintă o atracție unică. Centrul de atracție îl constituie o veche casă cu specific țărănesc, strămutată din localitatea Ilva Mare și reconstruită fidel în incinta muzeului. Această casă tradițională oferă vizitatorilor posibilitatea de a experimenta direct arhitectura și stilul de viață din satele năsăudene de odinioară.',
      'en': 'Located in the back courtyard of the museum, the outdoor section with ethnographic specifics represents a unique attraction. The center of attraction is an old peasant house, relocated from the village of Ilva Mare and faithfully reconstructed within the museum premises. This traditional house offers visitors the opportunity to directly experience the architecture and lifestyle of old Năsăud villages.',
      'de': 'Der im Hinterhof des Museums gelegene Freiluftbereich mit ethnographischen Besonderheiten stellt eine einzigartige Attraktion dar. Das Zentrum der Aufmerksamkeit ist ein altes Bauernhaus, das aus dem Dorf Ilva Mare verlegt und originalgetreu innerhalb des Museumsgeländes rekonstruiert wurde. Dieses traditionelle Haus bietet Besuchern die Möglichkeit, die Architektur und den Lebensstil alter Năsăuder Dörfer direkt zu erleben.'
    },
    'exhibitionsPrevious': {
      'ro': '❮ Anterior',
      'en': '❮ Previous',
      'de': '❮ Vorherige'
    },
    'exhibitionsNext': {
      'ro': 'Următorul ❯',
      'en': 'Next ❯',
      'de': 'Nächste ❯'
    },
    'exhibitionsPageInfo': {
      'ro': 'Pagina {currentPage} din {totalPages} ({totalImages} imagini în total)',
      'en': 'Page {currentPage} of {totalPages} ({totalImages} images in total)',
      'de': 'Seite {currentPage} von {totalPages} ({totalImages} Bilder insgesamt)'
    },
    'exhibitionsVisitingSchedule': {
      'ro': 'Program de vizitare',
      'en': 'Visiting schedule',
      'de': 'Besuchszeiten'
    },
    'exhibitionsVisitingDescription': {
      'ro': 'Expozițiile permanente pot fi vizitate în timpul programului normal al muzeului:',
      'en': 'The permanent exhibitions can be visited during the museum\'s normal hours:',
      'de': 'Die Dauerausstellungen können während der normalen Öffnungszeiten des Museums besucht werden:'
    },
    'exhibitionsTuesdayFriday': {
      'ro': 'Marți - Vineri:',
      'en': 'Tuesday - Friday:',
      'de': 'Dienstag - Freitag:'
    },
    'exhibitionsSaturdaySunday': {
      'ro': 'Sâmbătă - Duminică:',
      'en': 'Saturday - Sunday:',
      'de': 'Samstag - Sonntag:'
    },
    'exhibitionsMonday': {
      'ro': 'Luni:',
      'en': 'Monday:',
      'de': 'Montag:'
    },
    'exhibitionsClosed': {
      'ro': 'Închis',
      'en': 'Closed',
      'de': 'Geschlossen'
    },
    'exhibitionsGroupBooking': {
      'ro': 'Pentru grupuri organizate, vă rugăm să faceți o rezervare în prealabil.',
      'en': 'For organized groups, please make a reservation in advance.',
      'de': 'Für organisierte Gruppen bitten wir um eine Voranmeldung.'
    },

    // Museum Landscapes (Peisaje Muzeu) translations
    'landscapesBackHome': {
      'ro': '← Înapoi la pagina principală',
      'en': '← Back to main page',
      'de': '← Zurück zur Hauptseite'
    },
    'landscapesTitle': {
      'ro': 'Peisaje din curtea muzeului',
      'en': 'Museum Courtyard Landscapes',
      'de': 'Museumshof-Landschaften'
    },
    'landscapesIntroText': {
      'ro': 'Muzeul Grăniceresc Năsăudean este înconjurat de o curte minunată, cu peisaje ce reflectă frumusețea istorică și naturală a zonei. Aceste imagini surprind diversele perspective și elemente care compun spațiul exterior al muzeului.',
      'en': 'The Năsăud Border Guard Museum is surrounded by a wonderful courtyard, with landscapes that reflect the historical and natural beauty of the area. These images capture the various perspectives and elements that make up the exterior space of the museum.',
      'de': 'Das Năsăuder Grenzwacht-Museum ist von einem wunderschönen Hof umgeben, mit Landschaften, die die historische und natürliche Schönheit der Gegend widerspiegeln. Diese Bilder erfassen die verschiedenen Perspektiven und Elemente, die den Außenbereich des Museums ausmachen.'
    },
    'landscapesAdminSection': {
      'ro': 'Administrare imagini',
      'en': 'Image management',
      'de': 'Bildverwaltung'
    },
    'landscapesImageDescription': {
      'ro': 'Descriere imagine:',
      'en': 'Image description:',
      'de': 'Bildbeschreibung:'
    },
    'landscapesImageDescriptionPlaceholder': {
      'ro': 'Adaugă o descriere pentru imagine...',
      'en': 'Add a description for the image...',
      'de': 'Fügen Sie eine Beschreibung für das Bild hinzu...'
    },
    'landscapesSelectImages': {
      'ro': 'Selectează imagini',
      'en': 'Select images',
      'de': 'Bilder auswählen'
    },
    'landscapesSelectedFiles': {
      'ro': 'Fișiere selectate ({count}):',
      'en': 'Selected files ({count}):',
      'de': 'Ausgewählte Dateien ({count}):'
    },
    'landscapesRemoveFile': {
      'ro': 'Elimină fișierul',
      'en': 'Remove file',
      'de': 'Datei entfernen'
    },
    'landscapesUploadImages': {
      'ro': 'Încarcă imaginile ({count})',
      'en': 'Upload images ({count})',
      'de': 'Bilder hochladen ({count})'
    },
    'landscapesUploading': {
      'ro': 'Se încarcă {current}/{total}...',
      'en': 'Uploading {current}/{total}...',
      'de': 'Laden {current}/{total}...'
    },
    'landscapesNoImages': {
      'ro': 'Nu există imagini disponibile momentan.',
      'en': 'No images available at the moment.',
      'de': 'Momentan sind keine Bilder verfügbar.'
    },
    'landscapesDeleteImage': {
      'ro': 'Șterge imaginea',
      'en': 'Delete image',
      'de': 'Bild löschen'
    },
    'landscapesPrevious': {
      'ro': '❮ Anterior',
      'en': '❮ Previous',
      'de': '❮ Vorherige'
    },
    'landscapesNext': {
      'ro': 'Următorul ❯',
      'en': 'Next ❯',
      'de': 'Nächste ❯'
    },
    'landscapesPageInfo': {
      'ro': 'Pagina {currentPage} din {totalPages}',
      'en': 'Page {currentPage} of {totalPages}',
      'de': 'Seite {currentPage} von {totalPages}'
    },
    'landscapesPreviousImage': {
      'ro': 'Imaginea anterioară (←)',
      'en': 'Previous image (←)',
      'de': 'Vorheriges Bild (←)'
    },
    'landscapesNextImage': {
      'ro': 'Imaginea următoare (→)',
      'en': 'Next image (→)',
      'de': 'Nächstes Bild (→)'
    },
    'landscapesZoomOut': {
      'ro': 'Micșorează (-)',
      'en': 'Zoom out (-)',
      'de': 'Verkleinern (-)'
    },
    'landscapesZoomIn': {
      'ro': 'Mărește (+)',
      'en': 'Zoom in (+)',
      'de': 'Vergrößern (+)'
    },
    'landscapesResetZoom': {
      'ro': 'Resetează zoom (0)',
      'en': 'Reset zoom (0)',
      'de': 'Zoom zurücksetzen (0)'
    },
    'landscapesFullscreen': {
      'ro': 'Mod ecran complet (F)',
      'en': 'Fullscreen mode (F)',
      'de': 'Vollbildmodus (F)'
    },
    'landscapesExitFullscreen': {
      'ro': 'Ieșire din ecran complet (Esc)',
      'en': 'Exit fullscreen (Esc)',
      'de': 'Vollbild verlassen (Esc)'
    },

    // Friends of the Museum (Prietenii Muzeului) translations
    'friendsBackHome': {
      'ro': '← Înapoi la pagina principală',
      'en': '← Back to main page',
      'de': '← Zurück zur Hauptseite'
    },
    'friendsTitle': {
      'ro': 'Prietenii Muzeului',
      'en': 'Friends of the Museum',
      'de': 'Freunde des Museums'
    },
    'friendsIntroText': {
      'ro': 'Muzeul Grăniceresc Năsăudean este un loc plin de viață, unde istoria prinde culoare prin zâmbetele copiilor din școlile care ne vizitează cu entuziasm! Prietenii noștri sunt clasele pline de elevi curioși care descoperă cu ochii mari exponatele, voluntarii care ne ajută la târgurile de Crăciun și evenimentele speciale, familiile care petrec weekenduri frumoase explorând trecutul, și toți cei care își deschid inimile pentru patrimoniul cultural al Năsăudului. Fiecare vizitator, fiecare mână de ajutor, fiecare poveste împărtășită face din muzeul nostru un spațiu al comunității!',
      'en': 'The Năsăud Border Guard Museum is a lively place, where history comes to life through the smiles of children from schools who visit us with enthusiasm! Our friends are the classes full of curious students who discover the exhibits with wide eyes, the volunteers who help us at Christmas fairs and special events, the families who spend beautiful weekends exploring the past, and all those who open their hearts to the cultural heritage of Năsăud. Every visitor, every helping hand, every shared story makes our museum a community space!',
      'de': 'Das Năsăuder Grenzwacht-Museum ist ein lebendiger Ort, wo Geschichte durch die Lächeln der Kinder aus Schulen zum Leben erwacht, die uns mit Begeisterung besuchen! Unsere Freunde sind die Klassen voller neugieriger Schüler, die die Exponate mit großen Augen entdecken, die Freiwilligen, die uns bei Weihnachtsmärkten und besonderen Veranstaltungen helfen, die Familien, die schöne Wochenenden mit der Erkundung der Vergangenheit verbringen, und alle, die ihre Herzen für das kulturelle Erbe von Năsăud öffnen. Jeder Besucher, jede helfende Hand, jede geteilte Geschichte macht unser Museum zu einem Gemeinschaftsraum!'
    },
    'friendsAdminSection': {
      'ro': 'Administrare imagini',
      'en': 'Image management',
      'de': 'Bildverwaltung'
    },
    'friendsImageDescription': {
      'ro': 'Descriere imagine:',
      'en': 'Image description:',
      'de': 'Bildbeschreibung:'
    },
    'friendsImageDescriptionPlaceholder': {
      'ro': 'Adaugă o descriere pentru imagine...',
      'en': 'Add a description for the image...',
      'de': 'Fügen Sie eine Beschreibung für das Bild hinzu...'
    },
    'friendsSelectImages': {
      'ro': 'Selectează imagini',
      'en': 'Select images',
      'de': 'Bilder auswählen'
    },
    'friendsSelectedFiles': {
      'ro': 'Fișiere selectate ({count}):',
      'en': 'Selected files ({count}):',
      'de': 'Ausgewählte Dateien ({count}):'
    },
    'friendsRemoveFile': {
      'ro': 'Elimină fișierul',
      'en': 'Remove file',
      'de': 'Datei entfernen'
    },
    'friendsUploadImages': {
      'ro': 'Încarcă imaginile ({count})',
      'en': 'Upload images ({count})',
      'de': 'Bilder hochladen ({count})'
    },
    'friendsUploading': {
      'ro': 'Se încarcă {current}/{total}...',
      'en': 'Uploading {current}/{total}...',
      'de': 'Laden {current}/{total}...'
    },
    'friendsNoImages': {
      'ro': 'Nu există imagini disponibile momentan.',
      'en': 'No images available at the moment.',
      'de': 'Momentan sind keine Bilder verfügbar.'
    },
    'friendsDeleteImage': {
      'ro': 'Șterge imaginea',
      'en': 'Delete image',
      'de': 'Bild löschen'
    },
    'friendsPrevious': {
      'ro': '❮ Anterior',
      'en': '❮ Previous',
      'de': '❮ Vorherige'
    },
    'friendsNext': {
      'ro': 'Următorul ❯',
      'en': 'Next ❯',
      'de': 'Nächste ❯'
    },
    'friendsPageInfo': {
      'ro': 'Pagina {currentPage} din {totalPages}',
      'en': 'Page {currentPage} of {totalPages}',
      'de': 'Seite {currentPage} von {totalPages}'
    },
    'friendsPreviousImage': {
      'ro': 'Imaginea anterioară (←)',
      'en': 'Previous image (←)',
      'de': 'Vorheriges Bild (←)'
    },
    'friendsNextImage': {
      'ro': 'Imaginea următoare (→)',
      'en': 'Next image (→)',
      'de': 'Nächstes Bild (→)'
    },
    'friendsZoomOut': {
      'ro': 'Micșorează (-)',
      'en': 'Zoom out (-)',
      'de': 'Verkleinern (-)'
    },
    'friendsZoomIn': {
      'ro': 'Mărește (+)',
      'en': 'Zoom in (+)',
      'de': 'Vergrößern (+)'
    },
    'friendsResetZoom': {
      'ro': 'Resetează zoom (0)',
      'en': 'Reset zoom (0)',
      'de': 'Zoom zurücksetzen (0)'
    },
    'friendsFullscreen': {
      'ro': 'Mod ecran complet (F)',
      'en': 'Fullscreen mode (F)',
      'de': 'Vollbildmodus (F)'
    },
    'friendsExitFullscreen': {
      'ro': 'Ieșire din ecran complet (Esc)',
      'en': 'Exit fullscreen (Esc)',
      'de': 'Vollbild verlassen (Esc)'
    },

    // Footer Motto translations
    'footerMotto': {
      'ro': 'Intri bun, ieși și mai bun',
      'en': 'Enter good, leave even better',
      'de': 'Komm gut herein, geh noch besser hinaus'
    },
    'footerMottoYear': {
      'ro': '(Deviza muzeului din anul înființării - 1931)',
      'en': '(Museum motto since its founding - 1931)',
      'de': '(Museumsmotto seit der Gründung - 1931)'
    }
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