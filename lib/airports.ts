export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export const AIRPORT_LIST: Airport[] = [
  // India
  { code: "TRV", name: "Trivandrum International", city: "Thiruvananthapuram", country: "India" },
  { code: "COK", name: "Cochin International", city: "Kochi", country: "India" },
  { code: "BLR", name: "Kempegowda International", city: "Bengaluru", country: "India" },
  { code: "MAA", name: "Chennai International", city: "Chennai", country: "India" },
  { code: "BOM", name: "Chhatrapati Shivaji International", city: "Mumbai", country: "India" },
  { code: "DEL", name: "Indira Gandhi International", city: "New Delhi", country: "India" },
  { code: "HYD", name: "Rajiv Gandhi International", city: "Hyderabad", country: "India" },
  { code: "CCU", name: "Netaji Subhas Chandra Bose Intl", city: "Kolkata", country: "India" },
  { code: "AMD", name: "Sardar Vallabhbhai Patel Intl", city: "Ahmedabad", country: "India" },
  { code: "PNQ", name: "Pune Airport", city: "Pune", country: "India" },
  { code: "GOI", name: "Goa International", city: "Goa", country: "India" },
  { code: "JAI", name: "Jaipur International", city: "Jaipur", country: "India" },
  { code: "LKO", name: "Chaudhary Charan Singh International", city: "Lucknow", country: "India" },
  { code: "CCJ", name: "Calicut International", city: "Kozhikode", country: "India" },
  { code: "GAU", name: "Lokpriya Gopinath Bordoloi Intl", city: "Guwahati", country: "India" },
  { code: "ATQ", name: "Sri Guru Ram Dass Jee International", city: "Amritsar", country: "India" },
  { code: "SXR", name: "Sheikh ul Alam International", city: "Srinagar", country: "India" },
  { code: "VTZ", name: "Visakhapatnam Airport", city: "Visakhapatnam", country: "India" },
  { code: "IXE", name: "Mangalore International", city: "Mangalore", country: "India" },
  { code: "IXB", name: "Bagdogra International", city: "Siliguri", country: "India" },
  { code: "IXZ", name: "Veer Savarkar International", city: "Port Blair", country: "India" },
  { code: "IXC", name: "Chandigarh International", city: "Chandigarh", country: "India" },
  { code: "IXM", name: "Madurai Airport", city: "Madurai", country: "India" },
  { code: "IXA", name: "Agartala Airport", city: "Agartala", country: "India" },
  { code: "VNS", name: "Lal Bahadur Shastri International", city: "Varanasi", country: "India" },
  { code: "NAG", name: "Dr. Babasaheb Ambedkar International", city: "Nagpur", country: "India" },
  { code: "IDR", name: "Devi Ahilya Bai Holkar Airport", city: "Indore", country: "India" },
  { code: "PAT", name: "Jay Prakash Narayan International", city: "Patna", country: "India" },
  { code: "BBI", name: "Biju Patnaik International", city: "Bhubaneswar", country: "India" },
  { code: "TRZ", name: "Tiruchirappalli International", city: "Tiruchirappalli", country: "India" },
  { code: "CJB", name: "Coimbatore International", city: "Coimbatore", country: "India" },
  { code: "UDR", name: "Maharana Pratap Airport", city: "Udaipur", country: "India" },
  { code: "RPR", name: "Swami Vivekananda Airport", city: "Raipur", country: "India" },
  { code: "IXR", name: "Birsa Munda Airport", city: "Ranchi", country: "India" },
  { code: "DIB", name: "Dibrugarh Airport", city: "Dibrugarh", country: "India" },
  { code: "IXU", name: "Aurangabad Airport", city: "Aurangabad", country: "India" },
  { code: "BHO", name: "Raja Bhoj Airport", city: "Bhopal", country: "India" },
  { code: "VGA", name: "Vijayawada Airport", city: "Vijayawada", country: "India" },
  // Thailand
  { code: "BKK", name: "Suvarnabhumi International", city: "Bangkok", country: "Thailand" },
  { code: "DMK", name: "Don Mueang International", city: "Bangkok", country: "Thailand" },
  { code: "HKT", name: "Phuket International", city: "Phuket", country: "Thailand" },
  { code: "KBV", name: "Krabi International", city: "Krabi", country: "Thailand" },
  { code: "CNX", name: "Chiang Mai International", city: "Chiang Mai", country: "Thailand" },
  { code: "USM", name: "Koh Samui Airport", city: "Koh Samui", country: "Thailand" },
  { code: "HDY", name: "Hat Yai International", city: "Hat Yai", country: "Thailand" },
  { code: "UTH", name: "Udon Thani International", city: "Udon Thani", country: "Thailand" },
  { code: "CEI", name: "Chiang Rai International", city: "Chiang Rai", country: "Thailand" },
  { code: "UBP", name: "Ubon Ratchathani Airport", city: "Ubon Ratchathani", country: "Thailand" },
  // Malaysia
  { code: "KUL", name: "Kuala Lumpur International", city: "Kuala Lumpur", country: "Malaysia" },
  { code: "PEN", name: "Penang International", city: "Penang", country: "Malaysia" },
  { code: "LGK", name: "Langkawi International", city: "Langkawi", country: "Malaysia" },
  { code: "BKI", name: "Kota Kinabalu International", city: "Kota Kinabalu", country: "Malaysia" },
  { code: "KCH", name: "Kuching International", city: "Kuching", country: "Malaysia" },
  { code: "JHB", name: "Senai International", city: "Johor Bahru", country: "Malaysia" },
  // Singapore
  { code: "SIN", name: "Changi International", city: "Singapore", country: "Singapore" },
  // Indonesia
  { code: "CGK", name: "Soekarno-Hatta International", city: "Jakarta", country: "Indonesia" },
  { code: "DPS", name: "Ngurah Rai International", city: "Denpasar", country: "Indonesia" },
  { code: "SUB", name: "Juanda International", city: "Surabaya", country: "Indonesia" },
  { code: "MES", name: "Kualanamu International", city: "Medan", country: "Indonesia" },
  { code: "UPG", name: "Sultan Hasanuddin International", city: "Makassar", country: "Indonesia" },
  { code: "LOP", name: "Lombok International", city: "Lombok", country: "Indonesia" },
  { code: "JOG", name: "Adisutjipto International", city: "Yogyakarta", country: "Indonesia" },
  { code: "BPN", name: "Sultan Aji Muhammad Sulaiman Airport", city: "Balikpapan", country: "Indonesia" },
  // Philippines
  { code: "MNL", name: "Ninoy Aquino International", city: "Manila", country: "Philippines" },
  { code: "CEB", name: "Mactan-Cebu International", city: "Cebu", country: "Philippines" },
  { code: "DVO", name: "Francisco Bangoy International", city: "Davao", country: "Philippines" },
  { code: "KLO", name: "Kalibo International", city: "Kalibo", country: "Philippines" },
  { code: "ILO", name: "Iloilo International", city: "Iloilo", country: "Philippines" },
  { code: "CRK", name: "Clark International", city: "Clark", country: "Philippines" },
  // Vietnam
  { code: "HAN", name: "Noi Bai International", city: "Hanoi", country: "Vietnam" },
  { code: "SGN", name: "Tan Son Nhat International", city: "Ho Chi Minh City", country: "Vietnam" },
  { code: "DAD", name: "Da Nang International", city: "Da Nang", country: "Vietnam" },
  { code: "CXR", name: "Cam Ranh International", city: "Nha Trang", country: "Vietnam" },
  { code: "PQC", name: "Phu Quoc International", city: "Phu Quoc", country: "Vietnam" },
  // Myanmar
  { code: "RGN", name: "Yangon International", city: "Yangon", country: "Myanmar" },
  { code: "MDL", name: "Mandalay International", city: "Mandalay", country: "Myanmar" },
  // Cambodia
  { code: "PNH", name: "Phnom Penh International", city: "Phnom Penh", country: "Cambodia" },
  { code: "REP", name: "Siem Reap International", city: "Siem Reap", country: "Cambodia" },
  // Laos
  { code: "VTE", name: "Wattay International", city: "Vientiane", country: "Laos" },
  { code: "LPQ", name: "Luang Prabang International", city: "Luang Prabang", country: "Laos" },
  // Bangladesh
  { code: "DAC", name: "Hazrat Shahjalal International", city: "Dhaka", country: "Bangladesh" },
  { code: "CGP", name: "Shah Amanat International", city: "Chittagong", country: "Bangladesh" },
  // Sri Lanka
  { code: "CMB", name: "Bandaranaike International", city: "Colombo", country: "Sri Lanka" },
  // Nepal
  { code: "KTM", name: "Tribhuvan International", city: "Kathmandu", country: "Nepal" },
  // Maldives
  { code: "MLE", name: "Velana International", city: "Male", country: "Maldives" },
  // Pakistan
  { code: "KHI", name: "Jinnah International", city: "Karachi", country: "Pakistan" },
  { code: "LHE", name: "Allama Iqbal International", city: "Lahore", country: "Pakistan" },
  { code: "ISB", name: "Islamabad International", city: "Islamabad", country: "Pakistan" },
  { code: "PEW", name: "Bacha Khan International", city: "Peshawar", country: "Pakistan" },
  // UAE
  { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE" },
  { code: "AUH", name: "Abu Dhabi International", city: "Abu Dhabi", country: "UAE" },
  { code: "SHJ", name: "Sharjah International", city: "Sharjah", country: "UAE" },
  { code: "DWC", name: "Al Maktoum International", city: "Dubai", country: "UAE" },
  // Qatar
  { code: "DOH", name: "Hamad International", city: "Doha", country: "Qatar" },
  // Kuwait
  { code: "KWI", name: "Kuwait International", city: "Kuwait City", country: "Kuwait" },
  // Bahrain
  { code: "BAH", name: "Bahrain International", city: "Manama", country: "Bahrain" },
  // Saudi Arabia
  { code: "RUH", name: "King Khalid International", city: "Riyadh", country: "Saudi Arabia" },
  { code: "JED", name: "King Abdulaziz International", city: "Jeddah", country: "Saudi Arabia" },
  { code: "MED", name: "Prince Mohammad Bin Abdulaziz Airport", city: "Medina", country: "Saudi Arabia" },
  { code: "DMM", name: "King Fahd International", city: "Dammam", country: "Saudi Arabia" },
  // Oman
  { code: "MCT", name: "Muscat International", city: "Muscat", country: "Oman" },
  // Jordan
  { code: "AMM", name: "Queen Alia International", city: "Amman", country: "Jordan" },
  // Lebanon
  { code: "BEY", name: "Beirut Rafic Hariri International", city: "Beirut", country: "Lebanon" },
  // Turkey
  { code: "IST", name: "Istanbul Airport", city: "Istanbul", country: "Turkey" },
  { code: "SAW", name: "Sabiha Gokcen International", city: "Istanbul", country: "Turkey" },
  { code: "AYT", name: "Antalya Airport", city: "Antalya", country: "Turkey" },
  { code: "ADB", name: "Adnan Menderes Airport", city: "Izmir", country: "Turkey" },
  { code: "ESB", name: "Esenboga International", city: "Ankara", country: "Turkey" },
  // Israel
  { code: "TLV", name: "Ben Gurion International", city: "Tel Aviv", country: "Israel" },
  // Egypt
  { code: "CAI", name: "Cairo International", city: "Cairo", country: "Egypt" },
  { code: "HRG", name: "Hurghada International", city: "Hurghada", country: "Egypt" },
  { code: "SSH", name: "Sharm el-Sheikh International", city: "Sharm el-Sheikh", country: "Egypt" },
  { code: "LXR", name: "Luxor International", city: "Luxor", country: "Egypt" },
  // United Kingdom
  { code: "LHR", name: "London Heathrow", city: "London", country: "United Kingdom" },
  { code: "LGW", name: "London Gatwick", city: "London", country: "United Kingdom" },
  { code: "STN", name: "London Stansted", city: "London", country: "United Kingdom" },
  { code: "LCY", name: "London City Airport", city: "London", country: "United Kingdom" },
  { code: "LTN", name: "London Luton Airport", city: "London", country: "United Kingdom" },
  { code: "MAN", name: "Manchester Airport", city: "Manchester", country: "United Kingdom" },
  { code: "EDI", name: "Edinburgh Airport", city: "Edinburgh", country: "United Kingdom" },
  { code: "BHX", name: "Birmingham Airport", city: "Birmingham", country: "United Kingdom" },
  { code: "GLA", name: "Glasgow International", city: "Glasgow", country: "United Kingdom" },
  { code: "BRS", name: "Bristol Airport", city: "Bristol", country: "United Kingdom" },
  { code: "NCL", name: "Newcastle International", city: "Newcastle", country: "United Kingdom" },
  // France
  { code: "CDG", name: "Charles de Gaulle Airport", city: "Paris", country: "France" },
  { code: "ORY", name: "Paris Orly Airport", city: "Paris", country: "France" },
  { code: "NCE", name: "Nice Cote d Azur Airport", city: "Nice", country: "France" },
  { code: "MRS", name: "Marseille Provence Airport", city: "Marseille", country: "France" },
  { code: "LYS", name: "Lyon Saint-Exupery Airport", city: "Lyon", country: "France" },
  { code: "BOD", name: "Bordeaux-Merignac Airport", city: "Bordeaux", country: "France" },
  { code: "TLS", name: "Toulouse-Blagnac Airport", city: "Toulouse", country: "France" },
  { code: "NTE", name: "Nantes Atlantique Airport", city: "Nantes", country: "France" },
  // Germany
  { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", country: "Germany" },
  { code: "MUC", name: "Munich Airport", city: "Munich", country: "Germany" },
  { code: "BER", name: "Berlin Brandenburg Airport", city: "Berlin", country: "Germany" },
  { code: "HAM", name: "Hamburg Airport", city: "Hamburg", country: "Germany" },
  { code: "DUS", name: "Dusseldorf Airport", city: "Dusseldorf", country: "Germany" },
  { code: "CGN", name: "Cologne Bonn Airport", city: "Cologne", country: "Germany" },
  { code: "STR", name: "Stuttgart Airport", city: "Stuttgart", country: "Germany" },
  { code: "NUE", name: "Nuremberg Airport", city: "Nuremberg", country: "Germany" },
  // Netherlands
  { code: "AMS", name: "Amsterdam Schiphol Airport", city: "Amsterdam", country: "Netherlands" },
  { code: "EIN", name: "Eindhoven Airport", city: "Eindhoven", country: "Netherlands" },
  // Spain
  { code: "MAD", name: "Adolfo Suarez Madrid-Barajas Airport", city: "Madrid", country: "Spain" },
  { code: "BCN", name: "Barcelona El Prat Airport", city: "Barcelona", country: "Spain" },
  { code: "AGP", name: "Malaga Airport", city: "Malaga", country: "Spain" },
  { code: "PMI", name: "Palma de Mallorca Airport", city: "Palma", country: "Spain" },
  { code: "ALC", name: "Alicante-Elche Airport", city: "Alicante", country: "Spain" },
  { code: "VLC", name: "Valencia Airport", city: "Valencia", country: "Spain" },
  { code: "SVQ", name: "Seville Airport", city: "Seville", country: "Spain" },
  { code: "LPA", name: "Gran Canaria Airport", city: "Las Palmas", country: "Spain" },
  { code: "TFS", name: "Tenerife South Airport", city: "Tenerife", country: "Spain" },
  // Italy
  { code: "FCO", name: "Leonardo da Vinci International", city: "Rome", country: "Italy" },
  { code: "MXP", name: "Milan Malpensa Airport", city: "Milan", country: "Italy" },
  { code: "LIN", name: "Milan Linate Airport", city: "Milan", country: "Italy" },
  { code: "BGY", name: "Orio al Serio International", city: "Bergamo", country: "Italy" },
  { code: "VCE", name: "Venice Marco Polo Airport", city: "Venice", country: "Italy" },
  { code: "NAP", name: "Naples International Airport", city: "Naples", country: "Italy" },
  { code: "CTA", name: "Catania-Fontanarossa Airport", city: "Catania", country: "Italy" },
  { code: "BLQ", name: "Bologna Guglielmo Marconi Airport", city: "Bologna", country: "Italy" },
  { code: "PSA", name: "Galileo Galilei Airport", city: "Pisa", country: "Italy" },
  // Portugal
  { code: "LIS", name: "Humberto Delgado Airport", city: "Lisbon", country: "Portugal" },
  { code: "OPO", name: "Francisco Sa Carneiro Airport", city: "Porto", country: "Portugal" },
  { code: "FAO", name: "Faro Airport", city: "Faro", country: "Portugal" },
  // Switzerland
  { code: "ZRH", name: "Zurich Airport", city: "Zurich", country: "Switzerland" },
  { code: "GVA", name: "Geneva Airport", city: "Geneva", country: "Switzerland" },
  // Austria
  { code: "VIE", name: "Vienna International Airport", city: "Vienna", country: "Austria" },
  { code: "SZG", name: "Salzburg Airport", city: "Salzburg", country: "Austria" },
  // Belgium
  { code: "BRU", name: "Brussels Airport", city: "Brussels", country: "Belgium" },
  { code: "CRL", name: "Brussels South Charleroi Airport", city: "Charleroi", country: "Belgium" },
  // Sweden
  { code: "ARN", name: "Stockholm Arlanda Airport", city: "Stockholm", country: "Sweden" },
  { code: "GOT", name: "Gothenburg Landvetter Airport", city: "Gothenburg", country: "Sweden" },
  // Norway
  { code: "OSL", name: "Oslo Gardermoen Airport", city: "Oslo", country: "Norway" },
  { code: "BGO", name: "Bergen Airport", city: "Bergen", country: "Norway" },
  // Denmark
  { code: "CPH", name: "Copenhagen Airport", city: "Copenhagen", country: "Denmark" },
  // Finland
  { code: "HEL", name: "Helsinki-Vantaa Airport", city: "Helsinki", country: "Finland" },
  // Ireland
  { code: "DUB", name: "Dublin Airport", city: "Dublin", country: "Ireland" },
  { code: "ORK", name: "Cork Airport", city: "Cork", country: "Ireland" },
  // Greece
  { code: "ATH", name: "Athens International Airport", city: "Athens", country: "Greece" },
  { code: "HER", name: "Heraklion International Airport", city: "Heraklion", country: "Greece" },
  { code: "SKG", name: "Thessaloniki Airport", city: "Thessaloniki", country: "Greece" },
  { code: "RHO", name: "Rhodes International Airport", city: "Rhodes", country: "Greece" },
  { code: "CFU", name: "Corfu International Airport", city: "Corfu", country: "Greece" },
  { code: "JMK", name: "Mykonos Airport", city: "Mykonos", country: "Greece" },
  { code: "JTR", name: "Santorini Airport", city: "Santorini", country: "Greece" },
  { code: "KGS", name: "Kos International Airport", city: "Kos", country: "Greece" },
  // Poland
  { code: "WAW", name: "Warsaw Chopin Airport", city: "Warsaw", country: "Poland" },
  { code: "KRK", name: "Krakow John Paul II International", city: "Krakow", country: "Poland" },
  { code: "GDN", name: "Gdansk Lech Walesa Airport", city: "Gdansk", country: "Poland" },
  { code: "WRO", name: "Wroclaw Airport", city: "Wroclaw", country: "Poland" },
  // Czech Republic
  { code: "PRG", name: "Vaclav Havel Airport Prague", city: "Prague", country: "Czech Republic" },
  // Hungary
  { code: "BUD", name: "Budapest Ferenc Liszt International", city: "Budapest", country: "Hungary" },
  // Romania
  { code: "OTP", name: "Henri Coanda International Airport", city: "Bucharest", country: "Romania" },
  { code: "CLJ", name: "Cluj-Napoca International Airport", city: "Cluj-Napoca", country: "Romania" },
  // Bulgaria
  { code: "SOF", name: "Sofia Airport", city: "Sofia", country: "Bulgaria" },
  { code: "VAR", name: "Varna Airport", city: "Varna", country: "Bulgaria" },
  // Croatia
  { code: "ZAG", name: "Zagreb Airport", city: "Zagreb", country: "Croatia" },
  { code: "SPU", name: "Split Airport", city: "Split", country: "Croatia" },
  { code: "DBV", name: "Dubrovnik Airport", city: "Dubrovnik", country: "Croatia" },
  // Serbia
  { code: "BEG", name: "Belgrade Nikola Tesla Airport", city: "Belgrade", country: "Serbia" },
  // Russia
  { code: "SVO", name: "Sheremetyevo International Airport", city: "Moscow", country: "Russia" },
  { code: "DME", name: "Domodedovo International Airport", city: "Moscow", country: "Russia" },
  { code: "LED", name: "Pulkovo Airport", city: "Saint Petersburg", country: "Russia" },
  // China
  { code: "PEK", name: "Beijing Capital International", city: "Beijing", country: "China" },
  { code: "PKX", name: "Beijing Daxing International", city: "Beijing", country: "China" },
  { code: "PVG", name: "Shanghai Pudong International", city: "Shanghai", country: "China" },
  { code: "SHA", name: "Shanghai Hongqiao International", city: "Shanghai", country: "China" },
  { code: "CAN", name: "Guangzhou Baiyun International", city: "Guangzhou", country: "China" },
  { code: "CTU", name: "Chengdu Tianfu International", city: "Chengdu", country: "China" },
  { code: "XIY", name: "Xi an Xianyang International", city: "Xi an", country: "China" },
  { code: "HGH", name: "Hangzhou Xiaoshan International", city: "Hangzhou", country: "China" },
  { code: "SZX", name: "Shenzhen Bao an International", city: "Shenzhen", country: "China" },
  { code: "WUH", name: "Wuhan Tianhe International", city: "Wuhan", country: "China" },
  { code: "KMG", name: "Kunming Changshui International", city: "Kunming", country: "China" },
  { code: "HAK", name: "Haikou Meilan International", city: "Haikou", country: "China" },
  { code: "SYX", name: "Sanya Phoenix International", city: "Sanya", country: "China" },
  { code: "NKG", name: "Nanjing Lukou International", city: "Nanjing", country: "China" },
  { code: "TAO", name: "Qingdao International", city: "Qingdao", country: "China" },
  { code: "XMN", name: "Xiamen Gaoqi International", city: "Xiamen", country: "China" },
  { code: "CSX", name: "Changsha Huanghua International", city: "Changsha", country: "China" },
  { code: "DLC", name: "Dalian Zhoushuizi International", city: "Dalian", country: "China" },
  // Hong Kong
  { code: "HKG", name: "Hong Kong International", city: "Hong Kong", country: "Hong Kong" },
  // Macau
  { code: "MFM", name: "Macau International", city: "Macau", country: "Macau" },
  // Taiwan
  { code: "TPE", name: "Taiwan Taoyuan International", city: "Taipei", country: "Taiwan" },
  { code: "KHH", name: "Kaohsiung International", city: "Kaohsiung", country: "Taiwan" },
  // South Korea
  { code: "ICN", name: "Incheon International", city: "Seoul", country: "South Korea" },
  { code: "GMP", name: "Gimpo International", city: "Seoul", country: "South Korea" },
  { code: "PUS", name: "Gimhae International", city: "Busan", country: "South Korea" },
  { code: "CJU", name: "Jeju International", city: "Jeju", country: "South Korea" },
  // Japan
  { code: "NRT", name: "Narita International", city: "Tokyo", country: "Japan" },
  { code: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", country: "Japan" },
  { code: "KIX", name: "Kansai International", city: "Osaka", country: "Japan" },
  { code: "ITM", name: "Itami Airport", city: "Osaka", country: "Japan" },
  { code: "NGO", name: "Chubu Centrair International", city: "Nagoya", country: "Japan" },
  { code: "CTS", name: "New Chitose Airport", city: "Sapporo", country: "Japan" },
  { code: "FUK", name: "Fukuoka Airport", city: "Fukuoka", country: "Japan" },
  { code: "OKA", name: "Naha Airport", city: "Okinawa", country: "Japan" },
  // Australia
  { code: "SYD", name: "Sydney Kingsford Smith Airport", city: "Sydney", country: "Australia" },
  { code: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "Australia" },
  { code: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "Australia" },
  { code: "PER", name: "Perth Airport", city: "Perth", country: "Australia" },
  { code: "ADL", name: "Adelaide Airport", city: "Adelaide", country: "Australia" },
  { code: "DRW", name: "Darwin International Airport", city: "Darwin", country: "Australia" },
  { code: "CNS", name: "Cairns Airport", city: "Cairns", country: "Australia" },
  { code: "OOL", name: "Gold Coast Airport", city: "Gold Coast", country: "Australia" },
  { code: "CBR", name: "Canberra Airport", city: "Canberra", country: "Australia" },
  // New Zealand
  { code: "AKL", name: "Auckland Airport", city: "Auckland", country: "New Zealand" },
  { code: "WLG", name: "Wellington International Airport", city: "Wellington", country: "New Zealand" },
  { code: "CHC", name: "Christchurch International Airport", city: "Christchurch", country: "New Zealand" },
  { code: "ZQN", name: "Queenstown Airport", city: "Queenstown", country: "New Zealand" },
  // Canada
  { code: "YYZ", name: "Toronto Pearson International", city: "Toronto", country: "Canada" },
  { code: "YVR", name: "Vancouver International", city: "Vancouver", country: "Canada" },
  { code: "YUL", name: "Montreal Pierre Elliott Trudeau International", city: "Montreal", country: "Canada" },
  { code: "YYC", name: "Calgary International", city: "Calgary", country: "Canada" },
  { code: "YEG", name: "Edmonton International", city: "Edmonton", country: "Canada" },
  { code: "YOW", name: "Ottawa Macdonald-Cartier International", city: "Ottawa", country: "Canada" },
  { code: "YHZ", name: "Halifax Stanfield International", city: "Halifax", country: "Canada" },
  // USA
  { code: "JFK", name: "John F. Kennedy International", city: "New York", country: "USA" },
  { code: "EWR", name: "Newark Liberty International", city: "Newark", country: "USA" },
  { code: "LGA", name: "LaGuardia Airport", city: "New York", country: "USA" },
  { code: "LAX", name: "Los Angeles International", city: "Los Angeles", country: "USA" },
  { code: "ORD", name: "O Hare International", city: "Chicago", country: "USA" },
  { code: "MDW", name: "Chicago Midway International", city: "Chicago", country: "USA" },
  { code: "DFW", name: "Dallas Fort Worth International", city: "Dallas", country: "USA" },
  { code: "ATL", name: "Hartsfield-Jackson Atlanta International", city: "Atlanta", country: "USA" },
  { code: "MIA", name: "Miami International Airport", city: "Miami", country: "USA" },
  { code: "FLL", name: "Fort Lauderdale-Hollywood International", city: "Fort Lauderdale", country: "USA" },
  { code: "SFO", name: "San Francisco International", city: "San Francisco", country: "USA" },
  { code: "SJC", name: "San Jose International", city: "San Jose", country: "USA" },
  { code: "OAK", name: "Oakland International", city: "Oakland", country: "USA" },
  { code: "SEA", name: "Seattle-Tacoma International", city: "Seattle", country: "USA" },
  { code: "BOS", name: "Logan International Airport", city: "Boston", country: "USA" },
  { code: "IAH", name: "George Bush Intercontinental", city: "Houston", country: "USA" },
  { code: "HOU", name: "Houston Hobby Airport", city: "Houston", country: "USA" },
  { code: "DEN", name: "Denver International Airport", city: "Denver", country: "USA" },
  { code: "PHX", name: "Phoenix Sky Harbor International", city: "Phoenix", country: "USA" },
  { code: "MCO", name: "Orlando International Airport", city: "Orlando", country: "USA" },
  { code: "LAS", name: "Harry Reid International", city: "Las Vegas", country: "USA" },
  { code: "DTW", name: "Detroit Metropolitan Airport", city: "Detroit", country: "USA" },
  { code: "MSP", name: "Minneapolis Saint Paul International", city: "Minneapolis", country: "USA" },
  { code: "PHL", name: "Philadelphia International Airport", city: "Philadelphia", country: "USA" },
  { code: "CLT", name: "Charlotte Douglas International", city: "Charlotte", country: "USA" },
  { code: "SAN", name: "San Diego International Airport", city: "San Diego", country: "USA" },
  { code: "TPA", name: "Tampa International Airport", city: "Tampa", country: "USA" },
  { code: "PDX", name: "Portland International Airport", city: "Portland", country: "USA" },
  { code: "IAD", name: "Washington Dulles International", city: "Washington DC", country: "USA" },
  { code: "DCA", name: "Ronald Reagan Washington National", city: "Washington DC", country: "USA" },
  { code: "BWI", name: "Baltimore Washington International", city: "Baltimore", country: "USA" },
  { code: "HNL", name: "Daniel K. Inouye International", city: "Honolulu", country: "USA" },
  { code: "ANC", name: "Ted Stevens Anchorage International", city: "Anchorage", country: "USA" },
  { code: "SLC", name: "Salt Lake City International", city: "Salt Lake City", country: "USA" },
  { code: "BNA", name: "Nashville International Airport", city: "Nashville", country: "USA" },
  { code: "AUS", name: "Austin-Bergstrom International", city: "Austin", country: "USA" },
  { code: "RDU", name: "Raleigh-Durham International Airport", city: "Raleigh", country: "USA" },
  { code: "CLE", name: "Cleveland Hopkins International", city: "Cleveland", country: "USA" },
  { code: "PIT", name: "Pittsburgh International Airport", city: "Pittsburgh", country: "USA" },
  { code: "STL", name: "St. Louis Lambert International", city: "St. Louis", country: "USA" },
  { code: "MKE", name: "General Mitchell International", city: "Milwaukee", country: "USA" },
  { code: "MSY", name: "Louis Armstrong New Orleans International", city: "New Orleans", country: "USA" },
  { code: "BUF", name: "Buffalo Niagara International", city: "Buffalo", country: "USA" },
  { code: "SMF", name: "Sacramento International Airport", city: "Sacramento", country: "USA" },
  { code: "ABQ", name: "Albuquerque International Sunport", city: "Albuquerque", country: "USA" },
  // Mexico
  { code: "MEX", name: "Mexico City Benito Juarez International", city: "Mexico City", country: "Mexico" },
  { code: "CUN", name: "Cancun International Airport", city: "Cancun", country: "Mexico" },
  { code: "GDL", name: "Miguel Hidalgo International", city: "Guadalajara", country: "Mexico" },
  { code: "MTY", name: "Monterrey International Airport", city: "Monterrey", country: "Mexico" },
  { code: "PVR", name: "Licenciado Gustavo Diaz Ordaz International", city: "Puerto Vallarta", country: "Mexico" },
  { code: "SJD", name: "Los Cabos International Airport", city: "Los Cabos", country: "Mexico" },
  // Brazil
  { code: "GRU", name: "Sao Paulo Guarulhos International", city: "Sao Paulo", country: "Brazil" },
  { code: "GIG", name: "Rio de Janeiro Galeao International", city: "Rio de Janeiro", country: "Brazil" },
  { code: "BSB", name: "Brasilia International Airport", city: "Brasilia", country: "Brazil" },
  { code: "SSA", name: "Deputado Luis Eduardo Magalhaes International", city: "Salvador", country: "Brazil" },
  { code: "REC", name: "Recife Guararapes International", city: "Recife", country: "Brazil" },
  { code: "FOR", name: "Fortaleza Pinto Martins International", city: "Fortaleza", country: "Brazil" },
  { code: "MAN", name: "Eduardo Gomes International", city: "Manaus", country: "Brazil" },
  { code: "CWB", name: "Afonso Pena International", city: "Curitiba", country: "Brazil" },
  { code: "POA", name: "Salgado Filho International", city: "Porto Alegre", country: "Brazil" },
  // Argentina
  { code: "EZE", name: "Ministro Pistarini International", city: "Buenos Aires", country: "Argentina" },
  { code: "AEP", name: "Jorge Newbery Airfield", city: "Buenos Aires", country: "Argentina" },
  { code: "COR", name: "Ingeniero Ambrosio Taravella Airport", city: "Cordoba", country: "Argentina" },
  // Colombia
  { code: "BOG", name: "El Dorado International Airport", city: "Bogota", country: "Colombia" },
  { code: "MDE", name: "Jose Maria Cordova International", city: "Medellin", country: "Colombia" },
  { code: "CLO", name: "Alfonso Bonilla Aragon International", city: "Cali", country: "Colombia" },
  { code: "CTG", name: "Rafael Nunez International", city: "Cartagena", country: "Colombia" },
  // Peru
  { code: "LIM", name: "Jorge Chavez International", city: "Lima", country: "Peru" },
  { code: "CUZ", name: "Alejandro Velasco Astete International", city: "Cusco", country: "Peru" },
  // Chile
  { code: "SCL", name: "Arturo Merino Benitez International", city: "Santiago", country: "Chile" },
  // Ecuador
  { code: "UIO", name: "Mariscal Sucre International Airport", city: "Quito", country: "Ecuador" },
  { code: "GYE", name: "Jose Joaquin de Olmedo International", city: "Guayaquil", country: "Ecuador" },
  // Panama
  { code: "PTY", name: "Tocumen International Airport", city: "Panama City", country: "Panama" },
  // Dominican Republic
  { code: "PUJ", name: "Punta Cana International Airport", city: "Punta Cana", country: "Dominican Republic" },
  { code: "SDQ", name: "Las Americas International Airport", city: "Santo Domingo", country: "Dominican Republic" },
  // Kenya
  { code: "NBO", name: "Jomo Kenyatta International Airport", city: "Nairobi", country: "Kenya" },
  { code: "MBA", name: "Mombasa Moi International Airport", city: "Mombasa", country: "Kenya" },
  // Ethiopia
  { code: "ADD", name: "Addis Ababa Bole International Airport", city: "Addis Ababa", country: "Ethiopia" },
  // South Africa
  { code: "JNB", name: "O.R. Tambo International Airport", city: "Johannesburg", country: "South Africa" },
  { code: "CPT", name: "Cape Town International Airport", city: "Cape Town", country: "South Africa" },
  { code: "DUR", name: "King Shaka International Airport", city: "Durban", country: "South Africa" },
  // Morocco
  { code: "CMN", name: "Mohammed V International Airport", city: "Casablanca", country: "Morocco" },
  { code: "RAK", name: "Marrakech Menara Airport", city: "Marrakech", country: "Morocco" },
  { code: "FEZ", name: "Fes-Saiss Airport", city: "Fez", country: "Morocco" },
  // Nigeria
  { code: "LOS", name: "Murtala Muhammed International Airport", city: "Lagos", country: "Nigeria" },
  { code: "ABV", name: "Nnamdi Azikiwe International Airport", city: "Abuja", country: "Nigeria" },
  // Ghana
  { code: "ACC", name: "Kotoka International Airport", city: "Accra", country: "Ghana" },
  // Tanzania
  { code: "DAR", name: "Julius Nyerere International Airport", city: "Dar es Salaam", country: "Tanzania" },
  { code: "ZNZ", name: "Abeid Amani Karume International Airport", city: "Zanzibar", country: "Tanzania" },
  { code: "JRO", name: "Kilimanjaro International Airport", city: "Kilimanjaro", country: "Tanzania" },
  // Uganda
  { code: "EBB", name: "Entebbe International Airport", city: "Entebbe", country: "Uganda" },
  // Rwanda
  { code: "KGL", name: "Kigali International Airport", city: "Kigali", country: "Rwanda" },
  // Mauritius
  { code: "MRU", name: "Sir Seewoosagur Ramgoolam International", city: "Mauritius", country: "Mauritius" },
  // Seychelles
  { code: "SEZ", name: "Seychelles International Airport", city: "Mahe", country: "Seychelles" },
  // Iran
  { code: "IKA", name: "Imam Khomeini International Airport", city: "Tehran", country: "Iran" },
  { code: "THR", name: "Mehrabad International Airport", city: "Tehran", country: "Iran" },
  { code: "MHD", name: "Mashhad International Airport", city: "Mashhad", country: "Iran" },
  // Armenia
  { code: "EVN", name: "Zvartnots International Airport", city: "Yerevan", country: "Armenia" },
  // Azerbaijan
  { code: "GYD", name: "Heydar Aliyev International Airport", city: "Baku", country: "Azerbaijan" },
  // Georgia
  { code: "TBS", name: "Tbilisi International Airport", city: "Tbilisi", country: "Georgia" },
  { code: "BUS", name: "Batumi International Airport", city: "Batumi", country: "Georgia" },
  // Kazakhstan
  { code: "ALA", name: "Almaty International Airport", city: "Almaty", country: "Kazakhstan" },
  // Uzbekistan
  { code: "TAS", name: "Islam Karimov Tashkent International", city: "Tashkent", country: "Uzbekistan" },
  { code: "SKD", name: "Samarkand International Airport", city: "Samarkand", country: "Uzbekistan" },
  // Cyprus
  { code: "LCA", name: "Larnaca International Airport", city: "Larnaca", country: "Cyprus" },
  { code: "PFO", name: "Paphos International Airport", city: "Paphos", country: "Cyprus" },
  // Malta
  { code: "MLA", name: "Malta International Airport", city: "Valletta", country: "Malta" },
  // Iceland
  { code: "KEF", name: "Keflavik International Airport", city: "Reykjavik", country: "Iceland" },
  // Latvia
  { code: "RIX", name: "Riga International Airport", city: "Riga", country: "Latvia" },
  // Lithuania
  { code: "VNO", name: "Vilnius International Airport", city: "Vilnius", country: "Lithuania" },
  // Estonia
  { code: "TLL", name: "Tallinn Airport", city: "Tallinn", country: "Estonia" },
  // Ukraine
  { code: "KBP", name: "Boryspil International Airport", city: "Kyiv", country: "Ukraine" },
  // Albania
  { code: "TIA", name: "Tirana International Airport", city: "Tirana", country: "Albania" },
  // Tunisia
  { code: "TUN", name: "Tunis-Carthage International Airport", city: "Tunis", country: "Tunisia" },
  // Algeria
  { code: "ALG", name: "Houari Boumediene Airport", city: "Algiers", country: "Algeria" },
  // Cuba
  { code: "HAV", name: "Jose Marti International Airport", city: "Havana", country: "Cuba" },
];

// O(1) lookup by IATA code
export const AIRPORTS_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORT_LIST.map((a) => [a.code, a])
);

// Returns city name for a code, or the code itself as fallback
export function getAirportCity(code: string): string {
  return AIRPORTS_BY_CODE[code]?.city ?? code;
}

// Returns airport name for a code, or the code itself as fallback
export function getAirportName(code: string): string {
  return AIRPORTS_BY_CODE[code]?.name ?? code;
}

// Fuzzy search: exact code match first, then code prefix, then name/city contains
export function searchAirports(query: string, limit = 8): Airport[] {
  const q = query.trim().toUpperCase();
  if (q.length < 2) return [];

  const exact: Airport[] = [];
  const codePrefix: Airport[] = [];
  const nameCity: Airport[] = [];

  for (const a of AIRPORT_LIST) {
    if (a.code === q) { exact.push(a); continue; }
    if (a.code.startsWith(q)) { codePrefix.push(a); continue; }
    if (
      a.name.toUpperCase().includes(q) ||
      a.city.toUpperCase().includes(q) ||
      a.country.toUpperCase().includes(q)
    ) {
      nameCity.push(a);
    }
  }

  return [...exact, ...codePrefix, ...nameCity].slice(0, limit);
}
