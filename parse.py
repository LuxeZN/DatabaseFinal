import json
import os
import sys
import sqlite3

class Database:
    def __init__(self, file: str, src_directory: str = None):
        """Pass in .db file or directory containing .db; src_directory specifies where cve list is located if db still needs to be intialized"""
        self.file = file
        self.cve_directory = src_directory
        if (self.file.endswith('.db')):
            if self.check_database():
                #connect to sql
                connection = sqlite3.connect(self.file)
            else:
                #db not initialized
                self.initialize_db()
                self.load_database()
        else:
            root, dirs, files = os.walk('.db', topdown=False)
            for f in files:
                if f.endswith('.db'):
                    self.file = f
                    if self.check_database():
                        #connect to sql
                        connection = sqlite3.connect(self.file)
                    else:
                        #db not initialized
                        self.initialize_db()
                        self.load_database()
                        
                break

    def check_database(self) -> bool:
        """Checks if database has been initialized or not and if it needs to be """
        if os.stat(self.file).st_size > 0:
            return True
        else:
            if self.cve_directory == None:
                raise Exception('.db file is empty and CVE Directory is not given')
            else:
                return False

    def initialize_db(self):
        """Creates database and tables"""
        connection = sqlite3.connect(self.file)
        cursor = connection.cursor()
        cursor.execute('''CREATE TABLE IF NOT EXISTS cve
                        (cve_id text PRIMARY KEY NOT NULL, title text, description text, attack_complexity text, availability_impact text,
                        base_score int, base_severity text, confidentiality_impact text, priveleges_required text,
                        discovery text,  date text)''')
        cursor.execute('''CREATE TABLE IF NOT EXISTS cve_references
                        (reference text, cve_id text, FOREIGN KEY (cve_id) REFERENCES cve(cve_id))''')
        connection.commit()
        connection.close()

    
    def load_database(self):
        for root, dirs, files in os.walk(self.cve_directory):
            for f in files:
                file_path = os.path.join(root, f)
                if f.endswith('.json'):
                    with open(file_path, 'r') as cve_file:
                        cve_json = json.load(cve_file)
                        cve_id = f[:-5]
                        cve_title = find_cve_title(cve_json)
                        """ if (cve_title == 'NULL') :
                            print(file_path) """
                        cve_desc = find_cve_desc(cve_json)
                        cve_attack = find_cve_attack(cve_json)
                        cve_availability = find_cve_avail(cve_json)
                        if (cve_availability == 'NULL') :
                            print(file_path)
                        cve_base_score = find_base_score(cve_json)
                        """ if (cve_base_score == 'NULL') :
                            print(file_path) """
                        cve_base_severity = find_cve_severity(cve_json)
                        cve_confidentiality = find_cve_confidentiality(cve_json)
                        cve_privileges = find_cve_privileges(cve_json)
                        cve_discovery = find_cve_discovery(cve_json)
                        cve_date = find_cve_date(cve_json)
                        cve_references = find_cve_references(cve_json)
                        connection = sqlite3.connect(self.file)
                        cursor = connection.cursor()
                        cursor.execute('''INSERT INTO cve VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''', 
                        (cve_id, cve_title, cve_desc, cve_attack, cve_availability, 
                        cve_base_score, cve_base_severity, cve_confidentiality, cve_privileges, cve_discovery, cve_date))
                        for ref in cve_references:
                            try:
                                cursor.execute('''INSERT INTO cve_references VALUES (?, ?)''', (ref['url'], cve_id))
                            except:
                                pass
                        connection.commit()
                        connection.close()

def find_cve_title(json: dict) -> str:
    try:
        cve_title = json['containers']['cna']['x_legacyV4Record']['CVE_data_meta']['TITLE']
        return cve_title
    except KeyError:
        cve_title = 'NULL'
    try:
        cve_title = json['containers']['cna']['title']
        return cve_title
    except KeyError:
        cve_title = 'NULL'
    return 'NULL'

def find_cve_desc(json: dict) -> str:
    try:
        cve_desc = json['containers']['cna']['x_legacyV4Record']['description']['descriptiondata'][0]['value']
        return cve_desc
    except:
        cve_desc = 'NULL'
    try:
        cve_desc = json['containers']['cna']['descriptions'][0]['value']
        return cve_desc
    except:
        cve_desc = 'NULL'
    return 'NULL'

def find_cve_attack(json: dict) -> str:
    try:
        cve_attack = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['attackComplexity']
        return cve_attack
    except:
        cve_attack = 'NULL'
    try:
        cve_attack = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['attackVector']
        return cve_attack
    except:
        cve_attack = 'NULL'
    try:
        cve_attack = json['containers']['cna']['metrics'][0]['cvssV3_1']['attackComplexity']
    except:
        cve_attack = 'NULL'
    try:
        cve_attack = json['containers']['cna']['metrics'][0]['cvssV3_0']['attackComplexity']
    except:
        cve_attack = 'NULL'
    return 'NULL'

def find_cve_avail(json:dict) -> str:
    try:
        cve_avail = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['availabilityImpact']
        return cve_avail
    except:
        cve_avail = 'NULL'
    try:
        cve_avail = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['availabilityImpact']
        return cve_avail
    except:
        cve_avail = 'NULL'
    try:
        cve_avail = json['containers']['cna']['metrics'][0]['cvssV3_1']['availabilityImpact']
    except:
        cve_avail = 'NULL'
    try:
        cve_avail = json['containers']['cna']['metrics'][0]['cvssV3_0']['availabilityImpact']
    except:
        cve_avail = 'NULL'
    return 'NULL'

def find_base_score(json: dict) -> int:
    try:
        cve_base_score = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['baseScore']
        return cve_base_score
    except:
        cve_base_score = 'NULL'
    try:
        cve_base_score = json['containers']['cna']['metrics'][0]['cvssV3_1']['baseScore']
    except:
        cve_base_score = 'NULL'
    try:
        cve_base_score = json['containers']['cna']['metrics'][0]['cvssV3_0']['baseScore']
    except:
        cve_base_score = 'NULL'
    return 'NULL'

def find_cve_severity(json: dict) -> str:
    try:
        cve_severity = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['baseSeverity']
        return cve_severity
    except:
        cve_severity = 'NULL'
    try:
        cve_severity = json['containers']['cna']['metrics'][0]['cvssV3_1']['baseSeverity']
    except:
        cve_severity = 'NULL'
    try:
        cve_severity = json['containers']['cna']['metrics'][0]['cvssV3_0']['baseSeverity']
    except:
        cve_severity = 'NULL'
    return 'NULL'

def find_cve_confidentiality(json: dict) -> str:
    try:
        cve_confidentiality = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['confidentialityImpact']
        return cve_confidentiality
    except:
        cve_confidentiality = 'NULL'
    try:
        cve_confidentiality = json['containers']['cna']['metrics'][0]['cvssV3_1']['confidentialityImpact']
    except:
        cve_confidentiality = 'NULL'
    try:
        cve_confidentiality = json['containers']['cna']['metrics'][0]['cvssV3_0']['confidentialityImpact']
    except:
        cve_confidentiality = 'NULL'
    return 'NULL'

def find_cve_privileges(json: dict) -> str:
    try:
        cve_privileges = json['containers']['cna']['x_legacyV4Record']['impact']['cvss']['privilegesRequired']
        return cve_privileges
    except:
        cve_privileges = 'NULL'
    try:
        cve_privileges = json['containers']['cna']['metrics'][0]['cvssV3_1']['privelagesRequired']
    except:
        cve_privileges = 'NULL'
    try:
        cve_privileges = json['containers']['cna']['metrics'][0]['cvssV3_0']['privelagesRequired']
    except:
        cve_privileges = 'NULL'
    return 'NULL'

def find_cve_discovery(json: dict) -> str:
    try:
        cve_discovery = json['containers']['cna']['x_legacyV4Record']['source']['discovery']
        return cve_discovery
    except:
        cve_discovery = 'NULL'
    return 'NULL'

def find_cve_date(json: dict) -> str:
    try:
        cve_date = json['containers']['cna']['x_legacyV4Record']['CVE_data_meta']['DATE_PUBLIC']
        return cve_date
    except:
        cve_date = 'NULL'
    try:
        cve_date = json['cveMetadata']['datePublished']
    except:
        cve_date = 'NULL'
    return 'NULL'

def find_cve_references(json: dict) -> list:
    try:
        cve_references = json['containers']['cna']['x_legacyV4Record']['references']['reference_data']
        return cve_references
    except:
        cve_references = []
    try:
        cve_references = json['containers']['cna']['references']
        return cve_references
    except:
        cve_references = []
    return cve_references
if __name__ == "__main__":
    test = Database("cve.db", "cvelistV5-main")
