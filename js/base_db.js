// This file loads the units if the remote database is unavailable

var cached_terrain = {
    "Mountain": {
       "color": "846A51",
       "_id": "Mountain",
       "food": 1,
       "production": 3,
       "prob": 10
   },
   "Coast": {
       "color": "66CCFF",
       "_id": "Coast",
       "food": 2,
       "production": 1,
       "prob": 20
   },
   "Desert": {
       "color": "FFD683",
       "_id": "Desert",
       "food": 1,
       "production": 1,
       "prob": 20
   },
   "Poles": {
       "color": "FFFFFF",
       "_id": "Poles",
       "food": 1,
       "production": 1,
       "prob": 0
   },
   "Plains": {
       "color": "ABD483",
       "_id": "Plains",
       "food": 3,
       "production": 2,
       "prob": 80
   },
   "Tundra": {
       "color": "AAAAAA",
       "_id": "Tundra",
       "food": 1,
       "production": 1,
       "prob": 10
   },
   "Ocean": {
       "color": "297ACC",
       "_id": "Ocean",
       "food": 2,
       "production": 1,
       "prob": 25
   }
};

var cached_units = {
    "Aircraft Carrier":{  
        "_id":"Aircraft Carrier",
        "image":{  

        }
    },
    "Archer":{  
        "_id":"Archer",
        "image":{  

        }
    },
    "City Worker":{  
        "src":"images/city_worker.png",
        "Mountain":false,
        "Coast":false,
        "base_moves":2,
        "Ocean":false,
        "type":"civilian",
        "cost":0,
        "_id":"City Worker",
        "image":{  

        }
    },
    "Clubman":{  
        "src":"images/clubman.png",
        "cost":10,
        "base_moves":2,
        "type":"combat",
        "Coast":false,
        "Mountain":false,
        "Ocean":false,
        "_id":"Clubman",
        "image":{  

        }
    },
    "Marine":{  
        "_id":"Marine",
        "image":{  

        }
    },
    "Settler":{  
        "src":"images/settler.png",
        "Mountain":false,
        "Coast":false,
        "base_moves":2,
        "Ocean":false,
        "type":"civilian",
        "cost":200,
        "unit_actions":[  
            "found_city"
        ],
        "_id":"Settler",
        "image":{  

        }
    },
    "Workboat":{  
        "class":"civilian",
        "_id":"Workboat",
        "image":{  

        }
    },
    "Worker":{  
        "cost":30,
        "base_moves":3,
        "type":"civilian",
        "_id":"Worker",
        "image":{  

        }
    }
};

var cached_nations = {  
    "China":{  
        "city_names":[  
            "Guangzhou",
            "Shanghai",
            "Beijing",
            "Shantou",
            "Shenzhen",
            "Tianjin",
            "Chengdu",
            "Dongguan",
            "Hangzhou",
            "Wuhan",
            "Shenyang",
            "Xi'an",
            "Nanjing",
            "Hong Kong",
            "Chongqing",
            "Quanzhou",
            "Wenzhou",
            "Qingdao",
            "Suzhou",
            "Harbin",
            "Qiqihar",
            "Xiamen",
            "Zhengzhou",
            "Jinan",
            "Nanchang",
            "Dalian",
            "Changsha",
            "Taiyuan",
            "Shijiazhuang",
            "Kunming",
            "Wuxi",
            "Changchun",
            "Ningbo",
            "Zibo",
            "Hefei",
            "Changzhou",
            "Taizhou",
            "Tangshan",
            "Nantong",
            "Nanning",
            "Guiyang",
            "Ürümqi",
            "Fuzhou",
            "Huai'an",
            "Xuzhou",
            "Linyi",
            "Lanzhou",
            "Yangzhou",
            "Huizhou",
            "Anshan",
            "Huaibei",
            "Haikou",
            "Yiwu",
            "Baotou",
            "Liuzhou",
            "Anyang",
            "Hohhot",
            "Jili",
            "Putian",
            "Xiangtan",
            "Yantai",
            "Luoyang",
            "Huainan",
            "Nanchong",
            "Jiangmen",
            "Nanyang",
            "Baoding",
            "Fuyang",
            "Tai'an",
            "Suzhou",
            "Lu'an",
            "Datong",
            "Yancheng",
            "Zhanjiang",
            "Tengzhou",
            "Huangshi",
            "Jiangyin",
            "Weifang",
            "Yinchuan",
            "Changshu",
            "Zhuhai",
            "Dengzhou",
            "Cixi",
            "Changde",
            "Pizhou",
            "Baoji",
            "Suqian",
            "Daqing",
            "Bozhou",
            "Handan",
            "Panjin",
            "Wenling"
        ],
        "_id":"China"
    },
    "Russia":{  
        "city_names":[  
            "Abakan",
            "Abaza",
            "Abdulino",
            "Abinsk",
            "Armavir",
            "Arsenyev",
            "Arsk",
            "Artyom",
            "Artyomovsk",
            "Artyomovsky",
            "Arzamas",
            "Asha",
            "Belomorsk",
            "Belorechensk",
            "Berezniki",
            "Berezovsky",
            "Berezovsky",
            "Beslan",
            "Buzuluk",
            "Dyurtyuli",
            "Krasnozavodsk",
            "Krasnoznamensk",
            "Krasnoznamensk",
            "Krasny",
            "Krasny",
            "Kremyonki",
            "Kulebaki",
            "Kumertau",
            "Kungur",
            "Kurchatov",
            "Kurgan",
            "Kurganinsk",
            "Kurilsk",
            "Lytkarino",
            "Lyuban",
            "Lyubim",
            "Moscow",
            "Mendeleyevsk",
            "Menzelinsk",
            "Nevyansk",
            "Ozyorsk",
            "Perevoz",
            "Perm",
            "Raduzhny",
            "Ramenskoye",
            "Rasskazovo",
            "Raychikhinsk",
            "Reutov",
            "Revda",
            "Surovikino",
            "Sursk",
            "Susuman",
            "Svirsk",
            "Vetluga",
            "Vichuga",
            "Vidnoye",
            "Vikhorevka",
            "Vilyuchinsk",
            "Vyazemsky",
            "Vyazma",
            "Vyazniki",
            "Vyborg",
            "Vyksa",
            "Vysokovsk",
            "Vysotsk",
            "Yuzhnouralsk",
            "Zadonsk",
            "Zainsk",
            "Zakamensk",
            "Zaozyorny",
            "Zaozyorsk",
            "Zapolyarny",
            "Zaraysk",
            "Zarechny",
            "Zarechny",
            "Zarinsk",
            "Zavitinsk",
            "Zavodoukovsk"
        ],
        "_id":"Russia"
    },
    "UK":{  
        "city_names":[  
            "Bath",
            "Birmingham",
            "Bradford",
            "Brighton & Hove",
            "Bristol",
            "Cambridge",
            "Canterbury",
            "Carlisle",
            "Chelmsford",
            "Chester",
            "Chichester",
            "Coventry",
            "Derby",
            "Durham",
            "Ely",
            "Exeter",
            "Gloucester",
            "Hereford",
            "Kingston",
            "Lancaster",
            "Leeds",
            "Leicester",
            "Lichfield",
            "Lincoln",
            "Liverpool",
            "London",
            "Manchester",
            "Newcastle",
            "Norwich",
            "Nottingham",
            "Oxford",
            "Peterborough",
            "Plymouth",
            "Portsmouth",
            "Preston",
            "Ripon",
            "Salford",
            "Salisbury",
            "Sheffield",
            "Southampton",
            "St Albans",
            "Stoke-on-Trent",
            "Sunderland",
            "Truro",
            "Wakefield",
            "Wells",
            "Westminster",
            "Winchester",
            "Wolverhampton",
            "Worcester",
            "York"
        ],
        "_id":"UK"
    },
    "USA":{  
        "city_names":[  
            "Winston",
            "Salem",
            "Wichita",
            "Washington",
            "Virginia",
            "Tulsa",
            "Tucson",
            "Toledo",
            "Tampa",
            "Stockton",
            "Seattle",
            "Scottsdale",
            "Sacramento",
            "Riverside",
            "Richmond",
            "Reno",
            "Raleigh",
            "Portland",
            "Plano",
            "Pittsburgh",
            "Phoenix",
            "Philadelphia",
            "Orlando",
            "Omaha",
            "Oklahoma",
            "Oakland",
            "North",
            "Norfolk",
            "Newark",
            "New York",
            "Nashville",
            "Minneapolis",
            "Milwaukee",
            "Miami",
            "Mesa",
            "Memphis",
            "Madison",
            "Lubbock",
            "Louisville",
            "Long",
            "Lincoln",
            "Lexington",
            "Laredo",
            "Kansas",
            "Jersey",
            "Jacksonville",
            "Irving",
            "Irvine",
            "Indianapolis",
            "Houston",
            "Honolulu",
            "Hialeah",
            "Henderson",
            "Greensboro",
            "Glendale",
            "Gilbert",
            "Garland",
            "Fresno",
            "Fremont",
            "Durham",
            "Detroit",
            "Denver",
            "allas",
            "Corpus",
            "Columbus",
            "Colorado",
            "Cleveland",
            "Cincinnati",
            "Chula",
            "Chicago",
            "Chesapeake",
            "Charlotte",
            "Chandler",
            "Buffalo",
            "Boston",
            "Boise",
            "Baton",
            "Baltimore",
            "Bakersfield",
            "Austin",
            "Aurora",
            "Atlanta",
            "Arlington",
            "Anchorage",
            "Anaheim",
            "Albuquerque"
        ],
        "_id":"USA"
    }
};


